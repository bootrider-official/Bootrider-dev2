import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { loginSuccess } from "../redux/authSlice";
import { BASE_URL } from "../utils/constants";
import {
    Eye, EyeOff, Truck, ArrowRight,
    User, Mail, Lock
} from "lucide-react";

const TransporterSignup = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "transporter",
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
            const res = await axios.post(`${BASE_URL}/auth/register`, {
                ...form,
                role: "transporter",
            });
            dispatch(loginSuccess({ token: res.data.token, user: res.data.user }));
            localStorage.setItem("token", res.data.token);
            navigate("/kyc-form");
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
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/8 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-600/8 rounded-full blur-3xl" />
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
                        Join the
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                            fleet network.
                        </span>
                    </h1>

                    <p className="text-gray-400 text-lg leading-relaxed mb-12">
                        Register your fleet on Bootrider Enterprise and start monetising
                        empty return trips from day one.
                    </p>

                    <div className="space-y-5">
                        {[
                            { num: "01", text: "Register and complete KYC" },
                            { num: "02", text: "List your return trip routes" },
                            { num: "03", text: "Accept cargo bookings and earn" },
                        ].map((item) => (
                            <div key={item.num} className="flex items-center gap-4">
                                <span className="text-amber-500 font-mono text-sm font-bold">
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
                            Create fleet account
                        </h2>
                        <p className="text-gray-500">
                            Already registered?{" "}
                            <Link
                                to="/transporter/login"
                                className="text-amber-400 hover:text-amber-300 transition font-medium"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Full name
                            </label>
                            <div className="relative">
                                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Rajesh Transport Co."
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition text-sm"
                                />
                            </div>
                        </div>

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
                                    placeholder="Min. 8 characters"
                                    required
                                    minLength={8}
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
                                    Create fleet account
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-gray-600 text-xs text-center mt-8">
                        After signup you will be directed to complete KYC verification
                        before listing your first trip.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TransporterSignup;