import React from "react";
import { Package, X, ChevronRight } from "lucide-react";

const StepBootRegister = ({ data, onUpdate }) => {
    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Package size={24} className="text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">
                    Register boot space?
                </h2>
                <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
                    Earn extra by carrying parcels in your boot. Senders pay you
                    directly for the space you already have.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Yes */}
                <button
                    type="button"
                    onClick={() => onUpdate({ acceptsParcels: true })}
                    className={`relative p-6 rounded-2xl border transition-all text-left group ${data.acceptsParcels === true
                            ? "bg-blue-600/10 border-blue-500/40 shadow-lg shadow-blue-500/10"
                            : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.14]"
                        }`}
                >
                    {data.acceptsParcels === true && (
                        <div className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                    )}
                    <Package
                        size={22}
                        className={`mb-3 ${data.acceptsParcels === true ? "text-blue-400" : "text-gray-500"
                            }`}
                    />
                    <p
                        className={`font-semibold text-sm mb-1 ${data.acceptsParcels === true ? "text-white" : "text-gray-300"
                            }`}
                    >
                        Yes, register
                    </p>
                    <p className="text-gray-500 text-xs leading-relaxed">
                        Set your prices and earn on every trip
                    </p>
                </button>

                {/* No */}
                <button
                    type="button"
                    onClick={() => onUpdate({ acceptsParcels: false, bootSpace: null })}
                    className={`relative p-6 rounded-2xl border transition-all text-left group ${data.acceptsParcels === false
                            ? "bg-white/[0.06] border-white/20"
                            : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.14]"
                        }`}
                >
                    {data.acceptsParcels === false && (
                        <div className="absolute top-3 right-3 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                    )}
                    <X
                        size={22}
                        className={`mb-3 ${data.acceptsParcels === false ? "text-gray-300" : "text-gray-500"
                            }`}
                    />
                    <p
                        className={`font-semibold text-sm mb-1 ${data.acceptsParcels === false ? "text-white" : "text-gray-300"
                            }`}
                    >
                        No thanks
                    </p>
                    <p className="text-gray-500 text-xs leading-relaxed">
                        Seat bookings only for this ride
                    </p>
                </button>
            </div>

            {/* Info banner when Yes selected */}
            {data.acceptsParcels === true && (
                <div className="flex items-start gap-3 bg-blue-500/5 border border-blue-500/15 rounded-xl p-4">
                    <ChevronRight size={16} className="text-blue-400 mt-0.5 shrink-0" />
                    <p className="text-blue-300/80 text-xs leading-relaxed">
                        Next step — set your parcel prices and boot details. You're in
                        full control of what you accept.
                    </p>
                </div>
            )}
        </div>
    );
};

export default StepBootRegister;