// // import React, { useState } from "react";
// // import axios from "axios";
// // import { BASE_URL } from "../utils/constants";
// // import { useDispatch } from "react-redux";
// // import { loginSuccess } from "../redux/authSlice";
// // import { useNavigate } from "react-router-dom";

// // const Signup = () => {
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     email: "",
// //     phone: "",
// //     role: "individual",
// //   });

// //   const [otp, setOtp] = useState("");
// //   const [sessionId, setSessionId] = useState("");
// //   const [otpSent, setOtpSent] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [message, setMessage] = useState("");
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleSendOtp = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setMessage("");

// //     try {
// //       const res = await axios.post(`${BASE_URL}/auth/send-otp`, {
// //         phone: formData.phone,
// //         type: "signup",
// //         name: formData.name,
// //         email: formData.email,
// //         role: formData.role,
// //       });

// //       setOtpSent(true);
// //       setSessionId(res.data.sessionId);
// //       setMessage(res.data.message || "OTP sent successfully!");
// //     } catch (err) {
// //       setMessage(err.response?.data?.message || "Failed to send OTP");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleVerifyOtp = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setMessage("");

// //     try {
// //       const res = await axios.post(`${BASE_URL}/auth/verify-otp`, {
// //         sessionId,
// //         otp,
// //       });

// //       setMessage(res.data.message || "Signup successful!");
// //       localStorage.setItem("token", res.data.token);
// //       dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));

// //       // ✅ Redirect after successful signup
// //       navigate("/");
// //     } catch (err) {
// //       setMessage(err.response?.data?.message || "Invalid OTP");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
// //       <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
// //         <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
// //           {otpSent ? "Verify OTP" : "Sign Up"}
// //         </h2>

// //         {message && (
// //           <p className="text-center text-sm mb-4 text-blue-600">{message}</p>
// //         )}

// //         <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
// //           {!otpSent ? (
// //             <>
// //               <input
// //                 type="text"
// //                 name="name"
// //                 placeholder="Full Name"
// //                 value={formData.name}
// //                 onChange={handleChange}
// //                 className="w-full p-2 mb-3 border rounded-md focus:ring-2 focus:ring-blue-400"
// //                 required
// //               />
// //               <input
// //                 type="email"
// //                 name="email"
// //                 placeholder="Email Address"
// //                 value={formData.email}
// //                 onChange={handleChange}
// //                 className="w-full p-2 mb-3 border rounded-md focus:ring-2 focus:ring-blue-400"
// //                 required
// //               />
// //               <input
// //                 type="text"
// //                 name="phone"
// //                 placeholder="Mobile Number"
// //                 value={formData.phone}
// //                 onChange={handleChange}
// //                 className="w-full p-2 mb-3 border rounded-md focus:ring-2 focus:ring-blue-400"
// //                 required
// //               />
// //               <select
// //                 name="role"
// //                 value={formData.role}
// //                 onChange={handleChange}
// //                 className="w-full p-2 mb-3 border rounded-md focus:ring-2 focus:ring-blue-400"
// //               >
// //                 <option value="individual">Individual</option>
// //                 <option value="transporter">Transporter</option>
// //               </select>
// //             </>
// //           ) : (
// //             <>
// //               <p className="text-center text-gray-600 mb-4">
// //                 OTP sent to <b>{formData.phone}</b>
// //               </p>
// //               <input
// //                 type="text"
// //                 name="otp"
// //                 placeholder="Enter OTP"
// //                 value={otp}
// //                 onChange={(e) => setOtp(e.target.value)}
// //                 className="w-full p-2 mb-3 border rounded-md focus:ring-2 focus:ring-blue-400"
// //                 required
// //               />
// //             </>
// //           )}

// //           <button
// //             type="submit"
// //             className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
// //             disabled={loading}
// //           >
// //             {loading
// //               ? "Processing..."
// //               : otpSent
// //               ? "Verify & Sign Up"
// //               : "Send OTP"}
// //           </button>
// //         </form>

