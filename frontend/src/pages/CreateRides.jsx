import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Check, MapPin, Navigation, StopCircle,
  Settings, Package, FileText, Car, Zap
} from "lucide-react";

import StepFromCity from "../components/StepFromCity";
import StepToCity from "../components/StepToCity";
import StepStops from "../components/StepStops";
import StepDetails from "../components/StepDetails";
import StepBookingPreference from "../components/StepBookingPreference";
import StepBootRegister from "../components/StepBootRegister";
import StepBootDetails from "../components/StepBootDetails";
import StepSummary from "../components/StepSummary";
import { BASE_URL } from "../utils/constants";
// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── Step definitions ─────────────────────────────────────────────────────────
const BASE_STEPS = [
  { id: "from", label: "Pickup", icon: <MapPin size={13} /> },
  { id: "to", label: "Destination", icon: <Navigation size={13} /> },
  { id: "stops", label: "Stops", icon: <StopCircle size={13} /> },
  { id: "details", label: "Details", icon: <Settings size={13} /> },
  { id: "booking", label: "Booking", icon: <Zap size={13} /> },
  { id: "boot", label: "Boot space", icon: <Package size={13} /> },
  { id: "bootdetails", label: "Boot details", icon: <Package size={13} />, conditional: true },
  { id: "summary", label: "Summary", icon: <FileText size={13} /> },
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
    pricePerSeat: 0,
    vehicleDetails: {},
    bookingPreference: "review",
    acceptsParcels: null,
    bootSpace: null,
    preferences: {
      smokingAllowed: false,
      petsAllowed: false,
      womenOnly: false,
      maxInBack: false,
      musicAllowed: true,
      chatPreference: "no_preference",
    },
    stopoverPrices: [],
  });

  // ── Visible steps based on acceptsParcels ────────────────────────────────
  const visibleSteps = BASE_STEPS.filter((s) => {
    if (s.id === "bootdetails") return rideData.acceptsParcels === true;
    return true;
  });

  const totalSteps = visibleSteps.length;
  const currentStepId = visibleSteps[step]?.id;
  const isLastStep = step === totalSteps - 1;
  const progressPercent = Math.round(((step + 1) / totalSteps) * 100);

  const handleUpdate = (data) => {
    setRideData((prev) => ({ ...prev, ...data }));
    setError("");
  };

  // ── Validation ───────────────────────────────────────────────────────────
  const validate = () => {
    switch (currentStepId) {
      case "from":
        if (!rideData.from) return "Please select your pickup location.";
        break;
      case "to":
        if (!rideData.to) return "Please select your destination.";
        break;
      case "details":
        if (!rideData.date) return "Please select a date.";
        if (!rideData.time) return "Please select a time.";
        if (!rideData.pricePerSeat && rideData.pricePerSeat !== 0)
          return "Please set a price per seat.";
        break;
      case "boot":
        if (rideData.acceptsParcels === null)
          return "Please choose whether to register boot space.";
        break;
      default:
        break;
    }
    return null;
  };

  const handleNext = () => {
    const err = validate();
    if (err) return setError(err);
    setError("");
    setStep((s) => Math.min(s + 1, totalSteps - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setError("");
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        preferences: rideData.preferences,
        stopoverPrices: rideData.stopoverPrices || [],
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

  // ── Render step ──────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (currentStepId) {
      case "from": return <StepFromCity data={rideData} onUpdate={handleUpdate} />;
      case "to": return <StepToCity data={rideData} onUpdate={handleUpdate} />;
      case "stops": return <StepStops data={rideData} onUpdate={handleUpdate} />;
      case "details": return <StepDetails data={rideData} onUpdate={handleUpdate} />;
      case "booking": return <StepBookingPreference data={rideData} onUpdate={handleUpdate} />;
      case "boot": return <StepBootRegister data={rideData} onUpdate={handleUpdate} />;
      case "bootdetails": return <StepBootDetails data={rideData} onUpdate={handleUpdate} />;
      case "summary": return <StepSummary data={rideData} onUpdate={handleUpdate} />;
      default: return null;
    }
  };

  // ── Steps that use split layout (no padding wrapper needed) ──────────────
  const isSplitStep = ["from", "to", "stops"].includes(currentStepId);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Top bar ── */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4">

          {/* Header row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Car size={18} className="text-blue-600" />
              <h1 className="text-slate-800 font-bold text-lg">
                Offer a ride
              </h1>
            </div>
            <span className="text-slate-400 text-sm">
              {step + 1} / {totalSteps}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Step dots — hidden on mobile */}
          <div className="hidden sm:flex items-center justify-between mt-3">
            {visibleSteps.map((s, i) => (
              <div key={s.id} className="flex flex-col items-center gap-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all text-xs ${i < step
                    ? "bg-blue-600 text-white"
                    : i === step
                      ? "bg-blue-100 border-2 border-blue-600 text-blue-600"
                      : "bg-slate-100 text-slate-400 border border-slate-200"
                  }`}>
                  {i < step ? <Check size={11} /> : s.icon}
                </div>
                <span className={`text-[10px] ${i === step ? "text-blue-600 font-medium" : "text-slate-400"
                  }`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Step content ── */}
      <div className="max-w-5xl mx-auto">
        {isSplitStep ? (
          /* Split layout — full width, no card wrapper */
          <div className="bg-white border-b border-slate-200 min-h-[480px]">
            {renderStep()}
          </div>
        ) : (
          /* Normal layout — centered card */
          <div className="px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 min-h-[400px]">
              {renderStep()}
            </div>
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <div className="sticky bottom-0 bg-white border-t border-slate-200 shadow-lg z-40">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="max-w-2xl mx-auto flex gap-3">
            {step > 0 && (
              <button
                onClick={handleBack}
                className="flex-1 py-3.5 rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition"
              >
                Back
              </button>
            )}

            {error && (
              <p className="text-red-500 text-xs text-center absolute -top-6 left-1/2 -translate-x-1/2 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                {error}
              </p>
            )}

            {isLastStep ? (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-sm text-sm"
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
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition text-sm shadow-sm"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRides;