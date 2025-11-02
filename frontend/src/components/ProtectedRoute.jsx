import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role-based restriction (optional)
  // if (role && user?.role !== role) {
  //   return <Navigate to="/" replace />;
  // }

  return children;
};

export default ProtectedRoute;
