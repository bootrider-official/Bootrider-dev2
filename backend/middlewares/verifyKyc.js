export const verifyKyc = (req, res, next) => {
  try {
    const user = req.user; // from JWT middleware

    if (!user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    if (user.kycStatus !== "verified") {
      return res
        .status(403)
        .json({ message: "Access denied. KYC not verified." });
    }

    next(); // ✅ continue to create ride
  } catch (error) {
    console.error("KYC verification middleware error:", error);
    res.status(500).json({ message: "Server error during KYC check." });
  }
};
