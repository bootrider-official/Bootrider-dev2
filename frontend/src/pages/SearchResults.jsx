import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  MapPin, Calendar, Clock, Users, Package,
  Star, ShieldCheck, ArrowRight, Search,
  Car, AlertCircle, SlidersHorizontal, X,
  Cigarette, PawPrint, Music, Zap, UserCheck,
  ChevronDown, ChevronUp, Check
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const geocodePlace = async (name) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/geocode?city=${encodeURIComponent(name)}`
    );
    return { lat: res.data.lat, lng: res.data.lng };
  } catch {
    return null;
  }
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [form, setForm] = useState({
    from: searchParams.get("from") || "",
    to: searchParams.get("to") || "",
    date: searchParams.get("date") || "",
    passengers: searchParams.get("passengers") || 1,
  });

  // ── Filters ──────────────────────────────────────────────────────────────
  const [sortBy, setSortBy] = useState("earliest");
  const [timeSlots, setTimeSlots] = useState({
    before12: false,
    afternoon: false,
    evening: false,
  });
  const [amenities, setAmenities] = useState({
    verifiedOnly: false,
    instantOnly: false,
    bootSpace: false,
    smokingAllowed: false,
    petsAllowed: false,
    womenOnly: false,
    maxInBack: false,
  });

  const searchRides = useCallback(async (searchForm = form) => {
    if (!searchForm.from || !searchForm.to) {
      return setError("Please enter both From and To locations.");
    }
    setLoading(true);
    setError("");
    setRides([]);

    try {
      const [fromCoords, toCoords] = await Promise.all([
        geocodePlace(searchForm.from),
        geocodePlace(searchForm.to),
      ]);

      const params = {
        from: searchForm.from,
        to: searchForm.to,
        ...(searchForm.date && { date: searchForm.date }),
        sortBy,
      };

      if (fromCoords) { params.fromLat = fromCoords.lat; params.fromLng = fromCoords.lng; }
      if (toCoords) { params.toLat = toCoords.lat; params.toLng = toCoords.lng; }

      // Amenity filters
      if (amenities.instantOnly) params.instantOnly = "true";
      if (amenities.bootSpace) params.acceptsParcels = "true";
      if (amenities.smokingAllowed) params.smokingAllowed = "true";
      if (amenities.petsAllowed) params.petsAllowed = "true";
      if (amenities.womenOnly) params.womenOnly = "true";
      if (amenities.maxInBack) params.maxInBack = "true";
      if (amenities.verifiedOnly) params.verifiedOnly = "true";

      const res = await axios.get(`${BASE_URL}/ride/search`, { params });
      setRides(res.data || []);
    } catch (err) {
      if (err.response?.status === 404) {
        setRides([]);
        setError("No rides found for this route.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [form, sortBy, amenities]);

  useEffect(() => {
    if (form.from && form.to) searchRides();
  }, []);

  // ── Filter rides client-side for time slots ──────────────────────────────
  const getTimeSlot = (timeStr) => {
    if (!timeStr) return null;
    const [h] = timeStr.split(":").map(Number);
    if (h < 12) return "before12";
    if (h < 18) return "afternoon";
    return "evening";
  };

  const anyTimeSlot = Object.values(timeSlots).some(Boolean);

  const filteredRides = rides.filter((ride) => {
    if (!anyTimeSlot) return true;
    const slot = getTimeSlot(ride.time);
    return timeSlots[slot];
  });

  // ── Count helpers ────────────────────────────────────────────────────────
  const countBySlot = (slot) =>
    rides.filter((r) => getTimeSlot(r.time) === slot).length;

  const countByAmenity = (key) => {
    switch (key) {
      case "verifiedOnly": return rides.filter((r) => r.driver?.kycStatus === "verified").length;
      case "instantOnly": return rides.filter((r) => r.bookingPreference === "instant").length;
      case "bootSpace": return rides.filter((r) => r.acceptsParcels).length;
      case "smokingAllowed": return rides.filter((r) => r.preferences?.smokingAllowed).length;
      case "petsAllowed": return rides.filter((r) => r.preferences?.petsAllowed).length;
      case "womenOnly": return rides.filter((r) => r.preferences?.womenOnly).length;
      case "maxInBack": return rides.filter((r) => r.preferences?.maxInBack).length;
      default: return 0;
    }
  };

  const activeFilterCount =
    Object.values(timeSlots).filter(Boolean).length +
    Object.values(amenities).filter(Boolean).length +
    (sortBy !== "earliest" ? 1 : 0);

  const clearAllFilters = () => {
    setSortBy("earliest");
    setTimeSlots({ before12: false, afternoon: false, evening: false });
    setAmenities({
      verifiedOnly: false, instantOnly: false, bootSpace: false,
      smokingAllowed: false, petsAllowed: false, womenOnly: false, maxInBack: false,
    });
  };

  // ── Sidebar component ────────────────────────────────────────────────────
  const Sidebar = () => (
    <div className="space-y-6">

      {/* Sort by */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="font-bold text-slate-800 text-sm">Sort by</p>
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-blue-600 text-xs hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="space-y-2">
          {[
            { value: "earliest", label: "Earliest departure", icon: <Clock size={14} /> },
            { value: "price_asc", label: "Lowest price", icon: <ArrowRight size={14} /> },
            { value: "rating", label: "Highest rated", icon: <Star size={14} /> },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${sortBy === opt.value
                    ? "border-blue-600 bg-blue-600"
                    : "border-slate-300 group-hover:border-blue-400"
                  }`}>
                  {sortBy === opt.value && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </div>
                <span className="text-slate-600 text-sm flex items-center gap-1.5">
                  {opt.icon}
                  {opt.label}
                </span>
              </div>
              <input
                type="radio"
                name="sortBy"
                value={opt.value}
                checked={sortBy === opt.value}
                onChange={() => setSortBy(opt.value)}
                className="hidden"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* Departure time */}
      <div>
        <p className="font-bold text-slate-800 text-sm mb-3">Departure time</p>
        <div className="space-y-2">
          {[
            { key: "before12", label: "Before 12:00", count: countBySlot("before12") },
            { key: "afternoon", label: "12:01 – 18:00", count: countBySlot("afternoon") },
            { key: "evening", label: "After 18:00", count: countBySlot("evening") },
          ].map((slot) => (
            <label
              key={slot.key}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition ${timeSlots[slot.key]
                    ? "border-blue-600 bg-blue-600"
                    : "border-slate-300 group-hover:border-blue-400"
                  }`}>
                  {timeSlots[slot.key] && <Check size={10} className="text-white" />}
                </div>
                <span className="text-slate-600 text-sm">{slot.label}</span>
              </div>
              <span className="text-slate-400 text-xs">{slot.count}</span>
              <input
                type="checkbox"
                checked={timeSlots[slot.key]}
                onChange={() =>
                  setTimeSlots((prev) => ({ ...prev, [slot.key]: !prev[slot.key] }))
                }
                className="hidden"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* Trust & safety */}
      <div>
        <p className="font-bold text-slate-800 text-sm mb-3">Trust & safety</p>
        <div className="space-y-2">
          {[
            { key: "verifiedOnly", label: "Verified profile", icon: <ShieldCheck size={13} className="text-emerald-500" /> },
          ].map((item) => (
            <label key={item.key} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2.5">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition ${amenities[item.key]
                    ? "border-blue-600 bg-blue-600"
                    : "border-slate-300 group-hover:border-blue-400"
                  }`}>
                  {amenities[item.key] && <Check size={10} className="text-white" />}
                </div>
                <span className="text-slate-600 text-sm flex items-center gap-1.5">
                  {item.icon}
                  {item.label}
                </span>
              </div>
              <span className="text-slate-400 text-xs">{countByAmenity(item.key)}</span>
              <input
                type="checkbox"
                checked={amenities[item.key]}
                onChange={() =>
                  setAmenities((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                }
                className="hidden"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* Amenities */}
      <div>
        <p className="font-bold text-slate-800 text-sm mb-3">Amenities</p>
        <div className="space-y-2">
          {[
            { key: "instantOnly", label: "Instant booking", icon: <Zap size={13} className="text-amber-500" /> },
            { key: "bootSpace", label: "Boot space available", icon: <Package size={13} className="text-blue-500" /> },
            { key: "maxInBack", label: "Max. 2 in the back", icon: <Users size={13} className="text-slate-500" /> },
            { key: "smokingAllowed", label: "Smoking allowed", icon: <Cigarette size={13} className="text-slate-500" /> },
            { key: "petsAllowed", label: "Pets allowed", icon: <PawPrint size={13} className="text-slate-500" /> },
            { key: "womenOnly", label: "Women only", icon: <UserCheck size={13} className="text-pink-500" /> },
          ].map((item) => (
            <label key={item.key} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2.5">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition ${amenities[item.key]
                    ? "border-blue-600 bg-blue-600"
                    : "border-slate-300 group-hover:border-blue-400"
                  }`}>
                  {amenities[item.key] && <Check size={10} className="text-white" />}
                </div>
                <span className="text-slate-600 text-sm flex items-center gap-1.5">
                  {item.icon}
                  {item.label}
                </span>
              </div>
              <span className="text-slate-400 text-xs">{countByAmenity(item.key)}</span>
              <input
                type="checkbox"
                checked={amenities[item.key]}
                onChange={() =>
                  setAmenities((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                }
                className="hidden"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Search bar ── */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <form
            onSubmit={(e) => { e.preventDefault(); searchRides(); }}
            className="flex flex-col md:flex-row gap-3"
          >
            <div className="relative flex-1">
              <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-500" />
              <input
                type="text"
                placeholder="Leaving from"
                value={form.from}
                onChange={(e) => setForm({ ...form, from: e.target.value })}
                className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white"
              />
            </div>
            <div className="relative flex-1">
              <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />
              <input
                type="text"
                placeholder="Going to"
                value={form.to}
                onChange={(e) => setForm({ ...form, to: e.target.value })}
                className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white"
              />
            </div>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white [color-scheme:light] w-full md:w-36"
            />
            {/* Mobile filter button */}
            <button
              type="button"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className={`md:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition ${activeFilterCount > 0
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white border-slate-200 text-slate-600"
                }`}
            >
              <SlidersHorizontal size={15} />
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Search size={14} />
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-6">

          {/* ── Desktop Sidebar ── */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sticky top-36 shadow-sm">
              <Sidebar />
            </div>
          </aside>

          {/* ── Mobile Sidebar ── */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setShowMobileFilters(false)}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-5">
                  <p className="font-bold text-slate-800">Filters</p>
                  <button onClick={() => setShowMobileFilters(false)}>
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>
                <Sidebar />
                <button
                  onClick={() => { searchRides(); setShowMobileFilters(false); }}
                  className="w-full mt-6 bg-blue-600 text-white font-bold py-3.5 rounded-xl"
                >
                  Show {filteredRides.length} rides
                </button>
              </div>
            </div>
          )}

          {/* ── Results ── */}
          <div className="flex-1 min-w-0">

            {/* Result count */}
            {!loading && !error && rides.length > 0 && (
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-600 text-sm">
                  <span className="font-bold text-slate-900">
                    {filteredRides.length}
                  </span>{" "}
                  ride{filteredRides.length !== 1 ? "s" : ""} found
                  {form.from && form.to && (
                    <span className="text-slate-400">
                      {" "}· {form.from} → {form.to}
                    </span>
                  )}
                </p>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-blue-600 text-xs hover:underline flex items-center gap-1"
                  >
                    <X size={12} />
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-10 h-10 border-2 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-slate-400 text-sm">Searching rides near you...</p>
              </div>
            )}

            {/* Error / empty */}
            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
                  <AlertCircle size={24} className="text-slate-400" />
                </div>
                <p className="text-slate-500 text-sm">{error}</p>
                <button
                  onClick={() => navigate("/")}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Back to home
                </button>
              </div>
            )}

            {/* Ride cards */}
            {!loading && filteredRides.length > 0 && (
              <div className="space-y-3">
                {filteredRides.map((ride) => (
                  <RideCard
                    key={ride._id || ride.id}
                    ride={ride}
                    navigate={navigate}
                  />
                ))}
              </div>
            )}

            {/* No results after filter */}
            {!loading && !error && rides.length > 0 && filteredRides.length === 0 && (
              <div className="text-center py-16">
                <p className="text-slate-400 text-sm mb-2">
                  No rides match your current filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Ride Card — BlaBlaCar style ───────────────────────────────────────────────
const RideCard = ({ ride, navigate }) => {
  const driver = ride.driver || {};
  const isVerified = driver.kycStatus === "verified";
  const prefs = ride.preferences || {};

  const amenityBadges = [
    ride.bookingPreference === "instant" && {
      label: "Instant", icon: <Zap size={11} />,
      className: "bg-amber-50 text-amber-600 border-amber-200",
    },
    prefs.maxInBack && {
      label: "Max. 2 in back", icon: <Users size={11} />,
      className: "bg-blue-50 text-blue-600 border-blue-200",
    },
    prefs.smokingAllowed && {
      label: "Smoking ok", icon: <Cigarette size={11} />,
      className: "bg-slate-50 text-slate-600 border-slate-200",
    },
    prefs.petsAllowed && {
      label: "Pets ok", icon: <PawPrint size={11} />,
      className: "bg-green-50 text-green-600 border-green-200",
    },
    prefs.womenOnly && {
      label: "Women only", icon: <UserCheck size={11} />,
      className: "bg-pink-50 text-pink-600 border-pink-200",
    },
    ride.acceptsParcels && {
      label: "Boot space", icon: <Package size={11} />,
      className: "bg-indigo-50 text-indigo-600 border-indigo-200",
    },
  ].filter(Boolean);

  return (
    <div
      onClick={() => navigate(`/ride/${ride._id || ride.id}`)}
      className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-4">

        {/* ── Route + time ── */}
        <div className="flex-1 min-w-0">
          {/* Time → duration → time (BlaBlaCar style) */}
          <div className="flex items-center gap-3 mb-3">
            <div className="text-center shrink-0">
              <p className="text-slate-900 font-black text-lg leading-none">
                {ride.time || "—"}
              </p>
              <p className="text-slate-500 text-xs mt-1 truncate max-w-[80px]">
                {ride.from?.name?.split(",")[0]}
              </p>
            </div>

            <div className="flex-1 flex items-center gap-1 min-w-0">
              <div className="w-2 h-2 bg-blue-600 rounded-full shrink-0" />
              <div className="flex-1 h-px bg-slate-200 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white text-slate-400 text-[10px] px-1.5 border border-slate-200 rounded-full whitespace-nowrap">
                    {ride.stops?.length > 0
                      ? `${ride.stops.length} stop${ride.stops.length > 1 ? "s" : ""}`
                      : "Direct"}
                  </span>
                </div>
              </div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full shrink-0" />
            </div>

            <div className="text-center shrink-0">
              <p className="text-slate-900 font-black text-lg leading-none">
                {ride.time || "—"}
              </p>
              <p className="text-slate-500 text-xs mt-1 truncate max-w-[80px]">
                {ride.to?.name?.split(",")[0]}
              </p>
            </div>
          </div>

          {/* Date + seats */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {new Date(ride.date).toLocaleDateString("en-IN", {
                day: "numeric", month: "short",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Users size={11} />
              {ride.availableSeats} seat{ride.availableSeats !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Amenity badges */}
          {amenityBadges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {amenityBadges.map((badge, i) => (
                <span
                  key={i}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${badge.className}`}
                >
                  {badge.icon}
                  {badge.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── Driver + price ── */}
        <div className="flex flex-col items-end gap-3 shrink-0">
          {/* Price */}
          <p className="text-2xl font-black text-slate-900">
            ₹{ride.pricePerSeat}
          </p>

          {/* Driver */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <p className="text-slate-600 text-xs font-semibold">
                  {driver.name?.split(" ")[0] || "Driver"}
                </p>
                {isVerified && (
                  <ShieldCheck size={11} className="text-emerald-500" />
                )}
              </div>
              {driver.totalRatings > 0 && (
                <div className="flex items-center gap-0.5 justify-end mt-0.5">
                  <Star size={10} className="text-amber-400 fill-amber-400" />
                  <span className="text-slate-400 text-[11px]">
                    {(driver.rating || 0).toFixed(1)}
                  </span>
                </div>
              )}
            </div>
            <div className="w-9 h-9 rounded-full overflow-hidden bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center">
              {driver.profilePhoto ? (
                <img
                  src={driver.profilePhoto}
                  alt={driver.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-blue-600 text-sm font-bold">
                  {driver.name?.[0]?.toUpperCase() || "D"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Boot pricing preview */}
      {ride.acceptsParcels && ride.bootSpace && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-4">
          {ride.bootSpace.smallPrice && (
            <span className="text-xs text-slate-500">
              Small <span className="font-semibold text-slate-700">₹{ride.bootSpace.smallPrice}</span>
            </span>
          )}
          {ride.bootSpace.mediumPrice && (
            <span className="text-xs text-slate-500">
              Medium <span className="font-semibold text-slate-700">₹{ride.bootSpace.mediumPrice}</span>
            </span>
          )}
          {ride.bootSpace.largePrice && (
            <span className="text-xs text-slate-500">
              Large <span className="font-semibold text-slate-700">₹{ride.bootSpace.largePrice}</span>
            </span>
          )}
          {ride.bootSpace.maxWeightKg && (
            <span className="text-xs text-slate-500">
              Max <span className="font-semibold text-slate-700">{ride.bootSpace.maxWeightKg}kg</span>
            </span>
          )}
        </div>
      )}

      <div className="flex justify-end mt-2">
        <ArrowRight
          size={15}
          className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
        />
      </div>
    </div>
  );
};

export default SearchResults;