import express from "express";
import { createRide, searchRides, deleteRide, bookRide, getMyRides, getRideById } from "../controllers/rideController.js";
// import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyKyc } from "../middlewares/verifyKyc.js";
import { protect } from "../middlewares/authMiddleware.js";
import Ride from "../models/Ride.js";

const router = express.Router();

router.get("/my-rides", protect, getMyRides); 


// ✅ Only verified users can create rides
router.post("/create", protect, verifyKyc, createRide);

// 🔍 Search rides (public)
router.get("/search", searchRides);

// ❌ Delete ride
router.delete("/:id", protect, deleteRide);

// 🪑 Book a ride
router.post("/book/:id", protect, bookRide);

router.get("/:id", getRideById);

export default router;
