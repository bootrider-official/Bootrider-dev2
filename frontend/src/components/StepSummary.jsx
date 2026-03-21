import React from "react";
import {
  MapPin, Calendar, Clock, Users, IndianRupee,
  Package, Cigarette, PawPrint, Music, MessageCircle,
  UserCheck, Check, Car, Info, Zap, ClipboardList,
  ChevronRight, ArrowRight
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";

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

const StepSummary = ({ data }) => {
  const prefs = data.preferences || {};
  const segments = data.stopoverPrices || [];
  const stops = data.stops || [];

  // ── All map points ───────────────────────────────────────────────────────
  const allPoints = [
    data.from?.coordinates,
    ...stops.map((s) => s.coordinates),
    data.to?.coordinates,
  ].filter(Boolean);

  const mapCenter =
    allPoints.length > 0
      ? allPoints[Math.floor(allPoints.length / 2)]
      : { lat: 28.6139, lng: 77.209 };

  // ── Preference badges ────────────────────────────────────────────────────
  const activePrefBadges = [
    prefs.smokingAllowed && {
      label: "Smoking ok",
      icon: <Cigarette size={11} />,
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
    prefs.petsAllowed && {
      label: "Pets ok",
      icon: <PawPrint size={11} />,
      color: "bg-green-50 text-green-600 border-green-200",
    },
    prefs.womenOnly && {
      label: "Women only",
      icon: <UserCheck size={11} />,
      color: "bg-pink-50 text-pink-600 border-pink-200",
    },
    prefs.maxInBack && {
      label: "Max 2 in back",
      icon: <Users size={11} />,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    prefs.musicAllowed && {
      label: "Music ok",
      icon: <Music size={11} />,
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
  ].filter(Boolean);

  const chatLabel = {
    quiet: "Quiet ride",
    chatty: "Love to chat",
    no_preference: null,
  }[prefs.chatPreference];

  // ── All named points for route display ───────────────────────────────────
  const allNamedPoints = [
    { name: data.from?.name?.split(",")[0] || "Pickup", type: "from" },
    ...stops.map((s) => ({ name: s.name?.split(",")[0], type: "stop" })),
    { name: data.to?.name?.split(",")[0] || "Destination", type: "to" },
  ];

  const dotColor = (type) => ({
    from: "bg-blue-600",
    stop: "bg-amber-400",
    to: "bg-emerald-500",
  }[type] || "bg-slate-300");

  return (
    <div className="space-y-5">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">
          Review your ride
        </h2>
        <p className="text-slate-500 text-sm">
          Double-check everything before publishing.
        </p>
      </div>

      {/* ── Map preview ── */}
      {allPoints.length >= 2 && (
        <div
          className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm"
          style={{ height: "200px" }}
        >
          <MapContainer
            center={[mapCenter.lat, mapCenter.lng]}
            zoom={7}
            style={{ width: "100%", height: "100%" }}
            zoomControl={false}
            dragging={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; CARTO'
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
            <Polyline
              positions={allPoints.map((p) => [p.lat, p.lng])}
              pathOptions={{
                color: "#2563EB",
                weight: 3,
                opacity: 0.8,
                dashArray: "8 4",
              }}
            />
          </MapContainer>
        </div>
      )}

      {/* ── Route + segment prices ── */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Route & pricing
          </p>
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <Clock size={12} />
            {data.date
              ? new Date(data.date).toLocaleDateString("en-IN", {
                weekday: "short", day: "numeric", month: "short",
              })
              : "—"}
            {data.time && ` · ${data.time}`}
          </div>
        </div>

        <div className="px-5 py-4">
          {segments.length > 0 ? (
            /* ── Segment pricing view ── */
            <div className="space-y-0">
              {allNamedPoints.map((point, i) => {
                const isLast = i === allNamedPoints.length - 1;
                const seg = segments[i];

                return (
                  <div key={i}>
                    {/* Point */}
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full shrink-0 ${dotColor(point.type)}`} />
                      <span className={`text-sm font-semibold flex-1 truncate ${point.type === "stop"
                          ? "text-slate-500"
                          : "text-slate-800"
                        }`}>
                        {point.name}
                      </span>
                    </div>

                    {/* Segment */}
                    {!isLast && seg && (
                      <div className="flex items-center gap-3 ml-1.5 pl-4 border-l-2 border-dashed border-slate-100 py-2">
                        <div className="flex-1 flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-xs">
                              {seg.fromName} → {seg.toName}
                            </span>
                            {seg.distanceKm > 0 && (
                              <span className="text-slate-300 text-[10px]">
                                ~{seg.distanceKm}km
                              </span>
                            )}
                          </div>
                          <span className="text-blue-600 font-bold text-sm">
                            ₹{seg.price}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Full route total */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowRight size={13} className="text-slate-400" />
                  <span className="text-slate-500 text-sm">Full route price</span>
                </div>
                <span className="text-slate-800 font-black text-lg">
                  ₹{data.pricePerSeat}
                </span>
              </div>
            </div>
          ) : (
            /* ── Simple route (no stops) ── */
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-1 pt-1 shrink-0">
                <div className="w-3 h-3 bg-blue-600 rounded-full" />
                <div className="w-px h-8 bg-slate-200" />
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-slate-800 font-semibold">
                  {data.from?.name?.split(",")[0] || "—"}
                </p>
                <p className="text-slate-800 font-semibold mt-4">
                  {data.to?.name?.split(",")[0] || "—"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-slate-800 font-black text-2xl">
                  ₹{data.pricePerSeat}
                </p>
                <p className="text-slate-400 text-xs mt-0.5">per seat</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Seats",
            value: data.availableSeats || 1,
            icon: <Users size={16} className="text-blue-600" />,
            bg: "bg-blue-50 border-blue-100",
          },
          {
            label: "Per seat",
            value: `₹${data.pricePerSeat || 0}`,
            icon: <IndianRupee size={16} className="text-emerald-600" />,
            bg: "bg-emerald-50 border-emerald-100",
          },
          {
            label: "Booking",
            value: data.bookingPreference === "instant" ? "Instant" : "Review",
            icon: data.bookingPreference === "instant"
              ? <Zap size={16} className="text-amber-600" />
              : <ClipboardList size={16} className="text-slate-600" />,
            bg: data.bookingPreference === "instant"
              ? "bg-amber-50 border-amber-100"
              : "bg-slate-50 border-slate-100",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bg} rounded-2xl p-4 text-center border`}
          >
            <div className="flex justify-center mb-2">{stat.icon}</div>
            <p className="text-slate-800 font-bold text-lg leading-none">
              {stat.value}
            </p>
            <p className="text-slate-500 text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Vehicle ── */}
      {data.vehicleDetails?.type && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
              <Car size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-slate-700 text-sm font-medium">
                {data.vehicleDetails.type}
                {data.vehicleDetails.model && ` · ${data.vehicleDetails.model}`}
              </p>
              {data.vehicleDetails.plateNumber && (
                <p className="text-slate-400 text-xs font-mono mt-0.5">
                  {data.vehicleDetails.plateNumber}
                </p>
              )}
            </div>
            {data.vehicleDetails.color && (
              <span className="ml-auto text-slate-500 text-xs">
                {data.vehicleDetails.color}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Preferences ── */}
      {(activePrefBadges.length > 0 || chatLabel) && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
            Ride preferences
          </p>
          <div className="flex flex-wrap gap-2">
            {activePrefBadges.map((badge, i) => (
              <span
                key={i}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${badge.color}`}
              >
                {badge.icon}
                {badge.label}
              </span>
            ))}
            {chatLabel && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-200">
                <MessageCircle size={11} />
                {chatLabel}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Boot space ── */}
      {data.acceptsParcels && data.bootSpace && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Package size={16} className="text-amber-600" />
            <p className="text-amber-700 font-semibold text-sm">
              Boot space registered
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            {data.bootSpace.smallPrice && (
              <span className="text-slate-600">
                Small{" "}
                <span className="font-bold text-slate-800">
                  ₹{data.bootSpace.smallPrice}
                </span>
              </span>
            )}
            {data.bootSpace.mediumPrice && (
              <span className="text-slate-600">
                Medium{" "}
                <span className="font-bold text-slate-800">
                  ₹{data.bootSpace.mediumPrice}
                </span>
              </span>
            )}
            {data.bootSpace.largePrice && (
              <span className="text-slate-600">
                Large{" "}
                <span className="font-bold text-slate-800">
                  ₹{data.bootSpace.largePrice}
                </span>
              </span>
            )}
            {data.bootSpace.maxWeightKg && (
              <span className="text-slate-600">
                Max{" "}
                <span className="font-bold text-slate-800">
                  {data.bootSpace.maxWeightKg}kg
                </span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Publish note ── */}
      <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
        <Info size={14} className="text-blue-500 mt-0.5 shrink-0" />
        <p className="text-blue-700 text-xs leading-relaxed">
          Once published, passengers searching any segment of your route
          will see the correct price for their journey. Manage all
          bookings from{" "}
          <strong>My Rides</strong>.
        </p>
      </div>
    </div>
  );
};

export default StepSummary;