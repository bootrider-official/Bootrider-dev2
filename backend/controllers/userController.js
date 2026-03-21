import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import getDataUri from "../utils/datauri.js";

// ===============================
// 🚗 Create/Update Transporter Profile (KYC)
// ===============================
export const createOrUpdateTransporterProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { vehicleType, registrationNo } = req.body;
    const file = req.file;

    const fileUri = getDataUri(file);

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY || process.env.API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET || process.env.API_SECRET,
    });

    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "transporter") {
      return res.status(403).json({ message: "Only transporters can create a profile" });
    }

    user.vehicleInfo = {
      vehicleType,
      registrationNo,
      photo: cloudResponse.secure_url || user.vehicleInfo?.photo,
    };
    user.kycStatus = "verified";

    await user.save();

    res.status(200).json({
      message: "Transporter profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("❌ Error updating transporter profile:");
    console.error("Message:", error.message);
    console.error("Full error object:", JSON.stringify(error, null, 2));
    res.status(500).json({
      message: "Server error updating transporter profile",
      error: error.message,
    });
  }
};

// ===============================
// 👤 Get Own Profile
// ===============================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error fetching profile:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};
// ===============================
// ✅ Simple KYC for normal users
// ===============================
export const verifyUserKyc = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.role !== "user") {
      return res.status(403).json({ message: "Use transporter KYC for fleet accounts." });
    }

    user.kycStatus = "verified";
    await user.save();

    res.status(200).json({
      message: "Identity verified successfully.",
      user,
    });
  } catch (error) {
    console.error("❌ Error verifying user KYC:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};
// ===============================
// ✏️ Update Own Profile
// ===============================
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      name,
      age,
      gender,
      bio,
      phone,
      preferences,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    // ── Update basic fields ──────────────────────
    if (name) user.name = name.trim();
    if (age) user.age = parseInt(age);
    if (gender) user.gender = gender;
    if (bio !== undefined) user.bio = bio.trim().slice(0, 300);
    if (phone) user.phone = phone;

    // ── Update preferences ───────────────────────
    if (preferences) {
      user.preferences = {
        music: preferences.music || user.preferences?.music || "no_preference",
        chat: preferences.chat || user.preferences?.chat || "no_preference",
        smoking: preferences.smoking || user.preferences?.smoking || "never",
        pets: preferences.pets || user.preferences?.pets || "fine",
      };
    }

    // ── Handle profile photo upload ──────────────
    if (req.file) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY || process.env.API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET || process.env.API_SECRET,
      });

      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        folder: "bootrider/profiles",
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
        ],
      });
      user.profilePhoto = cloudResponse.secure_url;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    console.error("❌ Error updating profile:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

// ===============================
// 🔍 Get Any User Profile by ID (auth required)
// ===============================
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select(
      "name profilePhoto age gender bio preferences rating totalRatings totalRidesAsDriver totalRidesAsPassenger kycStatus createdAt vehicleInfo role"
    );

    if (!user) return res.status(404).json({ message: "User not found." });

    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error fetching user:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};