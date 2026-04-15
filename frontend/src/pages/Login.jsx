import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { loginSuccess } from "../redux/authSlice";
import { BASE_URL } from "../utils/constants";
import {
  Eye, EyeOff, Car, ArrowRight, Mail,
  Lock, Phone, ShieldCheck, RefreshCw,
  Check, ChevronLeft, Zap
} from "lucide-react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ── Mode: "password" | "otp" ─────────────────────────────────────────────
  const [mode, setMode] = useState("password");

  // ── Password login state ──────────────────────────────────────────────────
  const [emailForm, setEmailForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  // ── OTP login state ───────────────────────────────────────────────────────
  const [otpStep, setOtpStep] = useState(0); // 0=enter phone, 1=enter otp
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [countdown, setCountdown] = useState(0);
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Countdown ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  // ── Reset on mode switch ─────────────────────────────────────────────────
  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setOtpStep(0);
    setOtp(["", "", "", ""]);
    setPhone("");
  };

  // ── Password login ────────────────────────────────────────────────────────
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!emailForm.email || !emailForm.password) {
      return setError("Please enter your email and password.");
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, emailForm);
      dispatch(loginSuccess({ token: res.data.token, user: res.data.user }));
      localStorage.setItem("token", res.data.token);
      if (res.data.user.role === "transporter") {
        navigate("/enterprise/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  // ── Send OTP ──────────────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return setError("Enter a valid 10-digit Indian mobile number.");
    }
    setOtpLoading(true);
    setError("");
    try {
      await axios.post(`${BASE_URL}/auth/send-otp`, {
        phone,
        purpose: "login",
      });
      setOtpStep(1);
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
        phone, purpose: "login",
      });
      setCountdown(60);
      otpRefs[0].current?.focus();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  // ── OTP input ─────────────────────────────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");
    if (value && index < 3) otpRefs[index + 1].current?.focus();
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
    pasted.split("").forEach((d, i) => { newOtp[i] = d; });
    setOtp(newOtp);
    otpRefs[Math.min(pasted.length, 3)].current?.focus();
  };

  // ── Login with OTP ────────────────────────────────────────────────────────
  const handleOtpLogin = async () => {
    const otpString = otp.join("");
    if (otpString.length < 4) return setError("Please enter the complete 4-digit OTP.");
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${BASE_URL}/auth/login-otp`, {
        phone,
        otp: otpString,
      });
      dispatch(loginSuccess({ token: res.data.token, user: res.data.user }));
      localStorage.setItem("token", res.data.token);
      if (res.data.user.role === "transporter") {
        navigate("/enterprise/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed.");
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
            Welcome
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              back.
            </span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-12">
            Your rides, your parcels, your earnings — all in one place.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "2,400+", label: "Active drivers" },
              { value: "18K+", label: "Parcels delivered" },
              { value: "4.8★", label: "Avg. rating" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
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

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Sign in</h2>
            <p className="text-gray-500">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-400 hover:text-blue-300 transition font-medium">
                Create one
              </Link>
            </p>
          </div>

          {/* ── Mode switcher ── */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-8 border border-white/10">
            <button
              onClick={() => switchMode("password")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === "password"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-gray-400 hover:text-gray-300"
                }`}
            >
              <Lock size={14} />
              Password
            </button>
            <button
              onClick={() => switchMode("otp")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === "otp"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-gray-400 hover:text-gray-300"
                }`}
            >
              <Zap size={14} />
              Login with OTP
            </button>
          </div>

          {/* ══ PASSWORD LOGIN ══ */}
          {mode === "password" && (
            <form onSubmit={handlePasswordLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    value={emailForm.email}
                    onChange={(e) => { setEmailForm({ ...emailForm, email: e.target.value }); setError(""); }}
                    placeholder="arjun@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-400">Password</label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-blue-400 hover:text-blue-300 transition"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={emailForm.password}
                    onChange={(e) => { setEmailForm({ ...emailForm, password: e.target.value }); setError(""); }}
                    placeholder="Your password"
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

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Sign in <ArrowRight size={15} /></>
                )}
              </button>
            </form>
          )}

          {/* ══ OTP LOGIN ══ */}
          {mode === "otp" && (
            <div className="space-y-5">

              {/* Step 0: Enter phone */}
              {otpStep === 0 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Mobile number
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <span className="text-gray-400 text-sm font-medium">+91</span>
                        <div className="w-px h-4 bg-white/10" />
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
                        placeholder="9876543210"
                        maxLength={10}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-16 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition text-sm"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleSendOtp}
                    disabled={otpLoading || phone.length < 10}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/40 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                  >
                    {otpLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><Phone size={15} /> Send OTP</>
                    )}
                  </button>
                </>
              )}

              {/* Step 1: Enter OTP */}
              {otpStep === 1 && (
                <>
                  <button
                    onClick={() => { setOtpStep(0); setOtp(["", "", "", ""]); setError(""); }}
                    className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition mb-2"
                  >
                    <ChevronLeft size={15} />
                    Change number
                  </button>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 flex items-center gap-3 mb-2">
                    <ShieldCheck size={16} className="text-blue-400 shrink-0" />
                    <p className="text-blue-300 text-sm">
                      OTP sent to <strong>+91 {phone}</strong>
                    </p>
                  </div>

                  {/* OTP boxes */}
                  <div className="flex justify-center gap-3">
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
      className={`w-12 sm:w-14 h-14 sm:h-16 text-center text-2xl font-bold rounded-xl border-2 bg-white/5 text-white focus:outline-none transition ${
        digit
          ? "border-blue-500 bg-blue-500/10"
          : "border-white/10 focus:border-blue-500/50"
      }`}
    />
  ))}
</div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleOtpLogin}
                    disabled={loading || otp.join("").length < 4}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/40 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><Check size={15} /> Verify & sign in</>
                    )}
                  </button>

                  {/* Resend */}
                  <div className="text-center">
                    {countdown > 0 ? (
                      <p className="text-gray-500 text-sm">
                        Resend in <span className="text-blue-400 font-medium">{countdown}s</span>
                      </p>
                    ) : (
                      <button
                        onClick={handleResend}
                        disabled={otpLoading}
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition mx-auto"
                      >
                        <RefreshCw size={12} className={otpLoading ? "animate-spin" : ""} />
                        Resend OTP
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Transporter link */}
          <div className="mt-8 p-4 bg-white/3 border border-white/8 rounded-xl">
            <p className="text-gray-500 text-sm text-center">
              Fleet owner?{" "}
              <Link to="/transporter/login" className="text-amber-400 hover:text-amber-300 transition font-medium">
                Transporter login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;