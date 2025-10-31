import express from "express";
import { sendOtp, verifyOtp, logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/logout", logout);

export default router;
