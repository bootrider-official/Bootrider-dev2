export const ensureVerifiedUser = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.kycStatus !== "verified") {
      return res
        .status(403)
        .json({ message: "User not verified. Please complete KYC verification." });
    }

    next();
  } catch (error) {
    console.error("verifyUserMiddleware error:", error);
    res.status(500).json({ message: "Error verifying user" });
  }
};
