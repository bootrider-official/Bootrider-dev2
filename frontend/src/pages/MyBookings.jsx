import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { BASE_URL } from "../utils/constants";

const MyBookings = () => {
  const { token } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/ride/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
      } catch (error) {
        console.error("❌ Error fetching bookings:", error);
        alert("Failed to load your bookings.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchBookings();
  }, [token]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">My Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-500 text-lg">You haven’t booked any rides yet.</p>
      ) : (
        <div className="grid gap-6">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {(b.from?.name || b.from) ?? "Unknown"} → {(b.to?.name || b.to) ?? "Unknown"}
              </h3>

              <p className="text-gray-600 mt-1">
                Date: {new Date(b.date).toLocaleDateString()} | Time: {b.time}
              </p>

              <p className="text-gray-600 mt-1">
                Seats Requested: {b.seatsRequested} | ₹{b.pricePerSeat} per seat
              </p>

              <p
                className={`mt-2 font-semibold ${
                  b.status === "pending"
                    ? "text-yellow-600"
                    : b.status === "approved"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                Status: {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
              </p>

              {/* Show driver details only if approved */}
              {b.status === "approved" && (
                <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-blue-800 font-medium">Driver Details</p>
                  <p>Name: {b.driver?.name || "N/A"}</p>
                  <p>Email: {b.driver?.email || "N/A"}</p>
                  <p>Phone: {b.driver?.phone || "N/A"}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
