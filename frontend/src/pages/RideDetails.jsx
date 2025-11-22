// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { BASE_URL } from "../utils/constants";

// const RideDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [ride, setRide] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchRide = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(`${BASE_URL}/ride/${id}`);
//         setRide(res.data);
//       } catch (err) {
//         console.error("Error fetching ride details:", err);
//         setError(err.response?.data?.message || "Failed to load ride details.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRide();
//   }, [id]);

//   if (loading)
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-700 border-t-transparent"></div>
//       </div>
//     );

//   if (error)
//     return (
//       <div className="text-center text-red-600 mt-20 font-medium">
//         {error}
//       </div>
//     );

//   if (!ride)
//     return (
//       <div className="text-center mt-20 text-gray-600">
//         Ride not found.
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 py-12 px-6 flex justify-center">
//       <div className="bg-white shadow-xl rounded-2xl p-8 max-w-3xl w-full border border-gray-100">
//         <h1 className="text-3xl font-bold text-blue-700 mb-4 text-center">
//           Ride Details
//         </h1>

//         <div className="border-t border-gray-200 my-6"></div>

//         <div className="space-y-3 text-gray-700">
//           <p>
//             <span className="font-semibold">From:</span> {ride.from}
//           </p>
//           <p>
//             <span className="font-semibold">To:</span> {ride.to}
//           </p>
//           {ride.stops?.length > 0 && (
//             <p>
//               <span className="font-semibold">Stops:</span>{" "}
//               {ride.stops.join(", ")}
//             </p>
//           )}
//           <p>
//             <span className="font-semibold">Date:</span>{" "}
//             {new Date(ride.date).toLocaleDateString()}
//           </p>
//           <p>
//             <span className="font-semibold">Time:</span> {ride.time}
//           </p>
//           <p>
//             <span className="font-semibold">Available Seats:</span>{" "}
//             {ride.availableSeats}
//           </p>
//           <p>
//             <span className="font-semibold">Price per Seat:</span> ₹
//             {ride.pricePerSeat}
//           </p>
//           <p>
//             <span className="font-semibold">Status:</span> {ride.status}
//           </p>
//         </div>

//         <div className="border-t border-gray-200 my-6"></div>

//         <div>
//           <h2 className="text-2xl font-semibold text-blue-700 mb-3">
//             Driver Information
//           </h2>
//           <div className="flex items-center gap-4">
//             {ride.driver?.photo && (
//               <img
//                 src={ride.driver.photo}
//                 alt={ride.driver.name}
//                 className="w-16 h-16 rounded-full object-cover border-2 border-blue-300"
//               />
//             )}
//             <div>
//               <p className="text-lg font-semibold text-gray-800">
//                 {ride.driver?.name || "Unknown Driver"}
//               </p>
              
//               <p
//                 className={`mt-1 text-sm ${
//                   ride.driver?.isVerified ? "text-green-600" : "text-red-500"
//                 }`}
//               >
//                 {/* {ride.driver?.isVerified ? "✔ Verified Driver" : "❌ Not Verified"} */}
//               </p>
//             </div>
//           </div>
//         </div>

//         <button
//           onClick={() => navigate(`/book-ride/${ride._id}`)}
//           className="w-full mt-8 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold shadow-md transition-all hover:scale-105"
//         >
//           Book Now
//         </button>
//       </div>
//     </div>
//   );
// };

// export default RideDetails;































// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { BASE_URL } from "../utils/constants";

// const RideDetails = () => {
//   const { id } = useParams();
//   const [ride, setRide] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [buttonState, setButtonState] = useState("book"); // "book", "pending", "disabled"

//   const fetchRide = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/ride/${id}`, { withCredentials: true });
//       setRide(res.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBook = async () => {
//     try {
//       setButtonState("pending");
//       await axios.post(
//         `${BASE_URL}/ride/request`,
//         { rideId: id, seatsRequested: 1 },
//         { withCredentials: true }
//       );
//       alert("Request sent to driver!");
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to send request.");
//       setButtonState("book");
//     }
//   };

//   useEffect(() => {
//     fetchRide();
//   }, [id]);

//   if (loading)
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin h-12 w-12 border-4 border-blue-700 border-t-transparent rounded-full"></div>
//       </div>
//     );

//   if (!ride)
//     return (
//       <div className="text-center mt-20 text-gray-600">Ride not found.</div>
//     );

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 py-12 px-6 flex justify-center">
//       <div className="bg-white shadow-xl rounded-2xl p-8 max-w-3xl w-full border border-gray-100">
//         <h1 className="text-3xl font-bold text-blue-700 mb-4 text-center">
//           Ride Details
//         </h1>

//         <div className="border-t border-gray-200 my-6"></div>

//         <div className="space-y-3 text-gray-700">
//           <p><b>From:</b> {ride.from}</p>
//           <p><b>To:</b> {ride.to}</p>
//           <p><b>Date:</b> {new Date(ride.date).toLocaleDateString()}</p>
//           <p><b>Time:</b> {ride.time}</p>
//           <p><b>Available Seats:</b> {ride.availableSeats}</p>
//           <p><b>Price per Seat:</b> ₹{ride.pricePerSeat}</p>
//         </div>

//         <div className="border-t border-gray-200 my-6"></div>

//         {buttonState === "book" && (
//           <button
//             onClick={handleBook}
//             className="w-full mt-4 bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition"
//           >
//             Book Now
//           </button>
//         )}

//         {buttonState === "pending" && (
//           <button
//             disabled
//             className="w-full mt-4 bg-gray-400 text-white py-3 rounded-lg cursor-not-allowed"
//           >
//             Waiting for response...
//           </button>
//         )}

//         {buttonState === "disabled" && (
//           <button
//             disabled
//             className="w-full mt-4 bg-gray-500 text-white py-3 rounded-lg cursor-not-allowed"
//           >
//             You already have one active request
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RideDetails;











// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { BASE_URL } from "../utils/constants";

// const RideDetails = () => {
//   const { id } = useParams();
//   const { token, user } = useSelector((state) => state.auth);

//   const [ride, setRide] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [buttonState, setButtonState] = useState("book"); // book | pending | approved | rejected

//   const fetchRide = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${BASE_URL}/ride/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const rideData = res.data;
//       setRide(rideData);

//       const myRequest = rideData.requests?.find(
//         (r) => r.user?._id === user?._id
//       );
//       if (myRequest) setButtonState(myRequest.status);
//     } catch (err) {
//       console.error("❌ Error fetching ride:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBook = async () => {
//     try {
//       setButtonState("pending");
//       await axios.post(
//         `${BASE_URL}/ride/request`,
//         { rideId: id, seatsRequested: 1 },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert("Request sent to driver!");
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to send request.");
//       setButtonState("book");
//     }
//   };

//   useEffect(() => {
//     if (id) fetchRide();
//   }, [id]);

//   if (loading)
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin h-12 w-12 border-4 border-blue-700 border-t-transparent rounded-full"></div>
//       </div>
//     );

//   if (!ride)
//     return <div className="text-center mt-20 text-gray-600">Ride not found.</div>;

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 py-12 px-6 flex justify-center">
//       <div className="bg-white shadow-xl rounded-2xl p-8 max-w-3xl w-full border border-gray-100">
//         <h1 className="text-3xl font-bold text-blue-700 mb-4 text-center">
//           Ride Details
//         </h1>

//         <div className="border-t border-gray-200 my-6"></div>

//         <div className="space-y-3 text-gray-700">
//           <p><b>From:</b> {ride.from?.name || "Unknown"}</p>
//           <p><b>To:</b> {ride.to?.name || "Unknown"}</p>

//           {ride.stops?.length > 0 && (
//             <p><b>Stops:</b> {ride.stops.map((s) => s.name).join(", ")}</p>
//           )}

//           <p><b>Date:</b> {new Date(ride.date).toLocaleDateString()}</p>
//           <p><b>Time:</b> {ride.time}</p>
//           <p><b>Available Seats:</b> {ride.availableSeats}</p>
//           <p><b>Price per Seat:</b> ₹{ride.pricePerSeat}</p>

//           <div className="border-t border-gray-200 my-4"></div>

//           <h3 className="text-xl font-semibold text-blue-700">Driver Info</h3>
//           <p><b>Name:</b> {ride.driver?.name}</p>
//           <p><b>Email:</b> {ride.driver?.email}</p>
//           {ride.driver?.vehicleInfo && (
//             <>
//               <p><b>Vehicle Type:</b> {ride.driver.vehicleInfo.vehicleType}</p>
//               <p><b>Registration No:</b> {ride.driver.vehicleInfo.registrationNo}</p>
//             </>
//           )}
//         </div>

