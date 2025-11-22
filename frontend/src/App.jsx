import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import "leaflet/dist/leaflet.css";

// import TransporterDashboard from "./pages/TransporterDashboard";
import KYCForm from "./pages/KYCForm";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateRides from "./pages/CreateRides";
import VerifiedRoute from "./components/VerifiedRoute";
import SearchResults from "./pages/SearchResults";
import MyRides from "./pages/MyRides";
import RideDetails from "./pages/RideDetails";
import MyBookings from "./pages/MyBookings";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route element={<VerifiedRoute />}>
          <Route path="/create-rides" element={<CreateRides />} />
        </Route>
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/my-rides" element={<MyRides />} />
        <Route path="/ride/:id" element={<RideDetails />} />
        <Route path="/my-bookings" element={<MyBookings />} />


        <Route
          path="/kyc-form"
          element={
            <ProtectedRoute role="transporter">
              <KYCForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;