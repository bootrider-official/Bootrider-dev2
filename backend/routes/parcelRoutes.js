import express from "express";
import {
    createParcel,
    getMyParcels,
    getParcelById,
    updateParcelStatus,
    getParcelsForRide,
    cancelParcel,
} from "../controllers/parcelController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createParcel);
router.get("/my-parcels", protect, getMyParcels);
router.get("/ride/:rideId", protect, getParcelsForRide);
router.get("/:id", protect, getParcelById);
router.patch("/:id/status", protect, updateParcelStatus);
router.patch("/:id/cancel", protect, cancelParcel);

export default router;