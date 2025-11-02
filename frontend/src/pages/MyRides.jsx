import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Trash2, Loader2 } from "lucide-react";
import { BASE_URL } from "../utils/constants";

const MyRides = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchMyRides = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/ride/my-rides`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter only rides created by this driver
        const myRides = res.data.filter(
          (ride) => ride.driver?._id === user?._id
        );
        setRides(myRides);
      } catch (error) {
        console.error("Error fetching rides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRides();
  }, [token, user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ride?")) return;

    setDeletingId(id);
    try {
      await axios.delete(`${BASE_URL}/ride/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRides((prev) => prev.filter((ride) => ride._id !== id));
    } catch (error) {
      console.error("Error deleting ride:", error);
      alert("Failed to delete ride.");
    } finally {
      setDeletingId(null);
    }
  };

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
          {rides.map((ride) => (
            <div
              key={ride._id}
              className="bg-white shadow-lg rounded-2xl p-6 flex justify-between items-center border border-gray-200"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {ride.from} → {ride.to}
                </h3>
                <p className="text-gray-600 mt-1">
                  Date: {new Date(ride.date).toLocaleDateString()} | Time:{" "}
                  {ride.time}
                </p>
                <p className="text-gray-600 mt-1">
                  Seats Left: {ride.availableSeats} | ₹{ride.pricePerSeat}/seat
                </p>
              </div>

              <button
                onClick={() => handleDelete(ride._id)}
                disabled={deletingId === ride._id}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 disabled:opacity-60"
              >
                {deletingId === ride._id ? (
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
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRides;
