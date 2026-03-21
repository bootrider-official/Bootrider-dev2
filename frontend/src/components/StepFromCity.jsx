import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { MapPin, Search, X, Navigation } from "lucide-react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── Fix leaflet default icon ─────────────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ── Custom blue pin marker ────────────────────────────────────────────────────
const bluePinIcon = L.divIcon({
  className: "",
  html: `<div style="
    width: 20px; height: 20px;
    background: #2563EB;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(37,99,235,0.5);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// ── Auto-center map when coords change ───────────────────────────────────────
const MapCenter = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo([coords.lat, coords.lng], 13, { duration: 1 });
    }
  }, [coords, map]);
  return null;
};

// ── Click handler on map ─────────────────────────────────────────────────────
const MapClickHandler = ({ onPinDrop }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
          { headers: { "User-Agent": "BootriderApp/1.0" } }
        );
        const data = await res.json();
        const name =
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          data.address?.suburb ||
          data.display_name?.split(",")[0] ||
          `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        onPinDrop({ name, coordinates: { lat, lng } });
      } catch {
        onPinDrop({
          name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          coordinates: { lat, lng },
        });
      }
    },
  });
  return null;
};

const StepFromCity = ({ data, onUpdate }) => {
  const [query, setQuery] = useState(data.from?.name || "");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);

  const coords = data.from?.coordinates;

  // ── Debounced search ─────────────────────────────────────────────────────
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
    const name =
      result.address?.city ||
      result.address?.town ||
      result.address?.village ||
      result.display_name?.split(",")[0];

    onUpdate({
      from: {
        name: result.display_name,
        coordinates: {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
        },
      },
    });
    setQuery(result.display_name);
    setShowDropdown(false);
    setResults([]);
  };

  const handlePinDrop = (location) => {
    onUpdate({ from: location });
    setQuery(location.name);
  };

  const handleClear = () => {
    setQuery("");
    onUpdate({ from: null });
    setResults([]);
    setShowDropdown(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-0 min-h-[480px]">

      {/* ── Left: Form ── */}
      <div className="lg:w-[45%] px-6 py-8 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Where would you like to pick up passengers?
        </h2>
        <p className="text-slate-400 text-sm mb-6 flex items-center gap-1.5">
          <MapPin size={13} className="text-blue-500" />
          Enter a city or specific location
        </p>

        {/* Search input */}
        <div className="relative">
          <div className="flex items-center gap-3 border-2 border-slate-200 rounded-2xl px-4 py-3.5 bg-white focus-within:border-blue-400 transition shadow-sm">
            {searching ? (
              <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin shrink-0" />
            ) : (
              <Search size={16} className="text-slate-400 shrink-0" />
            )}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => results.length > 0 && setShowDropdown(true)}
              placeholder="e.g. Noida, Sector 62"
              className="flex-1 text-slate-800 text-sm placeholder-slate-400 focus:outline-none bg-transparent"
              autoComplete="off"
            />
            {query && (
              <button onClick={handleClear} className="text-slate-400 hover:text-slate-600">
                <X size={15} />
              </button>
            )}
          </div>

          {/* Dropdown results */}
          {showDropdown && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50">
              {results.map((r, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(r)}
                  className="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-blue-50 transition text-left border-b border-slate-50 last:border-0"
                >
                  <MapPin size={14} className="text-blue-500 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-slate-800 text-sm font-medium truncate">
                      {r.display_name?.split(",")[0]}
                    </p>
                    <p className="text-slate-400 text-xs truncate mt-0.5">
                      {r.display_name?.split(",").slice(1, 3).join(",")}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected location display */}
        {data.from && (
          <div className="mt-4 flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3.5">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <Navigation size={14} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-blue-800 text-xs font-semibold uppercase tracking-wide mb-0.5">
                Pickup point selected
              </p>
              <p className="text-blue-700 text-sm leading-snug">
                {data.from.name}
              </p>
              <p className="text-blue-400 text-xs mt-1">
                {data.from.coordinates?.lat?.toFixed(4)}, {data.from.coordinates?.lng?.toFixed(4)}
              </p>
            </div>
          </div>
        )}

        <p className="text-slate-400 text-xs mt-4 flex items-center gap-1.5">
          <MapPin size={11} />
          Or click anywhere on the map to pin your exact location
        </p>
      </div>

      {/* ── Right: Map ── */}
      <div className="lg:w-[55%] min-h-[320px] lg:min-h-full relative">
        <MapContainer
          center={coords ? [coords.lat, coords.lng] : [28.6139, 77.2090]}
          zoom={coords ? 13 : 6}
          style={{ width: "100%", height: "100%", minHeight: "320px" }}
          zoomControl={false}
        >
          {/* Light clean tile — BlaBlaCar style */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />

          {coords && (
            <>
              <Marker position={[coords.lat, coords.lng]} icon={bluePinIcon} />
              <MapCenter coords={coords} />
            </>
          )}

          <MapClickHandler onPinDrop={handlePinDrop} />
        </MapContainer>

        {/* Map hint overlay */}
        {!coords && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl px-5 py-4 text-center shadow-lg max-w-[200px]">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin size={22} className="text-blue-600" />
              </div>
              <p className="text-slate-700 text-sm font-semibold leading-snug">
                Enter a specific place so we can recommend your ride to people nearby!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepFromCity;