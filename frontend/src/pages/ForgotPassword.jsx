import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { loginSuccess } from "../redux/authSlice";
import { BASE_URL } from "../utils/constants";
import {
    Car, Phone, ShieldCheck, Lock, Eye, EyeOff,
    RefreshCw, ChevronLeft, Check, ArrowRight
} from "lucide-react";

const STEPS = ["phone", "otp", "password", "done"];

const ForgotPassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [step, setStep] = useState(0);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [error, setError] = useState("");
    const [countdown, setCountdown] = useState(0);

    const otpRefs = [useRef(), useRef(), useRef(), useRef()];

    // ── Countdown ────────────────────────────────────────────────────────────
    useEffect(() => {
        if (countdown > 0) {
            const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
            return () => clearTimeout(t);
        }
    }, [countdown]);

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

    // ── Step 0: Send OTP ──────────────────────────────────────────────────────
    const handleSendOtp = async () => {
        if (!/^[6-9]\d{9}$/.test(phone)) {
            return setError("Enter a valid 10-digit Indian mobile number.");
        }
        setOtpLoading(true);
        setError("");
        try {
            await axios.post(`${BASE_URL}/auth/send-otp`, {
                phone,
                purpose: "forgot_password",
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
                phone,
                purpose: "forgot_password",
            });
            setCountdown(60);
            otpRefs[0].current?.focus();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to resend OTP.");
        } finally {
            setOtpLoading(false);
        }
    };

    // ── Step 1: Verify OTP ────────────────────────────────────────────────────
    const handleVerifyOtp = () => {
        const otpString = otp.join("");
        if (otpString.length < 4) return setError("Please enter the complete 4-digit OTP.");
        setError("");
        setStep(2);
    };

    // ── Step 2: Reset password ────────────────────────────────────────────────
    const handleResetPassword = async () => {
        if (!newPassword) return setError("Please enter a new password.");
        if (newPassword.length < 8) return setError("Password must be at least 8 characters.");
        if (newPassword !== confirmPassword) return setError("Passwords do not match.");

        setLoading(true);
        setError("");

        try {
            const res = await axios.post(`${BASE_URL}/auth/reset-password`, {
                phone,
                otp: otp.join(""),
                newPassword,
            });

            dispatch(loginSuccess({ token: res.data.token, user: res.data.user }));
            localStorage.setItem("token", res.data.token);
            setStep(3);
            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    // ── Password strength ─────────────────────────────────────────────────────
    const getStrength = (pwd) => {
        if (!pwd) return { score: 0, label: "", color: "" };
        let score = 0;
        if (pwd.length >= 8) score++;
        if (pwd.length >= 12) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
        if (score <= 3) return { score, label: "Fair", color: "bg-amber-500" };
        return { score, label: "Strong", color: "bg-emerald-500" };
    };

    const strength = getStrength(newPassword);

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex">

            {/* ── Left Panel ── */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0f1623] to-[#0a0a0f] items-center justify-center p-16">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
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
                        Reset your
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                            password.
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg leading-relaxed mb-12">
                        Verify your phone number and set a new password.
                        Takes less than a minute.
                    </p>

                    {/* Step indicators */}
                    <div className="space-y-4">
                        {[
                            { num: "01", text: "Enter your registered phone number" },
                            { num: "02", text: "Verify with OTP sent to your phone" },
                            { num: "03", text: "Set your new password" },
                        ].map((item, i) => (
                            <div key={item.num} className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${i < step
                                        ? "bg-blue-600 text-white"
                                        : i === step
                                            ? "bg-blue-600/20 border border-blue-500/40 text-blue-400"
                                            : "bg-white/5 border border-white/10 text-gray-600"
                                    }`}>
                                    {i < step ? <Check size={13} /> : item.num}
                                </div>
                                <p className={`text-sm transition-all ${i === step ? "text-white" : i < step ? "text-gray-500 line-through" : "text-gray-600"
                                    }`}>
                                    {item.text}
                                </p>
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

                    {/* ══ STEP 0: Enter phone ══ */}
                    {step === 0 && (
                        <>
                            <Link
                                to="/login"
                                className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition"
                            >
                                <ChevronLeft size={15} />
                                Back to login
                            </Link>

                            <div className="mb-8">
                                <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-5">
                                    <Phone size={24} className="text-blue-400" />
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">
                                    Forgot password?
                                </h2>
                                <p className="text-gray-500 text-sm">
                                    Enter your registered phone number and we'll send you an OTP to reset your password.
                                </p>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Registered mobile number
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
                            </div>
                        </>
                    )}

                    {/* ══ STEP 1: Enter OTP ══ */}
                    {step === 1 && (
                        <>
                            <button
                                onClick={() => { setStep(0); setOtp(["", "", "", ""]); setError(""); }}
                                className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition"
                            >
                                <ChevronLeft size={15} />
                                Change number
                            </button>

                            <div className="mb-8">
                                <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-5">
                                    <ShieldCheck size={24} className="text-blue-400" />
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">Enter OTP</h2>
                                <p className="text-gray-500 text-sm">
                                    We sent a 4-digit OTP to{" "}
                                    <span className="text-white font-medium">+91 {phone}</span>
                                </p>
                            </div>

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
                                onClick={handleVerifyOtp}
                                disabled={otp.join("").length < 4}
                                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/40 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 mb-5"
                            >
                                <Check size={15} />
                                Verify OTP
                            </button>

                            <div className="text-center">
                                {countdown > 0 ? (
                                    <p className="text-gray-500 text-sm">
                                        Resend in{" "}
                                        <span className="text-blue-400 font-medium">{countdown}s</span>
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

                    {/* ══ STEP 2: New password ══ */}
                    {step === 2 && (
                        <>
                            <div className="mb-8">
                                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-5">
                                    <Lock size={24} className="text-emerald-400" />
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">New password</h2>
                                <p className="text-gray-500 text-sm">
                                    OTP verified. Set a strong new password for your account.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        New password
                                    </label>
                                    <div className="relative">
                                        <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
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

                                    {/* Password strength bar */}
                                    {newPassword && (
                                        <div className="mt-2">
                                            <div className="flex gap-1 mb-1">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <div
                                                        key={i}
                                                        className={`flex-1 h-1 rounded-full transition-all ${i <= strength.score ? strength.color : "bg-white/10"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <p className={`text-xs ${strength.label === "Strong" ? "text-emerald-400" :
                                                    strength.label === "Fair" ? "text-amber-400" : "text-red-400"
                                                }`}>
                                                {strength.label} password
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Confirm password
                                    </label>
                                    <div className="relative">
                                        <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            type={showConfirm ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                                            placeholder="Repeat new password"
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
                                    {confirmPassword && newPassword !== confirmPassword && (
                                        <p className="text-red-400 text-xs mt-1.5">Passwords do not match</p>
                                    )}
                                    {confirmPassword && newPassword === confirmPassword && (
                                        <p className="text-emerald-400 text-xs mt-1.5 flex items-center gap-1">
                                            <Check size={11} /> Passwords match
                                        </p>
                                    )}
                                </div>

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                                        <p className="text-red-400 text-sm">{error}</p>
                                    </div>
                                )}

                                <button
                                    onClick={handleResetPassword}
                                    disabled={loading || newPassword !== confirmPassword || newPassword.length < 8}
                                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/40 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <><Check size={15} /> Reset password</>
                                    )}
                                </button>
                            </div>
                        </>
                    )}

                    {/* ══ STEP 3: Done ══ */}
                    {step === 3 && (
                        <div className="text-center">
                            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check size={36} className="text-emerald-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">
                                Password reset!
                            </h2>
                            <p className="text-gray-400 text-sm mb-2">
                                Your password has been updated successfully.
                            </p>
                            <p className="text-gray-600 text-xs">Redirecting you to home...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;