import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu, X, ShieldCheck, ShieldAlert, Shield,
  LogOut, Car, PackageSearch, LayoutDashboard,
  Plus, ChevronDown, Truck, User, Search,
  BookOpen, Star
} from "lucide-react";

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isTransporter = user?.role === "transporter";

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    setMenuOpen(false);
    setDropdownOpen(false);
    navigate("/");
  };

  const handleKycClick = () => {
    if (user?.kycStatus !== "verified") navigate("/kyc-form");
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `text-sm font-medium transition-colors px-1 py-0.5 border-b-2 ${isActive(path)
      ? "text-blue-600 border-blue-600"
      : "text-slate-600 hover:text-blue-600 border-transparent"
    }`;

  // ── KYC Badge ─────────────────────────────────────────────────────────────
  const KycBadge = () => {
    if (!user) return null;
    const configs = {
      verified: {
        icon: <ShieldCheck size={12} />,
        label: "Verified",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      },
      pending: {
        icon: <ShieldAlert size={12} />,
        label: "KYC Pending",
        className: "bg-amber-50 text-amber-700 border-amber-200 cursor-pointer animate-pulse",
      },
      not_started: {
        icon: <Shield size={12} />,
        label: "Verify KYC",
        className: "bg-red-50 text-red-600 border-red-200 cursor-pointer",
      },
    };
    const config = configs[user.kycStatus] || configs.not_started;
    return (
      <button
        onClick={handleKycClick}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition ${config.className}`}
      >
        {config.icon}
        {config.label}
      </button>
    );
  };

  // ── User nav links ─────────────────────────────────────────────────────────
  const UserLinks = () => (
    <>
      <Link to="/" className={navLinkClass("/")}>
        Home
      </Link>
      <Link to="/search-results" className={navLinkClass("/search-results")}>
        <span className="flex items-center gap-1.5">
          <Search size={14} />
          Find rides
        </span>
      </Link>
      <Link to="/my-bookings" className={navLinkClass("/my-bookings")}>
        <span className="flex items-center gap-1.5">
          <PackageSearch size={14} />
          My bookings
        </span>
      </Link>
      <Link to="/my-rides" className={navLinkClass("/my-rides")}>
        <span className="flex items-center gap-1.5">
          <Car size={14} />
          My rides
        </span>
      </Link>
    </>
  );

  // ── Transporter nav links ──────────────────────────────────────────────────
  const TransporterLinks = () => (
    <>
      <Link to="/enterprise/dashboard" className={navLinkClass("/enterprise/dashboard")}>
        <span className="flex items-center gap-1.5">
          <LayoutDashboard size={14} />
          Dashboard
        </span>
      </Link>
      <Link to="/enterprise/create" className={navLinkClass("/enterprise/create")}>
        <span className="flex items-center gap-1.5">
          <Plus size={14} />
          New listing
        </span>
      </Link>
      <Link to="/enterprise/search" className={navLinkClass("/enterprise/search")}>
        <span className="flex items-center gap-1.5">
          <Search size={14} />
          Find loads
        </span>
      </Link>
    </>
  );

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${isTransporter ? "bg-amber-500" : "bg-blue-600"
            }`}>
            {isTransporter
              ? <Truck size={16} className="text-white" />
              : <Car size={16} className="text-white" />
            }
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">
            Boot<span className={isTransporter ? "text-amber-500" : "text-blue-600"}>
              Rider
            </span>
          </span>
          {isTransporter && (
            <span className="hidden sm:flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-600 text-xs font-medium px-2 py-0.5 rounded-full ml-1">
              <Truck size={10} />
              Enterprise
            </span>
          )}
        </Link>

        {/* ── Desktop nav links ── */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated
            ? isTransporter ? <TransporterLinks /> : <UserLinks />
            : (
              <>
                <Link to="/" className={navLinkClass("/")}>Home</Link>
                <Link to="/search-results" className={navLinkClass("/search-results")}>
                  Find rides
                </Link>
              </>
            )
          }
        </div>

        {/* ── Desktop auth ── */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <KycBadge />

              {/* User dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 transition"
                >
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold overflow-hidden ${isTransporter ? "bg-amber-500" : "bg-blue-600"
                    }`}>
                    {user?.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user?.name?.[0]?.toUpperCase() || "U"
                    )}
                  </div>
                  <span className="text-slate-700 text-sm font-medium">
                    {user?.name?.split(" ")[0] || "User"}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50">
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                        <p className="text-slate-800 text-sm font-semibold">
                          {user?.name}
                        </p>
                        <p className="text-slate-400 text-xs mt-0.5 truncate">
                          {user?.email}
                        </p>
                      </div>

                      <div className="py-1.5">
                        {/* Common links */}
                        <DropdownLink
                          to="/profile"
                          icon={<User size={14} />}
                          label="My profile"
                          onClick={() => setDropdownOpen(false)}
                        />

                        {/* User-specific links */}
                        {!isTransporter && (
                          <>
                            <DropdownLink
                              to="/create-rides"
                              icon={<Plus size={14} />}
                              label="Offer a ride"
                              onClick={() => setDropdownOpen(false)}
                            />
                            <DropdownLink
                              to="/my-rides"
                              icon={<Car size={14} />}
                              label="My rides"
                              onClick={() => setDropdownOpen(false)}
                            />
                            <DropdownLink
                              to="/my-bookings"
                              icon={<BookOpen size={14} />}
                              label="My bookings"
                              onClick={() => setDropdownOpen(false)}
                            />
                          </>
                        )}

                        {/* Transporter-specific links */}
                        {isTransporter && (
                          <>
                            <DropdownLink
                              to="/enterprise/dashboard"
                              icon={<LayoutDashboard size={14} />}
                              label="Dashboard"
                              onClick={() => setDropdownOpen(false)}
                            />
                            <DropdownLink
                              to="/enterprise/create"
                              icon={<Plus size={14} />}
                              label="New listing"
                              onClick={() => setDropdownOpen(false)}
                            />
                          </>
                        )}

                        <div className="border-t border-slate-100 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
                          >
                            <LogOut size={14} />
                            Sign out
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-50 transition"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition shadow-sm"
              >
                Sign up
              </Link>
              <Link
                to="/transporter/login"
                className="text-sm font-medium text-amber-600 hover:text-amber-700 border border-amber-200 hover:border-amber-300 px-4 py-2 rounded-xl hover:bg-amber-50 transition"
              >
                Enterprise
              </Link>
            </div>
          )}
        </div>

        {/* ── Mobile toggle ── */}
        <button
          className="md:hidden text-slate-500 hover:text-slate-700 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="px-6 py-4 space-y-1">
            {isAuthenticated ? (
              isTransporter ? (
                <>
                  <MobileLink to="/enterprise/dashboard" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </MobileLink>
                  <MobileLink to="/enterprise/create" onClick={() => setMenuOpen(false)}>
                    New listing
                  </MobileLink>
                  <MobileLink to="/enterprise/search" onClick={() => setMenuOpen(false)}>
                    Find loads
                  </MobileLink>
                </>
              ) : (
                <>
                  <MobileLink to="/" onClick={() => setMenuOpen(false)}>Home</MobileLink>
                  <MobileLink to="/search-results" onClick={() => setMenuOpen(false)}>
                    Find rides
                  </MobileLink>
                  <MobileLink to="/my-bookings" onClick={() => setMenuOpen(false)}>
                    My bookings
                  </MobileLink>
                  <MobileLink to="/my-rides" onClick={() => setMenuOpen(false)}>
                    My rides
                  </MobileLink>
                  <MobileLink to="/create-rides" onClick={() => setMenuOpen(false)}>
                    Offer a ride
                  </MobileLink>
                </>
              )
            ) : (
              <>
                <MobileLink to="/" onClick={() => setMenuOpen(false)}>Home</MobileLink>
                <MobileLink to="/search-results" onClick={() => setMenuOpen(false)}>
                  Find rides
                </MobileLink>
              </>
            )}
          </div>

          {isAuthenticated ? (
            <div className="px-6 py-4 border-t border-slate-100 space-y-3">
              {/* User info row */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold overflow-hidden ${isTransporter ? "bg-amber-500" : "bg-blue-600"
                  }`}>
                  {user?.profilePhoto ? (
                    <img src={user.profilePhoto} alt="" className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.[0]?.toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 text-sm font-semibold truncate">
                    {user?.name}
                  </p>
                  <p className="text-slate-400 text-xs truncate">{user?.email}</p>
                </div>
                <KycBadge />
              </div>

              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full border border-blue-200 text-blue-600 rounded-xl py-2.5 text-sm font-medium hover:bg-blue-50 transition"
              >
                <User size={14} />
                My profile
              </Link>

              {!isTransporter && (
                <Link
                  to="/create-rides"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-blue-700 transition"
                >
                  <Plus size={14} />
                  Offer a ride
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full border border-red-200 text-red-500 rounded-xl py-2.5 text-sm font-medium hover:bg-red-50 transition"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          ) : (
            <div className="px-6 py-4 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-center py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="text-center py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
              >
                Sign up free
              </Link>
              <Link
                to="/transporter/login"
                onClick={() => setMenuOpen(false)}
                className="text-center py-2.5 rounded-xl border border-amber-200 text-amber-600 text-sm font-medium hover:bg-amber-50 transition"
              >
                Enterprise login
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const DropdownLink = ({ to, icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition"
  >
    <span className="text-slate-400">{icon}</span>
    {label}
  </Link>
);

const MobileLink = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-3 py-2.5 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium transition"
  >
    {children}
  </Link>
);

export default Navbar;