// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { Loader2 } from "lucide-react";
// import { BASE_URL } from "../utils/constants";

// const MyBookings = () => {
//   const { token } = useSelector((state) => state.auth);
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/ride/my-bookings`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setBookings(res.data);
//       } catch (error) {
//         console.error("❌ Error fetching bookings:", error);
//         alert("Failed to load your bookings.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (token) fetchBookings();
//   }, [token]);

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-[70vh]">
//         <Loader2 className="animate-spin text-blue-600" size={40} />
//       </div>
//     );

//   return (
//     <div className="max-w-4xl mx-auto px-6 py-10">
//       <h2 className="text-3xl font-bold mb-6 text-blue-700">My Bookings</h2>

//       {bookings.length === 0 ? (
//         <p className="text-gray-500 text-lg">You haven’t booked any rides yet.</p>
//       ) : (
//         <div className="grid gap-6">
//           {bookings.map((b) => (
//             <div
//               key={b.id}
//               className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200"
//             >
//               <h3 className="text-xl font-semibold text-gray-800">
//                 {(b.from?.name || b.from) ?? "Unknown"} → {(b.to?.name || b.to) ?? "Unknown"}
//               </h3>

//               <p className="text-gray-600 mt-1">
//                 Date: {new Date(b.date).toLocaleDateString()} | Time: {b.time}
//               </p>

//               <p className="text-gray-600 mt-1">
//                 Seats Requested: {b.seatsRequested} | ₹{b.pricePerSeat} per seat
//               </p>

//               <p
//                 className={`mt-2 font-semibold ${
//                   b.status === "pending"
//                     ? "text-yellow-600"
//                     : b.status === "approved"
//                     ? "text-green-600"
//                     : "text-red-600"
//                 }`}
//               >
//                 Status: {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
//               </p>

//               {/* Show driver details only if approved */}
//               {b.status === "approved" && (
//                 <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
//                   <p className="text-blue-800 font-medium">Driver Details</p>
//                   <p>Name: {b.driver?.name || "N/A"}</p>
//                   <p>Email: {b.driver?.email || "N/A"}</p>
//                   <p>Phone: {b.driver?.phone || "N/A"}</p>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyBookings;


import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Package, MapPin, Calendar, Clock,
  ChevronRight, Car, CheckCircle, XCircle,
  Loader, AlertCircle, Navigation, Star
} from "lucide-react";
import { BASE_URL } from "../utils/constants";
// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MyBookings = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("rides");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, parcelsRes] = await Promise.allSettled([
        axios.get(`${BASE_URL}/ride/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/parcel/my-parcels`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (bookingsRes.status === "fulfilled") {
        setBookings(bookingsRes.value.data || []);
      }
      if (parcelsRes.status === "fulfilled") {
        setParcels(parcelsRes.value.data || []);
      }
    } catch (err) {
      console.error("❌ Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* ── Header ── */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">My Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">
            Your ride bookings and parcel shipments
          </p>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1 mb-6 w-fit">
          {[
            { id: "rides", label: "Ride bookings", count: bookings.length },
            { id: "parcels", label: "Parcels", count: parcels.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${activeTab === tab.id
                ? "bg-white/10 text-white"
                : "text-gray-500 hover:text-gray-300"
                }`}
            >
              {tab.id === "rides" ? <Car size={14} /> : <Package size={14} />}
              {tab.label}
              <span className="text-xs opacity-60">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}

        {/* ── Ride Bookings Tab ── */}
        {!loading && activeTab === "rides" && (
          <>
            {bookings.length === 0 ? (
              <EmptyState
                icon={<Car size={24} className="text-gray-600" />}
                message="No ride bookings yet"
                action="Find a ride"
                onAction={() => navigate("/search-results")}
              />
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    navigate={navigate}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Parcels Tab ── */}
        {!loading && activeTab === "parcels" && (
          <>
            {parcels.length === 0 ? (
              <EmptyState
                icon={<Package size={24} className="text-gray-600" />}
                message="No parcel bookings yet"
                action="Send a parcel"
                onAction={() => navigate("/search-results")}
              />
            ) : (
              <div className="space-y-4">
                {parcels.map((parcel) => (
                  <ParcelCard
                    key={parcel.id || parcel._id}
                    parcel={parcel}
                    navigate={navigate}

                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ── Booking Card ──────────────────────────────────────────────────────────────
const BookingCard = ({ booking, navigate }) => {
  const statusConfig = {
    pending: {
      label: "Pending approval",
      className: "bg-amber-500/10 border-amber-500/20 text-amber-400",
      icon: <Loader size={12} className="animate-spin" />,
    },
    approved: {
      label: "Confirmed",
      className: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      icon: <CheckCircle size={12} />,
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-500/10 border-red-500/20 text-red-400",
      icon: <XCircle size={12} />,
    },
  };

  const config = statusConfig[booking.status] || statusConfig.pending;

  return (
    <div
      onClick={() => navigate(`/ride/${booking.id}`)}
      className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Route */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="flex flex-col items-center gap-1 pt-1 shrink-0">
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
            <div className="w-px h-6 bg-white/10" />
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm truncate">
              {booking.from?.name || "—"}
            </p>
            <p className="text-gray-400 text-sm truncate mt-2">
              {booking.to?.name || "—"}
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${config.className}`}>
            {config.icon}
            {config.label}
          </span>
          <p className="text-white font-bold">₹{booking.pricePerSeat}</p>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <Calendar size={12} />
          {new Date(booking.date).toLocaleDateString("en-IN", {
            day: "numeric", month: "short"
          })}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={12} />
          {booking.time}
        </span>
        <span className="flex items-center gap-1.5">
          <Car size={12} />
          {booking.driver?.name || "Driver"}
        </span>
        {booking.seatsRequested > 1 && (
          <span>{booking.seatsRequested} seats</span>
        )}
      </div>

      <div className="flex justify-end mt-3">
        <ChevronRight
          size={16}
          className="text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all"
        />
      </div>
    </div>
  );
};

// ── Parcel Card ───────────────────────────────────────────────────────────────
const ParcelCard = ({ parcel }) => {
  const steps = [
    { key: "booked", label: "Booked" },
    { key: "picked_up", label: "Picked up" },
    { key: "in_transit", label: "In transit" },
    { key: "delivered", label: "Delivered" },
  ];

  const stepIndex = steps.findIndex((s) => s.key === parcel.status);
  const isCancelled = parcel.status === "cancelled";

  const sizeColors = {
    small: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    medium: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    large: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  };

  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
            <Package size={18} className="text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-white font-medium text-sm">
                To: {parcel.receiverName}
              </p>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border capitalize ${sizeColors[parcel.size] || sizeColors.small
                }`}>
                {parcel.size}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin size={11} />
                {parcel.pickupPoint?.name || "—"}
              </span>
              <span>→</span>
              <span>{parcel.dropPoint?.name || "—"}</span>
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-white font-bold">₹{parcel.price}</p>
          <p className="text-gray-600 text-xs mt-0.5">{parcel.weight}kg</p>
        </div>
      </div>

      {/* Progress tracker */}
      {!isCancelled ? (
        <div className="relative">
          {/* Track line */}
          <div className="absolute top-3.5 left-3.5 right-3.5 h-px bg-white/[0.06]" />
          <div
            className="absolute top-3.5 left-3.5 h-px bg-blue-500 transition-all duration-500"
            style={{
              width: stepIndex >= 0
                ? `${(stepIndex / (steps.length - 1)) * (100 - 7)}%`
                : "0%",
            }}
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, i) => {
              const done = i <= stepIndex;
              const active = i === stepIndex;
              return (
                <div key={step.key} className="flex flex-col items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${done
                    ? "bg-blue-600 border-2 border-blue-400"
                    : "bg-white/[0.04] border border-white/[0.08]"
                    }`}>
                    {done ? (
                      i === stepIndex && parcel.status !== "delivered" ? (
                        <div className="w-2.5 h-2.5 bg-white rounded-full" />
                      ) : (
                        <CheckCircle size={13} className="text-white" />
                      )
                    ) : (
                      <div className="w-2 h-2 bg-white/10 rounded-full" />
                    )}
                  </div>
                  <span className={`text-[10px] text-center leading-tight ${active ? "text-blue-400 font-medium" : done ? "text-gray-400" : "text-gray-600"
                    }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <XCircle size={15} className="text-red-400" />
          <p className="text-red-400 text-sm">Parcel cancelled</p>
        </div>
      )}

      {/* Driver info */}
      {parcel.ride?.driver && (
        <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-300 text-xs font-bold">
              {parcel.ride.driver.name?.[0]?.toUpperCase() || "D"}
            </div>
            <div>
              <p className="text-gray-300 text-xs font-medium">
                {parcel.ride.driver.name}
              </p>
              {parcel.ride.driver.phone && (
                <p className="text-gray-600 text-[11px]">
                  {parcel.ride.driver.phone}
                </p>
              )}
            </div>
          </div>
          {parcel.ride.driver.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              <span className="text-gray-500 text-xs">
                {parcel.ride.driver.rating?.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Empty state ───────────────────────────────────────────────────────────────
const EmptyState = ({ icon, message, action, onAction }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-4">
    <div className="w-14 h-14 bg-white/[0.03] border border-white/[0.07] rounded-2xl flex items-center justify-center">
      {icon}
    </div>
    <p className="text-gray-500 text-sm">{message}</p>
    <button
      onClick={onAction}
      className="text-blue-400 hover:text-blue-300 text-sm transition"
    >
      {action} →
    </button>
  </div>
);

export default MyBookings;