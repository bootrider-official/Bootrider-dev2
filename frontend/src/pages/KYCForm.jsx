import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const KYCForm = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const [formData, setFormData] = useState({
    vehicleType: "",
    registrationNo: "",
    photo: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please log in to submit KYC.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("vehicleType", formData.vehicleType);
      data.append("registrationNo", formData.registrationNo);
      data.append("file", formData.photo);

      const res = await axios.post(`${BASE_URL}/users/transporter/profile`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert(res.data.message || "✅ KYC details submitted successfully!");
      console.log("Response:", res.data);
    } catch (error) {
      console.error("❌ Error submitting KYC:", error);
      alert(
        error.response?.data?.message ||
          "Failed to submit KYC details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-green-50 to-green-100 py-10 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Transporter KYC Form
        </h2>

        <p className="text-center text-gray-500 mb-6">
          {user
            ? `Hello, ${user.name}. Complete your transporter verification.`
            : "Please log in first."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Vehicle Type
            </label>
            <input
              type="text"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              placeholder="e.g. Truck, Van, Car"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Registration Number
            </label>
            <input
              type="text"
              name="registrationNo"
              value={formData.registrationNo}
              onChange={handleChange}
              placeholder="e.g. DL01AB1234"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Upload Vehicle Photo
            </label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-gray-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-2 rounded-lg shadow-md transition duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? "Submitting..." : "Submit for Verification"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default KYCForm;
