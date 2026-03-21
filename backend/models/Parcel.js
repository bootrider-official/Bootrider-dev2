// import mongoose from "mongoose";

// const parcelSchema = new mongoose.Schema(
//   {
//     sender: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     receiverName: {
//       type: String,
//       required: true,
//     },
//     receiverPhone: {
//       type: String,
//       required: true,
//     },
//     from: {
//       type: String,
//       required: true,
//     },
//     to: {
//       type: String,
//       required: true,
//     },
//     weight: {
//       type: Number,
//       required: true,
//       min: 0.1,
//     },
//     dimensions: {
//       length: Number,
//       width: Number,
//       height: Number,
//     },
//     price: {
//       type: Number,
//       required: true,
//     },
//     assignedDriver: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },
//     status: {
//       type: String,
//       enum: ["pending", "in-transit", "delivered", "cancelled"],
//       default: "pending",
//     },
//     pickupDate: {
//       type: Date,
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Parcel", parcelSchema);



import mongoose from "mongoose";

const parcelSchema = new mongoose.Schema(
  {
    // ── Who is sending ───────────────────────────
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ── Receiver details ─────────────────────────
    receiverName: {
      type: String,
      required: [true, "Receiver name is required"],
      trim: true,
    },

    receiverPhone: {
      type: String,
      required: [true, "Receiver phone is required"],
      trim: true,
    },

    // ── Linked ride ──────────────────────────────
    // Which ride is carrying this parcel
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride",
      required: true,
    },

    // ── Pickup point ─────────────────────────────
    // Either ride's start point or one of its stops
    pickupPoint: {
      name: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },

    // ── Drop point ───────────────────────────────
    dropPoint: {
      name: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },

    // ── Parcel details ───────────────────────────
    size: {
      type: String,
      enum: ["small", "medium", "large"],
      required: [true, "Parcel size is required"],
    },

    // Size reference:
    // small  → up to 2kg  (envelope, small box)
    // medium → up to 10kg (bag, shoebox)
    // large  → up to 20kg (large box, luggage)

    weight: {
      type: Number,
      required: [true, "Approximate weight is required"],
      min: 0.1,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    isFragile: {
      type: Boolean,
      default: false,
    },

    // ── Pricing ──────────────────────────────────
    // Calculated at booking time from ride's bootSpace pricing
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // ── 4-stage delivery status ──────────────────
    status: {
      type: String,
      enum: ["booked", "picked_up", "in_transit", "delivered", "cancelled"],
      default: "booked",
    },

    // Timestamps for each stage
    timeline: {
      bookedAt: { type: Date, default: Date.now },
      pickedUpAt: { type: Date, default: null },
      inTransitAt: { type: Date, default: null },
      deliveredAt: { type: Date, default: null },
      cancelledAt: { type: Date, default: null },
    },

    // ── Proof photos ─────────────────────────────
    // Driver uploads photo at pickup and delivery
    proofPhotos: {
      pickup: { type: String, default: null },    // Cloudinary URL
      delivery: { type: String, default: null },  // Cloudinary URL
    },

    // ── Soft delete ──────────────────────────────
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

// ── Filter soft-deleted parcels ──────────────────────────────────────────────
parcelSchema.pre(/^find/, function (next) {
  this.where({ deletedAt: null });
  next();
});

// ── Virtual: human-readable status ──────────────────────────────────────────
parcelSchema.virtual("statusLabel").get(function () {
  const labels = {
    booked: "Booked — awaiting pickup",
    picked_up: "Picked up by driver",
    in_transit: "In transit",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return labels[this.status] || this.status;
});

// ── Virtual: progress step (1-4) for tracking UI ────────────────────────────
parcelSchema.virtual("progressStep").get(function () {
  const steps = {
    booked: 1,
    picked_up: 2,
    in_transit: 3,
    delivered: 4,
    cancelled: 0,
  };
  return steps[this.status] || 1;
});

parcelSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

const Parcel = mongoose.model("Parcel", parcelSchema);
export default Parcel;