// // import React, { useEffect, useState } from "react";
// // import { useLocation, useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import { BASE_URL } from "../utils/constants";

// // const SearchResults = () => {
// //   const location = useLocation();
// //   const navigate = useNavigate();
// //   const queryParams = new URLSearchParams(location.search);

// //   const from = queryParams.get("from");
// //   const to = queryParams.get("to");
// //   const date = queryParams.get("date");
// //   const passengers = queryParams.get("passengers");

// //   const [rides, setRides] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");

// //   useEffect(() => {
// //     const fetchRides = async () => {
// //       try {
// //         setLoading(true);
// //         setError("");

// //         const response = await axios.get(`${BASE_URL}/ride/search`, {
// //           params: { from, to, date },
// //         });

// //         // Filter rides with available seats > 0
// //         const validRides = response.data.filter((r) => r.availableSeats > 0);
// //         setRides(validRides);
// //       } catch (err) {
// //         console.error("Error fetching rides:", err);
// //         setError(err.response?.data?.message || "Failed to fetch rides.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     if (from && to) fetchRides();
// //   }, [from, to, date, passengers]);

// //   return (
// //     <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 py-12 px-6">
// //       {/* Header */}
// //       <div className="text-center mb-10">
// //         <h1 className="text-4xl font-bold text-blue-700 mb-2">Available Rides</h1>
// //         <p className="text-gray-600">
// //           Showing results from{" "}
// //           <span className="font-semibold text-blue-700">{from}</span> →{" "}
// //           <span className="font-semibold text-blue-700">{to}</span>{" "}
// //           {date && (
// //             <>
// //               on <span className="font-semibold">{date}</span>
// //             </>
// //           )}{" "}
// //           for <span className="font-semibold">{passengers}</span> passenger(s)
// //         </p>
// //       </div>

// //       {/* Loading */}
// //       {loading ? (
// //         <div className="flex justify-center items-center py-20">
// //           <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-700 border-t-transparent"></div>
// //         </div>
// //       ) : error ? (
// //         <div className="text-center text-red-600 mt-16 font-medium">
// //           {error}
// //         </div>
// //       ) : rides.length === 0 ? (
// //         <div className="text-center text-gray-600 mt-16">
// //           <p className="text-lg">No rides found 😔</p>
// //         </div>
// //       ) : (
// //         <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
// //           {rides.map((ride) => (
// //             <div
// //               key={ride._id}
// //               onClick={() => navigate(`/ride/${ride._id}`)}
// //               className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100 hover:scale-[1.02]"
// //             >
// //               <div className="flex items-center justify-between mb-3">
// //                 <h3 className="text-xl font-bold text-blue-700">
// //                   {ride.driver?.name || "Unknown Driver"}
// //                 </h3>
// //               </div>
// //               <p className="text-gray-600 mb-1">
// //                 From: <span className="font-semibold">{ride.from}</span>
// //               </p>
// //               <p className="text-gray-600 mb-1">
// //                 To: <span className="font-semibold">{ride.to}</span>
// //               </p>
// //               {ride.stops?.length > 0 && (
// //                 <p className="text-gray-600 mb-1 text-sm">
// //                   Stops: {ride.stops.join(", ")}
// //                 </p>
// //               )}
// //               <p className="text-gray-600 mb-1">
// //                 Date:{" "}
// //                 <span className="font-semibold">
// //                   {new Date(ride.date).toLocaleDateString()}
// //                 </span>
// //               </p>
// //               <p className="text-gray-600 mb-1">
// //                 Time: <span className="font-semibold">{ride.time}</span>
// //               </p>
// //               <p className="text-gray-600 mb-1">
// //                 Seats:{" "}
// //                 <span className="font-semibold">{ride.availableSeats}</span>
// //               </p>
// //               <p className="text-2xl font-bold text-blue-700 mt-2">
// //                 ₹{ride.pricePerSeat}
// //               </p>
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default SearchResults;



// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { BASE_URL } from "../utils/constants";

// const SearchResults = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const queryParams = new URLSearchParams(location.search);

//   const from = queryParams.get("from");
//   const to = queryParams.get("to");
//   const date = queryParams.get("date");
//   const passengers = queryParams.get("passengers");

//   const [rides, setRides] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchRides = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const response = await axios.get(`${BASE_URL}/ride/search`, {
//           params: { from, to, date },
//         });

//         const validRides = response.data.filter((r) => r.availableSeats > 0);
//         setRides(validRides);
//       } catch (err) {
//         console.error("Error fetching rides:", err);
//         setError(err.response?.data?.message || "Failed to fetch rides.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (from && to) fetchRides();
//   }, [from, to, date, passengers]);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 py-12 px-6">
//       {/* Header */}
//       <div className="text-center mb-10">
//         <h1 className="text-4xl font-bold text-blue-700 mb-2">Available Rides</h1>
//         <p className="text-gray-600">
//           Showing results from{" "}
//           <span className="font-semibold text-blue-700">{from}</span> →{" "}
//           <span className="font-semibold text-blue-700">{to}</span>{" "}
//           {date && (
//             <>
//               on <span className="font-semibold">{date}</span>
//             </>
//           )}{" "}
//           for <span className="font-semibold">{passengers}</span> passenger(s)
//         </p>
//       </div>

//       {/* Loading & Errors */}
//       {loading ? (
//         <div className="flex justify-center items-center py-20">
//           <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-700 border-t-transparent"></div>
//         </div>
//       ) : error ? (
//         <div className="text-center text-red-600 mt-16 font-medium">{error}</div>
//       ) : rides.length === 0 ? (
//         <div className="text-center text-gray-600 mt-16">
//           <p className="text-lg">No rides found 😔</p>
//         </div>
//       ) : (

//         <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           {rides.map((ride) => (
//             <div
//               key={ride._id}
//               onClick={() => navigate(`/ride/${ride.id}`)}

//               className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100 hover:scale-[1.02]"
//             >

//               <div className="flex items-center justify-between mb-3">
//                 <h3 className="text-xl font-bold text-blue-700">
//                   {ride.driver?.name || "Unknown Driver"}
//                 </h3>
//               </div>

//               <p className="text-gray-600 mb-1">
//                 From: <span className="font-semibold">{ride.from?.name || "Unknown"}</span>
//               </p>
//               <p className="text-gray-600 mb-1">
//                 To: <span className="font-semibold">{ride.to?.name || "Unknown"}</span>
//               </p>

//               {ride.stops?.length > 0 && (
//                 <p className="text-gray-600 mb-1 text-sm">
//                   Stops: {ride.stops.map((s, i) => s.name).join(", ")}
//                 </p>
//               )}

//               <p className="text-gray-600 mb-1">
//                 Date:{" "}
//                 <span className="font-semibold">
//                   {new Date(ride.date).toLocaleDateString()}
//                 </span>
//               </p>
//               <p className="text-gray-600 mb-1">
//                 Time: <span className="font-semibold">{ride.time}</span>
//               </p>
//               <p className="text-gray-600 mb-1">
//                 Seats:{" "}
//                 <span className="font-semibold">{ride.availableSeats}</span>
//               </p>
//               <p className="text-2xl font-bold text-blue-700 mt-2">
//                 ₹{ride.pricePerSeat}
//               </p>
//               <p className="text-xs text-gray-500 mt-2">Ride ID: {ride.id}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchResults;



