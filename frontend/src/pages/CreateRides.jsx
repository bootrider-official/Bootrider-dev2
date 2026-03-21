// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { BASE_URL } from "../utils/constants";
// import { useNavigate } from "react-router-dom";
// import Select from "react-select";

// const CreateRide = () => {
//   const { user, token } = useSelector((state) => state.auth);
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     from: null,
//     to: null,
//     stops: [null],
//     date: "",
//     time: "",
//     availableSeats: "",
//     pricePerSeat: "",
//     vehicleModel: "",
//     plateNumber: "",
//   });

//   const [cities, setCities] = useState([]);
//   const [loadingCities, setLoadingCities] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   // 🌆 Fetch city list (India)
//   useEffect(() => {
//     const fetchCities = async () => {
//       setLoadingCities(true);
//       try {
//         const res = await fetch(
//           "https://countriesnow.space/api/v0.1/countries/cities",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ country: "India" }),
//           }
//         );
//         const data = await res.json();
//         const formatted = data.data.map((city) => ({
//           value: city,
//           label: city,
//         }));
//         setCities(formatted);
//       } catch (error) {
//         console.error("Error fetching cities:", error);
//       } finally {
//         setLoadingCities(false);
//       }
//     };

//     fetchCities();
//   }, []);

//   // ✅ Handle city dropdowns and inputs
//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleStopChange = (index, value) => {
//     const updatedStops = [...formData.stops];
//     updatedStops[index] = value;
//     setFormData({ ...formData, stops: updatedStops });
//   };

//   const addStop = () => setFormData({ ...formData, stops: [...formData.stops, null] });
//   const removeStop = (index) => {
//     const updatedStops = formData.stops.filter((_, i) => i !== index);
//     setFormData({ ...formData, stops: updatedStops });
//   };

//   // 🚀 Submit handler
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       const response = await axios.post(
//         `${BASE_URL}/ride/create`,
//         {
//           from: formData.from?.value,
//           to: formData.to?.value,
//           stops: formData.stops
//             .filter((stop) => stop && stop.value)
//             .map((s) => s.value),
//           date: formData.date,
//           time: formData.time,
//           availableSeats: formData.availableSeats,
//           pricePerSeat: formData.pricePerSeat,
//           vehicleDetails: {
//             model: formData.vehicleModel,
//             plateNumber: formData.plateNumber,
//           },
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setMessage("✅ Ride created successfully!");
//       setLoading(false);
//       navigate("/");
//     } catch (error) {
//       console.error(error);
//       setMessage(
//         error.response?.data?.message || "❌ Failed to create ride. Try again."
//       );
//       setLoading(false);
//     }
//   };

//   // 🚫 Prevent access if not verified
//   if (user?.kycStatus !== "verified") {
//     return (
//       <div className="text-center mt-20 text-red-600 font-semibold">
//         You must complete KYC verification to create rides.
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8 mt-10">
//       <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
//         🚗 Create a New Ride
//       </h2>

//       {message && (
//         <div className="mb-4 text-center text-sm font-semibold text-gray-700">
//           {message}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* From / To */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium mb-2 text-gray-600">
//               From
//             </label>
//             <Select
//               options={cities}
//               isLoading={loadingCities}
//               value={formData.from}
//               onChange={(value) => handleChange("from", value)}
//               placeholder="Select departure city"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2 text-gray-600">
//               To
//             </label>
//             <Select
//               options={cities}
//               isLoading={loadingCities}
//               value={formData.to}
//               onChange={(value) => handleChange("to", value)}
//               placeholder="Select destination city"
//             />
//           </div>
//         </div>

//         {/* Stops */}
//         <div>
//           <label className="block text-sm font-medium mb-2 text-gray-600">
//             Intermediate Stops (optional)
//           </label>
//           {formData.stops.map((stop, index) => (
//             <div key={index} className="flex gap-2 mb-2 items-center">
//               <Select
//                 options={cities}
//                 isLoading={loadingCities}
//                 value={stop}
//                 onChange={(value) => handleStopChange(index, value)}
//                 placeholder={`Stop ${index + 1}`}
//                 className="flex-1"
//               />
//               {index > 0 && (
//                 <button
//                   type="button"
//                   onClick={() => removeStop(index)}
//                   className="bg-red-500 text-white px-3 py-1 rounded-lg"
//                 >
//                   ✕
//                 </button>
//               )}
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={addStop}
//             className="text-blue-600 font-medium mt-1"
//           >
//             + Add Stop
//           </button>
//         </div>

//         {/* Date & Time */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input
//             type="date"
//             name="date"
//             value={formData.date}
//             onChange={(e) => handleChange("date", e.target.value)}
//             required
//             className="border p-3 rounded-lg w-full"
//           />
//           <input
//             type="time"
//             name="time"
//             value={formData.time}
//             onChange={(e) => handleChange("time", e.target.value)}
//             required
//             className="border p-3 rounded-lg w-full"
//           />
//         </div>

//         {/* Seats & Price */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input
//             type="number"
//             name="availableSeats"
//             placeholder="Available Seats"
//             min="1"
//             value={formData.availableSeats}
//             onChange={(e) => handleChange("availableSeats", e.target.value)}
//             required
//             className="border p-3 rounded-lg w-full"
//           />
//           <input
//             type="number"
//             name="pricePerSeat"
//             placeholder="Price per Seat (₹)"
//             min="0"
//             value={formData.pricePerSeat}
//             onChange={(e) => handleChange("pricePerSeat", e.target.value)}
//             required
//             className="border p-3 rounded-lg w-full"
//           />
//         </div>

//         {/* Vehicle Details */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input
//             type="text"
//             name="vehicleModel"
//             placeholder="Vehicle Model"
//             value={formData.vehicleModel}
//             onChange={(e) => handleChange("vehicleModel", e.target.value)}
//             className="border p-3 rounded-lg w-full"
//           />
//           <input
//             type="text"
//             name="plateNumber"
//             placeholder="Plate Number"
//             value={formData.plateNumber}
//             onChange={(e) => handleChange("plateNumber", e.target.value)}
//             className="border p-3 rounded-lg w-full"
//           />
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
//         >
//           {loading ? "Creating Ride..." : "Create Ride"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateRide;



// // ✅ src/pages/CreateRide.jsx
// import React, { useState } from "react";
// import axios from "axios";
// import StepFromCity from "../components/StepFromCity";
// import StepToCity from "../components/StepToCity";
// import StepStops from "../components/StepStops";
// import StepDetails from "../components/StepDetails";
// import StepSummary from "../components/StepSummary";
// import StepNavigation from "../components/StepNavigation";

// const CreateRide = () => {
//   const [step, setStep] = useState(0);
//   const [rideData, setRideData] = useState({});

//   const steps = [
//     { label: "Pickup", component: StepFromCity },
//     { label: "Destination", component: StepToCity },
//     { label: "Stops", component: StepStops },
//     { label: "Details", component: StepDetails },
//     { label: "Summary", component: StepSummary },
//   ];

//   const CurrentStep = steps[step].component;

//   const handleNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
//   const handleBack = () => setStep((s) => Math.max(s - 1, 0));

//   // const handleSubmit = async () => {
//   //   try {
//   //     await axios.post("http://localhost:5000/api/ride/create", rideData);
//   //     alert("✅ Ride created successfully!");
//   //   } catch (err) {
//   //     console.error(err);
//   //     alert("❌ Failed to create ride");
//   //   }
//   // };

//   const [loading, setLoading] = useState(false);
// const [message, setMessage] = useState("");

// const handleSubmit = async (e) => {
//   e.preventDefault(); // prevent reload
//   setLoading(true);
//   setMessage("");

//   try {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setMessage("⚠️ Please log in first.");
//       setLoading(false);
//       return;
//     }

//     // ✅ Prepare data payload cleanly
//     const payload = {
//       from: formData.from?.value,
//       to: formData.to?.value,
//       stops: formData.stops
//         ?.filter((stop) => stop && stop.value)
//         .map((s) => s.value),
//       date: formData.date,
//       time: formData.time,
//       availableSeats: formData.availableSeats,
//       pricePerSeat: formData.pricePerSeat,
//       vehicleDetails: {
//         model: formData.vehicleModel,
//         plateNumber: formData.plateNumber,
//       },
//     };

//     // ✅ Send POST request with Authorization header
//     const response = await axios.post(
//       `${BASE_URL}/ride/create`,
//       payload,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     // ✅ Success handling
//     setMessage("✅ Ride created successfully!");
//     setLoading(false);
//     navigate("/"); // redirect home or dashboard
//   } catch (error) {
//     console.error("❌ Ride creation error:", error);
//     setMessage(
//       error.response?.data?.message ||
//         "❌ Failed to create ride. Try again."
//     );
//     setLoading(false);
//   }
// };


//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
//       <div className="mb-6 flex items-center justify-between border-b pb-3">
//         <h1 className="text-2xl font-bold text-blue-600">Create New Ride</h1>
//         <p className="text-gray-500">Step {step + 1} of {steps.length}</p>
//       </div>

//       <CurrentStep data={rideData} onUpdate={(data) => setRideData({ ...rideData, ...data })} />

//       <div className="flex justify-between mt-6">
//         {step > 0 && (
//           <button
//             onClick={handleBack}
//             className="bg-gray-500 text-white px-4 py-2 rounded-lg"
//           >
//             Back
//           </button>
//         )}

//         {step < steps.length - 1 ? (
//           <button
//             onClick={handleNext}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg"
//           >
//             Next
//           </button>
//         ) : (
//           <button
//             onClick={handleSubmit}
//             className="bg-green-600 text-white px-4 py-2 rounded-lg"
//           >
//             Confirm & Publish
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CreateRide;










// // ✅ src/pages/CreateRide.jsx
// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import StepBookingPreference from "../components/StepBookingPreference";
// import StepFromCity from "../components/StepFromCity";
// import StepToCity from "../components/StepToCity";
// import StepStops from "../components/StepStops";
// import StepDetails from "../components/StepDetails";
// import StepSummary from "../components/StepSummary";
// import StepNavigation from "../components/StepNavigation";

// const BASE_URL = "http://localhost:5000/api";

// const CreateRide = () => {
//   const [step, setStep] = useState(0);

//   const [rideData, setRideData] = useState({
//   from: null,
//   to: null,
//   stops: [],
//   date: "",
//   time: "",
//   availableSeats: 1,
//   pricePerSeat: "",
//   vehicleDetails: {},
//   bookingPreference: "review", // ✅ default value
// });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const steps = [
//     { label: "Pickup", component: StepFromCity },
//     { label: "Destination", component: StepToCity },
//     { label: "Stops", component: StepStops },
//     { label: "Details", component: StepDetails },
//     { label: "Booking Preference", component: StepBookingPreference }, 
//     { label: "Summary", component: StepSummary },
//   ];

//   const CurrentStep = steps[step].component;

//   const handleNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
//   const handleBack = () => setStep((s) => Math.max(s - 1, 0));

//   // ✅ Submit handler
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setMessage("⚠️ Please log in first.");
//         setLoading(false);
//         return;
//       }

//       // ✅ Clean payload format as backend expects
//       const payload = {
//         from: rideData.from,
//         to: rideData.to,
//         stops: rideData.stops || [],
//         date: rideData.date,
//         time: rideData.time,
//         availableSeats: rideData.availableSeats,
//         pricePerSeat: rideData.pricePerSeat,
//         vehicleDetails: rideData.vehicleDetails,
//         bookingPreference: rideData.bookingPreference,
//       };

//       const response = await axios.post(`${BASE_URL}/ride/create`, payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log("✅ Ride created:", response.data);
//       setMessage("✅ Ride created successfully!");
//       setLoading(false);
//       navigate("/"); // redirect after success
//     } catch (error) {
//       console.error("❌ Ride creation error:", error);
//       setMessage(
//         error.response?.data?.message ||
//           "❌ Failed to create ride. Try again."
//       );
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
//       <div className="mb-6 flex items-center justify-between border-b pb-3">
//         <h1 className="text-2xl font-bold text-blue-600">Create New Ride</h1>
//         <p className="text-gray-500">
//           Step {step + 1} of {steps.length}
//         </p>
//       </div>

//       <CurrentStep
//         data={rideData}
//         onUpdate={(data) => setRideData({ ...rideData, ...data })}
//       />

//       {message && (
//         <p
//           className={`mt-4 text-center ${
//             message.includes("✅") ? "text-green-600" : "text-red-600"
//           }`}
//         >
//           {message}
//         </p>
//       )}

//       <div className="flex justify-between mt-6">
//         {step > 0 && (
//           <button
//             onClick={handleBack}
//             className="bg-gray-500 text-white px-4 py-2 rounded-lg"
//           >
//             Back
//           </button>
//         )}

//         {step < steps.length - 1 ? (
//           <button
//             onClick={handleNext}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg"
//           >
//             Next
//           </button>
//         ) : (
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className={`${
//               loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
//             } text-white px-4 py-2 rounded-lg`}
//           >
//             {loading ? "Publishing..." : "Confirm & Publish"}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CreateRide;




import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Check, Car, MapPin, Navigation,
  StopCircle, Settings, Package, FileText
} from "lucide-react";

import StepFromCity from "../components/StepFromCity";
import StepToCity from "../components/StepToCity";
import StepStops from "../components/StepStops";
import StepDetails from "../components/StepDetails";
import StepBookingPreference from "../components/StepBookingPreference";
import StepBootRegister from "../components/StepBootRegister";
import StepBootDetails from "../components/StepBootDetails";
import StepSummary from "../components/StepSummary";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── Step definitions ─────────────────────────────────────────────────────────
const BASE_STEPS = [
  { id: "from", label: "Pickup", icon: <MapPin size={14} /> },
  { id: "to", label: "Destination", icon: <Navigation size={14} /> },
  { id: "stops", label: "Stops", icon: <StopCircle size={14} /> },
  { id: "details", label: "Details", icon: <Settings size={14} /> },
  { id: "booking", label: "Preference", icon: <Car size={14} /> },
  { id: "boot", label: "Boot Space", icon: <Package size={14} /> },
  { id: "bootdetails", label: "Boot Details", icon: <Package size={14} />, conditional: true },
  { id: "summary", label: "Summary", icon: <FileText size={14} /> },
];

const CreateRides = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [rideData, setRideData] = useState({
    from: null,
    to: null,
    stops: [],
    date: "",
    time: "",
    availableSeats: 1,
    pricePerSeat: "",
    vehicleDetails: {},
    bookingPreference: "review",
    acceptsParcels: null,
    bootSpace: null,
  });

  // ── Build visible steps based on acceptsParcels ───────────────────────────
  const visibleSteps = BASE_STEPS.filter((s) => {
    if (s.id === "bootdetails") return rideData.acceptsParcels === true;
    return true;
  });

  const totalSteps = visibleSteps.length;
  const currentStepId = visibleSteps[step]?.id;

  const handleUpdate = (data) => {
    setRideData((prev) => ({ ...prev, ...data }));
    setError("");
  };

  const handleNext = () => {
    // Validate current step
    if (currentStepId === "from" && !rideData.from) {
      return setError("Please select a pickup location.");
    }
    if (currentStepId === "to" && !rideData.to) {
      return setError("Please select a destination.");
    }
    if (currentStepId === "details") {
      if (!rideData.date) return setError("Please select a date.");
      if (!rideData.time) return setError("Please select a time.");
      if (!rideData.pricePerSeat) return setError("Please enter price per seat.");
    }
    if (currentStepId === "boot" && rideData.acceptsParcels === null) {
      return setError("Please choose an option.");
    }

    setError("");
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  };

  const handleBack = () => {
    setError("");
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const payload = {
        from: rideData.from,
        to: rideData.to,
        stops: rideData.stops || [],
        date: rideData.date,
        time: rideData.time,
        availableSeats: rideData.availableSeats,
        pricePerSeat: rideData.pricePerSeat,
        vehicleDetails: rideData.vehicleDetails,
        bookingPreference: rideData.bookingPreference,
        acceptsParcels: rideData.acceptsParcels || false,
        bootSpace: rideData.acceptsParcels ? rideData.bootSpace : null,
      };

      await axios.post(`${BASE_URL}/ride/create`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/my-rides");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ride. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Render current step component ─────────────────────────────────────────
  const renderStep = () => {
    switch (currentStepId) {
      case "from":
        return <StepFromCity data={rideData} onUpdate={handleUpdate} />;
      case "to":
        return <StepToCity data={rideData} onUpdate={handleUpdate} />;
      case "stops":
        return <StepStops data={rideData} onUpdate={handleUpdate} />;
      case "details":
        return <StepDetails data={rideData} onUpdate={handleUpdate} />;
      case "booking":
        return <StepBookingPreference data={rideData} onUpdate={handleUpdate} />;
      case "boot":
        return <StepBootRegister data={rideData} onUpdate={handleUpdate} />;
      case "bootdetails":
        return <StepBootDetails data={rideData} onUpdate={handleUpdate} />;
      case "summary":
        return <StepSummary data={rideData} onUpdate={handleUpdate} />;
      default:
        return null;
    }
  };

  const isLastStep = step === totalSteps - 1;
  const progressPercent = ((step + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Car size={18} className="text-blue-400" />
            <h1 className="text-white font-bold text-xl">List a new ride</h1>
          </div>
          <p className="text-gray-500 text-sm">
            Step {step + 1} of {totalSteps} —{" "}
            <span className="text-gray-400">
              {visibleSteps[step]?.label}
            </span>
          </p>
        </div>

        {/* ── Progress bar ── */}
        <div className="mb-8">
          <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Step dots */}
          <div className="flex items-center justify-between mt-3">
            {visibleSteps.map((s, i) => (
              <div key={s.id} className="flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${i < step
                      ? "bg-blue-600"
                      : i === step
                        ? "bg-blue-600/20 border border-blue-500/40 ring-2 ring-blue-500/20"
                        : "bg-white/[0.04] border border-white/[0.08]"
                    }`}
                >
                  {i < step ? (
                    <Check size={12} className="text-white" />
                  ) : (
                    <span
                      className={`${i === step ? "text-blue-400" : "text-gray-600"
                        }`}
                    >
                      {s.icon}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] hidden sm:block ${i === step
                      ? "text-blue-400 font-medium"
                      : i < step
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Step card ── */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 mb-6 min-h-[360px]">
          {renderStep()}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* ── Navigation ── */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={handleBack}
              className="flex-1 py-3.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 text-sm font-medium transition"
            >
              Back
            </button>
          )}

          {isLastStep ? (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Check size={16} />
                  Publish ride
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition text-sm shadow-lg shadow-blue-500/20"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateRides;