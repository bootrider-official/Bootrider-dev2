import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOtp, verifyOtp, canSendOtp } from "../utils/otp.js";

// ── Generate JWT ──────────────────────────────────────────────────────────────
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ── Safe user object (no password) ───────────────────────────────────────────
const safeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  kycStatus: user.kycStatus,
  profilePhoto: user.profilePhoto || null,
  isPhoneVerified: user.isPhoneVerified,
  rating: user.rating,
  totalRatings: user.totalRatings,
});

// ===============================
// 📱 Send OTP
// ===============================
export const sendOtpHandler = async (req, res) => {
  try {
    const { phone, purpose } = req.body;
    // purpose: "signup" | "login" | "forgot_password"

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required." });
    }

    // ── Validate Indian phone number ──
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        message: "Please enter a valid 10-digit Indian mobile number.",
      });
    }

    // ── Rate limit check ──
    if (!canSendOtp(phone)) {
      return res.status(429).json({
        message: "Please wait 60 seconds before requesting another OTP.",
      });
    }

    // ── Purpose-specific checks ──
    if (purpose === "signup") {
      const existing = await User.findOne({ phone });
      if (existing) {
        return res.status(400).json({
          message: "This phone number is already registered. Please login.",
        });
      }
    }

    if (purpose === "login" || purpose === "forgot_password") {
      const user = await User.findOne({ phone });
      if (!user) {
        return res.status(404).json({
          message: "No account found with this phone number.",
        });
      }
    }

    await sendOtp(phone);

    res.status(200).json({
      success: true,
      message: `OTP sent to +91 ${phone}. Valid for 10 minutes.`,
    });
  } catch (error) {
    console.error("❌ FULL ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to send OTP." });
  }
};

// ===============================
// 📌 Register (email + password + phone OTP verified)
// ===============================
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, otp, role } = req.body;

    if (!name || !email || !password || !phone || !otp) {
      return res.status(400).json({
        message: "Name, email, password, phone and OTP are required.",
      });
    }

    // ── Verify OTP ──
    const otpResult = verifyOtp(phone, otp);
    if (!otpResult.valid) {
      return res.status(400).json({ message: otpResult.reason });
    }

    // ── Check existing ──
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already registered. Please login.",
      });
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        message: "Phone number already registered. Please login.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || "user",
      isPhoneVerified: true,
      kycStatus: "not_started",
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
      user: safeUser(user),
    });
  } catch (error) {
    console.error("❌ Register error:", error.message);
    res.status(500).json({ message: "Server error during registration." });
  }
};

// ===============================
// 🔐 Login — Email + Password
// ===============================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "No account found with this email.",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "This account uses OTP login. Please use the OTP option.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password." });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      token,
      user: safeUser(user),
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    res.status(500).json({ message: "Server error during login." });
  }
};

// ===============================
// 📱 Login — Phone + OTP
// ===============================
export const loginWithOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        message: "Phone number and OTP are required.",
      });
    }

    // ── Verify OTP ──
    const otpResult = verifyOtp(phone, otp);
    if (!otpResult.valid) {
      return res.status(400).json({ message: otpResult.reason });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        message: "No account found with this phone number.",
      });
    }

    // ── Mark phone as verified if not already ──
    if (!user.isPhoneVerified) {
      user.isPhoneVerified = true;
      await user.save();
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      token,
      user: safeUser(user),
    });
  } catch (error) {
    console.error("❌ OTP login error:", error.message);
    res.status(500).json({ message: "Server error during login." });
  }
};

// ===============================
// 🔑 Forgot Password — Send OTP
// (handled by sendOtpHandler with purpose="forgot_password")
// ===============================

// ===============================
// 🔑 Reset Password — Verify OTP + Set New Password
// ===============================
export const resetPassword = async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body;

    if (!phone || !otp || !newPassword) {
      return res.status(400).json({
        message: "Phone, OTP and new password are required.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters.",
      });
    }

    // ── Verify OTP ──
    const otpResult = verifyOtp(phone, otp);
    if (!otpResult.valid) {
      return res.status(400).json({ message: otpResult.reason });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.isPhoneVerified = true;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Password reset successfully.",
      token,
      user: safeUser(user),
    });
  } catch (error) {
    console.error("❌ Reset password error:", error.message);
    res.status(500).json({ message: "Server error during password reset." });
  }
};

// ===============================
// 🚪 Logout
// ===============================
export const logout = (req, res) => {
  res.status(200).json({ success: true, message: "Logged out successfully." });
};