import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const VerifiedRoute = () => {
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);
  const [checking, setChecking] = useState(true);
  const [hasRides, setHasRides] = useState(false);

  useEffect(() => {
    const checkRides = async () => {
      if (!token) {
        setChecking(false);
        return;
      }
      try {
        const res = await axios.get(`${BASE_URL}/ride/my-rides`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // has at least one existing ride
        setHasRides(res.data?.length > 0);
      } catch {
        // 404 means no rides — that's fine
        setHasRides(false);
      } finally {
        setChecking(false);
      }
    };
    checkRides();
  }, [token]);

  // Not logged in
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Still checking ride count
  if (checking) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  // ✅ Already verified — always allow
  if (user?.kycStatus === "verified") return <Outlet />;

  // ✅ Has existing rides — allow without KYC
  if (hasRides) return <Outlet />;

  // ❌ First ride + not verified — send to KYC
  return <Navigate to="/kyc-form" replace />;
};

export default VerifiedRoute;