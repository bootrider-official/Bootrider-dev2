import EnterpriseListing from "../models/EnterpriseListing.js";

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

// ===============================
// 📌 Create Enterprise Listing
// ===============================
export const createListing = async (req, res) => {
    try {
        const {
            from,
            to,
            stops,
            date,
            time,
            vehicleType,
            vehicleNumber,
            totalCapacityKg,
            pricePerKg,
            minimumWeightKg,
            acceptedGoodsTypes,
            fragileAccepted,
            hazardousAccepted,
            notes,
        } = req.body;

        if (
            !from || !to || !date || !time ||
            !vehicleType || !vehicleNumber ||
            !totalCapacityKg || !pricePerKg
        ) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        const listing = await EnterpriseListing.create({
            owner: req.user._id,
            from,
            to,
            stops: stops || [],
            date,
            time,
            vehicleType,
            vehicleNumber,
            totalCapacityKg,
            availableCapacityKg: totalCapacityKg, // starts fully available
            pricePerKg,
            minimumWeightKg: minimumWeightKg || 1,
            acceptedGoodsTypes: acceptedGoodsTypes || ["Other"],
            fragileAccepted: fragileAccepted || false,
            hazardousAccepted: hazardousAccepted || false,
            notes: notes || "",
            status: "active",
        });

        res.status(201).json({
            message: "Listing created successfully!",
            listing,
        });
    } catch (error) {
        console.error("❌ Error creating listing:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};

// ===============================
// 🔍 Search Enterprise Listings
// ===============================
export const searchListings = async (req, res) => {
    try {
        const {
            from,
            to,
            fromLat,
            fromLng,
            toLat,
            toLng,
            date,
            weightKg,
            radiusKm = 15,
        } = req.query;

        if (!from || !to) {
            return res.status(400).json({ message: "Please provide from and to." });
        }

        // ── Date filter ──────────────────────────────
        let dateFilter = {};
        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            dateFilter = { date: { $gte: start, $lte: end } };
        }

        // ── Weight filter ────────────────────────────
        let weightFilter = {};
        if (weightKg) {
            weightFilter = { availableCapacityKg: { $gte: parseFloat(weightKg) } };
        }

        const useRadius = fromLat && fromLng && toLat && toLng;
        const radius = parseFloat(radiusKm);

        let listings = [];

        if (useRadius) {
            const fLat = parseFloat(fromLat);
            const fLng = parseFloat(fromLng);
            const tLat = parseFloat(toLat);
            const tLng = parseFloat(toLng);

            const allListings = await EnterpriseListing.find({
                status: "active",
                availableCapacityKg: { $gt: 0 },
                ...dateFilter,
                ...weightFilter,
            })
                .populate("owner", "name phone profilePhoto rating vehicleInfo kycStatus")
                .sort({ date: 1, time: 1 });

            listings = allListings.filter((listing) => {
                const fromPoints = [listing.from, ...listing.stops];
                const toPoints = [listing.to, ...listing.stops];
                return (
                    isWithinRadius(fLat, fLng, fromPoints, radius) &&
                    isWithinRadius(tLat, tLng, toPoints, radius)
                );
            });
        } else {
            listings = await EnterpriseListing.find({
                $and: [
                    {
                        $or: [
                            { "from.name": { $regex: from, $options: "i" } },
                            { "stops.name": { $regex: from, $options: "i" } },
                        ],
                    },
                    {
                        $or: [
                            { "to.name": { $regex: to, $options: "i" } },
                            { "stops.name": { $regex: to, $options: "i" } },
                        ],
                    },
                    { status: "active" },
                    { availableCapacityKg: { $gt: 0 } },
                    dateFilter,
                    weightFilter,
                ].filter((f) => Object.keys(f).length > 0),
            })
                .populate("owner", "name phone profilePhoto rating vehicleInfo kycStatus")
                .sort({ date: 1, time: 1 });
        }

        if (!listings.length) {
            return res.status(404).json({ message: "No listings found." });
        }

        res.status(200).json(listings);
    } catch (error) {
        console.error("❌ Error searching listings:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};

// ===============================
// 🔍 Get Listing by ID
// ===============================
export const getListingById = async (req, res) => {
    try {
        const { id } = req.params;

        const listing = await EnterpriseListing.findById(id)
            .populate("owner", "name phone profilePhoto rating vehicleInfo kycStatus")
            .populate("bookings.sender", "name email phone profilePhoto");

        if (!listing) {
            return res.status(404).json({ message: "Listing not found." });
        }

        res.status(200).json(listing);
    } catch (error) {
        console.error("❌ Error fetching listing:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};

// ===============================
// 🧾 Get My Listings (transporter)
// ===============================
export const getMyListings = async (req, res) => {
    try {
        const listings = await EnterpriseListing.find({ owner: req.user._id })
            .populate("bookings.sender", "name email phone profilePhoto")
            .sort({ date: -1 });

        res.status(200).json(listings);
    } catch (error) {
        console.error("❌ Error fetching listings:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};

// ===============================
// 📦 Book a Listing (sender)
// ===============================
export const bookListing = async (req, res) => {
    try {
        const {
            listingId,
            cargoDescription,
            weightKg,
            volumeCbm,
            receiverName,
            receiverPhone,
        } = req.body;

        if (
            !listingId || !cargoDescription ||
            !weightKg || !receiverName || !receiverPhone
        ) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        const listing = await EnterpriseListing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found." });
        }

        if (listing.status !== "active") {
            return res.status(400).json({ message: "This listing is no longer active." });
        }

        if (weightKg < listing.minimumWeightKg) {
            return res.status(400).json({
                message: `Minimum booking weight is ${listing.minimumWeightKg}kg.`,
            });
        }

        if (weightKg > listing.availableCapacityKg) {
            return res.status(400).json({
                message: `Only ${listing.availableCapacityKg}kg available.`,
            });
        }

        const totalPrice = Math.round(weightKg * listing.pricePerKg);

        listing.bookings.push({
            sender: req.user._id,
            cargoDescription,
            weightKg,
            volumeCbm: volumeCbm || null,
            receiverName,
            receiverPhone,
            totalPrice,
            status: "pending",
            timeline: { bookedAt: new Date() },
        });

        await listing.save();

        res.status(201).json({
            message: "Booking request sent to transporter!",
            totalPrice,
        });
    } catch (error) {
        console.error("❌ Error booking listing:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};

// ===============================
// ✅ Handle Booking (transporter)
// ===============================
export const handleBooking = async (req, res) => {
    try {
        const { listingId, bookingId, action } = req.body;

        if (!listingId || !bookingId || !action) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const listing = await EnterpriseListing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found." });
        }

        if (String(listing.owner) !== String(req.user._id)) {
            return res.status(403).json({ message: "Not authorized." });
        }

        const booking = listing.bookings.id(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        if (booking.status !== "pending") {
            return res.status(400).json({ message: "Booking already handled." });
        }

        if (action === "approve") {
            if (booking.weightKg > listing.availableCapacityKg) {
                return res.status(400).json({ message: "Not enough capacity." });
            }
            booking.status = "approved";
            booking.timeline.approvedAt = new Date();
            listing.availableCapacityKg -= booking.weightKg;
        } else if (action === "reject") {
            booking.status = "rejected";
        } else {
            return res.status(400).json({ message: "Invalid action." });
        }

        await listing.save();

        res.status(200).json({
            message: `Booking ${action}ed successfully.`,
            listing,
        });
    } catch (error) {
        console.error("❌ Error handling booking:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};

// ===============================
// 🔄 Update Booking Status (transporter)
// ===============================
export const updateBookingStatus = async (req, res) => {
    try {
        const { listingId, bookingId, status, proofPhoto } = req.body;

        const validStatuses = ["in_transit", "delivered"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status." });
        }

        const listing = await EnterpriseListing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found." });
        }

        if (String(listing.owner) !== String(req.user._id)) {
            return res.status(403).json({ message: "Not authorized." });
        }

        const booking = listing.bookings.id(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        booking.status = status;

        if (status === "in_transit") {
            booking.timeline.pickedUpAt = new Date();
            if (proofPhoto) booking.proofPhotos.pickup = proofPhoto;
        } else if (status === "delivered") {
            booking.timeline.deliveredAt = new Date();
            if (proofPhoto) booking.proofPhotos.delivery = proofPhoto;
        }

        await listing.save();

        res.status(200).json({
            message: `Booking marked as ${status}.`,
            booking,
        });
    } catch (error) {
        console.error("❌ Error updating booking status:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};

// ===============================
// ✅ Complete Listing
// ===============================
export const completeListing = async (req, res) => {
    try {
        const { id } = req.params;

        const listing = await EnterpriseListing.findById(id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found." });
        }

        if (String(listing.owner) !== String(req.user._id)) {
            return res.status(403).json({ message: "Not authorized." });
        }

        listing.status = "completed";
        listing.completedAt = new Date();
        await listing.save();

        res.status(200).json({ message: "Listing marked as completed.", listing });
    } catch (error) {
        console.error("❌ Error completing listing:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};

// ===============================
// ❌ Delete Listing (soft delete)
// ===============================
export const deleteListing = async (req, res) => {
    try {
        const { id } = req.params;

        const listing = await EnterpriseListing.findById(id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found." });
        }

        if (String(listing.owner) !== String(req.user._id)) {
            return res.status(403).json({ message: "Not authorized." });
        }

        listing.deletedAt = new Date();
        listing.status = "cancelled";
        await listing.save();

        res.status(200).json({ message: "Listing deleted successfully." });
    } catch (error) {
        console.error("❌ Error deleting listing:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};