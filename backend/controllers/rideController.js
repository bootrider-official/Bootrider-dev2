import Ride from "../models/Ride.js";

// ── Haversine distance in km ─────────────────────────────────────────────────
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

const isWithinRadius = (queryLat, queryLng, points, radiusKm = 15) =>
  points.some(
    (p) =>
      p?.coordinates?.lat &&
      p?.coordinates?.lng &&
      haversineKm(queryLat, queryLng, p.coordinates.lat, p.coordinates.lng) <=
      radiusKm
  );

// ── Get time slot from time string ───────────────────────────────────────────
const getTimeSlot = (timeStr) => {
  if (!timeStr) return null;
  const [hours] = timeStr.split(":").map(Number);
  if (hours < 12) return "morning";
  if (hours < 18) return "afternoon";
  return "evening";
};

// ===============================
// 📌 Create Ride
// ===============================
export const createRide = async (req, res) => {
  try {
    const {
      from, to, stops, date, time,
      availableSeats, pricePerSeat,
      vehicleDetails, bookingPreference,
      acceptsParcels, bootSpace,
      preferences, stopoverPrices,
    } = req.body;

    if (!from || !to || !date || !time || !availableSeats || !pricePerSeat) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    const newRide = await Ride.create({
      driver: req.user._id,
      from, to,
      stops: stops || [],
      date, time,
      availableSeats,
      pricePerSeat,
      vehicleDetails: vehicleDetails || {},
      bookingPreference: bookingPreference || "review",
      acceptsParcels: acceptsParcels || false,
      bootSpace: acceptsParcels && bootSpace ? bootSpace : null,
      preferences: preferences || {},
      stopoverPrices: stopoverPrices || [],
      status: "active",
    });

    // ── Increment driver's totalRidesAsDriver ────────
    const User = (await import("../models/User.js")).default;
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalRidesAsDriver: 1 },
    });

    res.status(201).json({ message: "Ride created successfully!", ride: newRide });
  } catch (error) {
    console.error("❌ Error creating ride:", error.message);
    res.status(500).json({ message: "Server error while creating ride." });
  }
};

