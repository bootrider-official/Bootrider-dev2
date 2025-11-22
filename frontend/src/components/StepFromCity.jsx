// // // ✅ src/components/StepFromCity.jsx
// // import React, { useState, useEffect } from "react";
// // import { geocodeCity } from "../utils/geocode";
// // import MapPicker from "./MapPicker";

// // const StepFromCity = ({ data, onUpdate }) => {
// //   const [city, setCity] = useState(data?.from?.name || "");
// //   const [coordinates, setCoordinates] = useState(data?.from?.coordinates || null);

// //   useEffect(() => {
// //     onUpdate({ from: { name: city, coordinates } });
// //   }, [city, coordinates]);

// //   const handleFindCity = async () => {
// //     const coords = await geocodeCity(city);
// //     if (coords) setCoordinates(coords);
// //   };

// //   return (
// //     <div>
// //       <h2 className="text-xl font-semibold mb-3">Pickup Location</h2>
// //       <input
// //         type="text"
// //         value={city}
// //         onChange={(e) => setCity(e.target.value)}
// //         placeholder="Enter city name"
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

// // export default StepFromCity;

// import React, { useEffect, useState } from "react";
// import Select from "react-select";

// const StepFromCity = ({ data, onUpdate }) => {
//   const [cities, setCities] = useState([]);
//   const [loadingCities, setLoadingCities] = useState(false);

//   // 🌆 Fetch city list (India)
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
//         From (Pickup City)
//       </label>

//       <Select
//         isLoading={loadingCities}
//         options={cities}
//         placeholder="Select your starting city..."
//         value={
//           data.from
//             ? { value: data.from, label: data.from }
//             : null
//         }
//         onChange={(selected) =>
//           onUpdate({ from: selected?.value || "" })
//         }
//         className="text-gray-700"
//       />
//     </div>
//   );
// };

// export default StepFromCity;
import React, { useState, useEffect } from "react";
import { geocodeCity } from "../utils/geocode";
import MapPicker from "./MapPicker";

const StepFromCity = ({ data, onUpdate }) => {
  const [city, setCity] = useState(data?.from?.name || "");
  const [coordinates, setCoordinates] = useState(data?.from?.coordinates || null);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 🌆 Fetch all Indian cities once
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

  // 🔁 Update parent whenever city or coordinates change
  useEffect(() => {
    onUpdate({ from: { name: city, coordinates } });
  }, [city, coordinates]);

  // 🔍 Filter cities dynamically while typing
  useEffect(() => {
    if (!city.trim()) {
      setFilteredCities([]);
      return;
    }
    const matches = cities
      .filter((c) => c.toLowerCase().includes(city.toLowerCase()))
      .slice(0, 8); // limit results
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
      <h2 className="text-xl font-semibold mb-3">Pickup Location</h2>

      <input
        type="text"
        value={city}
        onChange={(e) => {
          setCity(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Enter city name"
        className="border rounded-lg px-3 py-2 w-full mb-2"
      />

      {/* 🔽 City suggestions dropdown */}
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

export default StepFromCity;
