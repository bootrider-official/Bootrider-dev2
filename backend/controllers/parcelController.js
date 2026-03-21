import Parcel from "../models/Parcel.js";
import Ride from "../models/Ride.js";

// ===============================
// 📦 Create Parcel Booking
// ===============================
export const createParcel = async (req, res) => {
    try {
        const {
            rideId,
            receiverName,
            receiverPhone,
            pickupPoint,
            dropPoint,
            size,
            weight,
            description,
            isFragile,
        } = req.body;

        if (!rideId || !receiverName || !receiverPhone || !pickupPoint || !dropPoint || !size || !weight) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        // ── Fetch the ride to validate and get price ──
        const ride = await Ride.findById(rideId);
        if (!ride) return res.status(404).json({ message: "Ride not found." });

        if (!ride.acceptsParcels || !ride.bootSpace) {
            return res.status(400).json({ message: "This ride does not accept parcels." });
        }

        // ── Calculate price from ride's boot pricing ──
        const pricing = ride.bootSpace;
        let price = null;

        if (size === "small" && pricing.smallPrice) price = pricing.smallPrice;
        else if (size === "medium" && pricing.mediumPrice) price = pricing.mediumPrice;
        else if (size === "large" && pricing.largePrice) price = pricing.largePrice;

        if (!price) {
            return res.status(400).json({
                message: `This ride does not accept ${size} parcels.`,
            });
        }

        // ── Check fragile ────────────────────────────
        if (isFragile && !pricing.fragileAccepted) {
            return res.status(400).json({
                message: "This driver does not accept fragile items.",
            });
        }

        // ── Check weight limit ───────────────────────
        if (pricing.maxWeightKg && weight > pricing.maxWeightKg) {
            return res.status(400).json({
                message: `Weight exceeds driver's limit of ${pricing.maxWeightKg}kg.`,
            });
        }

        const parcel = await Parcel.create({
            sender: req.user._id,
            receiverName,
            receiverPhone,
            ride: rideId,
            pickupPoint,
            dropPoint,
            size,
            weight,
            description: description || "",
            isFragile: isFragile || false,
            price,
            status: "booked",
            timeline: { bookedAt: new Date() },
        });

        res.status(201).json({
            message: "Parcel booked successfully!",
            parcel,
        });
    } catch (error) {
        console.error("❌ Error creating parcel:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};

// ===============================
// 📋 Get My Parcels (sender)
// ===============================
export const getMyParcels = async (req, res) => {
    try {
        const parcels = await Parcel.find({ sender: req.user._id })
            .populate("ride", "from to date time driver")
            .populate({
                path: "ride",
                populate: { path: "driver", select: "name phone profilePhoto rating" },
            })
            .sort({ createdAt: -1 });

        res.status(200).json(parcels);
    } catch (error) {
        console.error("❌ Error fetching parcels:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};

// ===============================
// 🔍 Get Parcel by ID
// ===============================
export const getParcelById = async (req, res) => {
    try {
        const { id } = req.params;

        const parcel = await Parcel.findById(id)
            .populate({
                path: "ride",
                select: "from to date time status driver",
                populate: { path: "driver", select: "name phone profilePhoto rating" },
            })
            .populate("sender", "name email phone");

        if (!parcel) return res.status(404).json({ message: "Parcel not found." });

        // Only sender or ride's driver can view
        const isDriver =
            String(parcel.ride?.driver?._id) === String(req.user._id);
        const isSender = String(parcel.sender._id) === String(req.user._id);

        if (!isDriver && !isSender) {
            return res.status(403).json({ message: "Not authorized." });
        }

        res.status(200).json(parcel);
    } catch (error) {
        console.error("❌ Error fetching parcel:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};

// ===============================
// 🔄 Update Parcel Status (driver only)
// ===============================
export const updateParcelStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, proofPhoto } = req.body;

        const validStatuses = ["picked_up", "in_transit", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status." });
        }

        const parcel = await Parcel.findById(id).populate("ride", "driver");
        if (!parcel) return res.status(404).json({ message: "Parcel not found." });

        // Only the ride's driver can update status
        if (String(parcel.ride?.driver) !== String(req.user._id)) {
            return res.status(403).json({ message: "Not authorized." });
        }

        // ── Update status + timeline ──────────────────
        parcel.status = status;

        if (status === "picked_up") {
            parcel.timeline.pickedUpAt = new Date();
            if (proofPhoto) parcel.proofPhotos.pickup = proofPhoto;
        } else if (status === "in_transit") {
            parcel.timeline.inTransitAt = new Date();
        } else if (status === "delivered") {
            parcel.timeline.deliveredAt = new Date();
            if (proofPhoto) parcel.proofPhotos.delivery = proofPhoto;
        } else if (status === "cancelled") {
            parcel.timeline.cancelledAt = new Date();
        }

        await parcel.save();

        res.status(200).json({
            message: `Parcel marked as ${status}.`,
            parcel,
        });
    } catch (error) {
        console.error("❌ Error updating parcel status:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};

// ===============================
// 📦 Get Parcels for a Ride (driver)
// ===============================
export const getParcelsForRide = async (req, res) => {
    try {
        const { rideId } = req.params;

        const ride = await Ride.findById(rideId);
        if (!ride) return res.status(404).json({ message: "Ride not found." });

        if (String(ride.driver) !== String(req.user._id)) {
            return res.status(403).json({ message: "Not authorized." });
        }

        const parcels = await Parcel.find({ ride: rideId })
            .populate("sender", "name email phone profilePhoto")
            .sort({ createdAt: -1 });

        res.status(200).json(parcels);
    } catch (error) {
        console.error("❌ Error fetching ride parcels:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};

// ===============================
// ❌ Cancel Parcel (sender only)
// ===============================
export const cancelParcel = async (req, res) => {
    try {
        const { id } = req.params;

        const parcel = await Parcel.findById(id);
        if (!parcel) return res.status(404).json({ message: "Parcel not found." });

        if (String(parcel.sender) !== String(req.user._id)) {
            return res.status(403).json({ message: "Not authorized." });
        }

        if (["delivered", "in_transit"].includes(parcel.status)) {
            return res.status(400).json({
                message: "Cannot cancel a parcel that is already in transit or delivered.",
            });
        }

        parcel.status = "cancelled";
        parcel.timeline.cancelledAt = new Date();
        await parcel.save();

        res.status(200).json({ message: "Parcel cancelled successfully." });
    } catch (error) {
        console.error("❌ Error cancelling parcel:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};