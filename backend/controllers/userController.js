import User from "../models/User.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../config/cloudinary.js";

// Create or update transporter profile
export const createOrUpdateTransporterProfile = async (req, res) => {


  try {
    console.log("FILE:", req.file);
    console.log("BODY:", req.body);
    console.log("CLOUDINARY CONFIG:", cloudinary.config());


    const userId = req.user.id; // from auth middleware
    const { vehicleType, registrationNo } = req.body;
    const file = req.file;
    const fileUri = getDataUri(file);

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY || process.env.API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET || process.env.API_SECRET,
    });

    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    // const photoUrl = req.file?.path; // Cloudinary auto adds this

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure user role is transporter
    if (user.role !== "transporter") {
      return res.status(403).json({ message: "Only transporters can create a profile" });
    }

    // Update profile with Cloudinary photo
    user.vehicleInfo = {
      vehicleType,
      registrationNo,
      photo: cloudResponse.secure_url || user.vehicleInfo.photo, // keep old if not updated
    };

    user.kycStatus = "verified"; // will change to "verified" after admin check

    await user.save();

    res.status(200).json({
      message: "Transporter profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("❌ Error updating transporter profile:");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("Full error object:", JSON.stringify(error, null, 2));

    res.status(500).json({
      message: "Server error updating transporter profile",
      error: error.message
    });
  }
};
