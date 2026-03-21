// import React, { useState } from "react";
// import axios from "axios";
// import { BASE_URL } from "../utils/constants";
// import { useDispatch } from "react-redux";
// import { loginSuccess } from "../redux/authSlice";
// import { useNavigate } from "react-router-dom";

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     role: "individual",
//   });

//   const [otp, setOtp] = useState("");
//   const [sessionId, setSessionId] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       const res = await axios.post(`${BASE_URL}/auth/send-otp`, {
//         phone: formData.phone,
//         type: "signup",
//         name: formData.name,
//         email: formData.email,
//         role: formData.role,
//       });

//       setOtpSent(true);
//       setSessionId(res.data.sessionId);
//       setMessage(res.data.message || "OTP sent successfully!");
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Failed to send OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       const res = await axios.post(`${BASE_URL}/auth/verify-otp`, {
//         sessionId,
//         otp,
//       });

//       setMessage(res.data.message || "Signup successful!");
//       localStorage.setItem("token", res.data.token);
//       dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));

//       // ✅ Redirect after successful signup
//       navigate("/");
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Invalid OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
//       <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
//           {otpSent ? "Verify OTP" : "Sign Up"}
//         </h2>

//         {message && (
//           <p className="text-center text-sm mb-4 text-blue-600">{message}</p>
//         )}

//         <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
//           {!otpSent ? (
//             <>
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Full Name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full p-2 mb-3 border rounded-md focus:ring-2 focus:ring-blue-400"
//                 required
//               />
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email Address"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full p-2 mb-3 border rounded-md focus:ring-2 focus:ring-blue-400"
//                 required
//               />
//               <input
//                 type="text"
//                 name="phone"
//                 placeholder="Mobile Number"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="w-full p-2 mb-3 border rounded-md focus:ring-2 focus:ring-blue-400"
//                 required
//               />
//               <select
//                 name="role"
//                 value={formData.role}
//                 onChange={handleChange}
//                 className="w-full p-2 mb-3 border rounded-md focus:ring-2 focus:ring-blue-400"
//               >
//                 <option value="individual">Individual</option>
//                 <option value="transporter">Transporter</option>
//               </select>
//             </>
//           ) : (
//             <>
//               <p className="text-center text-gray-600 mb-4">
//                 OTP sent to <b>{formData.phone}</b>
//               </p>
//               <input
//                 type="text"
//                 name="otp"
//                 placeholder="Enter OTP"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 className="w-full p-2 mb-3 border rounded-md focus:ring-2 focus:ring-blue-400"
//                 required
//               />
//             </>
//           )}

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
//             disabled={loading}
//           >
//             {loading
//               ? "Processing..."
//               : otpSent
//               ? "Verify & Sign Up"
//               : "Send OTP"}
//           </button>
//         </form>

//         {!otpSent && (
//           <p className="text-center mt-4 text-sm text-gray-600">
//             Already have an account?{" "}
//             <a href="/login" className="text-blue-700 font-semibold">
//               Login
//             </a>
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Signup;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { loginSuccess } from "../redux/authSlice";
import { BASE_URL } from "../utils/constants";
import { Eye, EyeOff, Car, ArrowRight, User, Mail, Lock, Briefcase } from "lucide-react";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${BASE_URL}/auth/register`, form);
      dispatch(loginSuccess({ token: res.data.token, user: res.data.user }));
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0f1623] to-[#0a0a0f] items-center justify-center p-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />
          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Car size={20} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Boot<span className="text-blue-400">Rider</span>
            </span>
          </div>

          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Turn your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              daily drive
            </span>
            into income.
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed mb-12">
            Share your boot space, split fuel costs, and help packages reach
            their destination — all on your existing route.
          </p>

          <div className="space-y-5">
            {[
              { num: "01", text: "List your ride in under 2 minutes" },
              { num: "02", text: "Accept parcels or passengers" },
              { num: "03", text: "Earn on every trip you already take" },
            ].map((item) => (
              <div key={item.num} className="flex items-center gap-4">
                <span className="text-blue-500 font-mono text-sm font-bold">
                  {item.num}
                </span>
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-gray-300 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Car size={16} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg">
              Boot<span className="text-blue-400">Rider</span>
            </span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">
              Create account
            </h2>
            <p className="text-gray-500">
              Already have one?{" "}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 transition font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-8 border border-white/10">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: "user" })}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${form.role === "user"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-gray-400 hover:text-gray-300"
                }`}
            >
              <User size={15} />
              Passenger
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: "transporter" })}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${form.role === "transporter"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-gray-400 hover:text-gray-300"
                }`}
            >
              <Briefcase size={15} />
              Driver / Transporter
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Full name
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Arjun Sharma"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="arjun@example.com"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create account
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-gray-600 text-xs text-center mt-8">
            By signing up you agree to our{" "}
            <span className="text-gray-500 cursor-pointer hover:text-gray-400">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-gray-500 cursor-pointer hover:text-gray-400">
              Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;