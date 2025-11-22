// ✅ src/components/StepDetails.jsx
import React, { useState, useEffect } from "react";

const StepDetails = ({ data, onUpdate }) => {
  const [details, setDetails] = useState({
    date: data.date || "",
    time: data.time || "",
    availableSeats: data.availableSeats || 1,
    pricePerSeat: data.pricePerSeat || "",
  });

  useEffect(() => {
    onUpdate(details);
  }, [details]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Ride Details</h2>
      <div className="grid grid-cols-2 gap-3">
        <input
          type="date"
          name="date"
          value={details.date}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
        />
        <input
          type="time"
          name="time"
          value={details.time}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
        />
        <input
          type="number"
          name="availableSeats"
          value={details.availableSeats}
          onChange={handleChange}
          placeholder="Seats"
          className="border rounded-lg px-3 py-2"
        />
        <input
          type="number"
          name="pricePerSeat"
          value={details.pricePerSeat}
          onChange={handleChange}
          placeholder="Price per seat"
          className="border rounded-lg px-3 py-2"
        />
      </div>
    </div>
  );
};

export default StepDetails;
