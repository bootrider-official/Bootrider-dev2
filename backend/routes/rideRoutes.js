
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

// ── Dynamic routes  ─────────────────────────────────────────────────────
router.patch("/complete/:id", protect, completeRide);
router.delete("/:id", protect, deleteRide);
router.get("/:id", getRideById);

export default router;