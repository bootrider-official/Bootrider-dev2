// backend/routes/chat.js
import express from "express";
import Groq from "groq-sdk";
import Ride from "../models/Ride.js";

const router = express.Router();

// ── Lazy init — created on first request, AFTER dotenv.config() has run ──────
let _groq = null;
const getGroq = () => {
    if (!_groq) {
        _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }
    return _groq;
};

// ── Haversine ────────────────────────────────────────────────────────────────
const haversineKm = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const isWithinRadius = (queryLat, queryLng, points, radiusKm = 30) =>
    points.some(
        (p) =>
            p?.coordinates?.lat &&
            p?.coordinates?.lng &&
            haversineKm(queryLat, queryLng, p.coordinates.lat, p.coordinates.lng) <= radiusKm
    );

// ── Geocode via Nominatim ────────────────────────────────────────────────────
const geocodeCity = async (cityName) => {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1&countrycodes=in`,
            { headers: { "User-Agent": "BootriderApp/1.0 (contact@bootrider.in)" } }
        );
        const data = await res.json();
        if (!data?.length) return null;
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    } catch {
        return null;
    }
};

// ── POST /api/chat ───────────────────────────────────────────────────────────
router.post("/", async (req, res) => {
    const { userMessage, history = [] } = req.body;

    if (!userMessage?.trim()) {
        return res.status(400).json({ error: "Message required." });
    }

    const groq = getGroq();

    try {
        // ── Step 1: Extract intent ───────────────────────────────────────────────
        const extractionRes = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            max_tokens: 300,
            messages: [
                {
                    role: "system",
                    content: `You are a ride-booking intent extractor. Extract ride search details from the user's message.
Return ONLY valid JSON, no extra text, no markdown, no backticks.
Format:
{
  "isRideRequest": true or false,
  "from": "city name or null",
  "to": "city name or null",
  "date": "YYYY-MM-DD or null",
  "time": "HH:MM 24hr or null",
  "seats": 1,
  "wantsParcel": false
}
Today is ${new Date().toISOString().split("T")[0]}.
"kal" means tomorrow. "aaj" means today. "subah" = morning ~09:00. "dopahar" = afternoon ~13:00. "shaam" = evening ~17:00. "raat" = night ~20:00.
If message is about booking/finding a ride or travel, set isRideRequest to true.
If it mentions "parcel" or "courier" or "bhejna hai", set wantsParcel to true.`,
                },
                { role: "user", content: userMessage },
            ],
        });

        let extracted = {
            isRideRequest: false,
            from: null,
            to: null,
            date: null,
            time: null,
            seats: 1,
            wantsParcel: false,
        };

        try {
            const raw = extractionRes.choices[0].message.content.trim();
            extracted = JSON.parse(raw);
        } catch {
            extracted.isRideRequest = false;
        }

        // ── Step 2: Search MongoDB if ride request ───────────────────────────────
        let rides = [];

        if (extracted.isRideRequest && (extracted.from || extracted.to)) {
            const dbQuery = {
                status: "active",
                availableSeats: { $gt: 0 },
                deletedAt: null,
            };

            if (extracted.wantsParcel) dbQuery.acceptsParcels = true;

            if (extracted.date) {
                const start = new Date(extracted.date);
                start.setHours(0, 0, 0, 0);
                const end = new Date(extracted.date);
                end.setHours(23, 59, 59, 999);
                dbQuery.date = { $gte: start, $lte: end };
            }

            const [fromCoords, toCoords] = await Promise.all([
                extracted.from ? geocodeCity(extracted.from) : Promise.resolve(null),
                extracted.to ? geocodeCity(extracted.to) : Promise.resolve(null),
            ]);

            const allRides = await Ride.find(dbQuery)
                .populate("driver", "name rating totalRatings kycStatus profilePhoto")
                .sort({ date: 1, time: 1 })
                .limit(50);

            if (fromCoords || toCoords) {
                rides = allRides.filter((ride) => {
                    const fromPoints = [ride.from, ...ride.stops];
                    const toPoints = [ride.to, ...ride.stops];

                    const fromMatch = fromCoords
                        ? isWithinRadius(fromCoords.lat, fromCoords.lng, fromPoints, 30)
                        : extracted.from
                            ? ride.from?.name?.toLowerCase().includes(extracted.from.toLowerCase())
                            : true;

                    const toMatch = toCoords
                        ? isWithinRadius(toCoords.lat, toCoords.lng, toPoints, 30)
                        : extracted.to
                            ? ride.to?.name?.toLowerCase().includes(extracted.to.toLowerCase())
                            : true;

                    return fromMatch && toMatch;
                });
            } else {
                rides = allRides.filter((ride) => {
                    const fromMatch = extracted.from
                        ? ride.from?.name?.toLowerCase().includes(extracted.from.toLowerCase()) ||
                        ride.stops?.some((s) =>
                            s.name?.toLowerCase().includes(extracted.from.toLowerCase())
                        )
                        : true;
                    const toMatch = extracted.to
                        ? ride.to?.name?.toLowerCase().includes(extracted.to.toLowerCase()) ||
                        ride.stops?.some((s) =>
                            s.name?.toLowerCase().includes(extracted.to.toLowerCase())
                        )
                        : true;
                    return fromMatch && toMatch;
                });
            }

            rides = rides.slice(0, 5);
        }

        // ── Step 3: Generate reply ───────────────────────────────────────────────
        const systemPrompt = `You are BootBot, a helpful ride-booking assistant for BootRider — an Indian carpooling and parcel delivery platform.
Reply in the same language/mix the user uses (Hindi, English, or Hinglish).
Keep replies short and friendly — 1-3 sentences max.
If rides were found, say how many you found briefly.
If no rides found, apologize briefly and suggest they try different dates.
If it's a general question, answer helpfully about the platform.
Platform info: users can search rides, book seats, or send parcels via driver boot space. KYC required to list rides.`;

        const replyRes = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            max_tokens: 200,
            messages: [
                { role: "system", content: systemPrompt },
                ...history.slice(-6),
                {
                    role: "user",
                    content:
                        extracted.isRideRequest && rides.length > 0
                            ? `${userMessage}\n\n[CONTEXT: ${rides.length} rides found. Tell the user briefly.]`
                            : extracted.isRideRequest && (extracted.from || extracted.to)
                                ? `${userMessage}\n\n[CONTEXT: No rides found. Apologize briefly.]`
                                : userMessage,
                },
            ],
        });

        return res.json({
            reply: replyRes.choices[0].message.content,
            rides,
            extracted: {
                isRideRequest: extracted.isRideRequest,
                from: extracted.from,
                to: extracted.to,
                date: extracted.date,
            },
        });
    } catch (err) {
        console.error("❌ Chat error:", err.message);
        return res.status(500).json({
            reply: "Kuch problem ho gayi! Please thodi der baad try karein.",
            rides: [],
        });
    }
});

export default router;