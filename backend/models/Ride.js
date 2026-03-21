import mongoose from "mongoose";

// ── Location subschema ───────────────────────────────────────────────────────
const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  },
  { _id: false }
);

// ── Request subschema ────────────────────────────────────────────────────────
const requestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seatsRequested: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// ── Boot space subschema ─────────────────────────────────────────────────────
const bootSpaceSchema = new mongoose.Schema(
  {
    smallPrice: { type: Number, default: null },
    mediumPrice: { type: Number, default: null },
    largePrice: { type: Number, default: null },
    maxWeightKg: { type: Number, default: null },
    fragileAccepted: { type: Boolean, default: false },
    pickupFlexibility: {
      type: String,
      enum: ["start_only", "any_stop"],
      default: "start_only",
    },
    allowedGoods: {
      type: [String],
      enum: ["Documents", "Clothes", "Food (Sealed)", "Electronics", "Other"],
      default: [],
    },
    bootDescription: { type: String, default: "" },
  },
  { _id: false }
);

// ── Main ride schema ─────────────────────────────────────────────────────────
const rideSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    from: { type: locationSchema, required: true },
    to: { type: locationSchema, required: true },
    stops: { type: [locationSchema], default: [] },

    date: { type: Date, required: true },
    time: { type: String, required: true },

    availableSeats: { type: Number, required: true, min: 0 },
    pricePerSeat: { type: Number, required: true, min: 0 },

    vehicleDetails: {
      type: { type: String, default: null },
      model: { type: String, default: null },
      color: { type: String, default: null },
      plateNumber: { type: String, default: null },
    },

    bookingPreference: {
      type: String,
      enum: ["instant", "review"],
      default: "review",
    },

    // ── Ride preferences (BlaBlaCar style) ──────────
    preferences: {
      smokingAllowed: { type: Boolean, default: false },
      petsAllowed: { type: Boolean, default: false },
      womenOnly: { type: Boolean, default: false },
      maxInBack: { type: Boolean, default: false }, // max 2 in back seat
      musicAllowed: { type: Boolean, default: true },
      chatPreference: {
        type: String,
        enum: ["chatty", "quiet", "no_preference"],
        default: "no_preference",
      },
    },

    // ── Boot space (optional) ────────────────────────
    acceptsParcels: { type: Boolean, default: false },
    bootSpace: { type: bootSpaceSchema, default: null },

    // ── Stopover pricing ─────────────────────────────
    // Price per segment e.g. A→B ₹70, B→C ₹100
    // ── Stopover pricing ─────────────────────────────────────────────
    stopoverPrices: {
      type: [
        {
          fromName: { type: String },   // e.g. "Noida"
          toName: { type: String },   // e.g. "Farah"
          fromCoordinates: {
            lat: { type: Number },
            lng: { type: Number },
          },
          toCoordinates: {
            lat: { type: Number },
            lng: { type: Number },
          },
          price: { type: Number },   // ₹ for this segment
          distanceKm: { type: Number },   // approximate km
        },
      ],
      default: [],
    },

    // ── Status ───────────────────────────────────────
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },

    completedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null },

    // ── Relations ────────────────────────────────────
    requests: { type: [requestSchema], default: [] },

    passengers: {
      type: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          seatsBooked: { type: Number, min: 1 },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

// ── Indexes ──────────────────────────────────────────────────────────────────
rideSchema.index({ "from.coordinates.lat": 1, "from.coordinates.lng": 1 });
rideSchema.index({ "to.coordinates.lat": 1, "to.coordinates.lng": 1 });
rideSchema.index({ date: 1, status: 1 });

// ── Filter soft-deleted rides ────────────────────────────────────────────────
rideSchema.pre(/^find/, function (next) {
  this.where({ deletedAt: null });
  next();
});

// ── Virtual: booked seats ────────────────────────────────────────────────────
rideSchema.virtual("bookedSeats").get(function () {
  return this.passengers.reduce((acc, p) => acc + (p.seatsBooked || 0), 0);
});

rideSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

const Ride = mongoose.model("Ride", rideSchema);
export default Ride;