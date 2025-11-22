// ✅ src/components/StepSummary.jsx
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";

const markers = {
  start: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [32, 32],
  }),
  stop: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854929.png",
    iconSize: [26, 26],
  }),
  end: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
    iconSize: [32, 32],
  }),
};

const FitBounds = ({ positions }) => {
  const map = useMap();
  useEffect(() => {
    if (positions.length) map.fitBounds(positions);
  }, [map, positions]);
  return null;
};

const StepSummary = ({ data }) => {
  if (!data.from || !data.to) return <p>Please complete all steps first.</p>;

  // Build ordered points: from → stops → to
  const waypoints = [
    data.from.coordinates,
    ...(data.stops?.map((s) => s.coordinates) || []),
    data.to.coordinates,
  ].filter(Boolean);

  const names = [
    data.from.name,
    ...(data.stops?.map((s) => s.name) || []),
    data.to.name,
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Route Summary</h2>
      <div className="w-full h-96 rounded-xl overflow-hidden shadow-lg mb-5">
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {waypoints.map((point, i) => (
            <Marker
              key={i}
              position={[point.lat, point.lng]}
              icon={
                i === 0
                  ? markers.start
                  : i === waypoints.length - 1
                  ? markers.end
                  : markers.stop
              }
            >
              <Tooltip>{names[i]}</Tooltip>
            </Marker>
          ))}

          <Polyline positions={waypoints.map((p) => [p.lat, p.lng])} color="#2563EB" weight={5} />
          <FitBounds positions={waypoints.map((p) => [p.lat, p.lng])} />
        </MapContainer>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-2">Ride Details</h3>
        <p>
          <strong>From:</strong> {data.from.name}
        </p>
        {data.stops?.length > 0 && (
          <p>
            <strong>Stops:</strong> {data.stops.map((s) => s.name).join(", ")}
          </p>
        )}
        <p>
          <strong>To:</strong> {data.to.name}
        </p>
        <p>
          <strong>Date:</strong> {data.date} &nbsp; | &nbsp;
          <strong>Time:</strong> {data.time}
        </p>
        <p>
          <strong>Seats:</strong> {data.availableSeats} &nbsp; | &nbsp;
          <strong>Price per Seat:</strong> ₹{data.pricePerSeat}
        </p>
      </div>
    </div>
  );
};

export default StepSummary;
