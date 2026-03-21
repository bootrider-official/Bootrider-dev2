








// // models/Ride.js
// import mongoose from "mongoose";

// const requestSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   seatsRequested: { type: Number, required: true },
//   status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
//   createdAt: { type: Date, default: Date.now },
// });

// const rideSchema = new mongoose.Schema({
//   driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   from: String,
//   to: String,
//   stops: [String],
//   date: Date,
//   time: String,
//   availableSeats: Number,
//   pricePerSeat: Number,
//   status: { type: String, default: "active" },
//   requests: [requestSchema],

//   fromLocation: { lat: Number, lng: Number },
// toLocation: { lat: Number, lng: Number },
// stopsLocation: [{ lat: Number, lng: Number }],

//   passengers: [
//     {
//       user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//       seatsBooked: Number,
//     },
//   ],
// });

// export default mongoose.model("Ride", rideSchema);




// // backend/models/Ride.js
// import mongoose from "mongoose";

// const requestSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   seatsRequested: Number,
//   status: { type: String, default: "pending" },
// });

// const rideSchema = new mongoose.Schema({
//   driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   from: {
//     name: String,
//     coordinates: {
//       lat: Number,
//       lng: Number,
//     },
//   },
//   to: {
//     name: String,
//     coordinates: {
//       lat: Number,
//       lng: Number,
//     },
//   },
//   stops: [
//     {
//       name: String,
//       coordinates: {
//         lat: Number,
//         lng: Number,
//       },
//     },
//   ],
//   date: Date,
//   time: String,
//   availableSeats: Number,
//   pricePerSeat: Number,
//   status: { type: String, default: "active" },
//   requests: [requestSchema],
//   passengers: [
//     {
//       user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//       seatsBooked: Number,
//     },
//   ],
// });

// const Ride = mongoose.model("Ride", rideSchema);
// export default Ride;










// // backend/models/Ride.js
// import mongoose from "mongoose";

// // ===============================
// // 📍 Request Schema
// // ===============================
// const requestSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     seatsRequested: {
//       type: Number,
//       required: true,
//       min: [1, "At least one seat must be requested"],
//     },
//     bookingPreference: {
//   type: String,
//   enum: ["instant", "review"],
//   default: "review",
// },

//     status: {
//       type: String,
//       enum: ["pending", "approved", "rejected"],
//       default: "pending",
//     },
//   },
//   { timestamps: true }
// );

// // ===============================
// // 📍 Location Subschema
// // ===============================
// const locationSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Location name is required"],
//       trim: true,
//     },
//     coordinates: {
//       lat: { type: Number, required: true },
//       lng: { type: Number, required: true },
//     },
//   },
//   { _id: false }
// );

// // ===============================
// // 🚗 Ride Schema
// // ===============================
// const rideSchema = new mongoose.Schema(
//   {
//     driver: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     from: {
//       type: locationSchema,
//       required: true,
//     },

//     to: {
//       type: locationSchema,
//       required: true,
//     },

//     stops: {
//       type: [locationSchema],
//       default: [],
//     },

//     date: {
//       type: Date,
//       required: [true, "Ride date is required"],
//     },

//     time: {
//       type: String,
//       required: [true, "Ride time is required"],
//     },

//     availableSeats: {
//       type: Number,
//       required: [true, "Available seats are required"],
//       min: [0, "There must be at least one available seat"],
//     },

//     pricePerSeat: {
//       type: Number,
//       required: [true, "Price per seat is required"],
//       min: [0, "Price must be non-negative"],
//     },

//     status: {
//       type: String,
//       enum: ["active", "completed", "cancelled"],
//       default: "active",
//     },

//     requests: {
//       type: [requestSchema],
//       default: [],
//     },

//     passengers: {
//       type: [
//         {
//           user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//           seatsBooked: { type: Number, min: 1 },
//         },
//       ],
//       default: [],
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // ===============================
// // 🧠 Middleware & Virtuals (Optional)
// // ===============================

// // Example: Automatically calculate total booked seats
// rideSchema.virtual("bookedSeats").get(function () {
//   return this.passengers.reduce((acc, p) => acc + (p.seatsBooked || 0), 0);
// });

// // Optional: Exclude sensitive/internal fields from JSON responses
// // rideSchema.set("toJSON", {
// //   virtuals: true,
// //   versionKey: false,
// //   transform: (_, ret) => {
// //     delete ret._id;
// //     return ret;
// //   },
// // });

// rideSchema.set("toJSON", {
//   virtuals: true,
//   versionKey: false,
//   transform: (_, ret) => {
//     ret.id = ret._id;   // 👈 Keep id field for frontend use
//     delete ret._id;     // Optional: remove raw _id if you prefer clean output
//     return ret;
//   },
// });


// // ===============================
// // ✅ Model Export
// // ===============================
// const Ride = mongoose.model("Ride", rideSchema);
// export default Ride;



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
    seatsRequested: {
      type: Number,
      default: 0,
      min: 0,
    },
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
    // Fixed prices per parcel size
    smallPrice: { type: Number, default: null },   // up to 2kg
    mediumPrice: { type: Number, default: null },  // up to 10kg
    largePrice: { type: Number, default: null },   // up to 20kg

    maxWeightKg: { type: Number, default: null },  // total boot capacity

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

    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },

    pricePerSeat: {
      type: Number,
      required: true,
      min: 0,
    },

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

    // ── Boot space (optional) ────────────────────
    acceptsParcels: { type: Boolean, default: false },
    bootSpace: { type: bootSpaceSchema, default: null },

    // ── Status ───────────────────────────────────
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },

    // ── Timestamps for lifecycle ─────────────────
    completedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null },    // soft delete

    // ── Relations ────────────────────────────────
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

// ── Filter soft-deleted rides from all queries ───────────────────────────────
rideSchema.pre(/^find/, function (next) {
  this.where({ deletedAt: null });
  next();
});

// ── Virtual: total booked seats ──────────────────────────────────────────────
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