// ✅ src/components/StepStops.jsx
import React, { useState } from "react";
import { geocodeCity } from "../utils/geocode";
import MapPicker from "./MapPicker";

const StepStops = ({ data, onUpdate }) => {
  const [stops, setStops] = useState(data?.stops || []);

  const addStop = async () => {
    setStops([...stops, { name: "", coordinates: null }]);
  };

  const updateStop = (index, key, value) => {
    const updated = [...stops];
    updated[index][key] = value;
    setStops(updated);
    onUpdate({ stops: updated });
  };

  const handleGeocode = async (index) => {
    const city = stops[index].name;
    const coords = await geocodeCity(city);
    if (coords) updateStop(index, "coordinates", coords);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Optional Stops</h2>
      {stops.map((stop, i) => (
        <div key={i} className="border p-3 mb-3 rounded-lg">
          <input
            type="text"
            value={stop.name}
            onChange={(e) => updateStop(i, "name", e.target.value)}
            placeholder="Stop city"
            className="border rounded-lg px-3 py-2 w-full mb-2"
          />
          <button
            onClick={() => handleGeocode(i)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-3"
          >
            Show Map
          </button>
          {stop.coordinates && (
            <MapPicker
              defaultCenter={[stop.coordinates.lat, stop.coordinates.lng]}
              onPick={(latlng) => updateStop(i, "coordinates", latlng)}
            />
          )}
        </div>
      ))}
      <button
        onClick={addStop}
        className="bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        + Add Stop
      </button>
    </div>
  );
};

export default StepStops;
