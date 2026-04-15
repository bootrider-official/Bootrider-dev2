


import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import chatRoutes from "./routes/chat.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import rideRoutes from "./routes/rideRoutes.js";
import geocodeRoutes from "./routes/geocode.js";
import parcelRoutes from "./routes/parcelRoutes.js";
import enterpriseRoutes from "./routes/enterpriseRoutes.js";

dotenv.config(); // ✅ only once

const app = express();
const cors = require("cors");


app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://bootrider-dev2-br.vercel.app",
    "https://bootrider.online"
  ],
  credentials: true
}));
app.options("*", cors());
app.use(express.json());
app.use(morgan("dev"));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ride", rideRoutes);
app.use("/api/geocode", geocodeRoutes);
app.use("/api/parcel", parcelRoutes);
app.use("/api/enterprise", enterpriseRoutes);
app.use("/api/chat", chatRoutes);

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Bootrider API is running." });
});

// ── Connect DB then start server ─────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI, {
    tls: true,
    tlsAllowInvalidCertificates: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  });
