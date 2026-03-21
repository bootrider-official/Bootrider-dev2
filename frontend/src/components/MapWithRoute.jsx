import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";

// ── Fix default marker icons ─────────────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ── Custom colored markers ────────────────────────────────────────────────────
const createIcon = (color) =>
  L.divIcon({
    className: "",
    html: `<div style="
      width:14px;height:14px;
      background:${color};
      border:2px solid white;
      border-radius:50%;
      box-shadow:0 2px 6px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

const startIcon = createIcon("#3b82f6");  // blue
const stopIcon = createIcon("#f59e0b");  // amber
const endIcon = createIcon("#10b981");  // green

// ── Auto-fit map to route bounds ──────────────────────────────────────────────
const FitBounds = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (points && points.length > 1) {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [points, map]);
  return null;
};

// ── Fetch road route from OpenRouteService ────────────────────────────────────
const fetchRoute = async (waypoints, apiKey) => {
  try {
    const coords = waypoints.map((p) => [p.lng, p.lat]);
    const res = await fetch(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey,
        },
        body: JSON.stringify({ coordinates: coords }),
      }
    );
    const data = await res.json();
    if (data.features && data.features[0]) {
      return data.features[0].geometry.coordinates.map(([lng, lat]) => ({
        lat,
        lng,
      }));
    }
    return null;
  } catch (err) {
    console.error("❌ Route fetch error:", err.message);
    return null;
  }
};

// ── Main component ────────────────────────────────────────────────────────────
const MapWithRoute = ({ waypoints }) => {
  const [routePoints, setRoutePoints] = useState([]);
  const [loading, setLoading] = useState(false);

  const ORS_KEY = import.meta.env.VITE_ORS_API_KEY || "";

  useEffect(() => {
    if (!waypoints || waypoints.length < 2) return;

    const loadRoute = async () => {
      setLoading(true);

      if (ORS_KEY) {
        const route = await fetchRoute(waypoints, ORS_KEY);
        if (route) {
          setRoutePoints(route);
          setLoading(false);
          return;
        }
      }

      // ── Fallback: straight lines if no key or fetch failed ──
      setRoutePoints(waypoints.map((p) => ({ lat: p.lat, lng: p.lng })));
      setLoading(false);
    };

    loadRoute();
  }, [waypoints, ORS_KEY]);

  if (!waypoints || waypoints.length < 2) return null;

  const center = waypoints[Math.floor(waypoints.length / 2)];

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: "380px" }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={7}
        style={{ width: "100%", height: "100%" }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* ── Route line ── */}
        {routePoints.length > 1 && (
          <Polyline
            positions={routePoints.map((p) => [p.lat, p.lng])}
            pathOptions={{
              color: "#3b82f6",
              weight: 4,
              opacity: 0.85,
            }}
          />
        )}

        {/* ── Markers ── */}
        {waypoints.map((point, index) => {
          const icon =
            index === 0
              ? startIcon
              : index === waypoints.length - 1
                ? endIcon
                : stopIcon;
          return (
            <Marker
              key={index}
              position={[point.lat, point.lng]}
              icon={icon}
            >
              <Popup>
                <span className="text-sm font-medium">
                  {index === 0
                    ? "Pickup"
                    : index === waypoints.length - 1
                      ? "Destination"
                      : `Stop ${index}`}
                  {point.name ? ` — ${point.name}` : ""}
                </span>
              </Popup>
            </Marker>
          );
        })}

        <FitBounds points={waypoints} />
      </MapContainer>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl">
          <div className="flex items-center gap-2 bg-black/60 px-4 py-2 rounded-full">
            <div className="w-4 h-4 border-2 border-white/20 border-t-blue-400 rounded-full animate-spin" />
            <span className="text-white text-xs">Loading route...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapWithRoute;