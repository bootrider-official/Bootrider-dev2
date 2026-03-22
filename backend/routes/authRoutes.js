import express from "express";
import {
    register,
    login,
    loginWithOtp,
    sendOtpHandler,
    resetPassword,
    logout,
} from "../controllers/authController.js";

const router = express.Router();

// ── OTP ──────────────────────────────────────────────────────────────────────
router.post("/send-otp", sendOtpHandler);

// ── Registration ─────────────────────────────────────────────────────────────
router.post("/register", register);

// ── Login ─────────────────────────────────────────────────────────────────────
router.post("/login", login);               // email + password
router.post("/login-otp", loginWithOtp);    // phone + OTP

// ── Password reset ────────────────────────────────────────────────────────────
// Step 1: send-otp with purpose="forgot_password" (reuses /send-otp)
// Step 2: verify OTP + set new password
router.post("/reset-password", resetPassword);

// ── Logout ────────────────────────────────────────────────────────────────────
router.post("/logout", logout);

export default router;