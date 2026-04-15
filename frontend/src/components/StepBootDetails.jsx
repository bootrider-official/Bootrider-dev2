import React from "react";
import { Package, Weight, AlertTriangle, Info } from "lucide-react";

const GOODS_OPTIONS = [
    "Documents",
    "Clothes",
    "Food (Sealed)",
    "Electronics",
    "Other",
];

const StepBootDetails = ({ data, onUpdate }) => {
    const bootSpace = data.bootSpace || {};

    const update = (field, value) => {
        onUpdate({
            bootSpace: { ...bootSpace, [field]: value },
        });
    };

    const toggleGood = (good) => {
        const current = bootSpace.allowedGoods || [];
        const updated = current.includes(good)
            ? current.filter((g) => g !== good)
            : [...current, good];
        update("allowedGoods", updated);
    };

    return (
        <div className="space-y-7">
            <div className="mb-2">
                <h2 className="text-xl font-semibold text-white mb-1">
                    Boot space details
                </h2>
                <p className="text-gray-500 text-sm">
                    Set your pricing and preferences for parcel bookings.
                </p>
            </div>

            {/* ── Parcel size pricing ── */}
            <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
                    Pricing per parcel size
                </p>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { key: "smallPrice", label: "Small", sub: "Up to 2kg" },
                        { key: "mediumPrice", label: "Medium", sub: "Up to 10kg" },
                        { key: "largePrice", label: "Large", sub: "Up to 20kg" },
                    ].map((item) => (
                        <div key={item.key}>
                            <label className="block text-xs text-gray-500 mb-1.5">
                                {item.label}
                                <span className="block text-gray-600 text-[11px]">
                                    {item.sub}
                                </span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                                    ₹
                                </span>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={bootSpace[item.key] || ""}
                                    onChange={(e) =>
                                        update(item.key, e.target.value ? parseFloat(e.target.value) : null)
                                    }
                                    className="w-full bg-black/100 border border-white/10 rounded-xl pl-7 pr-3 py-3 text-white text-sm focus:outline-none focus:border-blue-500/40 transition placeholder-gray-600"
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-gray-600 text-xs mt-2 flex items-center gap-1">
                    <Info size={11} />
                    Leave blank to not accept that size
                </p>
            </div>

            {/* ── Max weight ── */}
            <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
                    Max total weight (kg)
                </label>
                <div className="relative max-w-[160px]">
                    <Weight
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                        type="number"
                        min="1"
                        placeholder="e.g. 20"
                        value={bootSpace.maxWeightKg ?? ""}
                        onChange={(e) =>
                            update(
                                "maxWeightKg",
                                e.target.value ? parseFloat(e.target.value) : null
                            )
                        }
                        className="w-full bg-black/100 border border-white/10 rounded-xl pl-9 pr-3 py-3 text-white text-sm focus:outline-none focus:border-blue-500/40 transition placeholder-gray-600"
                    />
                </div>
            </div>

            {/* ── Allowed goods ── */}
            <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
                    Allowed goods
                </p>
                <div className="flex flex-wrap gap-2">
                    {GOODS_OPTIONS.map((good) => {
                        const selected = (bootSpace.allowedGoods || []).includes(good);
                        return (
                            <button
                                key={good}
                                type="button"
                                onClick={() => toggleGood(good)}
                                className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${selected
                                        ? "bg-blue-600/15 border-blue-500/30 text-blue-300"
                                        : "bg-white/[0.03] border-white/[0.08] text-gray-400 hover:border-white/20 hover:text-gray-300"
                                    }`}
                            >
                                {good}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Fragile toggle ── */}
            <div className="flex items-center justify-between py-4 border-t border-white/[0.06]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                        <AlertTriangle size={15} className="text-amber-400" />
                    </div>
                    <div>
                        <p className="text-white text-sm font-medium">Accept fragile items</p>
                        <p className="text-gray-500 text-xs">
                            Sender will be notified to pack carefully
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => update("fragileAccepted", !bootSpace.fragileAccepted)}
                    className={`relative w-11 h-6 rounded-full transition-all ${bootSpace.fragileAccepted ? "bg-blue-600" : "bg-white/10"
                        }`}
                >
                    <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${bootSpace.fragileAccepted ? "left-6" : "left-1"
                            }`}
                    />
                </button>
            </div>

            {/* ── Pickup flexibility ── */}
            <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
                    Parcel pickup point
                </p>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        {
                            value: "start_only",
                            label: "Start point only",
                            sub: "Sender must come to your pickup",
                        },
                        {
                            value: "any_stop",
                            label: "Any stop",
                            sub: "Sender can hand over at any stop",
                        },
                    ].map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => update("pickupFlexibility", opt.value)}
                            className={`p-4 rounded-xl border text-left transition-all ${bootSpace.pickupFlexibility === opt.value
                                    ? "bg-blue-600/10 border-blue-500/30"
                                    : "bg-white/[0.03] border-white/[0.08] hover:border-white/15"
                                }`}
                        >
                            <p
                                className={`text-sm font-medium mb-1 ${bootSpace.pickupFlexibility === opt.value
                                        ? "text-white"
                                        : "text-gray-300"
                                    }`}
                            >
                                {opt.label}
                            </p>
                            <p className="text-gray-500 text-xs">{opt.sub}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Boot description ── */}
            <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
                    Boot description
                    <span className="normal-case ml-1 text-gray-600">(optional)</span>
                </label>
                <textarea
                    rows={2}
                    placeholder='e.g. "Sedan boot, fits 1 large suitcase or 2 medium boxes"'
                    value={bootSpace.bootDescription || ""}
                    onChange={(e) => update("bootDescription", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/40 transition resize-none"
                />
            </div>
        </div>
    );
};

export default StepBootDetails;