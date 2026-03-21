import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer, TileLayer, Marker,
  Polyline, useMap
} from "react-leaflet";
import L from "leaflet";
import {
  MapPin, Search, X, Plus, Trash2,
  Info, IndianRupee, RotateCcw
} from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const makeIcon = (color, size = 16) =>
  L.divIcon({
    className: "",
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${color};
      border:2.5px solid white;
      border-radius:50%;
      box-shadow:0 2px 6px rgba(0,0,0,0.2);
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });

const blueIcon = makeIcon("#2563EB", 18);
const greenIcon = makeIcon("#10B981", 18);
const amberIcon = makeIcon("#F59E0B", 14);

// ── Haversine ────────────────────────────────────────────────────────────────
const haversineKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ── Build stopoverPrices array from all points ───────────────────────────────
// Each entry = one direct segment between consecutive points
// Schema: { fromName, toName, fromCoordinates, toCoordinates, price, distanceKm }
const buildSegments = (from, stops, to, totalPrice, existingSegments = []) => {
  if (!from?.coordinates || !to?.coordinates) return [];

  const allPoints = [from, ...stops, to];
  const segments = [];

  for (let i = 0; i < allPoints.length - 1; i++) {
    const a = allPoints[i];
    const b = allPoints[i + 1];

    if (!a?.coordinates || !b?.coordinates) continue;

    const distKm = Math.round(
      haversineKm(
        a.coordinates.lat, a.coordinates.lng,
        b.coordinates.lat, b.coordinates.lng
      )
    );

    segments.push({
      fromName: a.name?.split(",")[0] || "",
      toName: b.name?.split(",")[0] || "",
      fromCoordinates: a.coordinates,
      toCoordinates: b.coordinates,
      distanceKm: distKm,
      _suggestedPrice: 0, // filled below
      price: 0,           // filled below
    });
  }

  // ── Calculate suggested prices using distance ratio ──
  const totalDist = segments.reduce((s, seg) => s + seg.distanceKm, 0);

  segments.forEach((seg, i) => {
    const ratio = totalDist > 0 ? seg.distanceKm / totalDist : 1 / segments.length;
    const suggested = Math.max(10, Math.round((ratio * (totalPrice || 0)) / 10) * 10);
    seg._suggestedPrice = suggested;

    // ── Preserve manually edited price if segment matches ──
    const existing = existingSegments.find(
      (e) =>
        e.fromName === seg.fromName &&
        e.toName === seg.toName
    );
    seg.price = existing?.price ?? suggested;
  });

  return segments;
};

// ── Auto-fit map ─────────────────────────────────────────────────────────────
const FitBounds = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (points?.length >= 2) {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [40, 40], duration: 0.8 });
    }
  }, [points, map]);
  return null;
};

