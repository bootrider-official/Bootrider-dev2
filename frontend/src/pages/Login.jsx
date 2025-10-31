import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${BASE_URL}/auth/send-otp`, {
        phone,
        type: "login",
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

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${BASE_URL}/auth/verify-otp`, {
        sessionId,
        otp,
      });

      setMessage(res.data.message || "Login successful!");
      dispatch(loginSuccess(res.data.token));
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Optionally redirect user here
      // window.location.href = "/dashboard";
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
          {otpSent ? "Verify OTP" : "Login"}
        </h2>

        {message && (
          <p className="text-center text-sm mb-4 text-blue-600">{message}</p>
        )}

        <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
          {!otpSent ? (
            <input
              type="text"
              name="phone"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 mb-3 border rounded-md"
              required
            />
          ) : (
            <>
              <p className="text-center text-gray-600 mb-4">
                OTP sent to <b>{phone}</b>
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
              ? "Verify & Login"
              : "Send OTP"}
          </button>
        </form>

        {!otpSent && (
          <p className="text-center mt-4 text-sm text-gray-600">
            Don’t have an account?{" "}
            <a href="/signup" className="text-green-600 font-semibold">
              Sign Up
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
