// import express from "express";
// import { createRide, searchRides, deleteRide, bookRide, getMyRides, getRideById,requestRide } from "../controllers/rideController.js";
// // import { verifyToken } from "../middlewares/verifyToken.js";
// import { verifyKyc } from "../middlewares/verifyKyc.js";
// import { protect } from "../middlewares/authMiddleware.js";
// import Ride from "../models/Ride.js";

// const router = express.Router();

// router.get("/my-rides", protect, getMyRides); 


// // ✅ Only verified users can create rides
// router.post("/create", protect, verifyKyc, createRide);

// // 🔍 Search rides (public)
// router.get("/search", searchRides);

// // ❌ Delete ride
// router.delete("/:id", protect, deleteRide);

// // 🪑 Book a ride
// router.post("/book/:id", protect, bookRide);
// // Passenger sends request to driver
// router.post("/request", protect, requestRide);

// router.get("/:id", getRideById);

// export default router;

// routes/rideRoutes.js
import express from "express";
import {
  createRide,
  searchRides,
  getRideById,
  requestRide,
  handleRideRequest,
  getMyRides,
  getMyBookings,
  completeRide,
  deleteRide,
  rateUser,
} from "../controllers/rideController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { verifyKyc } from "../middlewares/verifyKyc.js";

const router = express.Router();

// ── Static routes first ──────────────────────────────────────────────────────
router.post("/create", protect, verifyKyc, createRide);
router.post("/request", protect, requestRide);
router.post("/handle-request", protect, handleRideRequest);
router.post("/rate-user", protect, rateUser);
router.get("/my-rides", protect, getMyRides);
router.get("/my-bookings", protect, getMyBookings);
router.get("/search", searchRides);

// ── Dynamic routes after ─────────────────────────────────────────────────────
router.patch("/complete/:id", protect, completeRide);
router.delete("/:id", protect, deleteRide);
router.get("/:id", getRideById);

export default router;