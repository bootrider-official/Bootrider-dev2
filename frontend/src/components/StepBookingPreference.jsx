import React from "react";
import reviewImage from "../assets/review.png";

const StepBookingPreference = ({ data, onUpdate }) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
      {/* Left Image Section */}
      <div className="flex-1 flex justify-center">
        <img
          src={reviewImage}
          alt="Review Ride Requests"
          className="w-80 h-auto rounded-2xl shadow-lg"
        />
      </div>

      {/* Right Text Section */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">
          Enable Instant Booking for Your Passengers
        </h2>
        <p className="text-gray-600 mb-4">
          Let passengers book instantly for convenience, or manually review each
          request before it expires.
        </p>

        <div className="space-y-4 mt-6">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="bookingPreference"
              value="instant"
              checked={data.bookingPreference === "instant"}
              onChange={(e) => onUpdate({ bookingPreference: e.target.value })}
              className="w-5 h-5 text-blue-600"
            />
            <span className="text-gray-800 text-lg font-medium">
              Enable Instant Booking
            </span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="bookingPreference"
              value="review"
              checked={data.bookingPreference === "review"}
              onChange={(e) => onUpdate({ bookingPreference: e.target.value })}
              className="w-5 h-5 text-blue-600"
            />
            <span className="text-gray-800 text-lg font-medium">
              Review every request before it expires
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default StepBookingPreference;
