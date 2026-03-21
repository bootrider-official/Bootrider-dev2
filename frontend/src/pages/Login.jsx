// import React, { useState } from "react";
// import axios from "axios";
// import { BASE_URL } from "../utils/constants.jsx";
// import { useDispatch } from "react-redux";
// import { loginSuccess } from "../redux/authSlice";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState("");
//   const [sessionId, setSessionId] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Step 1: Send OTP
//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       const res = await axios.post(`${BASE_URL}/auth/send-otp`, {
//         phone,
//         type: "login",
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

//   // Step 2: Verify OTP
//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       const res = await axios.post(`${BASE_URL}/auth/verify-otp`, {
//         sessionId,
//         otp,
//       });

//       setMessage(res.data.message || "Login successful!");
//       dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("user", JSON.stringify(res.data.user));

//       // ✅ Redirect after successful login
//       const user = res.data.user;
//       // if (user.role === "transporter") navigate("/transporter-dashboard");
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
//           {otpSent ? "Verify OTP" : "Login"}
//         </h2>

//         {message && (
//           <p className="text-center text-sm mb-4 text-blue-600">{message}</p>
//         )}

//         <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
//           {!otpSent ? (
//             <input
//               type="text"
//               name="phone"
//               placeholder="Mobile Number"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               className="w-full p-2 mb-3 border rounded-md focus:ring-2 focus:ring-blue-400"
//               required
//             />
//           ) : (
//             <>
//               <p className="text-center text-gray-600 mb-4">
//                 OTP sent to <b>{phone}</b>
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
//               ? "Verify & Login"
//               : "Send OTP"}
//           </button>
//         </form>

//         {!otpSent && (
//           <p className="text-center mt-4 text-sm text-gray-600">
//             Don’t have an account?{" "}
//             <a href="/signup" className="text-blue-700 font-semibold">
//               Sign Up
//             </a>
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Login;



import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { loginSuccess } from "../redux/authSlice";
import { BASE_URL } from "../utils/constants";
import { Eye, EyeOff, Car, ArrowRight, Mail, Lock } from "lucide-react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
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
      const res = await axios.post(`${BASE_URL}/auth/login`, form);
      dispatch(loginSuccess({ token: res.data.token, user: res.data.user }));
      localStorage.setItem("token", res.data.token);

      // Route based on role
      if (res.data.user.role === "transporter") {
        navigate("/enterprise/dashboard");
      } else {
        navigate("/");
      }
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
          <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />
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
            Welcome
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              back.
            </span>
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed mb-12">
            Your rides, your parcels, your earnings — all in one place.
            Pick up where you left off.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "2,400+", label: "Active drivers" },
              { value: "18K+", label: "Parcels delivered" },
              { value: "4.8★", label: "Avg. rating" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
              >
                <p className="text-white font-bold text-lg">{stat.value}</p>
                <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
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
              Sign in
            </h2>
            <p className="text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-400 hover:text-blue-300 transition font-medium"
              >
                Create one
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-400">
                  Password
                </label>
                <span className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer transition">
                  Forgot password?
                </span>
              </div>
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
                  placeholder="Your password"
                  required
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
                  Sign in
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Transporter login link */}
          <div className="mt-8 p-4 bg-white/3 border border-white/8 rounded-xl">
            <p className="text-gray-500 text-sm text-center">
              Are you a truck owner or fleet operator?{" "}
              <Link
                to="/transporter/login"
                className="text-blue-400 hover:text-blue-300 transition font-medium"
              >
                Transporter login →
              </Link>
            </p>
          </div>

          <p className="text-gray-600 text-xs text-center mt-6">
            Protected by enterprise-grade encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;