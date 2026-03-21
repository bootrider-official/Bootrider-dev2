import React from "react";
import { Zap, ClipboardList, Check, Users, Bell, Clock } from "lucide-react";

const StepBookingPreference = ({ data, onUpdate }) => {
  const selected = data.bookingPreference || "review";

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          How would you like to manage bookings?
        </h2>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">
          Choose how passengers book seats on your ride.
          You can change this later.
        </p>
      </div>

      <div className="space-y-4">

        {/* ── Instant Booking ── */}
        <button
          type="button"
          onClick={() => onUpdate({ bookingPreference: "instant" })}
          className={`w-full text-left rounded-2xl border-2 p-5 transition-all ${selected === "instant"
              ? "border-blue-600 bg-blue-50 shadow-sm"
              : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
            }`}
        >
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${selected === "instant" ? "bg-blue-600" : "bg-slate-100"
              }`}>
              <Zap size={22} className={selected === "instant" ? "text-white" : "text-slate-500"} />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className={`font-bold text-lg ${selected === "instant" ? "text-blue-700" : "text-slate-800"
                  }`}>
                  Enable Instant Booking
                </p>
                {selected === "instant" && (
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check size={11} className="text-white" />
                  </div>
                )}
              </div>

              <div className="space-y-2 mt-3">
                {[
                  {
                    icon: <Bell size={14} />,
                    text: "No need to review every passenger request before it expires",
                  },
                  {
                    icon: <Users size={14} />,
                    text: "Get more passengers — they prefer instant answers",
                  },
                  {
                    icon: <Zap size={14} />,
                    text: "Your ride fills up faster",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className={`mt-0.5 shrink-0 ${selected === "instant" ? "text-blue-500" : "text-slate-400"
                      }`}>
                      {item.icon}
                    </span>
                    <p className={`text-sm ${selected === "instant" ? "text-blue-700" : "text-slate-500"
                      }`}>
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </button>

        {/* ── Review Each Request ── */}
        <button
          type="button"
          onClick={() => onUpdate({ bookingPreference: "review" })}
          className={`w-full text-left rounded-2xl border-2 p-5 transition-all ${selected === "review"
              ? "border-slate-700 bg-slate-50 shadow-sm"
              : "border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50"
            }`}
        >
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${selected === "review" ? "bg-slate-700" : "bg-slate-100"
              }`}>
              <ClipboardList size={22} className={selected === "review" ? "text-white" : "text-slate-500"} />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className={`font-bold text-lg ${selected === "review" ? "text-slate-800" : "text-slate-800"
                  }`}>
                  Review every request
                </p>
                {selected === "review" && (
                  <div className="w-5 h-5 bg-slate-700 rounded-full flex items-center justify-center">
                    <Check size={11} className="text-white" />
                  </div>
                )}
              </div>

              <div className="space-y-2 mt-3">
                {[
                  {
                    icon: <Clock size={14} />,
                    text: "You approve every passenger before they're confirmed",
                  },
                  {
                    icon: <Users size={14} />,
                    text: "Full control over who travels with you",
                  },
                  {
                    icon: <ClipboardList size={14} />,
                    text: "Review passenger profiles before accepting",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className={`mt-0.5 shrink-0 ${selected === "review" ? "text-slate-500" : "text-slate-400"
                      }`}>
                      {item.icon}
                    </span>
                    <p className={`text-sm ${selected === "review" ? "text-slate-600" : "text-slate-500"
                      }`}>
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Bottom note */}
      <p className="text-center text-slate-400 text-xs pt-2">
        Instant booking gets{" "}
        <span className="text-blue-600 font-medium">3x more passengers</span>{" "}
        on average. You can change this anytime.
      </p>
    </div>
  );
};

export default StepBookingPreference;