//         <div className="border-t border-gray-200 my-6"></div>

//         {buttonState === "book" && (
//           <button
//             onClick={handleBook}
//             className="w-full mt-4 bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition"
//           >
//             Book Now
//           </button>
//         )}

//         {buttonState === "pending" && (
//           <button
//             disabled
//             className="w-full mt-4 bg-yellow-500 text-white py-3 rounded-lg cursor-not-allowed"
//           >
//             Request Pending...
//           </button>
//         )}

//         {buttonState === "approved" && (
//           <button
//             disabled
//             className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg cursor-not-allowed"
//           >
//             Ride Approved ✅
//           </button>
//         )}

//         {buttonState === "rejected" && (
//           <button
//             disabled
//             className="w-full mt-4 bg-red-500 text-white py-3 rounded-lg cursor-not-allowed"
//           >
//             Request Rejected ❌
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RideDetails;




// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { BASE_URL } from "../utils/constants";

// const RideDetails = () => {
//   const { id } = useParams(); // ✅ this captures the ride ID from URL (/ride/:id)
//   console.log("🚀 RideDetails - Ride ID from URL:", id);

//   const [ride, setRide] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [buttonState, setButtonState] = useState("book"); // added missing state

//   useEffect(() => {
//     const fetchRide = async () => {
//       if (!id) return; // prevent undefined calls

//       try {
//         setLoading(true);
//         const response = await axios.get(`${BASE_URL}/ride/${id}`);
//         setRide(response.data);
//       } catch (err) {
//         console.error("❌ Error fetching ride:", err);
//         setError(err.response?.data?.message || "Failed to fetch ride details.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRide();
//   }, [id]);

//   // added dummy booking function to avoid undefined error
//   const handleBook = async () => {
//     alert("Book button clicked (placeholder).");
//     setButtonState("pending");
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
//       </div>
//     );

//   if (error)
//     return (
//       <div className="text-center mt-20 text-red-600 font-semibold">{error}</div>
//     );

//   if (!ride)
//     return (
//       <div className="text-center mt-20 text-gray-600 font-medium">
//         No ride details found.
//       </div>
//     );

//   return (
//     <div className="max-w-3xl mx-auto mt-12 p-8 bg-white shadow-lg rounded-xl">
//       <h1 className="text-3xl font-bold text-blue-700 mb-6">Ride Details</h1>

//       <p className="text-gray-700 mb-2">
//         <strong>From:</strong> {ride.from?.name || "Unknown"}
//       </p>
//       <p className="text-gray-700 mb-2">
//         <strong>To:</strong> {ride.to?.name || "Unknown"}
//       </p>
//       {ride.stops?.length > 0 && (
//         <p className="text-gray-700 mb-2">
//           <strong>Stops:</strong> {ride.stops.map((s) => s.name).join(", ")}
//         </p>
//       )}
//       <p className="text-gray-700 mb-2">
//         <strong>Date:</strong> {new Date(ride.date).toLocaleDateString()}
//       </p>
//       <p className="text-gray-700 mb-2">
//         <strong>Time:</strong> {ride.time}
//       </p>
//       <p className="text-gray-700 mb-2">
//         <strong>Seats Available:</strong> {ride.availableSeats}
//       </p>
//       <p className="text-2xl font-bold text-blue-700 mt-4">
//         ₹{ride.pricePerSeat}
//       </p>

//       {/* ✅ Buttons moved inside the same div */}
//       {buttonState === "book" && (
//         <button
//           onClick={handleBook}
//           className="w-full mt-6 bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition"
//         >
//           Book Now
//         </button>
//       )}

//       {buttonState === "pending" && (
//         <button
//           disabled
//           className="w-full mt-6 bg-yellow-500 text-white py-3 rounded-lg cursor-not-allowed"
//         >
//           Request Pending...
//         </button>
//       )}

//       {buttonState === "approved" && (
//         <button
//           disabled
//           className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg cursor-not-allowed"
//         >
//           Ride Approved ✅
//         </button>
//       )}

//       {buttonState === "rejected" && (
//         <button
//           disabled
//           className="w-full mt-6 bg-red-500 text-white py-3 rounded-lg cursor-not-allowed"
//         >
//           Request Rejected ❌
//         </button>
//       )}
//     </div>
//   );
// };

// export default RideDetails;





// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { BASE_URL } from "../utils/constants";

