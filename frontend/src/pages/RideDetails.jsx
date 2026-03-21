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
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  MapPin, Calendar, Clock, Users, Package,
  Star, ShieldCheck, Shield, ArrowLeft,
  Car, Weight, AlertTriangle, CheckCircle,
  XCircle, Loader, ChevronRight, Phone,
  Navigation, Info
} from "lucide-react";
import MapWithRoute from "../components/MapWithRoute";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const RideDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonState, setButtonState] = useState("book");
  const [myRequestId, setMyRequestId] = useState(null);

  // ── Parcel booking state ──────────────────────────────────────────────────
  const [showParcelForm, setShowParcelForm] = useState(false);
  const [parcelForm, setParcelForm] = useState({
    receiverName: "",
    receiverPhone: "",
    size: "small",
    weight: "",
    description: "",
    isFragile: false,
  });
  const [parcelLoading, setParcelLoading] = useState(false);
  const [parcelSuccess, setParcelSuccess] = useState("");
  const [parcelError, setParcelError] = useState("");

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

  // ── Book seat ─────────────────────────────────────────────────────────────
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

  // ── Book parcel ───────────────────────────────────────────────────────────
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
      setParcelForm({
        receiverName: "", receiverPhone: "",
        size: "small", weight: "",
        description: "", isFragile: false,
      });
    } catch (err) {
      setParcelError(err.response?.data?.message || "Failed to book parcel.");
    } finally {
      setParcelLoading(false);
    }
  };

  // ── Map waypoints ─────────────────────────────────────────────────────────
  const getWaypoints = () => {
    if (!ride) return [];
    const points = [];
    if (ride.from?.coordinates) {
      points.push({ ...ride.from.coordinates, name: ride.from.name });
    }
    if (ride.stops?.length > 0) {
      ride.stops.forEach((s) => {
        if (s.coordinates) points.push({ ...s.coordinates, name: s.name });
      });
    }
    if (ride.to?.coordinates) {
      points.push({ ...ride.to.coordinates, name: ride.to.name });
    }
    return points;
  };

  // ── Price for parcel size ─────────────────────────────────────────────────
  const getParcelPrice = (size) => {
    if (!ride?.bootSpace) return null;
    const map = {
      small: ride.bootSpace.smallPrice,
      medium: ride.bootSpace.mediumPrice,
      large: ride.bootSpace.largePrice,
    };
    return map[size] || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Ride not found.</p>
          <button onClick={() => navigate(-1)} className="text-blue-400 hover:text-blue-300 text-sm">
            Go back
          </button>
        </div>
      </div>
    );
  }

  const driver = ride.driver || {};
  // const isDriver = String(driver._id || driver.id) === String(user?._id || user?.id);
  const isDriver = String(driver._id || driver.id) === String(user?._id || user?.id || user?.id);
  const waypoints = getWaypoints();

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* ── Back button ── */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition"
        >
          <ArrowLeft size={16} />
          Back to results
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Main column ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Route card */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
              <div className="flex items-start gap-4 mb-5">
                <div className="flex flex-col items-center gap-1 pt-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <div className="w-px flex-1 bg-white/10 min-h-[32px]" />
                  <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                </div>
                <div className="flex-1">
                  <div className="mb-4">
                    <p className="text-white font-semibold text-lg">
                      {ride.from?.name}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-gray-500 text-sm">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} />
                        {new Date(ride.date).toLocaleDateString("en-IN", {
                          weekday: "short", day: "numeric", month: "long"
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} />
                        {ride.time}
                      </span>
                    </div>
                  </div>

                  {/* Stops */}
                  {ride.stops?.length > 0 && (
                    <div className="pl-0 mb-4">
                      {ride.stops.map((stop, i) => (
                        <div key={i} className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-amber-500/60 rounded-full ml-0.5" />
                          <p className="text-gray-400 text-sm">{stop.name}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-white font-semibold text-lg">
                    {ride.to?.name}
                  </p>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/[0.06]">
                <div className="text-center">
                  <p className="text-white font-bold text-lg">₹{ride.pricePerSeat}</p>
                  <p className="text-gray-500 text-xs mt-0.5">per seat</p>
                </div>
                <div className="text-center border-x border-white/[0.06]">
                  <p className="text-white font-bold text-lg">{ride.availableSeats}</p>
                  <p className="text-gray-500 text-xs mt-0.5">seats left</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-lg capitalize">
                    {ride.bookingPreference}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">booking</p>
                </div>
              </div>
            </div>

            {/* Map */}
            {waypoints.length > 1 && (
              <div className="rounded-2xl overflow-hidden">
                <MapWithRoute waypoints={waypoints} />
              </div>
            )}

            {/* Boot space card */}
            {ride.acceptsParcels && ride.bootSpace && (
              <div className="bg-amber-500/[0.04] border border-amber-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package size={18} className="text-amber-400" />
                  <h3 className="text-white font-semibold">Boot space available</h3>
                </div>

                {/* Parcel pricing */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { key: "smallPrice", label: "Small", sub: "up to 2kg" },
                    { key: "mediumPrice", label: "Medium", sub: "up to 10kg" },
                    { key: "largePrice", label: "Large", sub: "up to 20kg" },
                  ].map((item) =>
                    ride.bootSpace[item.key] ? (
                      <div
                        key={item.key}
                        className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-3 text-center"
                      >
                        <p className="text-white font-bold">
                          ₹{ride.bootSpace[item.key]}
                        </p>
                        <p className="text-gray-400 text-xs font-medium mt-0.5">
                          {item.label}
                        </p>
                        <p className="text-gray-600 text-[11px]">{item.sub}</p>
                      </div>
                    ) : null
                  )}
                </div>

                {/* Boot details */}
                <div className="flex flex-wrap gap-3 text-xs mb-4">
                  {ride.bootSpace.maxWeightKg && (
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <Weight size={12} />
                      Max {ride.bootSpace.maxWeightKg}kg
                    </span>
                  )}
                  {ride.bootSpace.fragileAccepted && (
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <AlertTriangle size={12} />
                      Fragile accepted
                    </span>
                  )}
                  {ride.bootSpace.allowedGoods?.length > 0 && (
                    <span className="text-gray-400">
                      {ride.bootSpace.allowedGoods.join(", ")}
                    </span>
                  )}
                </div>

                {ride.bootSpace.bootDescription && (
                  <p className="text-gray-500 text-xs flex items-start gap-1.5">
                    <Info size={12} className="mt-0.5 shrink-0" />
                    {ride.bootSpace.bootDescription}
                  </p>
                )}

                {/* Parcel success */}
                {parcelSuccess && (
                  <div className="mt-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-400" />
                    <p className="text-emerald-400 text-sm">{parcelSuccess}</p>
                  </div>
                )}

                {/* Send parcel button */}
                {!isDriver && !parcelSuccess && (
                  <button
                    onClick={() => setShowParcelForm(!showParcelForm)}
                    className="mt-4 w-full bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 text-amber-400 font-medium py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
                  >
                    <Package size={15} />
                    {showParcelForm ? "Cancel" : "Send a parcel on this ride"}
                  </button>
                )}

                {/* Parcel form */}
                {showParcelForm && (
                  <form onSubmit={handleParcelSubmit} className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5">
                          Receiver name
                        </label>
                        <input
                          type="text"
                          required
                          value={parcelForm.receiverName}
                          onChange={(e) => setParcelForm({ ...parcelForm, receiverName: e.target.value })}
                          placeholder="Full name"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/40 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5">
                          Receiver phone
                        </label>
                        <input
                          type="tel"
                          required
                          value={parcelForm.receiverPhone}
                          onChange={(e) => setParcelForm({ ...parcelForm, receiverPhone: e.target.value })}
                          placeholder="10-digit number"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/40 transition"
                        />
                      </div>
                    </div>

                    {/* Size selector */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">
                        Parcel size
                      </label>
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
                                ? "bg-blue-600/15 border-blue-500/30 text-blue-300"
                                : "bg-white/[0.03] border-white/[0.08] text-gray-400 hover:border-white/15"
                                }`}
                            >
                              <span className="capitalize block">{size}</span>
                              <span className="text-white font-bold">₹{price}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          required
                          min="0.1"
                          step="0.1"
                          value={parcelForm.weight}
                          onChange={(e) => setParcelForm({ ...parcelForm, weight: e.target.value })}
                          placeholder="e.g. 2.5"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/40 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5">
                          Description
                        </label>
                        <input
                          type="text"
                          value={parcelForm.description}
                          onChange={(e) => setParcelForm({ ...parcelForm, description: e.target.value })}
                          placeholder="e.g. Books"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/40 transition"
                        />
                      </div>
                    </div>

                    {/* Fragile toggle */}
                    {ride.bootSpace.fragileAccepted && (
                      <div className="flex items-center justify-between py-3 border-t border-white/[0.06]">
                        <span className="text-gray-400 text-sm flex items-center gap-2">
                          <AlertTriangle size={14} className="text-amber-400" />
                          Fragile item
                        </span>
                        <button
                          type="button"
                          onClick={() => setParcelForm({ ...parcelForm, isFragile: !parcelForm.isFragile })}
                          className={`relative w-10 h-5 rounded-full transition-all ${parcelForm.isFragile ? "bg-blue-600" : "bg-white/10"
                            }`}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${parcelForm.isFragile ? "left-5" : "left-0.5"
                            }`} />
                        </button>
                      </div>
                    )}

                    {parcelError && (
                      <p className="text-red-400 text-xs">{parcelError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={parcelLoading}
                      className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-black font-semibold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
                    >
                      {parcelLoading ? (
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      ) : (
                        <>
                          <Package size={15} />
                          Confirm parcel booking
                        </>
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
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
              <h3 className="text-gray-500 text-xs font-medium uppercase tracking-widest mb-4">
                Driver
              </h3>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-blue-300 font-bold text-lg">
                  {driver.name?.[0]?.toUpperCase() || "D"}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-white font-semibold">{driver.name}</p>
                    {driver.kycStatus === "verified" && (
                      <ShieldCheck size={14} className="text-emerald-400" />
                    )}
                  </div>
                  {driver.totalRatings > 0 && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star size={11} className="text-amber-400 fill-amber-400" />
                      <span className="text-gray-400 text-xs">
                        {(driver.rating || 0).toFixed(1)} · {driver.totalRatings} reviews
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {driver.vehicleInfo?.vehicleType && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Car size={13} />
                    {driver.vehicleInfo.vehicleType}
                    {driver.vehicleInfo.registrationNo && (
                      <span className="text-gray-600">
                        · {driver.vehicleInfo.registrationNo}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  {driver.kycStatus === "verified" ? (
                    <span className="flex items-center gap-1.5 text-emerald-400 text-xs">
                      <ShieldCheck size={12} />
                      KYC Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <Shield size={12} />
                      Not verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Book seat card */}
            {!isDriver && (
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold text-white">
                      ₹{ride.pricePerSeat}
                    </p>
                    <p className="text-gray-500 text-xs">per seat</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{ride.availableSeats}</p>
                    <p className="text-gray-500 text-xs">seats left</p>
                  </div>
                </div>

                {/* Booking button states */}
                {buttonState === "book" && (
                  <button
                    onClick={handleBook}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                  >
                    Request to book
                    <ChevronRight size={16} />
                  </button>
                )}

                {buttonState === "pending" && (
                  <div className="w-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm">
                    <Loader size={15} className="animate-spin" />
                    Request pending...
                  </div>
                )}

                {buttonState === "approved" && (
                  <div className="w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm">
                    <CheckCircle size={15} />
                    Booking confirmed
                  </div>
                )}

                {buttonState === "rejected" && (
                  <div className="space-y-2">
                    <div className="w-full bg-red-500/10 border border-red-500/20 text-red-400 font-medium py-3 rounded-xl flex items-center justify-center gap-2 text-sm">
                      <XCircle size={15} />
                      Request rejected
                    </div>
                    <button
                      onClick={handleBook}
                      className="w-full bg-blue-600/10 border border-blue-500/20 text-blue-400 font-medium py-3 rounded-xl text-sm transition hover:bg-blue-600/15"
                    >
                      Request again
                    </button>
                  </div>
                )}

                {ride.bookingPreference === "review" && buttonState === "book" && (
                  <p className="text-gray-600 text-xs text-center mt-3 flex items-center justify-center gap-1">
                    <Info size={11} />
                    Driver will review your request
                  </p>
                )}
              </div>
            )}

            {/* Driver view — pending requests */}
            {isDriver && ride.requests?.filter((r) => r.status === "pending").length > 0 && (
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
                <h3 className="text-gray-500 text-xs font-medium uppercase tracking-widest mb-4">
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

// ── Request row (driver view) ─────────────────────────────────────────────────
const RequestRow = ({ req, rideId, token, onDone }) => {
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
        <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-300 text-xs font-bold">
          {req.user?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <p className="text-white text-sm font-medium">{req.user?.name || "User"}</p>
          <p className="text-gray-500 text-xs">{req.seatsRequested} seat{req.seatsRequested > 1 ? "s" : ""}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => handle("approve")}
          disabled={!!loading}
          className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center hover:bg-emerald-500/20 transition"
        >
          {loading === "approve" ? (
            <div className="w-3 h-3 border border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
          ) : (
            <CheckCircle size={14} />
          )}
        </button>
        <button
          onClick={() => handle("reject")}
          disabled={!!loading}
          className="w-8 h-8 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition"
        >
          {loading === "reject" ? (
            <div className="w-3 h-3 border border-red-400/30 border-t-red-400 rounded-full animate-spin" />
          ) : (
            <XCircle size={14} />
          )}
        </button>
      </div>
    </div>
  );
};

export default RideDetails;