import Ride from "../models/Ride.js";

export const verifyKyc = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    // ✅ Already verified — always allow
    if (user.kycStatus === "verified") {
      return next();
    }

    // ✅ Check if this is their first ride
    const existingRides = await Ride.countDocuments({ driver: user._id });

    if (existingRides === 0) {
      // First ride — KYC required
      return res.status(403).json({
        message: "Please complete KYC before listing your first ride.",
        requiresKyc: true,
      });
    }

    // ✅ Has existing rides — allow without KYC
    return next();
  } catch (error) {
    console.error("❌ KYC middleware error:", error.message);
    res.status(500).json({ message: "Server error during KYC check." });
  }
};