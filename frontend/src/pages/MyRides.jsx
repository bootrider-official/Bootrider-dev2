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
import axios from "axios";
import { useSelector } from "react-redux";
import { Trash2, Loader2, Check, X } from "lucide-react";
import { BASE_URL } from "../utils/constants";

const MyRides = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [processingRequest, setProcessingRequest] = useState({
    rideId: null,
    requestId: null,
  });

  // ================================
  // 🔹 Fetch all rides of the driver
  // ================================
  useEffect(() => {
    const fetchMyRides = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/ride/my-rides`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const myRides = res.data.filter(
          (ride) =>
            String(ride.driver?._id) === String(user?._id) ||
            String(ride.driver?.id) === String(user?._id)
        );

        setRides(myRides);
      } catch (error) {
        console.error("❌ Error fetching rides:", error);
        alert("Failed to load rides.");
      } finally {
        setLoading(false);
      }
    };

    if (token && user) fetchMyRides();
  }, [token, user]);

  // ================================
  // 🗑️ Delete ride
  // ================================
  const handleDelete = async (id) => {
    const rideId = id || id?._id;
    if (!rideId) return alert("Invalid ride ID.");

    if (!window.confirm("Are you sure you want to delete this ride?")) return;

    setDeletingId(rideId);
    try {
      await axios.delete(`${BASE_URL}/ride/${rideId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRides((prev) => prev.filter((r) => r._id !== rideId && r.id !== rideId));
    } catch (error) {
      console.error("Error deleting ride:", error);
      alert(error.response?.data?.message || "Failed to delete ride.");
    } finally {
      setDeletingId(null);
    }
  };

  // ================================
  // ✅ Approve / Reject ride request
  // ================================
  const handleRequestAction = async (rideId, requestId, action) => {
    const resolvedRideId = rideId?._id || rideId?.id || rideId;
    const resolvedRequestId = requestId?._id || requestId?.id || requestId;

    if (!resolvedRideId || !resolvedRequestId)
      return alert("Invalid request or ride ID.");

    setProcessingRequest({ rideId: resolvedRideId, requestId: resolvedRequestId });

    try {
      const res = await axios.post(
        `${BASE_URL}/ride/handle-request`,
        { rideId: resolvedRideId, requestId: resolvedRequestId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRides((prevRides) =>
        prevRides.map((r) =>
          String(r._id) === String(resolvedRideId) ||
          String(r.id) === String(resolvedRideId)
            ? { ...r, requests: res.data.ride.requests }
            : r
        )
      );
    } catch (error) {
      console.error("❌ Error handling request:", error);
      alert(error.response?.data?.message || "Action failed.");
    } finally {
      setProcessingRequest({ rideId: null, requestId: null });
    }
  };

  // ================================
  // 💠 Render
  // ================================
  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
    

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">My Rides</h2>

      {rides.length === 0 ? (
        <p className="text-gray-500 text-lg">You haven’t created any rides yet.</p>
      ) : (
        <div className="grid gap-6">
          {rides.map((ride) => {
            const rideId = ride._id || ride.id;

            return (
              <div
                key={rideId}
                className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200"
              >
                {/* Ride Info */}
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {(ride.from?.name || ride.from) ?? "Unknown"} →{" "}
                      {(ride.to?.name || ride.to) ?? "Unknown"}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Date: {new Date(ride.date).toLocaleDateString()} | Time: {ride.time}
                    </p>
                    <p className="text-gray-600 mt-1">
                      Seats Left: {ride.availableSeats} | ₹{ride.pricePerSeat}/seat
                    </p>
                    {ride.stops?.length > 0 && (
                      <p className="text-gray-500 mt-1 text-sm">
                        Stops:{" "}
                        {ride.stops
                          .map(
                            (s, idx) =>
                              s.name || Object.values(s).join("") || `Stop-${idx}`
                          )
                          .join(", ")}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(rideId)}
                    disabled={deletingId === rideId}
                    className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 disabled:opacity-60"
                  >
                    {deletingId === rideId ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={18} /> Delete
                      </>
                    )}
                  </button>
                </div>

                {/* Booking Requests */}
                {ride.requests && ride.requests.length > 0 && (
                  <div className="mt-6 border-t pt-4">
                    <h4 className="text-lg font-semibold text-blue-700 mb-3">
                      Booking Requests
                    </h4>

                    {ride.requests.map((req) => {
                      const reqId = req._id || req.id;

                      return (
                        <div
                          key={reqId}
                          className="flex justify-between items-center bg-blue-50 p-3 rounded-lg mb-2"
                        >
                          <div>
                            <p className="font-medium text-gray-800">
                              {req.user?.name || "Unknown User"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {req.user?.email || "No email"} | {req.seatsRequested} seat(s)
                            </p>
                            <p
                              className={`text-sm font-medium mt-1 ${
                                req.status === "pending"
                                  ? "text-yellow-600"
                                  : req.status === "approved"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              Status: {req.status}
                            </p>
                          </div>

                          {req.status === "pending" && (
                            <div className="flex gap-2">
                              {/* Approve */}
                              <button
                                onClick={() =>
                                  handleRequestAction(rideId, reqId, "approve")
                                }
                                disabled={
                                  processingRequest.requestId === reqId &&
                                  processingRequest.rideId === rideId
                                }
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 disabled:opacity-60"
                              >
                                {processingRequest.requestId === reqId &&
                                processingRequest.rideId === rideId ? (
                                  <Loader2 className="animate-spin" size={16} />
                                ) : (
                                  <Check size={16} />
                                )}
                                Approve
                              </button>
                              

                              {/* Reject */}
                              <button
                                onClick={() =>
                                  handleRequestAction(rideId, reqId, "reject")
                                }
                                disabled={
                                  processingRequest.requestId === reqId &&
                                  processingRequest.rideId === rideId
                                }
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 disabled:opacity-60"
                              >
                                {processingRequest.requestId === reqId &&
                                processingRequest.rideId === rideId ? (
                                  <Loader2 className="animate-spin" size={16} />
                                ) : (
                                  <X size={16} />
                                )}
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyRides;