// //         {!otpSent && (
// //           <p className="text-center mt-4 text-sm text-gray-600">
// //             Already have an account?{" "}
// //             <a href="/login" className="text-blue-700 font-semibold">
// //               Login
// //             </a>
// //           </p>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default Signup;
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import axios from "axios";
// import { loginSuccess } from "../redux/authSlice";
// import { BASE_URL } from "../utils/constants";
// import { Eye, EyeOff, Car, ArrowRight, User, Mail, Lock, Briefcase } from "lucide-react";

// const Signup = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "user",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const res = await axios.post(`${BASE_URL}/auth/register`, form);
//       dispatch(loginSuccess({ token: res.data.token, user: res.data.user }));
//       localStorage.setItem("token", res.data.token);
//       navigate("/");
//     } catch (err) {
//       setError(err.response?.data?.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0a0a0f] flex">
//       {/* ── Left Panel ── */}
//       <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0f1623] to-[#0a0a0f] items-center justify-center p-16">
//         <div className="absolute inset-0 overflow-hidden">
//           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
//           <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />
//           {/* Grid lines */}
//           <div
//             className="absolute inset-0 opacity-[0.03]"
//             style={{
//               backgroundImage:
//                 "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
//               backgroundSize: "60px 60px",
//             }}
//           />
//         </div>

//         <div className="relative z-10 max-w-md">
//           <div className="flex items-center gap-3 mb-16">
//             <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
//               <Car size={20} className="text-white" />
//             </div>
//             <span className="text-white font-bold text-xl tracking-tight">
//               Boot<span className="text-blue-400">Rider</span>
//             </span>
//           </div>

//           <h1 className="text-5xl font-bold text-white leading-tight mb-6">
//             Turn your
//             <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
//               daily drive
//             </span>
//             into income.
//           </h1>

//           <p className="text-gray-400 text-lg leading-relaxed mb-12">
//             Share your boot space, split fuel costs, and help packages reach
//             their destination — all on your existing route.
//           </p>

//           <div className="space-y-5">
//             {[
//               { num: "01", text: "List your ride in under 2 minutes" },
//               { num: "02", text: "Accept parcels or passengers" },
//               { num: "03", text: "Earn on every trip you already take" },
//             ].map((item) => (
//               <div key={item.num} className="flex items-center gap-4">
//                 <span className="text-blue-500 font-mono text-sm font-bold">
//                   {item.num}
//                 </span>
//                 <div className="h-px flex-1 bg-white/5" />
//                 <span className="text-gray-300 text-sm">{item.text}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── Right Panel ── */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
//         <div className="w-full max-w-md">
//           {/* Mobile logo */}
//           <div className="flex items-center gap-2 mb-10 lg:hidden">
//             <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
//               <Car size={16} className="text-white" />
//             </div>
//             <span className="text-white font-bold text-lg">
//               Boot<span className="text-blue-400">Rider</span>
//             </span>
//           </div>

//           <div className="mb-10">
//             <h2 className="text-3xl font-bold text-white mb-2">
//               Create account
//             </h2>
//             <p className="text-gray-500">
//               Already have one?{" "}
//               <Link
//                 to="/login"
//                 className="text-blue-400 hover:text-blue-300 transition font-medium"
//               >
//                 Sign in
//               </Link>
//             </p>
//           </div>

