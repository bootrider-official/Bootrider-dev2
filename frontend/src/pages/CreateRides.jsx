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










// ✅ src/pages/CreateRide.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StepBookingPreference from "../components/StepBookingPreference";
import StepFromCity from "../components/StepFromCity";
import StepToCity from "../components/StepToCity";
import StepStops from "../components/StepStops";
import StepDetails from "../components/StepDetails";
import StepSummary from "../components/StepSummary";
import StepNavigation from "../components/StepNavigation";

const BASE_URL = "http://localhost:5000/api";

const CreateRide = () => {
  const [step, setStep] = useState(0);
  
  const [rideData, setRideData] = useState({
  from: null,
  to: null,
  stops: [],
  date: "",
  time: "",
  availableSeats: 1,
  pricePerSeat: "",
  vehicleDetails: {},
  bookingPreference: "review", // ✅ default value
});

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const steps = [
    { label: "Pickup", component: StepFromCity },
    { label: "Destination", component: StepToCity },
    { label: "Stops", component: StepStops },
    { label: "Details", component: StepDetails },
    { label: "Booking Preference", component: StepBookingPreference }, 
    { label: "Summary", component: StepSummary },
  ];

  const CurrentStep = steps[step].component;

  const handleNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("⚠️ Please log in first.");
        setLoading(false);
        return;
      }

      // ✅ Clean payload format as backend expects
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
      };

      const response = await axios.post(`${BASE_URL}/ride/create`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Ride created:", response.data);
      setMessage("✅ Ride created successfully!");
      setLoading(false);
      navigate("/"); // redirect after success
    } catch (error) {
      console.error("❌ Ride creation error:", error);
      setMessage(
        error.response?.data?.message ||
          "❌ Failed to create ride. Try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
      <div className="mb-6 flex items-center justify-between border-b pb-3">
        <h1 className="text-2xl font-bold text-blue-600">Create New Ride</h1>
        <p className="text-gray-500">
          Step {step + 1} of {steps.length}
        </p>
      </div>

      <CurrentStep
        data={rideData}
        onUpdate={(data) => setRideData({ ...rideData, ...data })}
      />

      {message && (
        <p
          className={`mt-4 text-center ${
            message.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <div className="flex justify-between mt-6">
        {step > 0 && (
          <button
            onClick={handleBack}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Back
          </button>
        )}

        {step < steps.length - 1 ? (
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            } text-white px-4 py-2 rounded-lg`}
          >
            {loading ? "Publishing..." : "Confirm & Publish"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateRide;
