// // // ✅ src/components/StepToCity.jsx
// // import React, { useState, useEffect } from "react";
// // import { geocodeCity } from "../utils/geocode";
// // import MapPicker from "./MapPicker";

// // const StepToCity = ({ data, onUpdate }) => {
// //   const [city, setCity] = useState(data?.to?.name || "");
// //   const [coordinates, setCoordinates] = useState(data?.to?.coordinates || null);

// //   useEffect(() => {
// //     onUpdate({ to: { name: city, coordinates } });
// //   }, [city, coordinates]);

// //   const handleFindCity = async () => {
// //     const coords = await geocodeCity(city);
// //     if (coords) setCoordinates(coords);
// //   };

// //   return (
// //     <div>
// //       <h2 className="text-xl font-semibold mb-3">Destination</h2>
// //       <input
// //         type="text"
// //         value={city}
// //         onChange={(e) => setCity(e.target.value)}
// //         placeholder="Enter destination city"
// //         className="border rounded-lg px-3 py-2 w-full mb-2"
// //       />
// //       <button
// //         onClick={handleFindCity}
// //         className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-3"
// //       >
// //         Show Map
// //       </button>
// //       {coordinates && (
// //         <MapPicker
// //           defaultCenter={[coordinates.lat, coordinates.lng]}
// //           onPick={(latlng) => setCoordinates(latlng)}
// //         />
// //       )}
// //     </div>
// //   );
// // };

// // export default StepToCity;


// import React, { useEffect, useState } from "react";
// import Select from "react-select";

// const StepToCity = ({ data, onUpdate }) => {
//   const [cities, setCities] = useState([]);
//   const [loadingCities, setLoadingCities] = useState(false);

//   useEffect(() => {
//     const fetchCities = async () => {
//       setLoadingCities(true);
//       try {
//         const res = await fetch(
//           "https://countriesnow.space/api/v0.1/countries/cities",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ country: "India" }),
//           }
//         );
//         const data = await res.json();
//         const formatted = data.data.map((city) => ({
//           value: city,
//           label: city,
//         }));
//         setCities(formatted);
//       } catch (error) {
//         console.error("Error fetching cities:", error);
//       } finally {
//         setLoadingCities(false);
//       }
//     };

//     fetchCities();
//   }, []);

//   return (
//     <div className="space-y-4">
//       <label className="block text-lg font-semibold text-gray-700">
//         To (Destination City)
//       </label>

//       <Select
//         isLoading={loadingCities}
//         options={cities}
//         placeholder="Select your destination..."
//         value={
//           data.to
//             ? { value: data.to, label: data.to }
//             : null
//         }
//         onChange={(selected) =>
//           onUpdate({ to: selected?.value || "" })
//         }
//         className="text-gray-700"
//       />
//     </div>
//   );
// };

// export default StepToCity;
import React, { useState, useEffect } from "react";
import { geocodeCity } from "../utils/geocode";
import MapPicker from "./MapPicker";

const StepToCity = ({ data, onUpdate }) => {
  const [city, setCity] = useState(data?.to?.name || "");
  const [coordinates, setCoordinates] = useState(data?.to?.coordinates || null);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: "India" }),
        });
        const data = await res.json();
        setCities(data.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    onUpdate({ to: { name: city, coordinates } });
  }, [city, coordinates]);

  useEffect(() => {
    if (!city.trim()) {
      setFilteredCities([]);
      return;
    }
    const matches = cities
      .filter((c) => c.toLowerCase().includes(city.toLowerCase()))
      .slice(0, 8);
    setFilteredCities(matches);
  }, [city, cities]);

  const handleFindCity = async () => {
    const coords = await geocodeCity(city);
    if (coords) setCoordinates(coords);
  };

  const handleSelectCity = (selected) => {
    setCity(selected);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <h2 className="text-xl font-semibold mb-3">Destination</h2>

      <input
        type="text"
        value={city}
        onChange={(e) => {
          setCity(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Enter destination city"
        className="border rounded-lg px-3 py-2 w-full mb-2"
      />

      {showSuggestions && filteredCities.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-lg w-full max-h-48 overflow-y-auto">
          {filteredCities.map((c, idx) => (
            <li
              key={idx}
              onClick={() => handleSelectCity(c)}
              className="px-3 py-2 cursor-pointer hover:bg-blue-100"
            >
              {c}
            </li>
          ))}
        </ul>
      )}

      {loadingCities && <p className="text-gray-500 text-sm">Loading cities...</p>}

      <button
        onClick={handleFindCity}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-3 mt-2"
      >
        Show Map
      </button>

      {coordinates && (
        <MapPicker
          defaultCenter={[coordinates.lat, coordinates.lng]}
          onPick={(latlng) => setCoordinates(latlng)}
        />
      )}
    </div>
  );
};

export default StepToCity;
