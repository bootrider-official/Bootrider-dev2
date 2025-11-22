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
  deleteRide,
  getMyRides,
  getRideById,
  bookRide,
  requestRide,
  handleRideRequest,
  getMyBookings,
} from "../controllers/rideController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { verifyKyc } from "../middlewares/verifyKyc.js";


const router = express.Router();

// ✅ 1️⃣ Static routes first
router.post("/handle-request", protect, handleRideRequest);
router.post("/request", protect, requestRide);
router.get("/my-rides", protect, getMyRides);
router.post("/create", protect, verifyKyc, createRide);
router.get("/search", searchRides);
router.get("/my-bookings", protect, getMyBookings);

// ✅ 2️⃣ Dynamic routes after static ones
router.delete("/:id", protect, deleteRide);
router.post("/book/:id", protect, bookRide);
router.get("/:id", getRideById);


export default router;
