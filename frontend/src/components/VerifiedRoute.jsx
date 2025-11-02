import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const VerifiedRoute = () => {
  const user = useSelector((state) => state.auth.user);

  // if user data not loaded yet
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // check verification status (you can adjust the property name)
  if (user.kycStatus !== "verified") {
    return <Navigate to="/kyc-form" replace />;
  }

  // if verified, allow route
  return <Outlet />;
};

export default VerifiedRoute;
