import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer, TileLayer, Marker,
  Polyline, useMap
} from "react-leaflet";
import L from "leaflet";
import { MapPin, Search, X, Plus, Trash2, Info } from "lucide-react";

// ── Fix leaflet icons ────────────────────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ── Marker icons ─────────────────────────────────────────────────────────────
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

// ── Auto-fit map to all points ────────────────────────────────────────────────
const FitBounds = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (points && points.length >= 2) {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [40, 40], duration: 0.8 });
    }
  }, [points, map]);
  return null;
};

// ── Stop search input ────────────────────────────────────────────────────────
const StopSearchInput = ({ onAdd, existingNames }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=in`,
          { headers: { "User-Agent": "BootriderApp/1.0" } }
        );
        const data = await res.json();
        setResults(data);
        setShowDropdown(true);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
  }, [query]);

  const handleSelect = (result) => {
    const stop = {
      name: result.display_name,
      coordinates: {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
      },
    };
    onAdd(stop);
    setQuery("");
    setResults([]);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-3 border-2 border-slate-200 rounded-2xl px-4 py-3 bg-white focus-within:border-amber-400 transition shadow-sm">
        {searching ? (
          <div className="w-4 h-4 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin shrink-0" />
        ) : (
          <Search size={15} className="text-slate-400 shrink-0" />
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          placeholder="Search a stop city or location..."
          className="flex-1 text-slate-800 text-sm placeholder-slate-400 focus:outline-none bg-transparent"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setResults([]); setShowDropdown(false); }}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50">
          {results.map((r, i) => {
            const name = r.display_name?.split(",")[0];
            const alreadyAdded = existingNames.includes(r.display_name);
            return (
              <button
                key={i}
                onClick={() => !alreadyAdded && handleSelect(r)}
                disabled={alreadyAdded}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left border-b border-slate-50 last:border-0 transition ${alreadyAdded
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-amber-50"
                  }`}
              >
                <MapPin size={13} className="text-amber-500 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-slate-800 text-sm font-medium truncate">
                    {name}
                  </p>
                  <p className="text-slate-400 text-xs truncate mt-0.5">
                    {r.display_name?.split(",").slice(1, 3).join(",")}
                  </p>
                </div>
                {alreadyAdded && (
                  <span className="ml-auto text-xs text-slate-400 shrink-0">
                    Added
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const StepStops = ({ data, onUpdate }) => {
  const stops = data.stops || [];

  const addStop = (stop) => {
    onUpdate({ stops: [...stops, stop] });
  };

  const removeStop = (index) => {
    const updated = stops.filter((_, i) => i !== index);
    onUpdate({ stops: updated });
  };

  // ── All points for map ───────────────────────────────────────────────────
  const allPoints = [
    data.from?.coordinates,
    ...stops.map((s) => s.coordinates),
    data.to?.coordinates,
  ].filter(Boolean);

  const mapCenter =
    allPoints.length > 0
      ? allPoints[Math.floor(allPoints.length / 2)]
      : { lat: 28.6139, lng: 77.209 };

  const existingNames = [
    data.from?.name,
    ...stops.map((s) => s.name),
    data.to?.name,
  ].filter(Boolean);

  return (
    <div className="flex flex-col lg:flex-row gap-0 min-h-[480px]">

      {/* ── Left: Form ── */}
      <div className="lg:w-[45%] px-6 py-8 flex flex-col">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Do you have any stops along the way?
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          Adding stops helps passengers who need to board or alight midway find your ride.
        </p>

        {/* Route preview */}
        <div className="flex items-start gap-3 mb-6 bg-slate-50 rounded-2xl px-4 py-3.5">
          <div className="flex flex-col items-center gap-1 pt-1 shrink-0">
            <div className="w-3 h-3 bg-blue-600 rounded-full" />
            {stops.map((_, i) => (
              <React.Fragment key={i}>
                <div className="w-px h-4 bg-slate-300" />
                <div className="w-2.5 h-2.5 bg-amber-400 rounded-full" />
              </React.Fragment>
            ))}
            <div className="w-px h-4 bg-slate-300" />
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-700 text-sm font-medium truncate">
              {data.from?.name?.split(",")[0] || "Pickup"}
            </p>
            {stops.map((stop, i) => (
              <div key={i} className="flex items-center justify-between mt-3 group">
                <p className="text-slate-500 text-sm truncate flex-1">
                  {stop.name?.split(",")[0]}
                </p>
                <button
                  onClick={() => removeStop(i)}
                  className="ml-2 w-6 h-6 bg-red-50 hover:bg-red-100 border border-red-200 text-red-400 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition shrink-0"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))}
            <p className="text-slate-700 text-sm font-medium truncate mt-3">
              {data.to?.name?.split(",")[0] || "Destination"}
            </p>
          </div>
        </div>

        {/* Add stop input */}
        <div className="mb-4">
          <p className="text-sm font-medium text-slate-600 mb-2 flex items-center gap-2">
            <Plus size={14} className="text-amber-500" />
            Add a stop
          </p>
          <StopSearchInput onAdd={addStop} existingNames={existingNames} />
        </div>

        {/* Stop count */}
        {stops.length > 0 && (
          <p className="text-slate-400 text-xs flex items-center gap-1.5 mt-2">
            <Info size={11} />
            {stops.length} stop{stops.length > 1 ? "s" : ""} added — click a stop name to remove it
          </p>
        )}

        {/* Skip hint */}
        {stops.length === 0 && (
          <div className="mt-auto pt-4">
            <p className="text-slate-400 text-xs flex items-center gap-1.5">
              <Info size={11} />
              No stops? That's fine — just continue to the next step.
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

          {/* From marker */}
          {data.from?.coordinates && (
            <Marker
              position={[data.from.coordinates.lat, data.from.coordinates.lng]}
              icon={blueIcon}
            />
          )}

          {/* Stop markers */}
          {stops.map((stop, i) =>
            stop.coordinates ? (
              <Marker
                key={i}
                position={[stop.coordinates.lat, stop.coordinates.lng]}
                icon={amberIcon}
              />
            ) : null
          )}

          {/* To marker */}
          {data.to?.coordinates && (
            <Marker
              position={[data.to.coordinates.lat, data.to.coordinates.lng]}
              icon={greenIcon}
            />
          )}

          {/* Route line */}
          {allPoints.length >= 2 && (
            <Polyline
              positions={allPoints.map((p) => [p.lat, p.lng])}
              pathOptions={{
                color: "#2563EB",
                weight: 3,
                opacity: 0.7,
                dashArray: "8 4",
              }}
            />
          )}

          {allPoints.length >= 2 && <FitBounds points={allPoints} />}
        </MapContainer>

        {/* Legend */}
        {allPoints.length >= 2 && (
          <div className="absolute bottom-4 left-4 bg-white/95 border border-slate-200 rounded-xl px-3 py-2.5 shadow-md z-10">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full" />
                <span className="text-slate-600 text-xs">Pickup</span>
              </div>
              {stops.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-400 rounded-full" />
                  <span className="text-slate-600 text-xs">
                    {stops.length} stop{stops.length > 1 ? "s" : ""}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                <span className="text-slate-600 text-xs">Destination</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepStops;