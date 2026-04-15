import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  MapPin, Phone, Calendar, Clock, Users, Package,
  Star, ShieldCheck, Shield, ArrowLeft,
  Car, Weight, AlertTriangle, CheckCircle,
  XCircle, Loader, ChevronRight, Info,
  Cigarette, PawPrint, Music, MessageCircle,
  UserCheck, ArrowRight, Navigation
} from "lucide-react";
import MapWithRoute from "../components/MapWithRoute";
import { BASE_URL } from "../utils/constants";
// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const RideDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonState, setButtonState] = useState("book");
  const [myRequestId, setMyRequestId] = useState(null);

  // ── Parcel booking ────────────────────────────────────────────────────────
  const [showParcelForm, setShowParcelForm] = useState(false);
  const [parcelForm, setParcelForm] = useState({
    receiverName: "", receiverPhone: "",
    size: "small", weight: "", description: "", isFragile: false,
  });
  const [parcelLoading, setParcelLoading] = useState(false);
  const [parcelSuccess, setParcelSuccess] = useState("");
  const [parcelError, setParcelError] = useState("");

  // ── Segment context from search ───────────────────────────────────────────
  // If user came from search results with a partial segment,
  // we highlight their specific from→to
  const segFromName = searchParams.get("segFrom");
  const segToName = searchParams.get("segTo");
  const segPrice = searchParams.get("segPrice");

  const fetchRide = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/ride/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const rideData = res.data;
      setRide(rideData);

      const myRequest = rideData.requests?.find(
        (r) => String(r.user?._id || r.user?.id) === String(user?._id || user?.id)
      );
      if (myRequest) {
        setMyRequestId(myRequest._id || myRequest.id);
        setButtonState(myRequest.status);
      } else {
        setButtonState("book");
      }
    } catch (err) {
      console.error("❌ Error fetching ride:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchRide();
  }, [id]);

  const handleBook = async () => {
    if (!token) return navigate("/login");
    try {
      setButtonState("pending");
      await axios.post(
        `${BASE_URL}/ride/request`,
        { rideId: id, seatsRequested: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRide();
    } catch (err) {
      setButtonState("book");
      alert(err.response?.data?.message || "Failed to send request.");
    }
  };

  const handleParcelSubmit = async (e) => {
    e.preventDefault();
    if (!token) return navigate("/login");
    setParcelLoading(true);
    setParcelError("");
    try {
      await axios.post(
        `${BASE_URL}/parcel/create`,
        {
          rideId: id,
          receiverName: parcelForm.receiverName,
          receiverPhone: parcelForm.receiverPhone,
          pickupPoint: ride.from,
          dropPoint: ride.to,
          size: parcelForm.size,
          weight: parseFloat(parcelForm.weight),
          description: parcelForm.description,
          isFragile: parcelForm.isFragile,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setParcelSuccess("Parcel booked successfully!");
      setShowParcelForm(false);
    } catch (err) {
      setParcelError(err.response?.data?.message || "Failed to book parcel.");
    } finally {
      setParcelLoading(false);
    }
  };

  const getWaypoints = () => {
    if (!ride) return [];
    const points = [];
    if (ride.from?.coordinates)
      points.push({ ...ride.from.coordinates, name: ride.from.name });
    (ride.stops || []).forEach((s) => {
      if (s.coordinates) points.push({ ...s.coordinates, name: s.name });
    });
    if (ride.to?.coordinates)
      points.push({ ...ride.to.coordinates, name: ride.to.name });
    return points;
  };

  const getParcelPrice = (size) => {
    if (!ride?.bootSpace) return null;
    return { small: ride.bootSpace.smallPrice, medium: ride.bootSpace.mediumPrice, large: ride.bootSpace.largePrice }[size] || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Ride not found.</p>
          <button onClick={() => navigate(-1)} className="text-blue-600 text-sm">Go back</button>
        </div>
      </div>
    );
  }

  const driver = ride.driver || {};
  const isDriver = String(driver._id || driver.id) === String(user?._id || user?.id);
  const waypoints = getWaypoints();
  const segments = ride.stopoverPrices || [];
  const stops = ride.stops || [];
  const prefs = ride.preferences || {};

  // ── All named points for route display ───────────────────────────────────
  const allNamedPoints = [
    { name: ride.from?.name?.split(",")[0], type: "from" },
    ...stops.map((s) => ({ name: s.name?.split(",")[0], type: "stop" })),
    { name: ride.to?.name?.split(",")[0], type: "to" },
  ];

  const dotColor = (type) => ({
    from: "bg-blue-600",
    stop: "bg-amber-400",
    to: "bg-emerald-500",
  }[type] || "bg-slate-300");

  // ── Determine display price ───────────────────────────────────────────────
  // If user came from segment search, show their segment price
  const displayPrice = segPrice ? parseInt(segPrice) : ride.pricePerSeat;
  const hasSegment = !!(segFromName && segToName);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* ── Back ── */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-6 transition"
        >
          <ArrowLeft size={16} />
          Back to results
        </button>

        {/* ── Segment highlight banner ── */}
        {hasSegment && (
          <div className="bg-blue-600 text-white rounded-2xl px-5 py-3.5 mb-5 flex items-center gap-3">
            <Navigation size={18} className="shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-sm">
                Your journey: {segFromName} → {segToName}
              </p>
              <p className="text-blue-100 text-xs mt-0.5">
                You're boarding at <strong>{segFromName}</strong> and
                alighting at <strong>{segToName}</strong> — price for
                your segment: <strong>₹{segPrice}</strong>
              </p>
            </div>
            <p className="text-2xl font-black shrink-0">₹{segPrice}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Main column ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* ── Full route card with segment prices ── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Full route
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar size={11} />
                  {new Date(ride.date).toLocaleDateString("en-IN", {
                    weekday: "short", day: "numeric", month: "long",
                  })}
                  <span>·</span>
                  <Clock size={11} />
                  {ride.time}
                </div>
              </div>

              <div className="px-5 py-4">
                {segments.length > 0 ? (
                  /* ── Segment view ── */
                  <div>
                    {allNamedPoints.map((point, i) => {
                      const isLast = i === allNamedPoints.length - 1;
                      const seg = segments[i];

                      // Is this segment the user's booked segment?
                      const isUserSegment =
                        hasSegment &&
                        seg?.fromName?.toLowerCase().includes(
                          segFromName?.toLowerCase()
                        ) &&
                        seg?.toName?.toLowerCase().includes(
                          segToName?.toLowerCase()
                        );

                      return (
                        <div key={i}>
                          {/* Point */}
                          <div className="flex items-center gap-3 py-1">
                            <div className={`w-3.5 h-3.5 rounded-full shrink-0 border-2 border-white shadow-sm ${dotColor(point.type)}`} />
                            <span className={`text-sm font-semibold flex-1 ${point.type === "stop" ? "text-slate-500" : "text-slate-800"
                              }`}>
                              {point.name}
                            </span>
                          </div>

                          {/* Segment */}
                          {!isLast && seg && (
                            <div className={`flex items-center gap-3 ml-1.5 pl-4 border-l-2 py-1.5 ${isUserSegment
                              ? "border-blue-400"
                              : "border-dashed border-slate-200"
                              }`}>
                              <div className={`flex-1 flex items-center justify-between rounded-xl px-3 py-2 ${isUserSegment
                                ? "bg-blue-50 border border-blue-200"
                                : "bg-slate-50"
                                }`}>
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs ${isUserSegment ? "text-blue-600 font-medium" : "text-slate-400"
                                    }`}>
                                    {seg.fromName} → {seg.toName}
                                  </span>
                                  {seg.distanceKm > 0 && (
                                    <span className="text-slate-300 text-[10px]">
                                      ~{seg.distanceKm}km
                                    </span>
                                  )}
                                  {isUserSegment && (
                                    <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                      Your ride
                                    </span>
                                  )}
                                </div>
                                <span className={`font-bold text-sm ${isUserSegment ? "text-blue-700" : "text-slate-600"
                                  }`}>
                                  ₹{seg.price}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Full route total */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-slate-500 text-sm flex items-center gap-1.5">
                        <ArrowRight size={12} />
                        Full route
                      </span>
                      <span className="text-slate-800 font-black text-lg">
                        ₹{ride.pricePerSeat}
                      </span>
                    </div>
                  </div>
                ) : (
                  /* ── Simple route (no stops) ── */
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-1 pt-1 shrink-0">
                      <div className="w-3 h-3 bg-blue-600 rounded-full" />
                      <div className="w-px h-10 bg-slate-200" />
                      <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-800 font-semibold">
                        {ride.from?.name?.split(",")[0]}
                      </p>
                      <p className="text-slate-800 font-semibold mt-5">
                        {ride.to?.name?.split(",")[0]}
                      </p>
                    </div>
                    <p className="text-2xl font-black text-slate-800">
                      ₹{ride.pricePerSeat}
                    </p>
                  </div>
                )}

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Users size={12} />
                    {ride.availableSeats} seats available
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Car size={12} />
                    {ride.bookingPreference === "instant" ? "Instant booking" : "Review booking"}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Map ── */}
            {waypoints.length > 1 && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <MapWithRoute waypoints={waypoints} />
              </div>
            )}

            {/* ── Ride preferences ── */}
            {(prefs.smokingAllowed || prefs.petsAllowed || prefs.womenOnly ||
              prefs.maxInBack || prefs.musicAllowed || prefs.chatPreference) && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">
                    Ride preferences
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      prefs.smokingAllowed && { label: "Smoking ok", icon: <Cigarette size={12} />, color: "bg-orange-50 text-orange-600 border-orange-200" },
                      prefs.petsAllowed && { label: "Pets ok", icon: <PawPrint size={12} />, color: "bg-green-50 text-green-600 border-green-200" },
                      prefs.womenOnly && { label: "Women only", icon: <UserCheck size={12} />, color: "bg-pink-50 text-pink-600 border-pink-200" },
                      prefs.maxInBack && { label: "Max 2 in back", icon: <Users size={12} />, color: "bg-blue-50 text-blue-600 border-blue-200" },
                      prefs.musicAllowed && { label: "Music ok", icon: <Music size={12} />, color: "bg-purple-50 text-purple-600 border-purple-200" },
                      prefs.chatPreference === "quiet" && { label: "Quiet ride", icon: <MessageCircle size={12} />, color: "bg-slate-50 text-slate-600 border-slate-200" },
                      prefs.chatPreference === "chatty" && { label: "Love to chat", icon: <MessageCircle size={12} />, color: "bg-indigo-50 text-indigo-600 border-indigo-200" },
                    ].filter(Boolean).map((badge, i) => (
                      <span
                        key={i}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${badge.color}`}
                      >
                        {badge.icon}
                        {badge.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* ── Boot space card ── */}
            {ride.acceptsParcels && ride.bootSpace && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Package size={18} className="text-amber-600" />
                  <h3 className="text-slate-800 font-semibold">Boot space available</h3>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { key: "smallPrice", label: "Small", sub: "up to 2kg" },
                    { key: "mediumPrice", label: "Medium", sub: "up to 10kg" },
                    { key: "largePrice", label: "Large", sub: "up to 20kg" },
                  ].map((item) =>
                    ride.bootSpace[item.key] ? (
                      <div
                        key={item.key}
                        className="bg-white border border-amber-100 rounded-xl p-3 text-center"
                      >
                        <p className="text-slate-800 font-bold">
                          ₹{ride.bootSpace[item.key]}
                        </p>
                        <p className="text-slate-500 text-xs font-medium mt-0.5">
                          {item.label}
                        </p>
                        <p className="text-slate-400 text-[11px]">{item.sub}</p>
                      </div>
                    ) : null
                  )}
                </div>

                <div className="flex flex-wrap gap-3 text-xs mb-4">
                  {ride.bootSpace.maxWeightKg && (
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Weight size={12} />
                      Max {ride.bootSpace.maxWeightKg}kg
                    </span>
                  )}
                  {ride.bootSpace.fragileAccepted && (
                    <span className="flex items-center gap-1.5 text-amber-600">
                      <AlertTriangle size={12} />
                      Fragile accepted
                    </span>
                  )}
                  {ride.bootSpace.allowedGoods?.length > 0 && (
                    <span className="text-slate-500">
                      {ride.bootSpace.allowedGoods.join(", ")}
                    </span>
                  )}
                </div>

                {parcelSuccess && (
                  <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-2">
                    <CheckCircle size={15} className="text-emerald-500" />
                    <p className="text-emerald-700 text-sm">{parcelSuccess}</p>
                  </div>
                )}

                {!isDriver && !parcelSuccess && (
                  <button
                    onClick={() => setShowParcelForm(!showParcelForm)}
                    className="w-full bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 text-amber-700 font-medium py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
                  >
                    <Package size={15} />
                    {showParcelForm ? "Cancel" : "Send a parcel on this ride"}
                  </button>
                )}

                {showParcelForm && (
                  <form onSubmit={handleParcelSubmit} className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1.5">Receiver name</label>
                        <input
                          type="text"
                          required
                          value={parcelForm.receiverName}
                          onChange={(e) => setParcelForm({ ...parcelForm, receiverName: e.target.value })}
                          placeholder="Full name"
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-blue-400 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1.5">Receiver phone</label>
                        <input
                          type="tel"
                          required
                          value={parcelForm.receiverPhone}
                          onChange={(e) => setParcelForm({ ...parcelForm, receiverPhone: e.target.value })}
                          placeholder="10-digit number"
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-blue-400 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-500 mb-1.5">Parcel size</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["small", "medium", "large"].map((size) => {
                          const price = getParcelPrice(size);
                          if (!price) return null;
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => setParcelForm({ ...parcelForm, size })}
                              className={`py-2.5 rounded-xl border text-xs font-medium transition ${parcelForm.size === size
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                                }`}
                            >
                              <span className="capitalize block">{size}</span>
                              <span className="font-bold">₹{price}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1.5">Weight (kg)</label>
                        <input
                          type="number"
                          required
                          min="0.1"
                          step="0.1"
                          value={parcelForm.weight}
                          onChange={(e) => setParcelForm({ ...parcelForm, weight: e.target.value })}
                          placeholder="e.g. 2.5"
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-blue-400 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1.5">Description</label>
                        <input
                          type="text"
                          value={parcelForm.description}
                          onChange={(e) => setParcelForm({ ...parcelForm, description: e.target.value })}
                          placeholder="e.g. Books"
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-blue-400 transition"
                        />
                      </div>
                    </div>

                    {ride.bootSpace.fragileAccepted && (
                      <div className="flex items-center justify-between py-3 border-t border-slate-100">
                        <span className="text-slate-600 text-sm flex items-center gap-2">
                          <AlertTriangle size={14} className="text-amber-500" />
                          Fragile item
                        </span>
                        <button
                          type="button"
                          onClick={() => setParcelForm({ ...parcelForm, isFragile: !parcelForm.isFragile })}
                          className={`relative w-10 h-5 rounded-full transition-all ${parcelForm.isFragile ? "bg-blue-600" : "bg-slate-200"
                            }`}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${parcelForm.isFragile ? "left-5" : "left-0.5"
                            }`} />
                        </button>
                      </div>
                    )}

                    {parcelError && (
                      <p className="text-red-500 text-xs">{parcelError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={parcelLoading}
                      className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-amber-300 text-black font-semibold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
                    >
                      {parcelLoading ? (
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      ) : (
                        <><Package size={15} /> Confirm parcel booking</>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-5">

            {/* Driver card */}
              <div
                onClick={() => navigate(`/profile/${driver._id || driver.id}`)}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm cursor-pointer hover:border-blue-200 hover:shadow-md transition"
              >
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">
                  Driver
                </h3>

                {/* Avatar + name + rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-blue-100 border-2 border-white shadow-md flex items-center justify-center">
                    {driver.profilePhoto ? (
                      <img
                        src={driver.profilePhoto}
                        alt={driver.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-blue-600 font-bold text-xl">
                        {driver.name?.[0]?.toUpperCase() || "D"}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-slate-800 font-bold">{driver.name}</p>
                      {driver.kycStatus === "verified" && (
                        <ShieldCheck size={14} className="text-emerald-500" />
                      )}
                    </div>
                    {driver.totalRatings > 0 && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star size={11} className="text-amber-400 fill-amber-400" />
                        <span className="text-slate-500 text-xs">
                          {(driver.rating || 0).toFixed(1)} · {driver.totalRatings} reviews
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Driver personal preferences */}
                {driver.preferences && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {[
                      driver.preferences.music === "always" && "🎵 Music always",
                      driver.preferences.chat === "chatty" && "💬 Loves to chat",
                      driver.preferences.chat === "quiet" && "🤫 Prefers quiet",
                      driver.preferences.smoking === "never" && "🚭 Non-smoker",
                      driver.preferences.pets === "love_them" && "🐾 Pet lover",
                    ].filter(Boolean).map((pref, i) => (
                      <span
                        key={i}
                        className="text-slate-500 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1"
                      >
                        {pref}
                      </span>
                    ))}
                  </div>
                )}

                {/* Vehicle info */}
                {driver.vehicleInfo?.vehicleType && (
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
                    <Car size={13} />
                    <span>{driver.vehicleInfo.vehicleType}</span>
                    {driver.vehicleInfo.registrationNo && (
                      <span className="text-slate-400 font-mono text-xs">
                        · {driver.vehicleInfo.registrationNo}
                      </span>
                    )}
                  </div>
                )}

                {/* ── Phone — only visible after booking is approved ── */}
                {buttonState === "approved" && driver.phone && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                      Contact driver
                    </p>
                    <a
                      href={`tel:${driver.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-emerald-100 transition">
                      <Phone size={15} />
                      {driver.phone}
                    </a>
                  </div>
                )}

                {/* Hidden phone hint — shown before approval */}
                {buttonState !== "approved" && !isDriver && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <Phone size={13} className="text-slate-300" />
                    <p className="text-slate-400 text-xs">
                      Driver's contact visible after booking is confirmed
                    </p>
                  </div>
                )}

                <p className="text-blue-500 text-xs mt-3 flex items-center gap-1 hover:text-blue-600 transition">
                  View full profile
                  <ChevronRight size={11} />
                </p>
              </div>

              {/* Book seat card */}
              {!isDriver && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-black text-slate-800">
                        ₹{displayPrice}
                      </p>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {hasSegment
                          ? `${segFromName} → ${segToName}`
                          : "per seat"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-800 font-bold">{ride.availableSeats}</p>
                      <p className="text-slate-400 text-xs">seats left</p>
                    </div>
                  </div>

                  {buttonState === "book" && (
                    <button
                      onClick={handleBook}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                    >
                      Request to book
                      <ChevronRight size={16} />
                    </button>
                  )}
                  {buttonState === "pending" && (
                    <div className="w-full bg-amber-50 border border-amber-200 text-amber-700 font-medium py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm">
                      <Loader size={15} className="animate-spin" />
                      Request pending...
                    </div>
                  )}
                  {buttonState === "approved" && (
                    <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm">
                      <CheckCircle size={15} />
                      Booking confirmed
                    </div>
                  )}
                  {buttonState === "rejected" && (
                    <div className="space-y-2">
                      <div className="w-full bg-red-50 border border-red-200 text-red-600 font-medium py-3 rounded-xl flex items-center justify-center gap-2 text-sm">
                        <XCircle size={15} />
                        Request rejected
                      </div>
                      <button
                        onClick={handleBook}
                        className="w-full bg-blue-50 border border-blue-200 text-blue-600 font-medium py-3 rounded-xl text-sm transition hover:bg-blue-100"
                      >
                        Request again
                      </button>
                    </div>
                  )}

                  {ride.bookingPreference === "review" && buttonState === "book" && (
                    <p className="text-slate-400 text-xs text-center mt-3 flex items-center justify-center gap-1">
                      <Info size={11} />
                      Driver will review your request
                    </p>
                  )}
                </div>
              )}

              {/* Driver pending requests */}
              {isDriver && ride.requests?.filter((r) => r.status === "pending").length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">
                    Pending requests
                  </h3>
                  <div className="space-y-3">
                    {ride.requests
                      .filter((r) => r.status === "pending")
                      .map((req) => (
                        <RequestRow
                          key={req._id}
                          req={req}
                          rideId={id}
                          token={token}
                          onDone={fetchRide}
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      );
};

      // ── Request row ───────────────────────────────────────────────────────────────
      const RequestRow = ({req, rideId, token, onDone}) => {
  const [loading, setLoading] = useState(null);

  const handle = async (action) => {
        setLoading(action);
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/ride/handle-request`,
          { rideId, requestId: req._id, action },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      onDone();
    } catch (err) {
        alert(err.response?.data?.message || "Failed.");
    } finally {
        setLoading(null);
    }
  };

      return (
      <div className="flex items-center justify-between gap-3 py-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
            {req.user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-slate-700 text-sm font-medium">
              {req.user?.name || "User"}
            </p>
            <p className="text-slate-400 text-xs">
              {req.seatsRequested} seat{req.seatsRequested > 1 ? "s" : ""}
            </p>
            {req.status === "approved" && req.user?.phone && (
              <a
                href={`tel:${req.user.phone}`}
                className="text-emerald-600 text-xs flex items-center gap-1 mt-0.5 hover:text-emerald-700"
              >
                <Phone size={10} />
                {req.user.phone}
              </a>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handle("approve")}
            disabled={!!loading}
            className="w-8 h-8 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-lg flex items-center justify-center hover:bg-emerald-100 transition"
          >
            {loading === "approve" ? (
              <div className="w-3 h-3 border border-emerald-300 border-t-emerald-600 rounded-full animate-spin" />
            ) : (
              <CheckCircle size={14} />
            )}
          </button>
          <button
            onClick={() => handle("reject")}
            disabled={!!loading}
            className="w-8 h-8 bg-red-50 border border-red-200 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition"
          >
            {loading === "reject" ? (
              <div className="w-3 h-3 border border-red-300 border-t-red-500 rounded-full animate-spin" />
            ) : (
              <XCircle size={14} />
            )}
          </button>
        </div>
      </div>
      );
};

      export default RideDetails;