//           {/* Role Toggle */}
//           <div className="flex bg-white/5 rounded-xl p-1 mb-8 border border-white/10">
//             <button
//               type="button"
//               onClick={() => setForm({ ...form, role: "user" })}
//               className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${form.role === "user"
//                   ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
//                   : "text-gray-400 hover:text-gray-300"
//                 }`}
//             >
//               <User size={15} />
//               Passenger
//             </button>
//             <button
//               type="button"
//               onClick={() => setForm({ ...form, role: "transporter" })}
//               className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${form.role === "transporter"
//                   ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
//                   : "text-gray-400 hover:text-gray-300"
//                 }`}
//             >
//               <Briefcase size={15} />
//               Driver / Transporter
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-400 mb-2">
//                 Full name
//               </label>
//               <div className="relative">
//                 <User
//                   size={16}
//                   className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
//                 />
//                 <input
//                   type="text"
//                   name="name"
//                   value={form.name}
//                   onChange={handleChange}
//                   placeholder="Arjun Sharma"
//                   required
//                   className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition text-sm"
//                 />
//               </div>
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-400 mb-2">
//                 Email address
//               </label>
//               <div className="relative">
//                 <Mail
//                   size={16}
//                   className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
//                 />
//                 <input
//                   type="email"
//                   name="email"
//                   value={form.email}
//                   onChange={handleChange}
//                   placeholder="arjun@example.com"
//                   required
//                   className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition text-sm"
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-400 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock
//                   size={16}
//                   className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
//                 />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={form.password}
//                   onChange={handleChange}
//                   placeholder="Min. 8 characters"
//                   required
//                   minLength={8}
//                   className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition text-sm"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
//                 >
//                   {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                 </button>
//               </div>
//             </div>

//             {error && (
//               <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
//                 <p className="text-red-400 text-sm">{error}</p>
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 mt-2"
//             >
//               {loading ? (
//                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//               ) : (
//                 <>
//                   Create account
//                   <ArrowRight size={16} />
//                 </>
//               )}
//             </button>
//           </form>

//           <p className="text-gray-600 text-xs text-center mt-8">
//             By signing up you agree to our{" "}
//             <span className="text-gray-500 cursor-pointer hover:text-gray-400">
//               Terms of Service
//             </span>{" "}
//             and{" "}
//             <span className="text-gray-500 cursor-pointer hover:text-gray-400">
//               Privacy Policy
//             </span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;


import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { loginSuccess } from "../redux/authSlice";
import { BASE_URL } from "../utils/constants";
import {
  Eye, EyeOff, Car, ArrowRight, User,
  Mail, Lock, Phone, ShieldCheck, ChevronLeft,
  RefreshCw, Check
} from "lucide-react";

