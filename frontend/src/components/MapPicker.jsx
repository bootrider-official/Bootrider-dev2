// ✅ src/components/MapPicker.jsx
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

const ClickMarker = ({ onPick }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onPick(e.latlng);
    },
  });

  return position ? <Marker position={position}></Marker> : null;
};

const MapPicker = ({ defaultCenter, onPick }) => {
  return (
    <div className="w-full h-80 rounded-xl overflow-hidden shadow-md">
      <MapContainer
        center={defaultCenter || [20.5937, 78.9629]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickMarker onPick={onPick} />
      </MapContainer>
    </div>
  );
};

export default MapPicker;