// const RideDetails = () => {
//   const { id } = useParams();
//   const { token, user } = useSelector((state) => state.auth);

//   const [ride, setRide] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [buttonState, setButtonState] = useState("book"); // book | pending | approved | rejected

//   // ✅ Fetch ride details and set button state based on user’s request
//   const fetchRide = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${BASE_URL}/ride/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const rideData = res.data;
//       setRide(rideData);

//       // Check if current user already made a request for this ride
//       const myRequest = rideData.requests?.find(
//         (r) => r.user?._id === user?._id
//       );

//       if (myRequest) {
//         // status could be "pending", "approved", or "rejected"
//         setButtonState(myRequest.status);
//       } else {
//         setButtonState("book");
//       }
//     } catch (err) {
//       console.error("❌ Error fetching ride:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Send booking request
//   const handleBook = async () => {
//     try {
//       setButtonState("pending");
//       await axios.post(
//         `${BASE_URL}/ride/request`,
//         { rideId: id, seatsRequested: 1 },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert("Request sent to driver!");
//       fetchRide(); // refresh ride data after booking
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to send request.");
//       setButtonState("book");
//     }
//   };

//   // ✅ Refetch on mount or when ride ID changes
//   useEffect(() => {
//     if (id) fetchRide();
//   }, [id]);

//   // ✅ Auto-refresh status every few seconds (to reflect approve/reject in real time)
//   useEffect(() => {
//     const interval = setInterval(() => {
//       fetchRide();
//     }, 5000); // check every 5 seconds
//     return () => clearInterval(interval);
//   }, [id]);

//   // ========== UI ==========

//   if (loading)
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin h-12 w-12 border-4 border-blue-700 border-t-transparent rounded-full"></div>
//       </div>
//     );

//   if (!ride)
//     return (
//       <div className="text-center mt-20 text-gray-600">
//         Ride not found.
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 py-12 px-6 flex justify-center">
//       <div className="bg-white shadow-xl rounded-2xl p-8 max-w-3xl w-full border border-gray-100">
//         <h1 className="text-3xl font-bold text-blue-700 mb-4 text-center">
//           Ride Details
//         </h1>

//         <div className="border-t border-gray-200 my-6"></div>

//         <div className="space-y-3 text-gray-700">
//           <p><b>From:</b> {ride.from?.name || "Unknown"}</p>
//           <p><b>To:</b> {ride.to?.name || "Unknown"}</p>

//           {ride.stops?.length > 0 && (
//             <p><b>Stops:</b> {ride.stops.map((s) => s.name).join(", ")}</p>
//           )}

//           <p><b>Date:</b> {new Date(ride.date).toLocaleDateString()}</p>
//           <p><b>Time:</b> {ride.time}</p>
//           <p><b>Available Seats:</b> {ride.availableSeats}</p>
//           <p><b>Price per Seat:</b> ₹{ride.pricePerSeat}</p>

//           <div className="border-t border-gray-200 my-4"></div>

//           <h3 className="text-xl font-semibold text-blue-700">Driver Info</h3>
//           <p><b>Name:</b> {ride.driver?.name}</p>
//           <p><b>Email:</b> {ride.driver?.email}</p>
//           {ride.driver?.vehicleInfo && (
//             <>
//               <p><b>Vehicle Type:</b> {ride.driver.vehicleInfo.vehicleType}</p>
//               <p><b>Registration No:</b> {ride.driver.vehicleInfo.registrationNo}</p>
//             </>
//           )}
//         </div>

//         <div className="border-t border-gray-200 my-6"></div>

//         {/* ✅ Buttons based on request status */}
//         {buttonState === "book" && (
//           <button
//             onClick={handleBook}
//             className="w-full mt-4 bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition"
//           >
//             Book Now
//           </button>
//         )}

//         {buttonState === "pending" && (
//           <button
//             disabled
//             className="w-full mt-4 bg-yellow-500 text-white py-3 rounded-lg cursor-not-allowed"
//           >
//             Request Pending...
//           </button>
//         )}

//         {buttonState === "approved" && (
//           <button
//             disabled
//             className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg cursor-not-allowed"
//           >
//             Ride Approved ✅
//           </button>
//         )}

//         {buttonState === "rejected" && (
//           <button
//             onClick={handleBook}
//             className="w-full mt-4 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition"
//           >
//             Request Rejected ❌ — Book Again
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RideDetails;











