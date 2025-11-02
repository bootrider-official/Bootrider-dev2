import express from "express";
import { createOrUpdateTransporterProfile } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
// import { upload } from "../config/cloudinary.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();


router.post("/transporter/profile", protect, singleUpload, createOrUpdateTransporterProfile);
export default router;
