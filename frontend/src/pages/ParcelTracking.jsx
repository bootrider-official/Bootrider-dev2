import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
    Package, MapPin, Phone, ArrowLeft,
    CheckCircle, Clock, Truck, Star,
    AlertCircle, Camera, User
} from "lucide-react";
import { BASE_URL } from "../utils/constants";
// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const STAGES = [
    {
        key: "booked",
        label: "Booked",
        sub: "Parcel booking confirmed",
        icon: <Package size={16} />,
    },
    {
        key: "picked_up",
        label: "Picked up",
        sub: "Driver has collected your parcel",
        icon: <CheckCircle size={16} />,
    },
    {
        key: "in_transit",
        label: "In transit",
        sub: "Your parcel is on the way",
        icon: <Truck size={16} />,
    },
    {
        key: "delivered",
        label: "Delivered",
        sub: "Parcel has been delivered",
        icon: <CheckCircle size={16} />,
    },
];

const ParcelTracking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, user } = useSelector((state) => state.auth);

    const [parcel, setParcel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ── Driver status update ─────────────────────────────────────────────────
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState("");

    const fetchParcel = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/parcel/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setParcel(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load parcel.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchParcel();
    }, [id]);

    // ── Auto-refresh every 15s ────────────────────────────────────────────────
    useEffect(() => {
        const interval = setInterval(fetchParcel, 15000);
        return () => clearInterval(interval);
    }, [id]);

    const handleStatusUpdate = async (status) => {
        setUpdateLoading(true);
        setUpdateError("");
        try {
            await axios.patch(
                `${BASE_URL}/parcel/${id}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchParcel();
        } catch (err) {
            setUpdateError(err.response?.data?.message || "Failed to update status.");
        } finally {
            setUpdateLoading(false);
        }
    };

    // ── Who is viewing ────────────────────────────────────────────────────────
    const isDriver =
        parcel?.ride?.driver &&
        String(parcel.ride.driver._id || parcel.ride.driver.id) ===
        String(user?._id || user?.id);

    const isCancelled = parcel?.status === "cancelled";
    const currentStepIndex = STAGES.findIndex((s) => s.key === parcel?.status);

    // ── Next available status for driver ─────────────────────────────────────
    const getNextStatus = () => {
        if (!parcel) return null;
        const flow = ["booked", "picked_up", "in_transit", "delivered"];
        const currentIndex = flow.indexOf(parcel.status);
        if (currentIndex === -1 || currentIndex === flow.length - 1) return null;
        return flow[currentIndex + 1];
    };

    const nextStatus = getNextStatus();

    const nextStatusLabels = {
        picked_up: "Mark as picked up",
        in_transit: "Mark as in transit",
        delivered: "Mark as delivered",
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-white/10 border-t-amber-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !parcel) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle size={32} className="text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">{error || "Parcel not found."}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-blue-400 hover:text-blue-300 text-sm transition"
                    >
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            <div className="max-w-2xl mx-auto px-4 py-8">

                {/* ── Back ── */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>

                {/* ── Header ── */}
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 mb-5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center">
                                <Package size={22} className="text-amber-400" />
                            </div>
                            <div>
                                <p className="text-white font-semibold">
                                    Parcel to {parcel.receiverName}
                                </p>
                                <p className="text-gray-500 text-sm mt-0.5 capitalize">
                                    {parcel.size} · {parcel.weight}kg
                                    {parcel.isFragile && (
                                        <span className="ml-2 text-amber-400 text-xs">· Fragile</span>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-white font-bold text-lg">₹{parcel.price}</p>
                            <p className="text-gray-600 text-xs mt-0.5">
                                #{String(parcel._id || parcel.id).slice(-6).toUpperCase()}
                            </p>
                        </div>
                    </div>

                    {/* Route */}
                    <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <div className="w-px h-5 bg-white/10" />
                            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        </div>
                        <div className="flex-1">
                            <p className="text-white text-sm">{parcel.pickupPoint?.name}</p>
                            <p className="text-gray-400 text-sm mt-1.5">
                                {parcel.dropPoint?.name}
                            </p>
                        </div>
                        <div className="text-right text-xs text-gray-500">
                            <p className="flex items-center gap-1 justify-end">
                                <Phone size={11} />
                                {parcel.receiverPhone}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Progress tracker ── */}
                {!isCancelled ? (
                    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 mb-5">
                        <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-6">
                            Delivery status
                        </p>

                        <div className="space-y-0">
                            {STAGES.map((stage, index) => {
                                const done = index <= currentStepIndex;
                                const active = index === currentStepIndex;
                                const isLast = index === STAGES.length - 1;

                                return (
                                    <div key={stage.key} className="flex gap-4">
                                        {/* Timeline */}
                                        <div className="flex flex-col items-center">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${done
                                                    ? active && parcel.status !== "delivered"
                                                        ? "bg-blue-600 border-2 border-blue-400 shadow-lg shadow-blue-500/30"
                                                        : "bg-emerald-600 border-2 border-emerald-400"
                                                    : "bg-white/[0.04] border border-white/[0.08]"
                                                }`}>
                                                <span className={done ? "text-white" : "text-gray-600"}>
                                                    {done ? (
                                                        active && parcel.status !== "delivered"
                                                            ? stage.icon
                                                            : <CheckCircle size={16} />
                                                    ) : (
                                                        stage.icon
                                                    )}
                                                </span>
                                            </div>
                                            {!isLast && (
                                                <div className={`w-px flex-1 min-h-[32px] my-1 ${done && index < currentStepIndex
                                                        ? "bg-emerald-500/40"
                                                        : "bg-white/[0.06]"
                                                    }`} />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className={`pb-6 flex-1 ${isLast ? "pb-0" : ""}`}>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className={`font-medium text-sm ${active ? "text-white" : done ? "text-gray-300" : "text-gray-600"
                                                        }`}>
                                                        {stage.label}
                                                    </p>
                                                    <p className={`text-xs mt-0.5 ${active ? "text-gray-400" : "text-gray-600"
                                                        }`}>
                                                        {stage.sub}
                                                    </p>
                                                </div>

                                                {/* Timestamp */}
                                                {done && parcel.timeline && (
                                                    <p className="text-gray-600 text-xs shrink-0 ml-4">
                                                        {stage.key === "booked" && parcel.timeline.bookedAt &&
                                                            new Date(parcel.timeline.bookedAt).toLocaleTimeString("en-IN", {
                                                                hour: "2-digit", minute: "2-digit"
                                                            })
                                                        }
                                                        {stage.key === "picked_up" && parcel.timeline.pickedUpAt &&
                                                            new Date(parcel.timeline.pickedUpAt).toLocaleTimeString("en-IN", {
                                                                hour: "2-digit", minute: "2-digit"
                                                            })
                                                        }
                                                        {stage.key === "in_transit" && parcel.timeline.inTransitAt &&
                                                            new Date(parcel.timeline.inTransitAt).toLocaleTimeString("en-IN", {
                                                                hour: "2-digit", minute: "2-digit"
                                                            })
                                                        }
                                                        {stage.key === "delivered" && parcel.timeline.deliveredAt &&
                                                            new Date(parcel.timeline.deliveredAt).toLocaleTimeString("en-IN", {
                                                                hour: "2-digit", minute: "2-digit"
                                                            })
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            {/* Proof photo */}
                                            {stage.key === "picked_up" && parcel.proofPhotos?.pickup && (
                                                <div className="mt-2">
                                                    <img
                                                        src={parcel.proofPhotos.pickup}
                                                        alt="Pickup proof"
                                                        className="w-24 h-16 object-cover rounded-lg border border-white/10"
                                                    />
                                                </div>
                                            )}
                                            {stage.key === "delivered" && parcel.proofPhotos?.delivery && (
                                                <div className="mt-2">
                                                    <img
                                                        src={parcel.proofPhotos.delivery}
                                                        alt="Delivery proof"
                                                        className="w-24 h-16 object-cover rounded-lg border border-white/10"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="bg-red-500/[0.05] border border-red-500/20 rounded-2xl p-6 mb-5 flex items-center gap-3">
                        <AlertCircle size={20} className="text-red-400 shrink-0" />
                        <div>
                            <p className="text-red-400 font-medium">Parcel cancelled</p>
                            <p className="text-red-400/60 text-sm mt-0.5">
                                This parcel booking has been cancelled.
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Driver update controls ── */}
                {isDriver && !isCancelled && nextStatus && (
                    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 mb-5">
                        <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-4">
                            Driver controls
                        </p>

                        {updateError && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
                                <p className="text-red-400 text-sm">{updateError}</p>
                            </div>
                        )}

                        <button
                            onClick={() => handleStatusUpdate(nextStatus)}
                            disabled={updateLoading}
                            className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-black font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
                        >
                            {updateLoading ? (
                                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Truck size={16} />
                                    {nextStatusLabels[nextStatus]}
                                </>
                            )}
                        </button>

                        <p className="text-gray-600 text-xs text-center mt-3 flex items-center justify-center gap-1">
                            <Camera size={11} />
                            Photo proof upload coming soon
                        </p>
                    </div>
                )}

                {/* ── Driver info ── */}
                {parcel.ride?.driver && (
                    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
                        <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-4">
                            Your driver
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-blue-300 font-bold text-lg">
                                {parcel.ride.driver.name?.[0]?.toUpperCase() || "D"}
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-semibold">
                                    {parcel.ride.driver.name}
                                </p>
                                {parcel.ride.driver.phone && (
                                    <p className="text-gray-500 text-sm flex items-center gap-1 mt-0.5">
                                        <Phone size={12} />
                                        {parcel.ride.driver.phone}
                                    </p>
                                )}
                            </div>
                            {parcel.ride.driver.rating > 0 && (
                                <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">
                                    <Star size={12} className="text-amber-400 fill-amber-400" />
                                    <span className="text-amber-300 text-sm font-medium">
                                        {parcel.ride.driver.rating?.toFixed(1)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Ride date */}
                        {parcel.ride.date && (
                            <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-gray-500 text-xs">
                                <Clock size={12} />
                                {new Date(parcel.ride.date).toLocaleDateString("en-IN", {
                                    weekday: "long", day: "numeric", month: "long"
                                })}
                                {parcel.ride.time && ` at ${parcel.ride.time}`}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParcelTracking;