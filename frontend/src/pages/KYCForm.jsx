import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { loginSuccess } from "../redux/authSlice";
import {
  ShieldCheck, Car, FileText, CheckCircle,
  AlertCircle, ArrowRight, Eye, Loader, X
} from "lucide-react";

const KYCForm = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isTransporter = user?.role === "transporter";

  // ── Steps depend on role ─────────────────────────────────────────────────
  const steps = isTransporter
    ? ["vehicle_details", "vehicle_photo", "aadhaar"]
    : ["aadhaar"];

  const stepLabels = {
    vehicle_details: "Vehicle details",
    vehicle_photo: "Vehicle photo",
    aadhaar: "Aadhaar verification",
  };

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [verifyingAadhaar, setVerifyingAadhaar] = useState(false);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [aadhaarError, setAadhaarError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    vehicleType: "",
    registrationNo: "",
    vehiclePhoto: null,
    aadhaarPhoto: null,
  });

  const [previews, setPreviews] = useState({
    vehiclePhoto: null,
    aadhaarPhoto: null,
  });

  const vehiclePhotoRef = useRef();
  const aadhaarPhotoRef = useRef();

  const currentStepId = steps[step];

  const handleFileChange = (field, file) => {
    if (!file) return;
    setForm((prev) => ({ ...prev, [field]: file }));
    setPreviews((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }));
    if (field === "aadhaarPhoto") {
      setAadhaarVerified(false);
      setAadhaarError("");
    }
  };

  // ── Basic Aadhaar checks ─────────────────────────────────────────────────
  const verifyAadhaar = async () => {
    if (!form.aadhaarPhoto) return;
    setVerifyingAadhaar(true);
    setAadhaarError("");

    try {
      const file = form.aadhaarPhoto;
      const fileSizeMB = file.size / (1024 * 1024);

      if (fileSizeMB > 10) {
        throw "File too large. Please upload a photo under 10MB.";
      }
      if (file.size < 10000) {
        throw "File too small. Please upload a clear photo of your Aadhaar card.";
      }

      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        throw "Please upload a JPG or PNG image.";
      }

      await new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
          URL.revokeObjectURL(url);
          if (img.naturalWidth < 300 || img.naturalHeight < 180) {
            reject("Image resolution too low. Please upload a clearer photo.");
            return;
          }
          if (img.naturalWidth / img.naturalHeight < 1.0) {
            reject("Please upload the Aadhaar card in landscape (horizontal) orientation.");
            return;
          }
          resolve();
        };
        img.onerror = () => { URL.revokeObjectURL(url); reject("Could not read image."); };
        img.src = url;
      });

      setAadhaarVerified(true);
      setAadhaarError("");
    } catch (errMsg) {
      setAadhaarVerified(false);
      setAadhaarError(typeof errMsg === "string" ? errMsg : "Verification failed.");
    } finally {
      setVerifyingAadhaar(false);
    }
  };

  // ── Validation per step ──────────────────────────────────────────────────
  const validateStep = () => {
    if (currentStepId === "vehicle_details") {
      if (!form.vehicleType) return "Please select your vehicle type.";
      if (!form.registrationNo) return "Please enter registration number.";
    }
    if (currentStepId === "vehicle_photo") {
      if (!form.vehiclePhoto) return "Please upload a vehicle photo.";
    }
    if (currentStepId === "aadhaar") {
      if (!form.aadhaarPhoto) return "Please upload your Aadhaar card photo.";
      if (!aadhaarVerified) return "Please verify your Aadhaar card first.";
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep();
    if (err) return setError(err);
    setError("");
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    const err = validateStep();
    if (err) return setError(err);

    setLoading(true);
    setError("");

    try {
      if (isTransporter) {
        const data = new FormData();
        data.append("vehicleType", form.vehicleType);
        data.append("registrationNo", form.registrationNo);
        data.append("file", form.vehiclePhoto);

        await axios.post(`${BASE_URL}/users/transporter/profile`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post(
          `${BASE_URL}/users/verify-kyc`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      dispatch(loginSuccess({ token, user: { ...user, kycStatus: "verified" } }));
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit KYC. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Render step content based on stepId ──────────────────────────────────
  const renderStep = () => {
    switch (currentStepId) {

      case "vehicle_details":
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-white font-semibold text-lg mb-1">Vehicle details</h2>
              <p className="text-gray-500 text-sm">Tell us about your vehicle.</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Vehicle type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Car", "SUV", "Van", "Truck", "Tempo", "Other"].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, vehicleType: v }))}
                    className={`py-2.5 rounded-xl border text-sm font-medium transition ${form.vehicleType === v
                        ? "bg-blue-600/15 border-blue-500/30 text-blue-300"
                        : "bg-white/[0.03] border-white/[0.08] text-gray-400 hover:border-white/15"
                      }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Registration number
              </label>
              <input
                type="text"
                placeholder="e.g. DL 01 AB 1234"
                value={form.registrationNo}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, registrationNo: e.target.value.toUpperCase() }))
                }
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/40 transition font-mono tracking-wider"
              />
            </div>
          </div>
        );

      case "vehicle_photo":
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-white font-semibold text-lg mb-1">Vehicle photo</h2>
              <p className="text-gray-500 text-sm">Upload a clear photo of your vehicle.</p>
            </div>

            <input
              ref={vehiclePhotoRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange("vehiclePhoto", e.target.files[0])}
            />

            {previews.vehiclePhoto ? (
              <div className="relative">
                <img
                  src={previews.vehiclePhoto}
                  alt="Vehicle"
                  className="w-full h-48 object-cover rounded-xl border border-white/10"
                />
                <button
                  onClick={() => {
                    setForm((p) => ({ ...p, vehiclePhoto: null }));
                    setPreviews((p) => ({ ...p, vehiclePhoto: null }));
                  }}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white"
                >
                  <X size={13} />
                </button>
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-emerald-500/80 px-2.5 py-1 rounded-full">
                  <CheckCircle size={11} className="text-white" />
                  <span className="text-white text-xs font-medium">Photo uploaded</span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => vehiclePhotoRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-white/20 hover:bg-white/[0.02] transition"
              >
                <div className="w-12 h-12 bg-white/[0.04] rounded-xl flex items-center justify-center">
                  <Car size={22} className="text-gray-500" />
                </div>
                <div className="text-center">
                  <p className="text-gray-300 text-sm font-medium">Click to upload</p>
                  <p className="text-gray-600 text-xs mt-1">JPG, PNG up to 10MB</p>
                </div>
              </button>
            )}

            <div className="flex items-start gap-2 bg-blue-500/5 border border-blue-500/15 rounded-xl px-4 py-3">
              <Eye size={14} className="text-blue-400 mt-0.5 shrink-0" />
              <p className="text-blue-300/80 text-xs leading-relaxed">
                Make sure the registration plate is clearly visible in the photo.
              </p>
            </div>
          </div>
        );

      case "aadhaar":
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-white font-semibold text-lg mb-1">
                Aadhaar verification
              </h2>
              <p className="text-gray-500 text-sm">
                Upload a photo of your Aadhaar card for identity verification.
              </p>
            </div>

            <input
              ref={aadhaarPhotoRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange("aadhaarPhoto", e.target.files[0])}
            />

            {previews.aadhaarPhoto ? (
              <div className="relative">
                <img
                  src={previews.aadhaarPhoto}
                  alt="Aadhaar"
                  className="w-full h-48 object-cover rounded-xl border border-white/10"
                />
                <button
                  onClick={() => {
                    setForm((p) => ({ ...p, aadhaarPhoto: null }));
                    setPreviews((p) => ({ ...p, aadhaarPhoto: null }));
                    setAadhaarVerified(false);
                    setAadhaarError("");
                  }}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white"
                >
                  <X size={13} />
                </button>
                {aadhaarVerified && (
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-emerald-500/80 px-2.5 py-1 rounded-full">
                    <CheckCircle size={11} className="text-white" />
                    <span className="text-white text-xs font-medium">Aadhaar verified</span>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => aadhaarPhotoRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-white/20 hover:bg-white/[0.02] transition"
              >
                <div className="w-12 h-12 bg-white/[0.04] rounded-xl flex items-center justify-center">
                  <FileText size={22} className="text-gray-500" />
                </div>
                <div className="text-center">
                  <p className="text-gray-300 text-sm font-medium">Upload Aadhaar card</p>
                  <p className="text-gray-600 text-xs mt-1">Front side · JPG or PNG</p>
                </div>
              </button>
            )}

            {form.aadhaarPhoto && !aadhaarVerified && (
              <button
                onClick={verifyAadhaar}
                disabled={verifyingAadhaar}
                className="w-full bg-blue-600/10 hover:bg-blue-600/15 border border-blue-500/20 text-blue-400 font-medium py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
              >
                {verifyingAadhaar ? (
                  <><Loader size={15} className="animate-spin" /> Verifying...</>
                ) : (
                  <><ShieldCheck size={15} /> Verify Aadhaar</>
                )}
              </button>
            )}

            {aadhaarError && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-red-400 text-sm">{aadhaarError}</p>
              </div>
            )}

            {aadhaarVerified && (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                <ShieldCheck size={15} className="text-emerald-400" />
                <p className="text-emerald-400 text-sm font-medium">
                  Aadhaar card verified successfully
                </p>
              </div>
            )}

            <div className="flex items-start gap-2 bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3">
              <AlertCircle size={13} className="text-gray-500 mt-0.5 shrink-0" />
              <p className="text-gray-500 text-xs leading-relaxed">
                Your Aadhaar details are used only for identity verification.
                We do not store the actual card image.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={36} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">KYC Verified</h2>
          <p className="text-gray-400 text-sm mb-8">
            Your account is now verified. You can start listing rides and earning on Bootrider.
          </p>
          <button
            onClick={() => navigate(isTransporter ? "/enterprise/dashboard" : "/create-rides")}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
          >
            Continue
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-lg mx-auto px-4 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={22} className="text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">KYC Verification</h1>
          <p className="text-gray-500 text-sm">
            {isTransporter
              ? "Complete verification to list your fleet"
              : "Verify your identity to start booking and listing rides"}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-around">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-col items-center gap-1.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition ${i < step
                    ? "bg-blue-600 text-white"
                    : i === step
                      ? "bg-blue-600/20 border border-blue-500/40 text-blue-400"
                      : "bg-white/[0.04] border border-white/[0.08] text-gray-600"
                  }`}>
                  {i < step ? <CheckCircle size={13} /> : i + 1}
                </div>
                <span className={`text-[11px] text-center leading-tight max-w-[80px] ${i === step ? "text-blue-400" : "text-gray-600"
                  }`}>
                  {stepLabels[s]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 mb-6">
          {renderStep()}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => { setStep((s) => s - 1); setError(""); }}
              className="flex-1 py-3.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 text-sm font-medium transition"
            >
              Back
            </button>
          )}

          {step < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition text-sm"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || !aadhaarVerified}
              className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/40 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><ShieldCheck size={16} /> Submit KYC</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default KYCForm;