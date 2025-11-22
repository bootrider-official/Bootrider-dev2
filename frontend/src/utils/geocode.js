// // ✅ src/utils/geocode.js
// import axios from "axios";

// export const geocodeCity = async (cityName) => {
//   if (!cityName) return null;
//   try {
//     const response = await axios.get("https://nominatim.openstreetmap.org/search", {
//       params: {
//         q: cityName,
//         format: "json",
//         addressdetails: 1,
//         limit: 1,
//       },
//     });

//     if (response.data.length > 0) {
//       const { lat, lon } = response.data[0];
//       return { lat: parseFloat(lat), lng: parseFloat(lon) };
//     } else {
//       console.warn(`No coordinates found for ${cityName}`);
//       return null;
//     }
//   } catch (err) {
//     console.error("Geocode error:", err);
//     return null;
//   }
// };



import axios from "axios";

export const geocodeCity = async (cityName) => {
  if (!cityName) return null;

  try {
    const response = await axios.get("http://localhost:5000/api/geocode", {
      params: { city: cityName },
    });

    if (response.data && response.data.lat && response.data.lng) {
      return {
        lat: parseFloat(response.data.lat),
        lng: parseFloat(response.data.lng),
        name: response.data.name,
      };
    }

    console.warn("No coordinates found:", cityName);
    return null;
  } catch (err) {
    console.error("Geocode error:", err);
    return null;
  }
};
