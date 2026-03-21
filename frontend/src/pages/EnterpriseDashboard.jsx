import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Truck, Plus, Package, TrendingUp,
    Calendar, Clock, Weight, ChevronRight,
    CheckCircle, XCircle, Loader, Check,
    X, AlertCircle, BarChart3, ShieldCheck
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const EnterpriseDashboard = () => {
    const { token, user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("active");
    const [actionLoading, setActionLoading] = useState(null);

    const fetchListings = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/enterprise/my-listings`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setListings(res.data || []);
        } catch (err) {
            console.error("Error fetching listings:", err);
            setListings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, []);

    const handleBooking = async (listingId, bookingId, action) => {
        setActionLoading(`${bookingId}-${action}`);
        try {
            await axios.post(
                `${BASE_URL}/enterprise/handle-booking`,
                { listingId, bookingId, action },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchListings();
        } catch (err) {
            alert(err.response?.data?.message || "Failed.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleComplete = async (listingId) => {
        if (!confirm("Mark this listing as completed?")) return;
        setActionLoading(`complete-${listingId}`);
        try {
            await axios.patch(
                `${BASE_URL}/enterprise/complete/${listingId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchListings();
        } catch (err) {
            alert(err.response?.data?.message || "Failed.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (listingId) => {
        if (!confirm("Cancel and delete this listing?")) return;
        setActionLoading(`delete-${listingId}`);
        try {
            await axios.delete(`${BASE_URL}/enterprise/${listingId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchListings();
        } catch (err) {
            alert(err.response?.data?.message || "Failed.");
        } finally {
            setActionLoading(null);
        }
    };

    const filteredListings = listings.filter((l) => l.status === activeTab);

    // ── Stats ────────────────────────────────────────────────────────────────
    const totalBookings = listings.reduce(
        (acc, l) => acc + (l.bookings?.length || 0), 0
    );
    const approvedBookings = listings.reduce(
        (acc, l) =>
            acc + (l.bookings?.filter((b) => b.status === "approved").length || 0),
        0
    );
    const totalRevenue = listings.reduce(
        (acc, l) =>
            acc +
            (l.bookings
                ?.filter((b) => ["approved", "delivered"].includes(b.status))
                .reduce((sum, b) => sum + (b.totalPrice || 0), 0) || 0),
        0
    );
    const pendingCount = listings.reduce(
        (acc, l) =>
            acc + (l.bookings?.filter((b) => b.status === "pending").length || 0),
        0
    );

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            <div className="max-w-5xl mx-auto px-4 py-8">

                {/* ── Header ── */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Truck size={18} className="text-amber-400" />
                            <h1 className="text-2xl font-bold text-white">
                                Enterprise Dashboard
                            </h1>
                        </div>
                        <p className="text-gray-500 text-sm">
                            Welcome back, {user?.name?.split(" ")[0]}
                            {user?.kycStatus === "verified" && (
                                <span className="ml-2 inline-flex items-center gap-1 text-emerald-400 text-xs">
                                    <ShieldCheck size={11} />
                                    KYC Verified
                                </span>
                            )}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/enterprise/create")}
                        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2.5 rounded-xl text-sm transition shadow-lg shadow-amber-500/20"
                    >
                        <Plus size={16} />
                        New listing
                    </button>
                </div>

                {/* ── Stats ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        {
                            label: "Total listings",
                            value: listings.length,
                            icon: <Truck size={16} className="text-amber-400" />,
                            bg: "bg-amber-500/10",
                        },
                        {
                            label: "Total bookings",
                            value: totalBookings,
                            icon: <Package size={16} className="text-blue-400" />,
                            bg: "bg-blue-500/10",
                        },
                        {
                            label: "Confirmed loads",
                            value: approvedBookings,
                            icon: <CheckCircle size={16} className="text-emerald-400" />,
                            bg: "bg-emerald-500/10",
                        },
                        {
                            label: "Est. revenue",
                            value: `₹${totalRevenue.toLocaleString()}`,
                            icon: <TrendingUp size={16} className="text-purple-400" />,
                            bg: "bg-purple-500/10",
                        },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4"
                        >
                            <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
                                {stat.icon}
                            </div>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* ── KYC warning ── */}
                {user?.kycStatus !== "verified" && (
                    <div
                        onClick={() => navigate("/kyc-form")}
                        className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-4 mb-6 cursor-pointer hover:bg-amber-500/15 transition"
                    >
                        <AlertCircle size={18} className="text-amber-400 shrink-0" />
                        <div>
                            <p className="text-amber-300 text-sm font-medium">
                                KYC verification required
                            </p>
                            <p className="text-amber-500/70 text-xs mt-0.5">
                                Complete your KYC to start listing trips. Click here to verify.
                            </p>
                        </div>
                        <ChevronRight size={16} className="text-amber-400 ml-auto" />
                    </div>
                )}

                {/* ── Tabs ── */}
                <div className="flex gap-1 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1 mb-6 w-fit">
                    {["active", "completed", "cancelled"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${activeTab === tab
                                    ? "bg-white/10 text-white"
                                    : "text-gray-500 hover:text-gray-300"
                                }`}
                        >
                            {tab}
                            <span className="ml-2 text-xs opacity-60">
                                {listings.filter((l) => l.status === tab).length}
                            </span>
                        </button>
                    ))}
                </div>

                {/* ── Loading ── */}
                {loading && (
                    <div className="flex items-center justify-center py-24">
                        <div className="w-8 h-8 border-2 border-white/10 border-t-amber-500 rounded-full animate-spin" />
                    </div>
                )}

                {/* ── Empty ── */}
                {!loading && filteredListings.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="w-14 h-14 bg-white/[0.03] border border-white/[0.07] rounded-2xl flex items-center justify-center">
                            <Truck size={24} className="text-gray-600" />
                        </div>
                        <p className="text-gray-500 text-sm">No {activeTab} listings</p>
                        {activeTab === "active" && (
                            <button
                                onClick={() => navigate("/enterprise/create")}
                                className="text-amber-400 hover:text-amber-300 text-sm transition"
                            >
                                Create your first listing
                            </button>
                        )}
                    </div>
                )}

                {/* ── Listings ── */}
                {!loading && filteredListings.length > 0 && (
                    <div className="space-y-4">
                        {filteredListings.map((listing) => (
                            <ListingCard
                                key={listing._id || listing.id}
                                listing={listing}
                                onApprove={(bookingId) =>
                                    handleBooking(listing._id || listing.id, bookingId, "approve")
                                }
                                onReject={(bookingId) =>
                                    handleBooking(listing._id || listing.id, bookingId, "reject")
                                }
                                onComplete={() => handleComplete(listing._id || listing.id)}
                                onDelete={() => handleDelete(listing._id || listing.id)}
                                actionLoading={actionLoading}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// ── Listing Card ──────────────────────────────────────────────────────────────
const ListingCard = ({
    listing, onApprove, onReject,
    onComplete, onDelete, actionLoading
}) => {
    const [expanded, setExpanded] = useState(false);
    const listingId = listing._id || listing.id;

    const pendingBookings = listing.bookings?.filter((b) => b.status === "pending") || [];
    const approvedBookings = listing.bookings?.filter((b) => b.status === "approved") || [];
    const utilisationPercent = listing.utilisationPercent ||
        Math.round(((listing.totalCapacityKg - listing.availableCapacityKg) / listing.totalCapacityKg) * 100);

    const vehicleLabels = {
        mini_truck: "Mini Truck",
        tempo: "Tempo",
        truck: "Truck",
        container: "Container",
        other: "Other",
    };

    return (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="p-5">
                <div className="flex items-start justify-between gap-4">

                    {/* Route */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="flex flex-col items-center gap-1 pt-1 shrink-0">
                            <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
                            <div className="w-px h-6 bg-white/10" />
                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm truncate">
                                {listing.from?.name}
                            </p>
                            <p className="text-gray-400 text-sm truncate mt-1">
                                {listing.to?.name}
                            </p>
                        </div>
                    </div>

                    {/* Status + price */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${listing.status === "active"
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                : listing.status === "completed"
                                    ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                    : "bg-red-500/10 border-red-500/20 text-red-400"
                            }`}>
                            {listing.status}
                        </span>
                        <p className="text-white font-bold">₹{listing.pricePerKg}/kg</p>
                    </div>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        {new Date(listing.date).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric"
                        })}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock size={12} />
                        {listing.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Truck size={12} />
                        {vehicleLabels[listing.vehicleType] || listing.vehicleType}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Weight size={12} />
                        {listing.availableCapacityKg}/{listing.totalCapacityKg} kg free
                    </span>
                    {pendingBookings.length > 0 && (
                        <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                            <AlertCircle size={12} />
                            {pendingBookings.length} pending
                        </span>
                    )}
                </div>

                {/* Utilisation bar */}
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-gray-600 text-xs">Capacity utilised</span>
                        <span className="text-gray-400 text-xs font-medium">
                            {utilisationPercent}%
                        </span>
                    </div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all ${utilisationPercent > 80
                                    ? "bg-emerald-500"
                                    : utilisationPercent > 40
                                        ? "bg-amber-500"
                                        : "bg-white/20"
                                }`}
                            style={{ width: `${utilisationPercent}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* ── Bookings section ── */}
            {(pendingBookings.length > 0 || approvedBookings.length > 0) && (
                <div className="border-t border-white/[0.06]">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="w-full flex items-center justify-between px-5 py-3 text-sm text-gray-400 hover:text-white transition"
                    >
                        <span>
                            {pendingBookings.length > 0
                                ? `${pendingBookings.length} pending booking${pendingBookings.length > 1 ? "s" : ""}`
                                : `${approvedBookings.length} confirmed booking${approvedBookings.length > 1 ? "s" : ""}`}
                        </span>
                        <ChevronRight
                            size={14}
                            className={`transition-transform ${expanded ? "rotate-90" : ""}`}
                        />
                    </button>

                    {expanded && (
                        <div className="px-5 pb-4 space-y-2">
                            {/* Pending */}
                            {pendingBookings.map((booking) => (
                                <div
                                    key={booking._id}
                                    className="bg-white/[0.03] rounded-xl p-4"
                                >
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div>
                                            <p className="text-white text-sm font-medium">
                                                {booking.sender?.name || "Sender"}
                                            </p>
                                            <p className="text-gray-500 text-xs mt-0.5">
                                                {booking.cargoDescription}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-white font-bold text-sm">
                                                ₹{booking.totalPrice}
                                            </p>
                                            <p className="text-gray-500 text-xs">{booking.weightKg}kg</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-gray-600 text-xs">
                                            To: {booking.receiverName} · {booking.receiverPhone}
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onApprove(booking._id)}
                                                disabled={!!actionLoading}
                                                className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center hover:bg-emerald-500/20 transition"
                                            >
                                                {actionLoading === `${booking._id}-approve` ? (
                                                    <div className="w-3 h-3 border border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                                                ) : (
                                                    <Check size={13} />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => onReject(booking._id)}
                                                disabled={!!actionLoading}
                                                className="w-8 h-8 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition"
                                            >
                                                {actionLoading === `${booking._id}-reject` ? (
                                                    <div className="w-3 h-3 border border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                                                ) : (
                                                    <X size={13} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Approved */}
                            {approvedBookings.map((booking) => (
                                <div
                                    key={booking._id}
                                    className="flex items-center justify-between bg-white/[0.03] rounded-xl px-4 py-3"
                                >
                                    <div>
                                        <p className="text-white text-sm font-medium">
                                            {booking.sender?.name || "Sender"}
                                        </p>
                                        <p className="text-gray-500 text-xs">
                                            {booking.weightKg}kg · {booking.cargoDescription}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <p className="text-white font-bold text-sm">
                                            ₹{booking.totalPrice}
                                        </p>
                                        <CheckCircle size={14} className="text-emerald-400" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── Actions ── */}
            {listing.status === "active" && (
                <div className="border-t border-white/[0.06] px-5 py-3 flex items-center gap-4">
                    <button
                        onClick={onComplete}
                        disabled={!!actionLoading}
                        className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition"
                    >
                        {actionLoading === `complete-${listingId}` ? (
                            <Loader size={13} className="animate-spin" />
                        ) : (
                            <CheckCircle size={13} />
                        )}
                        Mark complete
                    </button>
                    <span className="text-white/10">·</span>
                    <button
                        onClick={onDelete}
                        disabled={!!actionLoading}
                        className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition ml-auto"
                    >
                        {actionLoading === `delete-${listingId}` ? (
                            <Loader size={13} className="animate-spin" />
                        ) : (
                            <XCircle size={13} />
                        )}
                        Cancel listing
                    </button>
                </div>
            )}
        </div>
    );
};

export default EnterpriseDashboard;