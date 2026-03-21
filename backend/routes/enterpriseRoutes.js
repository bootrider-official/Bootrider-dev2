import express from "express";
import {
    createListing,
    searchListings,
    getListingById,
    getMyListings,
    bookListing,
    handleBooking,
    updateBookingStatus,
    completeListing,
    deleteListing,
} from "../controllers/enterpriseController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { verifyKyc } from "../middlewares/verifyKyc.js";

const router = express.Router();

// ── Public ───────────────────────────────────────────────────────────────────
router.get("/search", searchListings);

// ── Authenticated ────────────────────────────────────────────────────────────
router.post("/book", protect, bookListing);

// ── Transporter only (KYC verified) ─────────────────────────────────────────
router.post("/create", protect, verifyKyc, createListing);
router.get("/my-listings", protect, getMyListings);
router.post("/handle-booking", protect, handleBooking);
router.post("/update-booking-status", protect, updateBookingStatus);
router.patch("/complete/:id", protect, completeListing);
router.delete("/:id", protect, deleteListing);

// ── Dynamic last ─────────────────────────────────────────────────────────────
router.get("/:id", getListingById);

export default router;