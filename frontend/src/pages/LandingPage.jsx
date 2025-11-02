import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const LandingPage = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    passengers: 1,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://countriesnow.space/api/v0.1/countries/cities",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country: "India" }),
          }
        );
        const data = await res.json();
        const formattedCities = data.data.map((city) => ({
          value: city,
          label: city,
        }));
        setCities(formattedCities);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(
      `/search-results?from=${formData.from.value}&to=${formData.to.value}&date=${formData.date}&passengers=${formData.passengers}`
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-800">
      {/* Hero Section with Search */}
      <header className="w-full py-24 px-6 text-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white shadow-lg">
        <h1 className="text-6xl font-extrabold mb-6 tracking-tight drop-shadow-md">
          BootRider
        </h1>
        <p className="text-xl max-w-3xl mx-auto leading-relaxed mb-10">
          Find rides and deliveries faster than ever before.
          <br />
          <span className="font-semibold text-blue-200">
            Smart carpooling and seamless parcel delivery.
          </span>
        </p>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-4 md:gap-6"
        >
          <div className="w-full md:flex-1">
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              From
            </label>
            <Select
              options={cities}
              isLoading={loading}
              onChange={(value) => handleChange("from", value)}
              placeholder="Select city"
              className="text-gray-700"
            />
          </div>

          <div className="w-full md:flex-1">
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              To
            </label>
            <Select
              options={cities}
              isLoading={loading}
              onChange={(value) => handleChange("to", value)}
              placeholder="Select city"
              className="text-gray-700"
            />
          </div>

          <div className="w-full md:w-40">
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="w-full md:w-40">
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Passengers
            </label>
            <input
              type="number"
              min="1"
              value={formData.passengers}
              onChange={(e) =>
                handleChange("passengers", Math.max(1, e.target.value))
              }
              className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-semibold shadow-md transition-all hover:scale-105"
          >
            Search
          </button>
        </form>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mt-10">
          <button
            onClick={() => navigate("/create-rides")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition-transform transform hover:scale-105"
          >
            🚗 Create Ride
          </button>
          <button
            onClick={() => navigate("/send-parcel")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition-transform transform hover:scale-105"
          >
            📦 Send Parcel
          </button>
        </div>
      </header>

      {/* About Section */}
      <section className="py-16 px-8 max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-blue-700 mb-6">
          What is BootRider?
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          BootRider is your all-in-one mobility and delivery platform. Whether
          you want to
          <span className="font-semibold text-blue-700"> carpool</span> to work
          or
          <span className="font-semibold text-blue-700"> send a parcel</span>{" "}
          across town, BootRider connects you with verified drivers headed your
          way — optimizing time, cost, and environmental impact.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-700 to-blue-900 text-white text-center py-6 mt-auto">
        <p className="text-sm opacity-90">
          © {new Date().getFullYear()} BootRider — Drive • Deliver • Earn •
          Connect
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