import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const RideDetails = () => {
  const { id } = useParams();
  const { token, user } = useSelector((state) => state.auth);

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonState, setButtonState] = useState("book"); // book | pending | approved | rejected
  const [myRequestId, setMyRequestId] = useState(null);

  // ✅ Fetch ride details
  const fetchRide = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/ride/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const rideData = res.data;
      setRide(rideData);

      // Find if this user already made a request
      const myRequest = rideData.requests?.find(
        (r) =>
          String(r.user?._id || r.user?.id) === String(user?._id || user?.id)
      );

      if (myRequest) {
        setMyRequestId(myRequest._id || myRequest.id);
        setButtonState(myRequest.status); // "pending", "approved", "rejected"
      } else {
        setMyRequestId(null);
        setButtonState("book");
      }
    } catch (err) {
      console.error("❌ Error fetching ride:", err);
      alert("Failed to load ride details.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle booking or rebooking
  const handleBook = async (isRebook = false) => {
    try {
      setButtonState("pending");

      const payload = {
        rideId: id,
        seatsRequested: 1,
      };

      // If rebooking and user has a rejected request, reuse it
      if (isRebook && myRequestId) {
        payload.requestId = myRequestId;
      }

      await axios.post(`${BASE_URL}/ride/request`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(isRebook ? "Request re-sent to driver!" : "Request sent to driver!");
      fetchRide(); // refresh state
    } catch (err) {
      console.error("❌ Booking error:", err);
      alert(err.response?.data?.message || "Failed to send request.");
      setButtonState(isRebook ? "rejected" : "book");
    }
  };

  // ✅ Auto-refresh ride details every few seconds
  useEffect(() => {
    if (id) fetchRide();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchRide();
    }, 5000); // every 5 seconds
    return () => clearInterval(interval);
  }, [id]);

  // ✅ UI rendering
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-blue-700 border-t-transparent rounded-full"></div>
      </div>
    );

  if (!ride)
    return (
      <div className="text-center mt-20 text-gray-600">Ride not found.</div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 py-12 px-6 flex justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-3xl w-full border border-gray-100">
        <h1 className="text-3xl font-bold text-blue-700 mb-4 text-center">
          Ride Details
        </h1>

        <div className="border-t border-gray-200 my-6"></div>

        <div className="space-y-3 text-gray-700">
          <p><b>From:</b> {ride.from?.name || "Unknown"}</p>
          <p><b>To:</b> {ride.to?.name || "Unknown"}</p>

          {ride.stops?.length > 0 && (
            <p><b>Stops:</b> {ride.stops.map((s) => s.name).join(", ")}</p>
          )}

          <p><b>Date:</b> {new Date(ride.date).toLocaleDateString()}</p>
          <p><b>Time:</b> {ride.time}</p>
          <p><b>Available Seats:</b> {ride.availableSeats}</p>
          <p><b>Price per Seat:</b> ₹{ride.pricePerSeat}</p>

          <div className="border-t border-gray-200 my-4"></div>

          <h3 className="text-xl font-semibold text-blue-700">Driver Info</h3>
          <p><b>Name:</b> {ride.driver?.name || "Unknown"}</p>
          <p><b>Email:</b> {ride.driver?.email || "N/A"}</p>
          {ride.driver?.vehicleInfo && (
            <>
              <p><b>Vehicle Type:</b> {ride.driver.vehicleInfo.vehicleType}</p>
              <p><b>Registration No:</b> {ride.driver.vehicleInfo.registrationNo}</p>
            </>
          )}
        </div>

        <div className="border-t border-gray-200 my-6"></div>

        {/* ✅ Button states */}
        {buttonState === "book" && (
          <button
            onClick={() => handleBook(false)}
            className="w-full mt-4 bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition"
          >
            Book Now
          </button>
        )}

        {buttonState === "pending" && (
          <button
            disabled
            className="w-full mt-4 bg-yellow-500 text-white py-3 rounded-lg cursor-not-allowed"
          >
            Request Pending...
          </button>
        )}

        {buttonState === "approved" && (
          <button
            disabled
            className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg cursor-not-allowed"
          >
            Ride Approved ✅
          </button>
        )}

        {buttonState === "rejected" && (
          <button
            onClick={() => handleBook(true)} // Re-book using existing request
            className="w-full mt-4 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition"
          >
            Request Rejected ❌ — Book Again
          </button>
        )}
      </div>
    </div>
  );
};

export default RideDetails;
