import express from "express";
import axios from "axios";

const router = express.Router();

/**
 * GET /api/geocode?city=<cityname>
 * Fetch lat/lng for a city using OpenStreetMap Nominatim.
 */
router.get("/", async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: "City name required" });

  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: city,
        format: "json",
        addressdetails: 1,
        limit: 1,
      },
      headers: {
        // ✅ Replace with your real app & contact info
        "User-Agent": "BootriderApp/1.0 (contact@bootrider.in)",
        "Accept-Language": "en",
      },
      timeout: 10000, // 10s safety
    });

    if (!response.data || response.data.length === 0) {
      return res.status(404).json({ error: "City not found" });
    }

    const { lat, lon, display_name } = response.data[0];
    res.json({
      lat: parseFloat(lat),
      lng: parseFloat(lon),
      name: display_name,
    });
  } catch (error) {
    console.error("❌ Geocode error:", error.response?.status, error.message);
    res.status(500).json({
      error: "Geocoding failed",
      details: error.response?.data || error.message,
    });
  }
});

export default router;
