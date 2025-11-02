import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, sparse: true },
  password: { type: String }, // optional now
  phone: { type: String, required: true, unique: true },
  role: { type: String, enum: ["individual", "transporter"], default: "individual" },
kycStatus: {
  type: String,
  enum: ["not_started", "pending", "verified"],
  default: "not_started",
},  vehicleInfo: {
    type: {
      vehicleType: String,
      registrationNo: String,
      photo: String,
    },
    default: {},
  },
  ratings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
