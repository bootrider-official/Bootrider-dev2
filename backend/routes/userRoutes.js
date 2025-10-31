import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  uploadKYC,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

// Public routes
router.post("/signup", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/me", protect, getProfile);
router.put("/update", protect, updateProfile);
router.post("/kyc", protect, uploadKYC);

export default router;
