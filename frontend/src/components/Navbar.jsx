import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // for mobile menu icons
import { useState } from "react";

const Navbar = () => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

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
          <Link
            to="/"
            className="hover:text-blue-200 transition duration-200 font-medium"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="hover:text-blue-200 transition duration-200 font-medium"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="hover:text-blue-200 transition duration-200 font-medium"
          >
            Contact
          </Link>

          {token ? (
            <>
              <span className="bg-white/10 text-blue-100 px-4 py-2 rounded-full font-medium shadow-inner">
                Welcome 👋
              </span>
              <button
                onClick={() => dispatch(logout())}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="bg-white text-blue-700 px-5 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transition duration-200"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="bg-blue-500 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-600 transition duration-200"
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
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="hover:text-blue-200 transition"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="hover:text-blue-200 transition"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="hover:text-blue-200 transition"
          >
            Contact
          </Link>

          {token ? (
            <>
              <span className="font-semibold">Welcome 👋</span>
              <button
                onClick={() => {
                  dispatch(logout());
                  setMenuOpen(false);
                }}
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
