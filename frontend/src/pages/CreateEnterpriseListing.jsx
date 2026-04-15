import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Truck, MapPin, Calendar, Clock,
    Weight, ChevronRight, Check, Info,
    AlertTriangle, Package
} from "lucide-react";
import { BASE_URL } from "../utils/constants";
// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const GOODS_OPTIONS = [
    "Electronics", "Furniture", "FMCG", "Garments",
    "Documents", "Raw Materials", "Machinery", "Other",
];

const VEHICLE_TYPES = [
    { value: "mini_truck", label: "Mini Truck", sub: "Up to 1 ton" },
    { value: "tempo", label: "Tempo", sub: "Up to 2 tons" },
    { value: "truck", label: "Truck", sub: "Up to 10 tons" },
    { value: "container", label: "Container", sub: "10+ tons" },
    { value: "other", label: "Other", sub: "Custom vehicle" },
];

const CreateEnterpriseListing = () => {
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [step, setStep] = useState(0);

    const [form, setForm] = useState({
        // Route
        from: "",
        to: "",
        // Trip
        date: "",
        time: "",
        // Vehicle
        vehicleType: "",
        vehicleNumber: "",
        // Capacity & pricing
        totalCapacityKg: "",
        pricePerKg: "",
        minimumWeightKg: "",
        // Cargo preferences
        acceptedGoodsTypes: [],
        fragileAccepted: false,
        hazardousAccepted: false,
        notes: "",
    });

    const update = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setError("");
    };

    const toggleGood = (good) => {
        const current = form.acceptedGoodsTypes;
        update(
            "acceptedGoodsTypes",
            current.includes(good)
                ? current.filter((g) => g !== good)
                : [...current, good]
        );
    };

    // ── Geocode helper ──────────────────────────────────────────────────────
    const geocode = async (name) => {
        const res = await axios.get(
            `${BASE_URL}/geocode?city=${encodeURIComponent(name)}`
        );
        return { name, coordinates: { lat: res.data.lat, lng: res.data.lng } };
    };

    const validateStep = () => {
        if (step === 0) {
            if (!form.from) return "Please enter origin city.";
            if (!form.to) return "Please enter destination city.";
            if (!form.date) return "Please select a date.";
            if (!form.time) return "Please select a time.";
        }
        if (step === 1) {
            if (!form.vehicleType) return "Please select a vehicle type.";
            if (!form.vehicleNumber) return "Please enter vehicle number.";
            if (!form.totalCapacityKg) return "Please enter total capacity.";
            if (!form.pricePerKg) return "Please enter price per kg.";
        }
        return null;
    };

    const handleNext = () => {
        const err = validateStep();
        if (err) return setError(err);
        setError("");
        setStep((s) => s + 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");

        try {
            let fromData, toData;
            try {
                [fromData, toData] = await Promise.all([
                    geocode(form.from),
                    geocode(form.to),
                ]);
            } catch (geoErr) {
                setLoading(false);
                setError(
                    "Could not find one of the cities. Please check spelling and try again."
                );
                return;
            }
            const payload = {
                from: fromData,
                to: toData,
                date: form.date,
                time: form.time,
                vehicleType: form.vehicleType,
                vehicleNumber: form.vehicleNumber,
                totalCapacityKg: parseFloat(form.totalCapacityKg),
                pricePerKg: parseFloat(form.pricePerKg),
                minimumWeightKg: form.minimumWeightKg
                    ? parseFloat(form.minimumWeightKg)
                    : 1,
                acceptedGoodsTypes:
                    form.acceptedGoodsTypes.length > 0
                        ? form.acceptedGoodsTypes
                        : ["Other"],
                fragileAccepted: form.fragileAccepted,
                hazardousAccepted: form.hazardousAccepted,
                notes: form.notes,
            };

            await axios.post(`${BASE_URL}/enterprise/create`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            navigate("/enterprise/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to create listing. Try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const steps = ["Route & Schedule", "Vehicle & Capacity", "Cargo Preferences"];

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            <div className="max-w-2xl mx-auto px-4 py-10">

                {/* ── Header ── */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-1">
                        <Truck size={18} className="text-amber-400" />
                        <h1 className="text-white font-bold text-xl">New trip listing</h1>
                    </div>
                    <p className="text-gray-500 text-sm">
                        Step {step + 1} of {steps.length} — {steps[step]}
                    </p>
                </div>

                {/* ── Progress ── */}
                <div className="mb-8">
                    <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden mb-3">
                        <div
                            className="h-full bg-amber-500 rounded-full transition-all duration-500"
                            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                        />
                    </div>
                    <div className="flex gap-2">
                        {steps.map((s, i) => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition ${i < step
                                    ? "bg-amber-500 text-black"
                                    : i === step
                                        ? "bg-amber-500/20 border border-amber-500/40 text-amber-400"
                                        : "bg-white/[0.04] border border-white/[0.08] text-gray-600"
                                    }`}>
                                    {i < step ? <Check size={12} /> : i + 1}
                                </div>
                                <span className={`text-xs hidden sm:block ${i === step ? "text-amber-400 font-medium" : "text-gray-600"
                                    }`}>
                                    {s}
                                </span>
                                {i < steps.length - 1 && (
                                    <ChevronRight size={12} className="text-gray-700 hidden sm:block" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Step card ── */}
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 mb-6 min-h-[360px]">

                    {/* ── Step 0: Route & Schedule ── */}
                    {step === 0 && (
                        <div className="space-y-5">
                            <div>
                                <h2 className="text-white font-semibold text-lg mb-1">
                                    Route & schedule
                                </h2>
                                <p className="text-gray-500 text-sm">
                                    Where is your vehicle travelling?
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-2">
                                        Origin city
                                    </label>
                                    <div className="relative">
                                        <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500" />
                                        <input
                                            type="text"
                                            placeholder="e.g. Noida"
                                            value={form.from}
                                            onChange={(e) => update("from", e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-amber-500/40 transition"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-2">
                                        Destination city
                                    </label>
                                    <div className="relative">
                                        <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />
                                        <input
                                            type="text"
                                            placeholder="e.g. Delhi"
                                            value={form.to}
                                            onChange={(e) => update("to", e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-amber-500/40 transition"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-2">
                                        Trip date
                                    </label>
                                    <div className="relative">
                                        <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                        <input
                                            type="date"
                                            value={form.date}
                                            onChange={(e) => update("date", e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-3 text-white text-sm focus:outline-none focus:border-amber-500/40 transition [color-scheme:dark]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-2">
                                        Departure time
                                    </label>
                                    <div className="relative">
                                        <Clock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                        <input
                                            type="time"
                                            value={form.time}
                                            onChange={(e) => update("time", e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-3 text-white text-sm focus:outline-none focus:border-amber-500/40 transition [color-scheme:dark]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-2">
                                    Additional notes
                                    <span className="text-gray-600 ml-1 normal-case">(optional)</span>
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="e.g. Vehicle will be at the warehouse by 8am"
                                    value={form.notes}
                                    onChange={(e) => update("notes", e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-amber-500/40 transition resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* ── Step 1: Vehicle & Capacity ── */}
                    {step === 1 && (
                        <div className="space-y-5">
                            <div>
                                <h2 className="text-white font-semibold text-lg mb-1">
                                    Vehicle & capacity
                                </h2>
                                <p className="text-gray-500 text-sm">
                                    Tell senders what you're carrying in.
                                </p>
                            </div>

                            {/* Vehicle type */}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
                                    Vehicle type
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {VEHICLE_TYPES.map((v) => (
                                        <button
                                            key={v.value}
                                            type="button"
                                            onClick={() => update("vehicleType", v.value)}
                                            className={`p-3 rounded-xl border text-left transition ${form.vehicleType === v.value
                                                ? "bg-amber-500/10 border-amber-500/30"
                                                : "bg-white/[0.03] border-white/[0.08] hover:border-white/15"
                                                }`}
                                        >
                                            <p className={`text-sm font-medium ${form.vehicleType === v.value ? "text-white" : "text-gray-300"
                                                }`}>
                                                {v.label}
                                            </p>
                                            <p className="text-gray-500 text-xs mt-0.5">{v.sub}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Vehicle number */}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-2">
                                    Vehicle registration number
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. DL 01 AB 1234"
                                    value={form.vehicleNumber}
                                    onChange={(e) =>
                                        update("vehicleNumber", e.target.value.toUpperCase())
                                    }
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-amber-500/40 transition font-mono"
                                />
                            </div>

                            {/* Capacity & pricing */}
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-2">
                                        Total capacity (kg)
                                    </label>
                                    <div className="relative">
                                        <Weight size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="1000"
                                            value={form.totalCapacityKg}
                                            onChange={(e) => update("totalCapacityKg", e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-amber-500/40 transition"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-2">
                                        Price per kg (₹)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                            ₹
                                        </span>
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="8"
                                            value={form.pricePerKg}
                                            onChange={(e) => update("pricePerKg", e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-7 pr-3 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-amber-500/40 transition"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-2">
                                        Min. booking (kg)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="10"
                                        value={form.minimumWeightKg}
                                        onChange={(e) => update("minimumWeightKg", e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-amber-500/40 transition"
                                    />
                                </div>
                            </div>

                            {/* Price preview */}
                            {form.totalCapacityKg && form.pricePerKg && (
                                <div className="flex items-center gap-2 bg-amber-500/5 border border-amber-500/15 rounded-xl px-4 py-3">
                                    <Info size={14} className="text-amber-400 shrink-0" />
                                    <p className="text-amber-300/80 text-xs">
                                        Full load value:{" "}
                                        <span className="font-bold text-amber-300">
                                            ₹{(
                                                parseFloat(form.totalCapacityKg || 0) *
                                                parseFloat(form.pricePerKg || 0)
                                            ).toLocaleString()}
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Step 2: Cargo Preferences ── */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-white font-semibold text-lg mb-1">
                                    Cargo preferences
                                </h2>
                                <p className="text-gray-500 text-sm">
                                    What can senders book your vehicle for?
                                </p>
                            </div>

                            {/* Accepted goods */}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
                                    Accepted cargo types
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {GOODS_OPTIONS.map((good) => {
                                        const selected = form.acceptedGoodsTypes.includes(good);
                                        return (
                                            <button
                                                key={good}
                                                type="button"
                                                onClick={() => toggleGood(good)}
                                                className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition ${selected
                                                    ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
                                                    : "bg-white/[0.03] border-white/[0.08] text-gray-400 hover:border-white/20 hover:text-gray-300"
                                                    }`}
                                            >
                                                {good}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Toggles */}
                            <div className="space-y-4 pt-2 border-t border-white/[0.06]">
                                {[
                                    {
                                        key: "fragileAccepted",
                                        label: "Accept fragile cargo",
                                        sub: "Glass, ceramics, electronics etc.",
                                        icon: <AlertTriangle size={15} className="text-amber-400" />,
                                        bg: "bg-amber-500/10",
                                    },
                                    {
                                        key: "hazardousAccepted",
                                        label: "Accept hazardous materials",
                                        sub: "Chemicals, flammables — requires permits",
                                        icon: <Package size={15} className="text-red-400" />,
                                        bg: "bg-red-500/10",
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.key}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 ${item.bg} rounded-lg flex items-center justify-center`}>
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p className="text-white text-sm font-medium">
                                                    {item.label}
                                                </p>
                                                <p className="text-gray-500 text-xs">{item.sub}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => update(item.key, !form[item.key])}
                                            className={`relative w-11 h-6 rounded-full transition-all ${form[item.key] ? "bg-amber-500" : "bg-white/10"
                                                }`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form[item.key] ? "left-6" : "left-1"
                                                }`} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Summary */}
                            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 space-y-2">
                                <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-3">
                                    Listing summary
                                </p>
                                {[
                                    { label: "Route", value: `${form.from} to ${form.to}` },
                                    {
                                        label: "Date",
                                        value: `${new Date(form.date).toLocaleDateString("en-IN", {
                                            day: "numeric", month: "long", year: "numeric",
                                        })} at ${form.time}`,
                                    },
                                    {
                                        label: "Vehicle",
                                        value: `${VEHICLE_TYPES.find((v) => v.value === form.vehicleType)?.label || "—"} · ${form.vehicleNumber}`,
                                    },
                                    {
                                        label: "Capacity",
                                        value: `${form.totalCapacityKg} kg @ ₹${form.pricePerKg}/kg`,
                                    },
                                ].map((row) => (
                                    <div key={row.label} className="flex items-start justify-between gap-4">
                                        <span className="text-gray-600 text-xs shrink-0">{row.label}</span>
                                        <span className="text-gray-300 text-xs text-right">{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Error ── */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* ── Navigation ── */}
                <div className="flex gap-3">
                    {step > 0 && (
                        <button
                            onClick={() => { setStep((s) => s - 1); setError(""); }}
                            className="flex-1 py-3.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 text-sm font-medium transition"
                        >
                            Back
                        </button>
                    )}

                    {step < steps.length - 1 ? (
                        <button
                            onClick={handleNext}
                            className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold py-3.5 rounded-xl transition text-sm shadow-lg shadow-amber-500/20"
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-black font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Check size={16} />
                                    Publish listing
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateEnterpriseListing;