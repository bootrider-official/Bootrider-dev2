import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const CreateRide = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    from: null,
    to: null,
    stops: [null],
    date: "",
    time: "",
    availableSeats: "",
    pricePerSeat: "",
    vehicleModel: "",
    plateNumber: "",
  });

  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🌆 Fetch city list (India)
  useEffect(() => {
    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const res = await fetch(
          "https://countriesnow.space/api/v0.1/countries/cities",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country: "India" }),
          }
        );
        const data = await res.json();
        const formatted = data.data.map((city) => ({
          value: city,
          label: city,
        }));
        setCities(formatted);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  // ✅ Handle city dropdowns and inputs
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStopChange = (index, value) => {
    const updatedStops = [...formData.stops];
    updatedStops[index] = value;
    setFormData({ ...formData, stops: updatedStops });
  };

  const addStop = () => setFormData({ ...formData, stops: [...formData.stops, null] });
  const removeStop = (index) => {
    const updatedStops = formData.stops.filter((_, i) => i !== index);
    setFormData({ ...formData, stops: updatedStops });
  };

  // 🚀 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        `${BASE_URL}/ride/create`,
        {
          from: formData.from?.value,
          to: formData.to?.value,
          stops: formData.stops
            .filter((stop) => stop && stop.value)
            .map((s) => s.value),
          date: formData.date,
          time: formData.time,
          availableSeats: formData.availableSeats,
          pricePerSeat: formData.pricePerSeat,
          vehicleDetails: {
            model: formData.vehicleModel,
            plateNumber: formData.plateNumber,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("✅ Ride created successfully!");
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "❌ Failed to create ride. Try again."
      );
      setLoading(false);
    }
  };

  // 🚫 Prevent access if not verified
  if (user?.kycStatus !== "verified") {
    return (
      <div className="text-center mt-20 text-red-600 font-semibold">
        You must complete KYC verification to create rides.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8 mt-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
        🚗 Create a New Ride
      </h2>

      {message && (
        <div className="mb-4 text-center text-sm font-semibold text-gray-700">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* From / To */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">
              From
            </label>
            <Select
              options={cities}
              isLoading={loadingCities}
              value={formData.from}
              onChange={(value) => handleChange("from", value)}
              placeholder="Select departure city"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">
              To
            </label>
            <Select
              options={cities}
              isLoading={loadingCities}
              value={formData.to}
              onChange={(value) => handleChange("to", value)}
              placeholder="Select destination city"
            />
          </div>
        </div>

        {/* Stops */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-600">
            Intermediate Stops (optional)
          </label>
          {formData.stops.map((stop, index) => (
            <div key={index} className="flex gap-2 mb-2 items-center">
              <Select
                options={cities}
                isLoading={loadingCities}
                value={stop}
                onChange={(value) => handleStopChange(index, value)}
                placeholder={`Stop ${index + 1}`}
                className="flex-1"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeStop(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addStop}
            className="text-blue-600 font-medium mt-1"
          >
            + Add Stop
          </button>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
            required
            className="border p-3 rounded-lg w-full"
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={(e) => handleChange("time", e.target.value)}
            required
            className="border p-3 rounded-lg w-full"
          />
        </div>

        {/* Seats & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            name="availableSeats"
            placeholder="Available Seats"
            min="1"
            value={formData.availableSeats}
            onChange={(e) => handleChange("availableSeats", e.target.value)}
            required
            className="border p-3 rounded-lg w-full"
          />
          <input
            type="number"
            name="pricePerSeat"
            placeholder="Price per Seat (₹)"
            min="0"
            value={formData.pricePerSeat}
            onChange={(e) => handleChange("pricePerSeat", e.target.value)}
            required
            className="border p-3 rounded-lg w-full"
          />
        </div>

        {/* Vehicle Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="vehicleModel"
            placeholder="Vehicle Model"
            value={formData.vehicleModel}
            onChange={(e) => handleChange("vehicleModel", e.target.value)}
            className="border p-3 rounded-lg w-full"
          />
          <input
            type="text"
            name="plateNumber"
            placeholder="Plate Number"
            value={formData.plateNumber}
            onChange={(e) => handleChange("plateNumber", e.target.value)}
            className="border p-3 rounded-lg w-full"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {loading ? "Creating Ride..." : "Create Ride"}
        </button>
      </form>
    </div>
  );
};

export default CreateRide;