const STEPS = ["details", "verify", "done"];

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(0); // 0=details, 1=otp, 2=done
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  // ── Countdown timer for resend ───────────────────────────────────────────
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // ── OTP input handling ───────────────────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    // Auto-focus next
    if (value && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    const newOtp = ["", "", "", ""];
    pasted.split("").forEach((digit, i) => { newOtp[i] = digit; });
    setOtp(newOtp);
    otpRefs[Math.min(pasted.length, 3)].current?.focus();
  };

  // ── Validate details step ────────────────────────────────────────────────
  const validateDetails = () => {
    if (!form.name.trim()) return "Please enter your full name.";
    if (!form.email.trim()) return "Please enter your email address.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Please enter a valid email.";
    if (!form.phone.trim()) return "Please enter your phone number.";
    if (!/^[6-9]\d{9}$/.test(form.phone)) return "Enter a valid 10-digit Indian mobile number.";
    if (!form.password) return "Please enter a password.";
    if (form.password.length < 8) return "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    return null;
  };

  // ── Send OTP ─────────────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    const err = validateDetails();
    if (err) return setError(err);

    setOtpLoading(true);
    setError("");

    try {
      await axios.post(`${BASE_URL}/auth/send-otp`, {
        phone: form.phone,
        purpose: "signup",
      });
      setStep(1);
      setCountdown(60);
      setTimeout(() => otpRefs[0].current?.focus(), 300);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (countdown > 0) return;
    setOtpLoading(true);
    setError("");
    setOtp(["", "", "", ""]);
    try {
      await axios.post(`${BASE_URL}/auth/send-otp`, {
        phone: form.phone,
        purpose: "signup",
      });
      setCountdown(60);
      otpRefs[0].current?.focus();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  // ── Verify OTP + Register ─────────────────────────────────────────────────
  const handleVerifyAndRegister = async () => {
    const otpString = otp.join("");
    if (otpString.length < 4) return setError("Please enter the complete 4-digit OTP.");

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${BASE_URL}/auth/register`, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        otp: otpString,
        role: form.role,
      });

      dispatch(loginSuccess({ token: res.data.token, user: res.data.user }));
      localStorage.setItem("token", res.data.token);
      setStep(2);
      setTimeout(() => navigate("/"), 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed.");
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
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />
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
            Share your boot space, split fuel costs, and help packages
            reach their destination — all on your existing route.
          </p>

          <div className="space-y-5">
            {[
              { num: "01", text: "List your ride in under 2 minutes" },
              { num: "02", text: "Accept parcels or passengers" },
              { num: "03", text: "Earn on every trip you already take" },
            ].map((item) => (
              <div key={item.num} className="flex items-center gap-4">
                <span className="text-blue-500 font-mono text-sm font-bold">{item.num}</span>
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

          {/* ══ STEP 0: Details ══ */}
          {step === 0 && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Create account</h2>
                <p className="text-gray-500">
                  Already have one?{" "}
                  <Link to="/login" className="text-blue-400 hover:text-blue-300 transition font-medium">
                    Sign in
                  </Link>
                </p>
              </div>

              {/* Role toggle */}
              <div className="flex bg-white/5 rounded-xl p-1 mb-6 border border-white/10">
                {[
                  { value: "user", label: "Passenger" },
                  { value: "transporter", label: "Driver / Transporter" },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: r.value })}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${form.role === r.value
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                        : "text-gray-400 hover:text-gray-300"
                      }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Full name</label>
                  <div className="relative">
                    <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Arjun Sharma"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition text-sm"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="arjun@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition text-sm"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Mobile number</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <span className="text-gray-400 text-sm font-medium">+91</span>
                      <div className="w-px h-4 bg-white/10" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      maxLength={10}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-16 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition text-sm"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Min. 8 characters"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Confirm password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat password"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleSendOtp}
                  disabled={otpLoading}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 mt-2"
                >
                  {otpLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Phone size={15} />
                      Send OTP to verify
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {/* ══ STEP 1: OTP Verification ══ */}
          {step === 1 && (
            <>
              <button
                onClick={() => { setStep(0); setOtp(["", "", "", ""]); setError(""); }}
                className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition"
              >
                <ChevronLeft size={16} />
                Back
              </button>

              <div className="mb-8">
                <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-5">
                  <ShieldCheck size={24} className="text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Verify your number</h2>
                <p className="text-gray-500 text-sm">
                  We sent a 4-digit OTP to{" "}
                  <span className="text-white font-medium">+91 {form.phone}</span>
                </p>
              </div>

              {/* OTP input boxes */}
              <div className="flex gap-3 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={otpRefs[index]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    className={`flex-1 h-16 text-center text-2xl font-bold rounded-xl border-2 bg-white/5 text-white focus:outline-none transition ${digit
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-white/10 focus:border-blue-500/50"
                      }`}
                  />
                ))}
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleVerifyAndRegister}
                disabled={loading || otp.join("").length < 4}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/40 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 mb-5"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Check size={16} />
                    Verify & create account
                  </>
                )}
              </button>

              {/* Resend */}
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-gray-500 text-sm">
                    Resend OTP in{" "}
                    <span className="text-blue-400 font-medium">{countdown}s</span>
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={otpLoading}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition mx-auto"
                  >
                    <RefreshCw size={13} className={otpLoading ? "animate-spin" : ""} />
                    Resend OTP
                  </button>
                )}
              </div>
            </>
          )}

          {/* ══ STEP 2: Success ══ */}
          {step === 2 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={36} className="text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">You're in!</h2>
              <p className="text-gray-400 text-sm mb-2">
                Account created and phone verified.
              </p>
              <p className="text-gray-600 text-xs">Redirecting you now...</p>
            </div>
          )}

          {step === 0 && (
            <p className="text-gray-600 text-xs text-center mt-8">
              By signing up you agree to our{" "}
              <span className="text-gray-500 cursor-pointer hover:text-gray-400">Terms</span>{" "}
              and{" "}
              <span className="text-gray-500 cursor-pointer hover:text-gray-400">Privacy Policy</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;