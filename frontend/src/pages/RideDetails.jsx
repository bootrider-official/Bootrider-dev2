import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const RideDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRide = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/ride/${id}`);
        setRide(res.data);
      } catch (err) {
        console.error("Error fetching ride details:", err);
        setError(err.response?.data?.message || "Failed to load ride details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRide();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-700 border-t-transparent"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 mt-20 font-medium">
        {error}
      </div>
    );

  if (!ride)
    return (
      <div className="text-center mt-20 text-gray-600">
        Ride not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 py-12 px-6 flex justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-3xl w-full border border-gray-100">
        <h1 className="text-3xl font-bold text-blue-700 mb-4 text-center">
          Ride Details
        </h1>

        <div className="border-t border-gray-200 my-6"></div>

        <div className="space-y-3 text-gray-700">
          <p>
            <span className="font-semibold">From:</span> {ride.from}
          </p>
          <p>
            <span className="font-semibold">To:</span> {ride.to}
          </p>
          {ride.stops?.length > 0 && (
            <p>
              <span className="font-semibold">Stops:</span>{" "}
              {ride.stops.join(", ")}
            </p>
          )}
          <p>
            <span className="font-semibold">Date:</span>{" "}
            {new Date(ride.date).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Time:</span> {ride.time}
          </p>
          <p>
            <span className="font-semibold">Available Seats:</span>{" "}
            {ride.availableSeats}
          </p>
          <p>
            <span className="font-semibold">Price per Seat:</span> ₹
            {ride.pricePerSeat}
          </p>
          <p>
            <span className="font-semibold">Status:</span> {ride.status}
          </p>
        </div>

        <div className="border-t border-gray-200 my-6"></div>

        <div>
          <h2 className="text-2xl font-semibold text-blue-700 mb-3">
            Driver Information
          </h2>
          <div className="flex items-center gap-4">
            {ride.driver?.photo && (
              <img
                src={ride.driver.photo}
                alt={ride.driver.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-300"
              />
            )}
            <div>
              <p className="text-lg font-semibold text-gray-800">
                {ride.driver?.name || "Unknown Driver"}
              </p>
              
              <p
                className={`mt-1 text-sm ${
                  ride.driver?.isVerified ? "text-green-600" : "text-red-500"
                }`}
              >
                {/* {ride.driver?.isVerified ? "✔ Verified Driver" : "❌ Not Verified"} */}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate(`/book-ride/${ride._id}`)}
          className="w-full mt-8 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold shadow-md transition-all hover:scale-105"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default RideDetails;
