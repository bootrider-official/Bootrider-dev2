import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { loginSuccess } from "../redux/authSlice";
import { BASE_URL } from "../utils/constants";
import { Eye, EyeOff, Truck, ArrowRight, Mail, Lock } from "lucide-react";

const TransporterLogin = () => {
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

            if (res.data.user.role !== "transporter") {
                setError("This account is not a transporter account. Use the regular login.");
                setLoading(false);
                return;
            }

            dispatch(loginSuccess({ token: res.data.token, user: res.data.user }));
            localStorage.setItem("token", res.data.token);
            navigate("/enterprise/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex">
            {/* ── Left Panel ── */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#110e05] to-[#0a0a0f] items-center justify-center p-16">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-amber-600/8 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-orange-600/8 rounded-full blur-3xl" />
                    <div
                        className="absolute inset-0 opacity-[0.025]"
                        style={{
                            backgroundImage:
                                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                            backgroundSize: "60px 60px",
                        }}
                    />
                </div>

                <div className="relative z-10 max-w-md">
                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                            <Truck size={20} className="text-black" />
                        </div>
                        <div>
                            <span className="text-white font-bold text-xl tracking-tight">
                                Boot<span className="text-amber-400">Rider</span>
                            </span>
                            <span className="ml-2 text-amber-500/60 text-xs font-medium tracking-widest uppercase">
                                Enterprise
                            </span>
                        </div>
                    </div>

                    <h1 className="text-5xl font-bold text-white leading-tight mb-6">
                        Your fleet.
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                            Fully loaded.
                        </span>
                    </h1>

                    <p className="text-gray-400 text-lg leading-relaxed mb-12">
                        Stop losing money on empty return trips. List your available
                        cargo space and connect with businesses that need same-day freight.
                    </p>

                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { value: "340+", label: "Fleet owners" },
                            { value: "92%", label: "Load factor" },
                            { value: "₹12K", label: "Avg. monthly extra" },
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
                        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                            <Truck size={16} className="text-black" />
                        </div>
                        <span className="text-white font-bold text-lg">
                            Boot<span className="text-amber-400">Rider</span>
                            <span className="text-amber-500/60 text-xs ml-1">Enterprise</span>
                        </span>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-white mb-2">
                            Transporter sign in
                        </h2>
                        <p className="text-gray-500">
                            New to enterprise?{" "}
                            <Link
                                to="/transporter/signup"
                                className="text-amber-400 hover:text-amber-300 transition font-medium"
                            >
                                Create account
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="fleet@example.com"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Your password"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition text-sm"
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
                            className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-black font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 mt-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign in to dashboard
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 p-4 bg-white/3 border border-white/8 rounded-xl">
                        <p className="text-gray-500 text-sm text-center">
                            Looking for a ride or parcel?{" "}
                            <Link
                                to="/login"
                                className="text-blue-400 hover:text-blue-300 transition font-medium"
                            >
                                User login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransporterLogin;