import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShieldCheck, ShieldAlert, Shield } from "lucide-react";

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

  // ✅ When badge is clicked, navigate to /kyc-form if needed
  const handleKycClick = () => {
    if (
      user?.kycStatus === "not_started" ||
      user?.kycStatus === "pending"
    ) {
      navigate("/kyc-form");
    }
  };

  // ✅ KYC Badge visible for everyone
  const renderKycBadge = () => {
    if (!user) return null;

    let badgeStyle =
      "px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1 transition select-none";
    let icon, label, color, isClickable = false;

    switch (user.kycStatus) {
      case "verified":
        icon = <ShieldCheck size={16} />;
        label = "KYC Verified";
        color = "bg-green-600 text-white";
        break;
      case "pending":
        icon = <ShieldAlert size={16} />;
        label = "KYC Pending";
        color = "bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer";
        isClickable = true;
        break;
      default:
        icon = <Shield size={16} />;
        label = "KYC Not Started";
        color = "bg-red-500 text-white hover:bg-red-600 cursor-pointer";
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
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md"
        >
          BootRider
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center text-white">
          <Link to="/" className="hover:text-blue-200 transition font-medium">
            Home
          </Link>
          <Link to="/my-rides" className="hover:text-blue-200 transition font-medium">
  My Rides
</Link>

          <Link to="/contact" className="hover:text-blue-200 transition font-medium">
            Contact
          </Link>

          {isAuthenticated ? (
            <>
              {/* ✅ KYC Badge visible for all users */}
              {renderKycBadge()}

              <span className="bg-white/10 text-blue-100 px-4 py-2 rounded-full font-medium shadow-inner">
                Hi, {user?.name?.split(" ")[0] || "User"} 👋
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-blue-700 text-white flex flex-col items-center gap-4 py-6 shadow-inner transition-all">
          <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-blue-200">
            Home
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="hover:text-blue-200">
            About
          </Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)} className="hover:text-blue-200">
            Contact
          </Link>

          {isAuthenticated ? (
            <>
              {renderKycBadge()}
              <span className="font-semibold">Hi, {user?.name || "User"} 👋</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg font-semibold shadow-md"
              >
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