// ── Stop search ──────────────────────────────────────────────────────────────
const StopSearch = ({ onAdd, existingNames }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showDrop, setShowDrop] = useState(false);
  const debRef = useRef(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]); setShowDrop(false); return;
    }
    clearTimeout(debRef.current);
    debRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=in`,
          { headers: { "User-Agent": "BootriderApp/1.0" } }
        );
        const data = await res.json();
        setResults(data);
        setShowDrop(true);
      } catch { setResults([]); }
      finally { setSearching(false); }
    }, 400);
  }, [query]);

  const select = (r) => {
    onAdd({
      name: r.display_name,
      coordinates: { lat: parseFloat(r.lat), lng: parseFloat(r.lon) },
    });
    setQuery(""); setResults([]); setShowDrop(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-3 border-2 border-slate-200 rounded-2xl px-4 py-3 bg-white focus-within:border-amber-400 transition shadow-sm">
        {searching
          ? <div className="w-4 h-4 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin shrink-0" />
          : <Search size={15} className="text-slate-400 shrink-0" />
        }
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowDrop(true)}
          placeholder="Search a stop city or landmark..."
          className="flex-1 text-slate-800 text-sm placeholder-slate-400 focus:outline-none bg-transparent"
          autoComplete="off"
        />
        {query && (
          <button onClick={() => { setQuery(""); setResults([]); setShowDrop(false); }}>
            <X size={14} className="text-slate-400" />
          </button>
        )}
      </div>

      {showDrop && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50">
          {results.map((r, i) => {
            const already = existingNames.includes(r.display_name);
            return (
              <button
                key={i}
                onClick={() => !already && select(r)}
                disabled={already}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left border-b border-slate-50 last:border-0 transition ${already ? "opacity-40 cursor-not-allowed" : "hover:bg-amber-50"
                  }`}
              >
                <MapPin size={13} className="text-amber-500 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-slate-800 text-sm font-medium truncate">
                    {r.display_name?.split(",")[0]}
                  </p>
                  <p className="text-slate-400 text-xs truncate mt-0.5">
                    {r.display_name?.split(",").slice(1, 3).join(",")}
                  </p>
                </div>
                {already && <span className="ml-auto text-xs text-slate-400 shrink-0">Added</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Main ─────────────────────────────────────────────────────────────────────
const StepStops = ({ data, onUpdate }) => {
  const stops = data.stops || [];
  const segments = data.stopoverPrices || [];
  const hasPrice = (data.pricePerSeat || 0) > 0;

  // ── Rebuild segments when stops change ──────────────────────────────────
  const rebuild = (newStops, existingSegs) => {
    return buildSegments(data.from, newStops, data.to, data.pricePerSeat, existingSegs);
  };

  const addStop = (stop) => {
    const newStops = [...stops, stop];
    onUpdate({ stops: newStops, stopoverPrices: rebuild(newStops, segments) });
  };

  const removeStop = (idx) => {
    const newStops = stops.filter((_, i) => i !== idx);
    onUpdate({ stops: newStops, stopoverPrices: rebuild(newStops, segments) });
  };

  const updatePrice = (idx, val) => {
    const updated = segments.map((seg, i) =>
      i === idx ? { ...seg, price: parseInt(val) || 0 } : seg
    );
    onUpdate({ stopoverPrices: updated });
  };

  const resetSuggested = (idx) => {
    const updated = segments.map((seg, i) =>
      i === idx ? { ...seg, price: seg._suggestedPrice } : seg
    );
    onUpdate({ stopoverPrices: updated });
  };

  // ── Map points ───────────────────────────────────────────────────────────
  const allPoints = [
    data.from?.coordinates,
    ...stops.map((s) => s.coordinates),
    data.to?.coordinates,
  ].filter(Boolean);

  const mapCenter = allPoints.length > 0
    ? allPoints[Math.floor(allPoints.length / 2)]
    : { lat: 28.6139, lng: 77.209 };

  const existingNames = [
    data.from?.name,
    ...stops.map((s) => s.name),
    data.to?.name,
  ].filter(Boolean);

  // ── Point color helper ───────────────────────────────────────────────────
  const dotColor = (i, total) => {
    if (i === 0) return "bg-blue-600";
    if (i === total - 1) return "bg-emerald-500";
    return "bg-amber-400";
  };

  const allNamedPoints = [
    { name: data.from?.name?.split(",")[0] || "Pickup", type: "from" },
    ...stops.map((s) => ({ name: s.name?.split(",")[0], type: "stop" })),
    { name: data.to?.name?.split(",")[0] || "Destination", type: "to" },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-0 min-h-[520px]">

      {/* ── Left panel ── */}
      <div className="lg:w-[45%] px-6 py-8 flex flex-col overflow-y-auto max-h-[600px] lg:max-h-none">

        <h2 className="text-2xl font-bold text-slate-800 mb-1">
          Stops & segment prices
        </h2>
        <p className="text-slate-400 text-sm mb-5">
          Add stops along your route. Each segment gets its own price —
          passengers only pay for the part they travel.
        </p>

        {/* Add stop */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Plus size={12} className="text-amber-500" />
            Add a stop
          </p>
          <StopSearch onAdd={addStop} existingNames={existingNames} />
        </div>

        {/* No price warning */}
        {stops.length > 0 && !hasPrice && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 mb-4">
            <Info size={13} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-amber-700 text-xs leading-relaxed">
              Set your full route price in the Details step — we'll
              auto-suggest segment prices based on distance.
            </p>
          </div>
        )}

        {/* ── Full route timeline + segment prices ── */}
        {allNamedPoints.length >= 2 && (
          <div className="space-y-0">
            {allNamedPoints.map((point, i) => {
              const isLast = i === allNamedPoints.length - 1;
              const seg = segments[i]; // segment AFTER this point

              return (
                <div key={i}>
                  {/* ── Point row ── */}
                  <div className="flex items-center gap-3">
                    <div className={`w-3.5 h-3.5 rounded-full shrink-0 border-2 border-white shadow-sm ${dotColor(i, allNamedPoints.length)}`} />
                    <div className="flex-1 flex items-center justify-between py-1">
                      <span className="text-slate-700 text-sm font-semibold truncate max-w-[150px]">
                        {point.name}
                      </span>
                      {/* Remove stop button */}
                      {point.type === "stop" && (
                        <button
                          onClick={() => removeStop(i - 1)}
                          className="flex items-center gap-1 text-red-400 hover:text-red-500 text-xs transition ml-2 shrink-0"
                        >
                          <Trash2 size={11} />
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ── Segment price (between this point and next) ── */}
                  {!isLast && seg && (
                    <div className="flex items-stretch gap-3 ml-1.5 pl-4 border-l-2 border-dashed border-slate-200 py-2">
                      <div className="flex-1 bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                        {/* Segment info */}
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400 text-[11px]">
                              {seg.fromName} → {seg.toName}
                            </span>
                            {seg.distanceKm > 0 && (
                              <span className="bg-slate-100 text-slate-500 text-[10px] px-1.5 py-0.5 rounded-full">
                                ~{seg.distanceKm}km
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price input + suggested */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">
                              ₹
                            </span>
                            <input
                              type="number"
                              min="0"
                              value={seg.price || ""}
                              onChange={(e) => updatePrice(i, e.target.value)}
                              placeholder="0"
                              className="w-full border-2 border-slate-200 rounded-xl pl-7 pr-3 py-2 text-slate-800 text-sm font-bold focus:outline-none focus:border-blue-400 transition"
                            />
                          </div>

                          {/* Suggested price badge */}
                          {hasPrice && seg._suggestedPrice > 0 && (
                            <div className="shrink-0 text-right">
                              <p className="text-[10px] text-slate-400 mb-1">
                                Suggested
                              </p>
                              <button
                                onClick={() => resetSuggested(i)}
                                title="Use suggested price"
                                className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg border transition ${seg.price === seg._suggestedPrice
                                    ? "bg-blue-50 text-blue-600 border-blue-200"
                                    : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                                  }`}
                              >
                                {seg.price !== seg._suggestedPrice && (
                                  <RotateCcw size={10} />
                                )}
                                ₹{seg._suggestedPrice}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* No stops yet */}
        {stops.length === 0 && (
          <div className="mt-auto pt-4">
            <p className="text-slate-400 text-xs flex items-center gap-1.5">
              <Info size={11} />
              No stops needed? Just continue to the next step.
            </p>
          </div>
        )}

        {/* Summary note */}
        {segments.length > 0 && hasPrice && (
          <div className="mt-4 flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2.5">
            <Info size={12} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="text-blue-700 text-xs leading-relaxed">
              Passengers searching partial routes will see only their
              segment price. e.g. someone going{" "}
              <strong>
                {allNamedPoints[0]?.name} → {allNamedPoints[1]?.name}
              </strong>{" "}
              sees ₹{segments[0]?.price || "—"}.
            </p>
          </div>
        )}
      </div>

      {/* ── Right: Map ── */}
      <div className="lg:w-[55%] min-h-[320px] lg:min-h-full relative">
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={allPoints.length >= 2 ? 8 : 6}
          style={{ width: "100%", height: "100%", minHeight: "320px" }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />

          {data.from?.coordinates && (
            <Marker
              position={[data.from.coordinates.lat, data.from.coordinates.lng]}
              icon={blueIcon}
            />
          )}
          {stops.map((s, i) =>
            s.coordinates ? (
              <Marker
                key={i}
                position={[s.coordinates.lat, s.coordinates.lng]}
                icon={amberIcon}
              />
            ) : null
          )}
          {data.to?.coordinates && (
            <Marker
              position={[data.to.coordinates.lat, data.to.coordinates.lng]}
              icon={greenIcon}
            />
          )}
          {allPoints.length >= 2 && (
            <Polyline
              positions={allPoints.map((p) => [p.lat, p.lng])}
              pathOptions={{ color: "#2563EB", weight: 3, opacity: 0.7, dashArray: "8 4" }}
            />
          )}
          {allPoints.length >= 2 && <FitBounds points={allPoints} />}
        </MapContainer>

        {/* Map overlay: segment price summary */}
        {segments.length > 0 && (
          <div className="absolute top-4 right-4 bg-white/96 border border-slate-200 rounded-xl px-3 py-3 shadow-md z-10 min-w-[160px]">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wide mb-2">
              Segment prices
            </p>
            {segments.map((seg, i) => (
              <div key={i} className="flex items-center justify-between gap-3 mb-1.5 last:mb-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${i === 0 ? "bg-blue-600" : "bg-amber-400"
                    }`} />
                  <span className="text-slate-500 text-[11px] truncate">
                    {seg.fromName}
                  </span>
                  <span className="text-slate-300 text-[10px]">→</span>
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${i === segments.length - 1 ? "bg-emerald-500" : "bg-amber-400"
                    }`} />
                  <span className="text-slate-500 text-[11px] truncate">
                    {seg.toName}
                  </span>
                </div>
                <span className="text-blue-600 text-xs font-bold shrink-0">
                  ₹{seg.price}
                </span>
              </div>
            ))}
            <div className="border-t border-slate-100 mt-2 pt-2 flex justify-between">
              <span className="text-slate-400 text-[11px]">Full route</span>
              <span className="text-slate-700 text-xs font-bold">
                ₹{data.pricePerSeat || "—"}
              </span>
            </div>
          </div>
        )}

        {/* Legend */}
        {allPoints.length >= 2 && (
          <div className="absolute bottom-4 left-4 bg-white/95 border border-slate-200 rounded-xl px-3 py-2.5 shadow-md z-10">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full" />
                <span className="text-slate-600 text-xs">
                  {data.from?.name?.split(",")[0] || "Pickup"}
                </span>
              </div>
              {stops.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-400 rounded-full" />
                  <span className="text-slate-600 text-xs truncate max-w-[120px]">
                    {s.name?.split(",")[0]}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                <span className="text-slate-600 text-xs">
                  {data.to?.name?.split(",")[0] || "Destination"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepStops;