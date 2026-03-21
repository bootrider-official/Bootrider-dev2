import express from "express";
import {
    createOrUpdateTransporterProfile,
    getProfile,
    updateProfile,
    getUserById,
    verifyUserKyc,          // ← add this
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// ── Own profile ──────────────────────────────────────────────────────────────
router.get("/profile", protect, getProfile);
router.put("/profile", protect, singleUpload, updateProfile);

// ── Any user profile (auth required) ────────────────────────────────────────
router.get("/profile/:id", protect, getUserById);


// Add this route
router.post("/verify-kyc", protect, verifyUserKyc);
// ── Transporter KYC ─────────────────────────────────────────────────────────
router.post("/transporter/profile", protect, singleUpload, createOrUpdateTransporterProfile);

export default router;