import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  MapPin, Calendar, Clock, Users, Package,
  Star, ShieldCheck, ArrowRight, Search,
  Filter, Car, AlertCircle
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── Geocode a place name to lat/lng ──────────────────────────────────────────
const geocodePlace = async (name) => {
  try {
    const res = await axios.get(`${BASE_URL}/geocode?city=${encodeURIComponent(name)}`);
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

  const [form, setForm] = useState({
    from: searchParams.get("from") || "",
    to: searchParams.get("to") || "",
    date: searchParams.get("date") || "",
    passengers: searchParams.get("passengers") || 1,
  });

  // ── Filter state ─────────────────────────────────────────────────────────
  const [filters, setFilters] = useState({
    parcelsOnly: false,
    instantOnly: false,
    verifiedOnly: false,
  });
  const [showFilters, setShowFilters] = useState(false);

  const searchRides = async (searchForm = form) => {
    if (!searchForm.from || !searchForm.to) {
      return setError("Please enter both From and To locations.");
    }

    setLoading(true);
    setError("");
    setRides([]);

    try {
      // ── Geocode both locations ──────────────────
      const [fromCoords, toCoords] = await Promise.all([
        geocodePlace(searchForm.from),
        geocodePlace(searchForm.to),
      ]);

      const params = {
        from: searchForm.from,
        to: searchForm.to,
        ...(searchForm.date && { date: searchForm.date }),
      };

      // ── Add lat/lng if geocoding succeeded ──────
      if (fromCoords) {
        params.fromLat = fromCoords.lat;
        params.fromLng = fromCoords.lng;
      }
      if (toCoords) {
        params.toLat = toCoords.lat;
        params.toLng = toCoords.lng;
      }

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
  };

  // ── Run search on mount if params exist ──────────────────────────────────
  useEffect(() => {
    if (form.from && form.to) searchRides();
  }, []);

  // ── Apply filters ────────────────────────────────────────────────────────
  const filteredRides = rides.filter((ride) => {
    if (filters.parcelsOnly && !ride.acceptsParcels) return false;
    if (filters.instantOnly && ride.bookingPreference !== "instant") return false;
    if (filters.verifiedOnly && ride.driver?.kycStatus !== "verified") return false;
    return true;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    searchRides();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">

      {/* ── Search bar ── */}
      <div className="border-b border-white/[0.06] bg-[#0d0d14]">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="From"
                  value={form.from}
                  onChange={(e) => setForm({ ...form, from: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/40 transition"
                />
              </div>
              <div className="relative flex-1">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-500" />
                <input
                  type="text"
                  placeholder="To"
                  value={form.to}
                  onChange={(e) => setForm({ ...form, to: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/40 transition"
                />
              </div>
              <div className="relative">
                <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/40 transition [color-scheme:dark]"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition ${showFilters
                    ? "bg-blue-600/10 border-blue-500/30 text-blue-400"
                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                  }`}
              >
                <Filter size={15} />
                Filters
                {Object.values(filters).some(Boolean) && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <Search size={15} />
                Search
              </button>
            </div>

            {/* ── Filter pills ── */}
            {showFilters && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/[0.06]">
                {[
                  { key: "parcelsOnly", label: "Boot space available", icon: <Package size={12} /> },
                  { key: "instantOnly", label: "Instant booking", icon: <Car size={12} /> },
                  { key: "verifiedOnly", label: "Verified drivers only", icon: <ShieldCheck size={12} /> },
                ].map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilters({ ...filters, [f.key]: !filters[f.key] })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${filters[f.key]
                        ? "bg-blue-600/15 border-blue-500/30 text-blue-300"
                        : "bg-white/[0.03] border-white/[0.08] text-gray-400 hover:border-white/20"
                      }`}
                  >
                    {f.icon}
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Result count */}
        {!loading && !error && rides.length > 0 && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-400 text-sm">
              <span className="text-white font-semibold">{filteredRides.length}</span>{" "}
              ride{filteredRides.length !== 1 ? "s" : ""} found
              {form.from && form.to && (
                <span className="text-gray-500">
                  {" "}· {form.from} → {form.to}
                </span>
              )}
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Searching rides near you...</p>
          </div>
        )}

        {/* Error / empty */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-14 h-14 bg-white/[0.03] border border-white/[0.08] rounded-2xl flex items-center justify-center">
              <AlertCircle size={24} className="text-gray-500" />
            </div>
            <p className="text-gray-400 text-sm">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="text-blue-400 hover:text-blue-300 text-sm transition"
            >
              Back to home
            </button>
          </div>
        )}

        {/* Ride cards */}
        {!loading && filteredRides.length > 0 && (
          <div className="space-y-4">
            {filteredRides.map((ride) => (
              <RideCard key={ride._id || ride.id} ride={ride} navigate={navigate} />
            ))}
          </div>
        )}

        {/* No results after filter */}
        {!loading && !error && rides.length > 0 && filteredRides.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm">
              No rides match your current filters.
            </p>
            <button
              onClick={() => setFilters({ parcelsOnly: false, instantOnly: false, verifiedOnly: false })}
              className="text-blue-400 hover:text-blue-300 text-sm mt-2 transition"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Ride Card ─────────────────────────────────────────────────────────────────
const RideCard = ({ ride, navigate }) => {
  const driverName = ride.driver?.name || "Driver";
  const driverInitial = driverName[0]?.toUpperCase();
  const isVerified = ride.driver?.kycStatus === "verified";
  const rating = ride.driver?.rating || 0;
  const totalRatings = ride.driver?.totalRatings || 0;

  return (
    <div
      onClick={() => navigate(`/ride/${ride._id || ride.id}`)}
      className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-4">

        {/* ── Left: route info ── */}
        <div className="flex-1 min-w-0">
          {/* Route */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
              <div className="w-px h-8 bg-white/10" />
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-white font-medium text-sm leading-none">
                {ride.from?.name || "—"}
              </p>
              <p className="text-gray-400 text-sm leading-none">
                {ride.to?.name || "—"}
              </p>
            </div>
          </div>

          {/* Stops */}
          {ride.stops?.length > 0 && (
            <p className="text-gray-600 text-xs mb-3">
              via {ride.stops.map((s) => s.name).join(", ")}
            </p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} />
              {new Date(ride.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              {ride.time}
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={12} />
              {ride.availableSeats} seat{ride.availableSeats !== 1 ? "s" : ""}
            </span>
            {ride.bookingPreference === "instant" && (
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[11px] font-medium">
                Instant
              </span>
            )}
          </div>
        </div>

        {/* ── Right: driver + price ── */}
        <div className="flex flex-col items-end gap-3 shrink-0">
          {/* Price */}
          <div className="text-right">
            <p className="text-2xl font-bold text-white">
              ₹{ride.pricePerSeat}
            </p>
            <p className="text-gray-600 text-xs">per seat</p>
          </div>

          {/* Driver */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <p className="text-gray-300 text-xs font-medium">
                  {driverName.split(" ")[0]}
                </p>
                {isVerified && (
                  <ShieldCheck size={11} className="text-emerald-400" />
                )}
              </div>
              {totalRatings > 0 && (
                <div className="flex items-center gap-1 justify-end mt-0.5">
                  <Star size={10} className="text-amber-400 fill-amber-400" />
                  <span className="text-gray-500 text-[11px]">
                    {rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-blue-300 text-xs font-bold">
              {driverInitial}
            </div>
          </div>

          {/* Boot space badge */}
          {ride.acceptsParcels && (
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full text-[11px] font-medium">
              <Package size={10} />
              Boot available
            </div>
          )}
        </div>
      </div>

      {/* ── Boot pricing preview ── */}
      {ride.acceptsParcels && ride.bootSpace && (
        <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-wrap gap-3">
          {ride.bootSpace.smallPrice && (
            <span className="text-xs text-gray-500">
              Small <span className="text-white">₹{ride.bootSpace.smallPrice}</span>
            </span>
          )}
          {ride.bootSpace.mediumPrice && (
            <span className="text-xs text-gray-500">
              Medium <span className="text-white">₹{ride.bootSpace.mediumPrice}</span>
            </span>
          )}
          {ride.bootSpace.largePrice && (
            <span className="text-xs text-gray-500">
              Large <span className="text-white">₹{ride.bootSpace.largePrice}</span>
            </span>
          )}
          {ride.bootSpace.maxWeightKg && (
            <span className="text-xs text-gray-500">
              Max <span className="text-white">{ride.bootSpace.maxWeightKg}kg</span>
            </span>
          )}
        </div>
      )}

      {/* Arrow */}
      <div className="flex justify-end mt-3">
        <ArrowRight
          size={16}
          className="text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all"
        />
      </div>
    </div>
  );
};

export default SearchResults;