// ===============================
// 🔍 Search Rides
// ===============================
// ===============================
// 🔍 Search Rides (segment-aware)
// ===============================
export const searchRides = async (req, res) => {
  try {
    const {
      from, to,
      fromLat, fromLng,
      toLat, toLng,
      date, radiusKm = 15,
      smokingAllowed, petsAllowed, womenOnly,
      maxInBack, instantOnly, verifiedOnly,
      acceptsParcels, sortBy,
    } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: "Please provide from and to." });
    }

    let dateFilter = {};
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      dateFilter = { date: { $gte: start, $lte: end } };
    }

    const useRadius = fromLat && fromLng && toLat && toLng;
    const radius = parseFloat(radiusKm);

    // ── Base DB query ────────────────────────────────
    const dbQuery = {
      status: "active",
      availableSeats: { $gt: 0 },
      ...dateFilter,
    };

    if (instantOnly === "true") dbQuery.bookingPreference = "instant";
    if (acceptsParcels === "true") dbQuery.acceptsParcels = true;
    if (smokingAllowed === "true") dbQuery["preferences.smokingAllowed"] = true;
    if (petsAllowed === "true") dbQuery["preferences.petsAllowed"] = true;
    if (womenOnly === "true") dbQuery["preferences.womenOnly"] = true;
    if (maxInBack === "true") dbQuery["preferences.maxInBack"] = true;

    let rides = await Ride.find(dbQuery)
      .populate(
        "driver",
        "name email phone profilePhoto rating totalRatings kycStatus preferences age gender"
      )
      .sort({ date: 1, time: 1 });

    // ── Verified filter ──────────────────────────────
    if (verifiedOnly === "true") {
      rides = rides.filter((r) => r.driver?.kycStatus === "verified");
    }

    // ── Build segment-aware results ──────────────────
    // Each result represents a SEGMENT of a ride, not the full ride.
    // e.g. A→B→C ride becomes two results: A→B and B→C (plus A→C)
    const results = [];

    for (const ride of rides) {
      // Build all possible segments from this ride
      // Points: [from, ...stops, to]
      const allPoints = [
        {
          name: ride.from?.name,
          coordinates: ride.from?.coordinates,
          isOrigin: true,
        },
        ...(ride.stops || []).map((s) => ({
          name: s.name,
          coordinates: s.coordinates,
          isStop: true,
        })),
        {
          name: ride.to?.name,
          coordinates: ride.to?.coordinates,
          isDestination: true,
        },
      ];

      // Generate all possible pickup→dropoff combinations (in order)
      for (let i = 0; i < allPoints.length - 1; i++) {
        for (let j = i + 1; j < allPoints.length; j++) {

          const segFrom = allPoints[i];
          const segTo = allPoints[j];

          if (!segFrom?.coordinates || !segTo?.coordinates) continue;

          // ── Check if this segment matches search ──
          let fromMatch = false;
          let toMatch = false;

          if (useRadius) {
            const fLat = parseFloat(fromLat);
            const fLng = parseFloat(fromLng);
            const tLat = parseFloat(toLat);
            const tLng = parseFloat(toLng);

            fromMatch = haversineKm(
              fLat, fLng,
              segFrom.coordinates.lat,
              segFrom.coordinates.lng
            ) <= radius;

            toMatch = haversineKm(
              tLat, tLng,
              segTo.coordinates.lat,
              segTo.coordinates.lng
            ) <= radius;
          } else {
            fromMatch =
              segFrom.name?.toLowerCase().includes(from.toLowerCase());
            toMatch =
              segTo.name?.toLowerCase().includes(to.toLowerCase());
          }

          if (!fromMatch || !toMatch) continue;

          // ── Find price for this segment ───────────
          // Check stopoverPrices first, then fall back to pricePerSeat
          let segmentPrice = ride.pricePerSeat; // default full price

          if (
            ride.stopoverPrices &&
            ride.stopoverPrices.length > 0
          ) {
            // Direct segment match in stopoverPrices
            const directMatch = ride.stopoverPrices.find(
              (sp) =>
                sp.fromName?.toLowerCase().includes(
                  segFrom.name?.split(",")[0]?.toLowerCase()
                ) &&
                sp.toName?.toLowerCase().includes(
                  segTo.name?.split(",")[0]?.toLowerCase()
                )
            );

            if (directMatch) {
              segmentPrice = directMatch.price;
            } else {
              // Multi-hop: sum up intermediate segments
              // e.g. A→C = price(A→B) + price(B→C)
              let totalSegPrice = 0;
              let found = true;

              for (let k = i; k < j; k++) {
                const legFrom = allPoints[k];
                const legTo = allPoints[k + 1];

                const legMatch = ride.stopoverPrices.find(
                  (sp) =>
                    sp.fromName?.toLowerCase().includes(
                      legFrom.name?.split(",")[0]?.toLowerCase()
                    ) &&
                    sp.toName?.toLowerCase().includes(
                      legTo.name?.split(",")[0]?.toLowerCase()
                    )
                );

                if (legMatch) {
                  totalSegPrice += legMatch.price;
                } else {
                  found = false;
                  break;
                }
              }

              if (found && totalSegPrice > 0) {
                segmentPrice = totalSegPrice;
              }
            }
          }

          // ── Build the result object ───────────────
          results.push({
            // Full ride data
            _id: ride._id,
            id: ride._id,
            driver: ride.driver,
            date: ride.date,
            time: ride.time,
            availableSeats: ride.availableSeats,
            bookingPreference: ride.bookingPreference,
            preferences: ride.preferences,
            acceptsParcels: ride.acceptsParcels,
            bootSpace: ride.bootSpace,
            status: ride.status,
            stopoverPrices: ride.stopoverPrices,

            // ── Segment-specific fields ──
            // These override the ride's from/to/price
            // so the search card shows the right info
            segmentFrom: {
              name: segFrom.name,
              coordinates: segFrom.coordinates,
            },
            segmentTo: {
              name: segTo.name,
              coordinates: segTo.coordinates,
            },
            segmentPrice,

            // Keep original for ride detail page
            originalFrom: ride.from,
            originalTo: ride.to,
            originalPrice: ride.pricePerSeat,
            fullRoute: {
              from: ride.from,
              stops: ride.stops,
              to: ride.to,
            },

            // Is this the full route or a partial segment?
            isFullRoute: i === 0 && j === allPoints.length - 1,
          });
        }
      }
    }

    // ── Deduplicate: if same ride appears as both
    //    full route and segment, prefer the segment ──
    const seen = new Map();
    const deduped = [];

    for (const result of results) {
      const key = `${result._id}-${result.segmentFrom?.name}-${result.segmentTo?.name}`;
      if (!seen.has(key)) {
        seen.set(key, true);
        deduped.push(result);
      }
    }

    // ── Sort ─────────────────────────────────────────
    let sorted = deduped;
    if (sortBy === "price_asc") {
      sorted = deduped.sort((a, b) => a.segmentPrice - b.segmentPrice);
    } else if (sortBy === "rating") {
      sorted = deduped.sort(
        (a, b) => (b.driver?.rating || 0) - (a.driver?.rating || 0)
      );
    }
    // default: already sorted by date/time from DB

    if (!sorted.length) {
      return res.status(404).json({ message: "No rides found." });
    }

    res.status(200).json(sorted);
  } catch (error) {
    console.error("❌ Error searching rides:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};
// ===============================
// 🔍 Get Ride by ID
// ===============================
export const getRideById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === "undefined") {
      return res.status(400).json({ message: "Invalid ride ID." });
    }

    const ride = await Ride.findById(id)
      .populate(
        "driver",
        "name email phone profilePhoto rating totalRatings kycStatus vehicleInfo preferences age gender bio"
      )
      .populate("requests.user", "name email profilePhoto")
      .populate("passengers.user", "name email profilePhoto");

    if (!ride) return res.status(404).json({ message: "Ride not found." });
    res.status(200).json(ride);
  } catch (error) {
    console.error("❌ Error fetching ride:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

// ===============================
// 🚗 Request a Ride
// ===============================
export const requestRide = async (req, res) => {
  try {
    const { rideId, seatsRequested } = req.body;
    const userId = req.user._id;

    if (!rideId || !seatsRequested) {
      return res.status(400).json({ message: "Missing rideId or seatsRequested." });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found." });

    const existingRequest = ride.requests.find(
      (r) => r.user.toString() === userId.toString()
    );

    if (existingRequest) {
      if (existingRequest.status === "pending") {
        return res.status(400).json({ message: "Request already pending." });
      } else if (existingRequest.status === "approved") {
        return res.status(400).json({ message: "Already approved for this ride." });
      } else if (existingRequest.status === "rejected") {
        existingRequest.status = "pending";
        existingRequest.seatsRequested = seatsRequested;
        await ride.save();
        return res.status(200).json({ message: "Request re-sent!" });
      }
    }

    ride.requests.push({ user: userId, seatsRequested, status: "pending" });
    await ride.save();
    res.status(200).json({ message: "Ride request sent to driver!" });
  } catch (err) {
    console.error("❌ Error in requestRide:", err.message);
    res.status(500).json({ message: "Server error." });
  }
};

// ===============================
// ✅ Approve / ❌ Reject Request
// ===============================
export const handleRideRequest = async (req, res) => {
  try {
    const { rideId, requestId, action } = req.body;
    const driverId = req.user._id;

    if (!rideId || !requestId || !action) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found." });

    if (String(ride.driver) !== String(driverId)) {
      return res.status(403).json({ message: "Not authorized." });
    }

    let request = ride.requests.id(requestId);
    if (!request) {
      request = ride.requests.find(
        (r) =>
          String(r._id) === String(requestId) ||
          String(r.id) === String(requestId)
      );
    }
    if (!request) return res.status(404).json({ message: "Request not found." });
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already handled." });
    }

    if (action === "approve") {
      if (ride.availableSeats < request.seatsRequested) {
        return res.status(400).json({ message: "Not enough seats." });
      }
      request.status = "approved";
      ride.availableSeats -= request.seatsRequested;
      ride.passengers.push({
        user: request.user,
        seatsBooked: request.seatsRequested,
      });

      // ── Increment passenger's totalRidesAsPassenger ──
      const User = (await import("../models/User.js")).default;
      await User.findByIdAndUpdate(request.user, {
        $inc: { totalRidesAsPassenger: 1 },
      });
    } else if (action === "reject") {
      request.status = "rejected";
    } else {
      return res.status(400).json({ message: "Invalid action." });
    }

    await ride.save();
    res.status(200).json({ message: `Request ${action}ed successfully.`, ride });
  } catch (err) {
    console.error("❌ Error handling request:", err.message);
    res.status(500).json({ message: "Server error." });
  }
};

// ===============================
// 🧾 Get My Rides (driver)
// ===============================
export const getMyRides = async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.user._id })
      .populate("driver", "name email phone profilePhoto")
      .populate("requests.user", "name email profilePhoto")
      .populate("passengers.user", "name email profilePhoto")
      .sort({ date: -1 });

    res.status(200).json(rides);
  } catch (error) {
    console.error("❌ Error fetching my rides:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

// ===============================
// 📦 Get My Bookings (passenger)
// ===============================
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const rides = await Ride.find({ "requests.user": userId })
      .populate("driver", "name email phone profilePhoto rating")
      .populate("requests.user", "name email")
      .sort({ date: -1 });

    const myBookings = rides.map((ride) => {
      const myRequest = ride.requests.find(
        (r) => String(r.user._id || r.user) === String(userId)
      );
      return {
        id: ride._id,
        from: ride.from,
        to: ride.to,
        date: ride.date,
        time: ride.time,
        pricePerSeat: ride.pricePerSeat,
        driver: ride.driver,
        status: myRequest.status,
        seatsRequested: myRequest.seatsRequested,
        acceptsParcels: ride.acceptsParcels,
        preferences: ride.preferences,
      };
    });

    res.status(200).json(myBookings);
  } catch (err) {
    console.error("❌ Error fetching bookings:", err.message);
    res.status(500).json({ message: "Failed to fetch bookings." });
  }
};

