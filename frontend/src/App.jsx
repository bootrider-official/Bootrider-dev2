import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "leaflet/dist/leaflet.css";

import Navbar from "./components/Navbar";

// ── User pages ───────────────────────────────────────────────────────────────
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import KYCForm from "./pages/KYCForm";
import CreateRides from "./pages/CreateRides";
import SearchResults from "./pages/SearchResults";
import RideDetails from "./pages/RideDetails";
import MyRides from "./pages/MyRides";
import MyBookings from "./pages/MyBookings";
import ProfilePage from "./pages/ProfilePage";
import ParcelTracking from "./pages/ParcelTracking";
import AboutPage from "./pages/AboutPage";
import TermsPage from "./pages/TermsPage";

// ── Transporter pages ────────────────────────────────────────────────────────
import TransporterLogin from "./pages/TransporterLogin";
import TransporterSignup from "./pages/TransporterSignup";
import EnterpriseDashboard from "./pages/EnterpriseDashboard";
import CreateEnterpriseListing from "./pages/CreateEnterpriseListing";
import ForgotPassword from "./pages/ForgotPassword";

// ── Route guards ─────────────────────────────────────────────────────────────
import ProtectedRoute from "./components/ProtectedRoute";
import VerifiedRoute from "./components/VerifiedRoute";

// ── 404 ──────────────────────────────────────────────────────────────────────
const NotFound = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center">
    <div className="text-center">
      <p className="text-8xl font-black text-slate-100 mb-4">404</p>
      <p className="text-slate-500 text-lg mb-2">Page not found</p>
      <p className="text-slate-400 text-sm mb-8">
        The page you're looking for doesn't exist.
      </p>

      <a href="/"
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition">
        Go home
      </a>
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>

        {/* ══ Public routes ══ */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/ride/:id" element={<RideDetails />} />

        {/* ══ Transporter auth ══ */}
        <Route path="/transporter/login" element={<TransporterLogin />} />
        <Route path="/transporter/signup" element={<TransporterSignup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/terms" element={<TermsPage />} />
        {/* ══ Auth required ══ */}
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-rides"
          element={
            <ProtectedRoute>
              <MyRides />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kyc-form"
          element={
            <ProtectedRoute>
              <KYCForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parcel/:id"
          element={
            <ProtectedRoute>
              <ParcelTracking />
            </ProtectedRoute>
          }
        />

        {/* ══ KYC verified required ══ */}
        <Route element={<VerifiedRoute />}>
          <Route path="/create-rides" element={<CreateRides />} />
        </Route>

        {/* ══ Enterprise routes ══ */}
        <Route
          path="/enterprise/dashboard"
          element={
            <ProtectedRoute>
              <EnterpriseDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/enterprise/create"
          element={
            <ProtectedRoute>
              <CreateEnterpriseListing />
            </ProtectedRoute>
          }
        />

        {/* ══ 404 ══ */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
};

export default App;