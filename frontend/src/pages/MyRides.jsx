// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { Trash2, Loader2 } from "lucide-react";
// import { BASE_URL } from "../utils/constants";

// const MyRides = () => {
//   const { token, user } = useSelector((state) => state.auth);
//   const [rides, setRides] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [deletingId, setDeletingId] = useState(null);

//   useEffect(() => {
//     const fetchMyRides = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/ride/my-rides`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         // Filter only rides created by this driver
//         const myRides = res.data.filter(
//           (ride) => ride.driver?._id === user?._id
//         );
//         setRides(myRides);
//       } catch (error) {
//         console.error("Error fetching rides:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMyRides();
//   }, [token, user]);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this ride?")) return;

//     setDeletingId(id);
//     try {
//       await axios.delete(`${BASE_URL}/ride/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setRides((prev) => prev.filter((ride) => ride._id !== id));
//     } catch (error) {
//       console.error("Error deleting ride:", error);
//       alert("Failed to delete ride.");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-[70vh]">
//         <Loader2 className="animate-spin text-blue-600" size={40} />
//       </div>
//     );

//   return (
//     <div className="max-w-5xl mx-auto px-6 py-10">
//       <h2 className="text-3xl font-bold mb-6 text-blue-700">My Rides</h2>

//       {rides.length === 0 ? (
//         <p className="text-gray-500 text-lg">You haven’t created any rides yet.</p>
//       ) : (
//         <div className="grid gap-6">
//           {rides.map((ride) => (
//             <div
//               key={ride._id}
//               className="bg-white shadow-lg rounded-2xl p-6 flex justify-between items-center border border-gray-200"
//             >
//               <div>
//                 <h3 className="text-xl font-semibold text-gray-800">
//                   {ride.from} → {ride.to}
//                 </h3>
//                 <p className="text-gray-600 mt-1">
//                   Date: {new Date(ride.date).toLocaleDateString()} | Time:{" "}
//                   {ride.time}
//                 </p>
//                 <p className="text-gray-600 mt-1">
//                   Seats Left: {ride.availableSeats} | ₹{ride.pricePerSeat}/seat
//                 </p>
//               </div>

//               <button
//                 onClick={() => handleDelete(ride._id)}
//                 disabled={deletingId === ride._id}
//                 className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 disabled:opacity-60"
//               >
//                 {deletingId === ride._id ? (
//                   <>
//                     <Loader2 className="animate-spin" size={16} />
//                     Deleting...
//                   </>
//                 ) : (
//                   <>
//                     <Trash2 size={18} /> Delete
//                   </>
//                 )}
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyRides;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { Trash2, Loader2, Check, X } from "lucide-react";
// import { BASE_URL } from "../utils/constants";

// const MyRides = () => {
//   const { token, user } = useSelector((state) => state.auth);
//   const [rides, setRides] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [deletingId, setDeletingId] = useState(null);
//   const [processingRequestId, setProcessingRequestId] = useState(null);

//   useEffect(() => {
//     const fetchMyRides = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/ride/my-rides`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const myRides = res.data.filter((ride) => ride.driver?._id === user?._id);
//         setRides(myRides);
//       } catch (error) {
//         console.error("Error fetching rides:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMyRides();
//   }, [token, user]);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this ride?")) return;
//     setDeletingId(id);
//     try {
//       await axios.delete(`${BASE_URL}/ride/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setRides((prev) => prev.filter((ride) => ride._id !== id));
//     } catch (error) {
//       console.error("Error deleting ride:", error);
//       alert("Failed to delete ride.");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const handleRequestAction = async (rideId, requestId, action) => {
//     try {
//       setProcessingRequestId(requestId);
//       const res = await axios.post(
//         `${BASE_URL}/ride/handle-request`,
//         { rideId, requestId, action },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // Update ride locally
//       setRides((prevRides) =>
//         prevRides.map((ride) =>
//           ride._id === rideId ? { ...ride, requests: res.data.ride.requests } : ride
//         )
//       );
//     } catch (error) {
//       console.error("Error handling request:", error);
//       alert(error.response?.data?.message || "Action failed.");
//     } finally {
//       setProcessingRequestId(null);
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-[70vh]">
//         <Loader2 className="animate-spin text-blue-600" size={40} />
//       </div>
//     );

//   return (
//     <div className="max-w-5xl mx-auto px-6 py-10">
//       <h2 className="text-3xl font-bold mb-6 text-blue-700">My Rides</h2>

//       {rides.length === 0 ? (
//         <p className="text-gray-500 text-lg">You haven’t created any rides yet.</p>
//       ) : (
//         <div className="grid gap-6">
//           {rides.map((ride) => (
//             <div
//               key={ride._id}
//               className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200"
//             >
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="text-xl font-semibold text-gray-800">
//                     {ride.from} → {ride.to}
//                   </h3>
//                   <p className="text-gray-600 mt-1">
//                     Date: {new Date(ride.date).toLocaleDateString()} | Time:{" "}
//                     {ride.time}
//                   </p>
//                   <p className="text-gray-600 mt-1">
//                     Seats Left: {ride.availableSeats} | ₹{ride.pricePerSeat}/seat
//                   </p>
//                 </div>

//                 <button
//                   onClick={() => handleDelete(ride._id)}
//                   disabled={deletingId === ride._id}
//                   className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 disabled:opacity-60"
//                 >
//                   {deletingId === ride._id ? (
//                     <>
//                       <Loader2 className="animate-spin" size={16} />
//                       Deleting...
//                     </>
//                   ) : (
//                     <>
//                       <Trash2 size={18} /> Delete
//                     </>
//                   )}
//                 </button>
//               </div>

//               {/* Booking Requests Section */}
//               {ride.requests && ride.requests.length > 0 && (
//                 <div className="mt-6 border-t pt-4">
//                   <h4 className="text-lg font-semibold text-blue-700 mb-3">
//                     Booking Requests
//                   </h4>
//                   {ride.requests.map((req) => (
//                     <div
//                       key={req._id}
//                       className="flex justify-between items-center bg-blue-50 p-3 rounded-lg mb-2"
//                     >
//                       <div>
//                         <p className="font-medium text-gray-800">
//                           {req.user?.name || "Unknown User"}
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           {req.user?.email} | {req.seatsRequested} seat(s)
//                         </p>
//                         <p
//                           className={`text-sm font-medium mt-1 ${
//                             req.status === "pending"
//                               ? "text-yellow-600"
//                               : req.status === "approved"
//                               ? "text-green-600"
//                               : "text-red-600"
//                           }`}
//                         >
//                           Status: {req.status}
//                         </p>
//                       </div>

//                       {req.status === "pending" && (
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() =>
//                               handleRequestAction(ride._id, req._id, "approve")
//                             }
//                             disabled={processingRequestId === req._id}
//                             className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 disabled:opacity-60"
//                           >
//                             {processingRequestId === req._id ? (
//                               <Loader2 className="animate-spin" size={16} />
//                             ) : (
//                               <Check size={16} />
//                             )}
//                             Approve
//                           </button>

