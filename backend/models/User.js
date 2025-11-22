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








// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ["user", "transporter"], default: "user" },
  vehicleInfo: {
    vehicleType: String,
    registrationNo: String,
    photo: String,
  },
  kycStatus: {
  type: String,
  enum: ["not_started", "pending", "verified"],
  default: "not_started",
},
  requests: [
    {
      ride: { type: mongoose.Schema.Types.ObjectId, ref: "Ride" },
      status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    },
  ],
});

export default mongoose.model("User", userSchema);
