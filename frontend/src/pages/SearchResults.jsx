import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const from = queryParams.get("from");
  const to = queryParams.get("to");
  const date = queryParams.get("date");
  const passengers = queryParams.get("passengers");

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRides = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(`${BASE_URL}/ride/search`, {
          params: { from, to, date },
        });

        // Filter rides with available seats > 0
        const validRides = response.data.filter((r) => r.availableSeats > 0);
        setRides(validRides);
      } catch (err) {
        console.error("Error fetching rides:", err);
        setError(err.response?.data?.message || "Failed to fetch rides.");
      } finally {
        setLoading(false);
      }
    };

    if (from && to) fetchRides();
  }, [from, to, date, passengers]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 py-12 px-6">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-700 mb-2">Available Rides</h1>
        <p className="text-gray-600">
          Showing results from{" "}
          <span className="font-semibold text-blue-700">{from}</span> →{" "}
          <span className="font-semibold text-blue-700">{to}</span>{" "}
          {date && (
            <>
              on <span className="font-semibold">{date}</span>
            </>
          )}{" "}
          for <span className="font-semibold">{passengers}</span> passenger(s)
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-700 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 mt-16 font-medium">
          {error}
        </div>
      ) : rides.length === 0 ? (
        <div className="text-center text-gray-600 mt-16">
          <p className="text-lg">No rides found 😔</p>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {rides.map((ride) => (
            <div
              key={ride._id}
              onClick={() => navigate(`/ride/${ride._id}`)}
              className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-blue-700">
                  {ride.driver?.name || "Unknown Driver"}
                </h3>
              </div>
              <p className="text-gray-600 mb-1">
                From: <span className="font-semibold">{ride.from}</span>
              </p>
              <p className="text-gray-600 mb-1">
                To: <span className="font-semibold">{ride.to}</span>
              </p>
              {ride.stops?.length > 0 && (
                <p className="text-gray-600 mb-1 text-sm">
                  Stops: {ride.stops.join(", ")}
                </p>
              )}
              <p className="text-gray-600 mb-1">
                Date:{" "}
                <span className="font-semibold">
                  {new Date(ride.date).toLocaleDateString()}
                </span>
              </p>
              <p className="text-gray-600 mb-1">
                Time: <span className="font-semibold">{ride.time}</span>
              </p>
              <p className="text-gray-600 mb-1">
                Seats:{" "}
                <span className="font-semibold">{ride.availableSeats}</span>
              </p>
              <p className="text-2xl font-bold text-blue-700 mt-2">
                ₹{ride.pricePerSeat}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
