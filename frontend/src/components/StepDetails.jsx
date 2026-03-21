import React, { useState } from "react";
import {
  Minus, Plus, Users, IndianRupee,
  Cigarette, PawPrint, Music, MessageCircle,
  UserCheck, ChevronDown, ChevronUp, Info
} from "lucide-react";

const StepDetails = ({ data, onUpdate }) => {
  const [showPreferences, setShowPreferences] = useState(false);

  const prefs = data.preferences || {
    smokingAllowed: false,
    petsAllowed: false,
    womenOnly: false,
    maxInBack: false,
    musicAllowed: true,
    chatPreference: "no_preference",
  };

  const updatePref = (key, value) => {
    onUpdate({
      preferences: { ...prefs, [key]: value },
    });
  };

  const adjustSeats = (delta) => {
    const current = data.availableSeats || 1;
    const next = Math.min(8, Math.max(1, current + delta));
    onUpdate({ availableSeats: next });
  };

  const adjustPrice = (delta) => {
    const current = parseInt(data.pricePerSeat) || 0;
    const next = Math.max(0, current + delta);
    onUpdate({ pricePerSeat: next });
  };

  return (
    <div className="space-y-8">

      {/* ── Date & Time ── */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-5">
          When are you leaving?
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Date
            </label>
            <input
              type="date"
              value={data.date || ""}
              onChange={(e) => onUpdate({ date: e.target.value })}
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-blue-400 transition bg-white [color-scheme:light]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Time
            </label>
            <input
              type="time"
              value={data.time || ""}
              onChange={(e) => onUpdate({ time: e.target.value })}
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-blue-400 transition bg-white [color-scheme:light]"
            />
          </div>
        </div>
      </div>

      {/* ── Seats counter ── */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          How many passengers can you take?
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          Think about comfort — don't forget you need space for luggage too.
        </p>

        <div className="flex items-center justify-center gap-8">
          <button
            type="button"
            onClick={() => adjustSeats(-1)}
            disabled={(data.availableSeats || 1) <= 1}
            className="w-14 h-14 rounded-full border-2 border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <Minus size={20} />
          </button>

          <span className="text-7xl font-bold text-slate-800 w-20 text-center">
            {data.availableSeats || 1}
          </span>

          <button
            type="button"
            onClick={() => adjustSeats(1)}
            disabled={(data.availableSeats || 1) >= 8}
            className="w-14 h-14 rounded-full border-2 border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* ── Price per seat ── */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          Set your price per seat
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          Set a fair price — carpooling is about sharing costs, not making profit.
        </p>

        <div className="flex items-center justify-center gap-8 mb-4">
          <button
            type="button"
            onClick={() => adjustPrice(-10)}
            disabled={(parseInt(data.pricePerSeat) || 0) <= 0}
            className="w-14 h-14 rounded-full border-2 border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <Minus size={20} />
          </button>

          <div className="text-center">
            <div className="flex items-center gap-1 justify-center">
              <span className="text-4xl font-bold text-slate-800">₹</span>
              <span className="text-7xl font-bold text-slate-800">
                {data.pricePerSeat || 0}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => adjustPrice(10)}
            className="w-14 h-14 rounded-full border-2 border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-50 transition"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Manual price input */}
        <div className="flex justify-center">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
              ₹
            </span>
            <input
              type="number"
              min="0"
              value={data.pricePerSeat || ""}
              onChange={(e) => onUpdate({ pricePerSeat: parseInt(e.target.value) || 0 })}
              placeholder="Type exact amount"
              className="pl-8 pr-4 py-2.5 border-2 border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:border-blue-400 transition w-48 text-center"
            />
          </div>
        </div>

        <p className="text-center text-slate-400 text-xs mt-3 flex items-center justify-center gap-1">
          <Info size={12} />
          This is a max price limit to maintain the spirit of carpooling
        </p>
      </div>

      {/* ── Vehicle details ── */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-5">
          Your vehicle
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { field: "vehicleDetails.type", label: "Vehicle type", placeholder: "e.g. Sedan, SUV" },
            { field: "vehicleDetails.model", label: "Model", placeholder: "e.g. Swift Dzire" },
            { field: "vehicleDetails.color", label: "Color", placeholder: "e.g. White" },
            { field: "vehicleDetails.plateNumber", label: "Plate number", placeholder: "e.g. DL 01 AB 1234" },
          ].map((item) => (
            <div key={item.field}>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                {item.label}
              </label>
              <input
                type="text"
                placeholder={item.placeholder}
                value={
                  item.field.includes(".")
                    ? (data.vehicleDetails?.[item.field.split(".")[1]] || "")
                    : (data[item.field] || "")
                }
                onChange={(e) => {
                  if (item.field.includes(".")) {
                    onUpdate({
                      vehicleDetails: {
                        ...data.vehicleDetails,
                        [item.field.split(".")[1]]: e.target.value,
                      },
                    });
                  } else {
                    onUpdate({ [item.field]: e.target.value });
                  }
                }}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-blue-400 transition"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Passenger preferences (collapsible) ── */}
      <div className="border-2 border-slate-100 rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowPreferences(!showPreferences)}
          className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-slate-100 transition"
        >
          <div className="flex items-center gap-3">
            <Users size={18} className="text-blue-600" />
            <span className="font-semibold text-slate-700">
              Passenger options
            </span>
            <span className="text-slate-400 text-sm">
              (optional)
            </span>
          </div>
          {showPreferences
            ? <ChevronUp size={18} className="text-slate-400" />
            : <ChevronDown size={18} className="text-slate-400" />
          }
        </button>

        {showPreferences && (
          <div className="px-5 py-5 space-y-5 bg-white">

            {/* Toggle preferences */}
            {[
              {
                key: "maxInBack",
                icon: <Users size={16} className="text-slate-500" />,
                label: "Max. 2 in the back",
                sub: "Keep the middle seat empty for comfort",
              },
              {
                key: "smokingAllowed",
                icon: <Cigarette size={16} className="text-slate-500" />,
                label: "Smoking allowed",
                sub: "Allow passengers to smoke during the ride",
              },
              {
                key: "petsAllowed",
                icon: <PawPrint size={16} className="text-slate-500" />,
                label: "Pets allowed",
                sub: "Passengers can bring their pets",
              },
              {
                key: "womenOnly",
                icon: <UserCheck size={16} className="text-slate-500" />,
                label: "Women only",
                sub: "Make your ride visible only to women",
              },
              {
                key: "musicAllowed",
                icon: <Music size={16} className="text-slate-500" />,
                label: "Music allowed",
                sub: "Play music during the trip",
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-slate-700 text-sm font-medium">
                      {item.label}
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">{item.sub}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updatePref(item.key, !prefs[item.key])}
                  className={`relative w-11 h-6 rounded-full transition-all ${prefs[item.key] ? "bg-blue-600" : "bg-slate-200"
                    }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${prefs[item.key] ? "left-6" : "left-1"
                    }`} />
                </button>
              </div>
            ))}

            {/* Chat preference */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle size={16} className="text-slate-500" />
                <p className="text-slate-700 text-sm font-medium">
                  Chat preference
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "quiet", label: "Quiet ride" },
                  { value: "chatty", label: "I love to chat" },
                  { value: "no_preference", label: "No preference" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updatePref("chatPreference", opt.value)}
                    className={`py-2.5 px-3 rounded-xl border-2 text-xs font-medium transition ${prefs.chatPreference === opt.value
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepDetails;