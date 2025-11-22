import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ShieldCheck,
  ShieldAlert,
  Shield,
  LogOut,
  User,
  Car,
  PackageSearch,
} from "lucide-react";

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    setMenuOpen(false);
  };

  // 🧠 Handle KYC badge click
  const handleKycClick = () => {
    if (user?.kycStatus === "not_started" || user?.kycStatus === "pending") {
      navigate("/kyc-form");
    }
  };

  // 🎖️ Render KYC Badge
  const renderKycBadge = () => {
    if (!user) return null;

    let badgeStyle =
      "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition select-none shadow-sm";
    let icon, label, color, isClickable = false;

    switch (user.kycStatus) {
      case "verified":
        icon = <ShieldCheck size={14} />;
        label = "Verified";
        color = "bg-green-600 text-white";
        break;
      case "pending":
        icon = <ShieldAlert size={14} />;
        label = "Pending";
        color =
          "bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer animate-pulse";
        isClickable = true;
        break;
      default:
        icon = <Shield size={14} />;
        label = "Not Started";
        color =
          "bg-red-500 text-white hover:bg-red-600 cursor-pointer animate-pulse";
        isClickable = true;
        break;
    }

    return (
      <div
        onClick={isClickable ? handleKycClick : undefined}
        className={`${badgeStyle} ${color}`}
        title={
          user.kycStatus === "verified"
            ? "Your KYC is verified ✅"
            : "Click to complete your KYC"
        }
      >
        {icon}
        <span>{label}</span>
      </div>
    );
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 shadow-md sticky top-0 z-50 backdrop-blur-md border-b border-blue-600/30">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* 🌐 Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2"
        >
          <Car size={28} className="text-blue-200" />
          Boot<span className="text-blue-300">Rider</span>
        </Link>

        {/* 🌆 Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-white font-medium">
          <Link to="/" className="hover:text-blue-300 transition">
            Home
          </Link>

          <Link to="/my-rides" className="hover:text-blue-300 transition">
            My Rides
          </Link>

          <Link to="/my-bookings" className="hover:text-blue-300 transition flex items-center gap-1">
            <PackageSearch size={16} />
            My Bookings
          </Link>

          <Link to="/contact" className="hover:text-blue-300 transition">
            Contact
          </Link>

          {/* 🔐 Auth Section */}
          {isAuthenticated ? (
            <div className="flex items-center gap-5">
              {renderKycBadge()}

              <span className="bg-white/10 text-blue-100 px-4 py-2 rounded-full shadow-inner">
                <User size={16} className="inline mr-1" />
                {user?.name?.split(" ")[0] || "User"}
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 font-semibold shadow-md transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/signup"
                className="bg-white text-blue-700 px-5 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transition"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="bg-blue-500 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-600 transition"
              >
                Login
              </Link>
            </div>
          )}
        </div>

        {/* 📱 Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* 📱 Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-blue-800/90 backdrop-blur-md text-white flex flex-col items-center gap-4 py-6 shadow-inner transition-all">
          <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-blue-300">
            Home
          </Link>
          <Link to="/my-rides" onClick={() => setMenuOpen(false)} className="hover:text-blue-300">
            My Rides
          </Link>
          <Link to="/my-bookings" onClick={() => setMenuOpen(false)} className="hover:text-blue-300">
            My Bookings
          </Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)} className="hover:text-blue-300">
            Contact
          </Link>

          {isAuthenticated ? (
            <>
              {renderKycBadge()}
              <span className="font-semibold">
                Hi, {user?.name?.split(" ")[0] || "User"} 👋
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg font-semibold shadow-md flex items-center gap-1"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="bg-white text-blue-700 px-6 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transition"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-600 transition"
              >
                Login
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