//                           <button
//                             onClick={() =>
//                               handleRequestAction(ride._id, req._id, "reject")
//                             }
//                             disabled={processingRequestId === req._id}
//                             className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 disabled:opacity-60"
//                           >
//                             {processingRequestId === req._id ? (
//                               <Loader2 className="animate-spin" size={16} />
//                             ) : (
//                               <X size={16} />
//                             )}
//                             Reject
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyRides;
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Car, MapPin, Calendar, Clock, Users,
  Package, ChevronRight, Plus, CheckCircle,
  XCircle, Loader, Trash2, Check, X,
  Navigation, AlertCircle
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MyRides = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRides = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/ride/my-rides`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRides(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching rides:", err);
      setRides([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  // ── Handle approve/reject ────────────────────────────────────────────────
  const handleRequest = async (rideId, requestId, action) => {
    setActionLoading(`${requestId}-${action}`);
    try {
      await axios.post(
        `${BASE_URL}/ride/handle-request`,
        { rideId, requestId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchRides();
    } catch (err) {
      alert(err.response?.data?.message || "Failed.");
    } finally {
      setActionLoading(null);
    }
  };

  // ── Complete ride ────────────────────────────────────────────────────────
  const handleComplete = async (rideId) => {
    if (!confirm("Mark this ride as completed?")) return;
    setActionLoading(`complete-${rideId}`);
    try {
      await axios.patch(
        `${BASE_URL}/ride/complete/${rideId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchRides();
    } catch (err) {
      alert(err.response?.data?.message || "Failed.");
    } finally {
      setActionLoading(null);
    }
  };

  // ── Delete ride ──────────────────────────────────────────────────────────
  const handleDelete = async (rideId) => {
    if (!confirm("Cancel and delete this ride?")) return;
    setActionLoading(`delete-${rideId}`);
    try {
      await axios.delete(`${BASE_URL}/ride/${rideId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchRides();
    } catch (err) {
      alert(err.response?.data?.message || "Failed.");
    } finally {
      setActionLoading(null);
    }
  };

  // ── Filter by tab ────────────────────────────────────────────────────────
  const filteredRides = rides.filter((r) => {
    if (activeTab === "active") return r.status === "active";
    if (activeTab === "completed") return r.status === "completed";
    if (activeTab === "cancelled") return r.status === "cancelled";
    return true;
  });

  const pendingCount = rides.reduce(
    (acc, r) => acc + (r.requests?.filter((req) => req.status === "pending").length || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">My Rides</h1>
            <p className="text-gray-500 text-sm mt-1">
              {rides.length} total ride{rides.length !== 1 ? "s" : ""}
              {pendingCount > 0 && (
                <span className="ml-2 bg-amber-500/15 text-amber-400 border border-amber-500/20 text-xs px-2 py-0.5 rounded-full">
                  {pendingCount} pending request{pendingCount !== 1 ? "s" : ""}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => navigate("/create-rides")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition shadow-lg shadow-blue-500/20"
          >
            <Plus size={16} />
            New ride
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1 mb-6 w-fit">
          {[
            { id: "active", label: "Active" },
            { id: "completed", label: "Completed" },
            { id: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab.id
                  ? "bg-white/10 text-white"
                  : "text-gray-500 hover:text-gray-300"
                }`}
            >
              {tab.label}
              <span className="ml-2 text-xs opacity-60">
                {rides.filter((r) => r.status === tab.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && filteredRides.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-14 h-14 bg-white/[0.03] border border-white/[0.07] rounded-2xl flex items-center justify-center">
              <Car size={24} className="text-gray-600" />
            </div>
            <p className="text-gray-500 text-sm">No {activeTab} rides</p>
            {activeTab === "active" && (
              <button
                onClick={() => navigate("/create-rides")}
                className="text-blue-400 hover:text-blue-300 text-sm transition"
              >
                Create your first ride →
              </button>
            )}
          </div>
        )}

        {/* ── Ride list ── */}
        {!loading && filteredRides.length > 0 && (
          <div className="space-y-4">
            {filteredRides.map((ride) => (
              <RideCard
                key={ride._id || ride.id}
                ride={ride}
                navigate={navigate}
                onApprove={(reqId) => handleRequest(ride._id || ride.id, reqId, "approve")}
                onReject={(reqId) => handleRequest(ride._id || ride.id, reqId, "reject")}
                onComplete={() => handleComplete(ride._id || ride.id)}
                onDelete={() => handleDelete(ride._id || ride.id)}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Ride Card ─────────────────────────────────────────────────────────────────
const RideCard = ({
  ride, navigate, onApprove, onReject,
  onComplete, onDelete, actionLoading
}) => {
  const [expanded, setExpanded] = useState(false);
  const pendingRequests = ride.requests?.filter((r) => r.status === "pending") || [];
  const approvedPassengers = ride.passengers || [];
  const rideId = ride._id || ride.id;

  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">

      {/* ── Main row ── */}
      <div className="p-5">
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
                {ride.from?.name}
              </p>
              {ride.stops?.length > 0 && (
                <p className="text-gray-600 text-xs my-1">
                  via {ride.stops.map((s) => s.name).join(", ")}
                </p>
              )}
              <p className="text-gray-400 text-sm truncate">
                {ride.to?.name}
              </p>
            </div>
          </div>

          {/* Status badge + price */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${ride.status === "active"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : ride.status === "completed"
                  ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}>
              {ride.status}
            </span>
            <p className="text-white font-bold">₹{ride.pricePerSeat}</p>
            <p className="text-gray-600 text-xs">per seat</p>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <Calendar size={12} />
            {new Date(ride.date).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric"
            })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} />
            {ride.time}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={12} />
            {ride.availableSeats} seats left
          </span>
          {ride.acceptsParcels && (
            <span className="flex items-center gap-1.5 text-amber-400">
              <Package size={12} />
              Boot registered
            </span>
          )}
          {pendingRequests.length > 0 && (
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <AlertCircle size={12} />
              {pendingRequests.length} pending
            </span>
          )}
        </div>
      </div>

      {/* ── Requests section ── */}
      {(pendingRequests.length > 0 || approvedPassengers.length > 0) && (
        <div className="border-t border-white/[0.06]">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-5 py-3 text-sm text-gray-400 hover:text-white transition"
          >
            <span>
              {pendingRequests.length > 0
                ? `${pendingRequests.length} pending request${pendingRequests.length > 1 ? "s" : ""}`
                : `${approvedPassengers.length} passenger${approvedPassengers.length > 1 ? "s" : ""}`}
            </span>
            <ChevronRight
              size={14}
              className={`transition-transform ${expanded ? "rotate-90" : ""}`}
            />
          </button>

          {expanded && (
            <div className="px-5 pb-4 space-y-2">
              {/* Pending requests */}
              {pendingRequests.map((req) => (
                <div
                  key={req._id}
                  className="flex items-center justify-between bg-white/[0.03] rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-300 text-xs font-bold">
                      {req.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {req.user?.name || "User"}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {req.seatsRequested} seat{req.seatsRequested > 1 ? "s" : ""} · pending
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onApprove(req._id)}
                      disabled={!!actionLoading}
                      className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center hover:bg-emerald-500/20 transition"
                    >
                      {actionLoading === `${req._id}-approve` ? (
                        <div className="w-3 h-3 border border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                      ) : (
                        <Check size={13} />
                      )}
                    </button>
                    <button
                      onClick={() => onReject(req._id)}
                      disabled={!!actionLoading}
                      className="w-8 h-8 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition"
                    >
                      {actionLoading === `${req._id}-reject` ? (
                        <div className="w-3 h-3 border border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                      ) : (
                        <X size={13} />
                      )}
                    </button>
                  </div>
                </div>
              ))}

              {/* Approved passengers */}
              {approvedPassengers.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-white/[0.03] rounded-xl px-4 py-3"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-600/20 flex items-center justify-center text-emerald-300 text-xs font-bold">
                    {p.user?.name?.[0]?.toUpperCase() || "P"}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">
                      {p.user?.name || "Passenger"}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {p.seatsBooked} seat{p.seatsBooked > 1 ? "s" : ""} · confirmed
                    </p>
                  </div>
                  <CheckCircle size={14} className="text-emerald-400 ml-auto" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Action buttons ── */}
      {ride.status === "active" && (
        <div className="border-t border-white/[0.06] px-5 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(`/ride/${rideId}`)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition"
          >
            <Navigation size={13} />
            View details
          </button>
          <span className="text-white/10">·</span>
          <button
            onClick={onComplete}
            disabled={!!actionLoading}
            className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition"
          >
            {actionLoading === `complete-${rideId}` ? (
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
            {actionLoading === `delete-${rideId}` ? (
              <Loader size={13} className="animate-spin" />
            ) : (
              <Trash2 size={13} />
            )}
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default MyRides;