// ===============================
// ✅ Complete Ride
// ===============================
export const completeRide = async (req, res) => {
  try {
    const { id } = req.params;
    const ride = await Ride.findById(id);
    if (!ride) return res.status(404).json({ message: "Ride not found." });

    if (String(ride.driver) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized." });
    }
    if (ride.status === "completed") {
      return res.status(400).json({ message: "Already completed." });
    }

    ride.status = "completed";
    ride.completedAt = new Date();
    await ride.save();

    res.status(200).json({ message: "Ride marked as completed.", ride });
  } catch (error) {
    console.error("❌ Error completing ride:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

// ===============================
// ❌ Delete Ride (soft delete)
// ===============================
export const deleteRide = async (req, res) => {
  try {
    const { id } = req.params;
    const ride = await Ride.findById(id);
    if (!ride) return res.status(404).json({ message: "Ride not found." });

    if (String(ride.driver) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized." });
    }

    ride.deletedAt = new Date();
    ride.status = "cancelled";
    await ride.save();

    res.status(200).json({ message: "Ride deleted successfully." });
  } catch (error) {
    console.error("❌ Error deleting ride:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

// ===============================
// ⭐ Rate a User
// ===============================
export const rateUser = async (req, res) => {
  try {
    const { userId, rating } = req.body;
    if (!userId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Valid userId and rating (1-5) required." });
    }

    const User = (await import("../models/User.js")).default;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const newTotal = user.totalRatings + 1;
    const newRating = (user.rating * user.totalRatings + rating) / newTotal;

    user.rating = Math.round(newRating * 10) / 10;
    user.totalRatings = newTotal;
    await user.save();

    res.status(200).json({
      message: "Rating submitted.",
      rating: user.rating,
      totalRatings: user.totalRatings,
    });
  } catch (error) {
    console.error("❌ Error rating user:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};