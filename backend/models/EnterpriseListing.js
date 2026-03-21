import mongoose from "mongoose";

// ── Booking subschema ────────────────────────────────────────────────────────
const enterpriseBookingSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // Cargo details
        cargoDescription: { type: String, required: true, trim: true },
        weightKg: { type: Number, required: true, min: 1 },
        volumeCbm: { type: Number, default: null }, // cubic metres, optional

        // Receiver info
        receiverName: { type: String, required: true, trim: true },
        receiverPhone: { type: String, required: true, trim: true },

        // Calculated at booking time
        totalPrice: { type: Number, required: true },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "in_transit", "delivered"],
            default: "pending",
        },

        // Proof photos
        proofPhotos: {
            pickup: { type: String, default: null },
            delivery: { type: String, default: null },
        },

        // Timeline
        timeline: {
            bookedAt: { type: Date, default: Date.now },
            approvedAt: { type: Date, default: null },
            pickedUpAt: { type: Date, default: null },
            deliveredAt: { type: Date, default: null },
        },
    },
    { timestamps: true }
);

// ── Main enterprise listing schema ───────────────────────────────────────────
const enterpriseListingSchema = new mongoose.Schema(
    {
        // ── Owner ────────────────────────────────────
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // ── Route ────────────────────────────────────
        from: {
            name: { type: String, required: true, trim: true },
            coordinates: {
                lat: { type: Number, required: true },
                lng: { type: Number, required: true },
            },
        },

        to: {
            name: { type: String, required: true, trim: true },
            coordinates: {
                lat: { type: Number, required: true },
                lng: { type: Number, required: true },
            },
        },

        // Optional intermediate stops
        stops: {
            type: [
                {
                    name: { type: String, required: true },
                    coordinates: {
                        lat: { type: Number, required: true },
                        lng: { type: Number, required: true },
                    },
                },
            ],
            default: [],
        },

        // ── Trip details ─────────────────────────────
        date: { type: Date, required: true },
        time: { type: String, required: true },

        // ── Vehicle details ──────────────────────────
        vehicleType: {
            type: String,
            enum: ["mini_truck", "tempo", "truck", "container", "other"],
            required: true,
        },

        vehicleNumber: { type: String, required: true, trim: true },

        // ── Capacity ─────────────────────────────────
        totalCapacityKg: {
            type: Number,
            required: true,
            min: 1,
        },

        availableCapacityKg: {
            type: Number,
            required: true,
            min: 0,
        },

        // ── Pricing ──────────────────────────────────
        // Enterprise uses per-kg pricing (not fixed small/medium/large)
        pricePerKg: {
            type: Number,
            required: true,
            min: 1,
        },

        minimumWeightKg: {
            type: Number,
            default: 1,
        },

        // ── Cargo preferences ────────────────────────
        acceptedGoodsTypes: {
            type: [String],
            enum: [
                "Electronics",
                "Furniture",
                "FMCG",
                "Garments",
                "Documents",
                "Raw Materials",
                "Machinery",
                "Other",
            ],
            default: ["Other"],
        },

        fragileAccepted: { type: Boolean, default: false },
        hazardousAccepted: { type: Boolean, default: false },

        // ── Additional notes ─────────────────────────
        notes: { type: String, default: "", trim: true },

        // ── Status ───────────────────────────────────
        status: {
            type: String,
            enum: ["active", "completed", "cancelled"],
            default: "active",
        },

        completedAt: { type: Date, default: null },
        deletedAt: { type: Date, default: null },

        // ── Bookings ─────────────────────────────────
        bookings: { type: [enterpriseBookingSchema], default: [] },
    },
    { timestamps: true }
);

// ── Indexes ──────────────────────────────────────────────────────────────────
enterpriseListingSchema.index({ "from.coordinates.lat": 1, "from.coordinates.lng": 1 });
enterpriseListingSchema.index({ "to.coordinates.lat": 1, "to.coordinates.lng": 1 });
enterpriseListingSchema.index({ date: 1, status: 1 });

// ── Filter soft-deleted listings ─────────────────────────────────────────────
enterpriseListingSchema.pre(/^find/, function (next) {
    this.where({ deletedAt: null });
    next();
});

// ── Virtual: utilisation % ───────────────────────────────────────────────────
enterpriseListingSchema.virtual("utilisationPercent").get(function () {
    if (!this.totalCapacityKg) return 0;
    const used = this.totalCapacityKg - this.availableCapacityKg;
    return Math.round((used / this.totalCapacityKg) * 100);
});

enterpriseListingSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    },
});

const EnterpriseListing = mongoose.model("EnterpriseListing", enterpriseListingSchema);
export default EnterpriseListing;