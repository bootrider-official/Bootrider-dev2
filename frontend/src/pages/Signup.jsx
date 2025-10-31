import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "individual",
  });

  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  // handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // send otp
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${BASE_URL}/auth/send-otp`, {
        phone: formData.phone,
        type: "signup",
        name: formData.name,
        email: formData.email,
        role: formData.role,
      });

      setOtpSent(true);
      setSessionId(res.data.sessionId);
      setMessage(res.data.message || "OTP sent successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // verify otp (complete signup)
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${BASE_URL}/auth/verify-otp`, {
        sessionId,
        otp,
      });

      setMessage(res.data.message || "Signup successful!");
      localStorage.setItem("token", res.data.token);
      dispatch(loginSuccess(res.data.token));
      // redirect or update app state here if needed
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {otpSent ? "Verify OTP" : "Sign Up"}
        </h2>

        {message && (
          <p className="text-center text-sm mb-4 text-blue-600">{message}</p>
        )}

        <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
          {!otpSent ? (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 mb-3 border rounded-md"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 mb-3 border rounded-md"
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Mobile Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 mb-3 border rounded-md"
                required
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2 mb-3 border rounded-md"
              >
                <option value="individual">Individual</option>
                <option value="transporter">Transporter</option>
              </select>
            </>
          ) : (
            <>
              <p className="text-center text-gray-600 mb-4">
                OTP sent to <b>{formData.phone}</b>
              </p>
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 mb-3 border rounded-md"
                required
              />
            </>
          )}

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : otpSent
              ? "Verify & Sign Up"
              : "Send OTP"}
          </button>
        </form>

        {!otpSent && (
          <p className="text-center mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-green-600 font-semibold">
              Login
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default Signup;
