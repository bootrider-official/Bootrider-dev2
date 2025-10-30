import User from "../models/User.js";
import { generateToken } from "../utils/gentok.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const otpSessions = {}; // temporary in-memory OTP storage

// ✅ Send OTP
export const sendOtp = async (req, res) => {
  const { phone, type, name, email, role } = req.body;

  try {
    const response = await axios.get(
      `https://2factor.in/API/V1/${process.env.OTP_API_KEY}/SMS/${phone}/AUTOGEN`
    );

    if (response.data.Status === "Success") {
      const sessionId = response.data.Details;
      otpSessions[sessionId] = { phone, type, name, email, role };

      res.status(200).json({
        message: "OTP sent successfully",
        sessionId,
      });
    } else {
      res.status(500).json({ message: "Failed to send OTP" });
    }
  } catch (error) {
    console.error("OTP Send Error:", error.message);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

// ✅ Verify OTP
export const verifyOtp = async (req, res) => {
  const { sessionId, otp } = req.body;

  try {
    const response = await axios.get(
      `https://2factor.in/API/V1/${process.env.OTP_API_KEY}/SMS/VERIFY/${sessionId}/${otp}`
    );

    if (response.data.Status === "Success") {
      const session = otpSessions[sessionId];
      if (!session)
        return res.status(400).json({ message: "Session expired or invalid" });

      const { phone, type, name, email, role } = session;
      let user = await User.findOne({ phoneNumber: phone });

      if (type === "signup") {
        if (user)
          return res
            .status(400)
            .json({ message: "User already exists, please login." });
        if (!name || !role)
          return res
            .status(400)
            .json({ message: "Name and Role are required for signup." });

        user = await User.create({
          name,
          phoneNumber: phone,
          email: email || "",
          role,
        });
      }

      if (type === "login") {
        if (!user)
          return res
            .status(400)
            .json({ message: "User not found, please sign up first." });
      }

      const token = generateToken(user._id, res);
      delete otpSessions[sessionId];

      res.status(200).json({
        message: "OTP verified successfully",
        token,
        user,
      });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("OTP Verify Error:", error.message);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

// ✅ Logout
export const logout = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  res.status(200).json({ message: "Logged out successfully" });
};
