// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import LandingPage from "./pages/LandingPage";
// import Signup from "./pages/Signup";
// import Login from "./pages/Login";
// import "leaflet/dist/leaflet.css";

// // import TransporterDashboard from "./pages/TransporterDashboard";
// import KYCForm from "./pages/KYCForm";
// import ProtectedRoute from "./components/ProtectedRoute";
// import CreateRides from "./pages/CreateRides";
// import VerifiedRoute from "./components/VerifiedRoute";
// import SearchResults from "./pages/SearchResults";
// import MyRides from "./pages/MyRides";
// import RideDetails from "./pages/RideDetails";
// import MyBookings from "./pages/MyBookings";

// const App = () => {
//   return (
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/login" element={<Login />} />
//         <Route element={<VerifiedRoute />}>
//           <Route path="/create-rides" element={<CreateRides />} />
//         </Route>
//         <Route path="/search-results" element={<SearchResults />} />
//         <Route path="/my-rides" element={<MyRides />} />
//         <Route path="/ride/:id" element={<RideDetails />} />
//         <Route path="/my-bookings" element={<MyBookings />} />


//         <Route
//           path="/kyc-form"
//           element={
//             <ProtectedRoute role="transporter">
//               <KYCForm />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// };

// export default App;


import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import CreateEnterpriseListing from "./pages/CreateEnterpriseListing";
import ParcelTracking from "./pages/ParcelTracking";
import Navbar from "./components/Navbar";

// ── Pages ────────────────────────────────────────────────────────────────────
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import KYCForm from "./pages/KYCForm";
import CreateRides from "./pages/CreateRides";
import SearchResults from "./pages/SearchResults";
import RideDetails from "./pages/RideDetails";
import MyRides from "./pages/MyRides";
import MyBookings from "./pages/MyBookings";
import TransporterLogin from "./pages/TransporterLogin";
import TransporterSignup from "./pages/TransporterSignup";
import EnterpriseDashboard from "./pages/EnterpriseDashboard";
// ── Route guards ─────────────────────────────────────────────────────────────
import ProtectedRoute from "./components/ProtectedRoute";
import VerifiedRoute from "./components/VerifiedRoute";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>

        {/* ── Public ── */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/ride/:id" element={<RideDetails />} />

        {/* ── Auth required ── */}
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
        <Route path="/transporter/login" element={<TransporterLogin />} />
        <Route path="/transporter/signup" element={<TransporterSignup />} />

        {/* ── KYC verified required ── */}
        <Route element={<VerifiedRoute />}>
          <Route path="/create-rides" element={<CreateRides />} />
        </Route>
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
        <Route
          path="/parcel/:id"
          element={
            <ProtectedRoute>
              <ParcelTracking />
            </ProtectedRoute>
          }
        />

        {/* ── 404 ── */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
              <div className="text-center">
                <p className="text-6xl font-bold text-white/10 mb-4">404</p>
                <p className="text-gray-500 mb-6">Page not found</p>
                <a href="/" className="text-blue-400 hover:text-blue-300 text-sm transition">
                  Go home
                </a>
              </div>
            </div>
          }
        />
      </Routes>

    </Router >
  );
};

export default App;