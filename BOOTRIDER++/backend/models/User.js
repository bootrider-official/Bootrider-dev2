import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ["individual", "transporter"], default: "individual" },
  kycStatus: { type: String, enum: ["pending", "verified"], default: "pending" },
  vehicleInfo: {
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
