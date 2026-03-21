// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   name: { type: String },
//   email: { type: String, unique: true, sparse: true },
//   password: { type: String }, // optional now
//   phone: { type: String, required: true, unique: true },
//   role: { type: String, enum: ["individual", "transporter"], default: "individual" },
// kycStatus: {
//   type: String,
//   enum: ["not_started", "pending", "verified"],
//   default: "not_started",
// },  vehicleInfo: {
//     type: {
//       vehicleType: String,
//       registrationNo: String,
//       photo: String,
//     },
//     default: {},
//   },
//   ratings: { type: Number, default: 0 },
//   createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.model("User", userSchema);






import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
    },

    role: {
      type: String,
      enum: ["user", "transporter"],
      default: "user",
    },

    // ── Profile ─────────────────────────────────
    profilePhoto: {
      type: String,
      default: null,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    phone: {
      type: String,
      default: null,
    },

    // ── KYC ─────────────────────────────────────
    kycStatus: {
      type: String,
      enum: ["not_started", "pending", "verified"],
      default: "not_started",
    },

    // ── Vehicle (transporters) ───────────────────
    vehicleInfo: {
      vehicleType: { type: String, default: null },
      registrationNo: { type: String, default: null },
      photo: { type: String, default: null },
    },

    // ── Ratings ─────────────────────────────────
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalRatings: {
      type: Number,
      default: 0,
    },

    // ── Ride history refs (optional, for dashboard) ──
    requests: [
      {
        ride: { type: mongoose.Schema.Types.ObjectId, ref: "Ride" },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
      },
    ],

    // ── Soft delete ──────────────────────────────
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ── Filter out soft-deleted users from all queries ──
userSchema.pre(/^find/, function (next) {
  this.where({ deletedAt: null });
  next();
});

// ── Virtual: average rating display ──
userSchema.virtual("ratingDisplay").get(function () {
  if (!this.totalRatings || this.totalRatings === 0) return "No ratings yet";
  const rating = this.rating || 0;
  return `${rating.toFixed(1)} (${this.totalRatings} reviews)`;
});

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret.password; // never expose password
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);
export default User;