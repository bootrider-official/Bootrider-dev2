import express from "express";
import { sendOtp, verifyOtp, logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/logout", logout);

export default router;












// // routes/rideRoutes.js
// import express from "express";
// import {
//   createRide,
//   searchRides,
//   deleteRide,
//   bookRide,
//   getMyRides,
//   getRideById,
//   requestRide,
//   handleRideRequest,
// } from "../controllers/rideController.js";

// import { verifyKyc } from "../middlewares/verifyKyc.js";
// import { protect } from "../middlewares/authMiddleware.js";

// const router = express.Router();

// // ✅ My rides (for driver dashboard)
// router.get("/my-rides", protect, getMyRides);

// // ✅ Create a ride (only verified drivers)
// router.post("/create", protect, verifyKyc, createRide);

// // 🔍 Search rides (public)
// router.get("/search", searchRides);

// // 🪑 Passenger requests a ride
// router.post("/request", protect, requestRide);

// // 🟢 Approve / 🔴 Reject a ride request
// router.post("/handle-request", protect, handleRideRequest);

// // ❌ Delete a ride
// router.delete("/:id", protect, deleteRide);

// // 🔍 Get ride details
// router.get("/:id", getRideById);

// // 🚗 Legacy book ride endpoint (optional)
// router.post("/book/:id", protect, bookRide);

// export default router;
