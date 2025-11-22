// 📄 src/components/MapWithRoute.jsx
import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

const RoutingMachine = ({ waypoints }) => {
  const map = useMap();

  useEffect(() => {
    if (!waypoints || waypoints.length < 2) return;

    const control = L.Routing.control({
      waypoints: waypoints.map(
        (point) => L.latLng(point.lat, point.lng)
      ),
      lineOptions: {
        styles: [{ color: "#1E90FF", weight: 5 }],
      },
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      routeWhileDragging: false,
    }).addTo(map);

    return () => map.removeControl(control);
  }, [map, waypoints]);

  return null;
};

const MapWithRoute = ({ waypoints }) => {
  return (
    <div className="w-full h-96 rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={[20.5937, 78.9629]} // center of India
        zoom={5}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {waypoints && waypoints.length > 1 && (
          <RoutingMachine waypoints={waypoints} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapWithRoute;
