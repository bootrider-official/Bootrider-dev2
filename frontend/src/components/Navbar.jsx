// import React, { useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../redux/authSlice";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Menu,
//   X,
//   ShieldCheck,
//   ShieldAlert,
//   Shield,
//   LogOut,
//   User,
//   Car,
//   PackageSearch,
// } from "lucide-react";

// const Navbar = () => {
//   const { user, isAuthenticated } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [menuOpen, setMenuOpen] = useState(false);

//   const handleLogout = () => {
//     dispatch(logout());
//     localStorage.clear();
//     setMenuOpen(false);
//   };

//   // 🧠 Handle KYC badge click
//   const handleKycClick = () => {
//     if (user?.kycStatus === "not_started" || user?.kycStatus === "pending") {
//       navigate("/kyc-form");
//     }
//   };

//   // 🎖️ Render KYC Badge
//   const renderKycBadge = () => {
//     if (!user) return null;

//     let badgeStyle =
//       "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition select-none shadow-sm";
//     let icon, label, color, isClickable = false;

//     switch (user.kycStatus) {
//       case "verified":
//         icon = <ShieldCheck size={14} />;
//         label = "Verified";
//         color = "bg-green-600 text-white";
//         break;
//       case "pending":
//         icon = <ShieldAlert size={14} />;
//         label = "Pending";
//         color =
//           "bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer animate-pulse";
//         isClickable = true;
//         break;
//       default:
//         icon = <Shield size={14} />;
//         label = "Not Started";
//         color =
//           "bg-red-500 text-white hover:bg-red-600 cursor-pointer animate-pulse";
//         isClickable = true;
//         break;
//     }

//     return (
//       <div
//         onClick={isClickable ? handleKycClick : undefined}
//         className={`${badgeStyle} ${color}`}
//         title={
//           user.kycStatus === "verified"
//             ? "Your KYC is verified ✅"
//             : "Click to complete your KYC"
//         }
//       >
//         {icon}
//         <span>{label}</span>
//       </div>
//     );
//   };

//   return (
//     <nav className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 shadow-md sticky top-0 z-50 backdrop-blur-md border-b border-blue-600/30">
//       <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
//         {/* 🌐 Logo */}
//         <Link
//           to="/"
//           className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2"
//         >
//           <Car size={28} className="text-blue-200" />
//           Boot<span className="text-blue-300">Rider</span>
//         </Link>

//         {/* 🌆 Desktop Menu */}
//         <div className="hidden md:flex items-center gap-8 text-white font-medium">
//           <Link to="/" className="hover:text-blue-300 transition">
//             Home
//           </Link>

//           <Link to="/my-rides" className="hover:text-blue-300 transition">
//             My Rides
//           </Link>

//           <Link to="/my-bookings" className="hover:text-blue-300 transition flex items-center gap-1">
//             <PackageSearch size={16} />
//             My Bookings
//           </Link>

//           <Link to="/contact" className="hover:text-blue-300 transition">
//             Contact
//           </Link>

//           {/* 🔐 Auth Section */}
//           {isAuthenticated ? (
//             <div className="flex items-center gap-5">
//               {renderKycBadge()}

//               <span className="bg-white/10 text-blue-100 px-4 py-2 rounded-full shadow-inner">
//                 <User size={16} className="inline mr-1" />
//                 {user?.name?.split(" ")[0] || "User"}
//               </span>

//               <button
//                 onClick={handleLogout}
//                 className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 font-semibold shadow-md transition"
//               >
//                 <LogOut size={16} />
//                 Logout
//               </button>
//             </div>
//           ) : (
//             <div className="flex gap-3">
//               <Link
//                 to="/signup"
//                 className="bg-white text-blue-700 px-5 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transition"
//               >
//                 Sign Up
//               </Link>
//               <Link
//                 to="/login"
//                 className="bg-blue-500 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-600 transition"
//               >
//                 Login
//               </Link>
//             </div>
//           )}
//         </div>

//         {/* 📱 Mobile Menu Toggle */}
//         <button
//           className="md:hidden text-white"
//           onClick={() => setMenuOpen(!menuOpen)}
//         >
//           {menuOpen ? <X size={26} /> : <Menu size={26} />}
//         </button>
//       </div>

//       {/* 📱 Mobile Dropdown */}
//       {menuOpen && (
//         <div className="md:hidden bg-blue-800/90 backdrop-blur-md text-white flex flex-col items-center gap-4 py-6 shadow-inner transition-all">
//           <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-blue-300">
//             Home
//           </Link>
//           <Link to="/my-rides" onClick={() => setMenuOpen(false)} className="hover:text-blue-300">
//             My Rides
//           </Link>
//           <Link to="/my-bookings" onClick={() => setMenuOpen(false)} className="hover:text-blue-300">
//             My Bookings
//           </Link>
//           <Link to="/contact" onClick={() => setMenuOpen(false)} className="hover:text-blue-300">
//             Contact
//           </Link>

//           {isAuthenticated ? (
//             <>
//               {renderKycBadge()}
//               <span className="font-semibold">
//                 Hi, {user?.name?.split(" ")[0] || "User"} 👋
//               </span>
//               <button
//                 onClick={handleLogout}
//                 className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg font-semibold shadow-md flex items-center gap-1"
//               >
//                 <LogOut size={16} />
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link
//                 to="/signup"
//                 onClick={() => setMenuOpen(false)}
//                 className="bg-white text-blue-700 px-6 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transition"
//               >
//                 Sign Up
//               </Link>
//               <Link
//                 to="/login"
//                 onClick={() => setMenuOpen(false)}
//                 className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-600 transition"
//               >
//                 Login
//               </Link>
//             </>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;





import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu, X, ShieldCheck, ShieldAlert, Shield,
  LogOut, Car, PackageSearch, LayoutDashboard,
  Plus, ChevronDown, Truck
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
    `text-sm font-medium transition-colors ${isActive(path)
      ? "text-white"
      : "text-gray-400 hover:text-white"
    }`;

  const KycBadge = () => {
    if (!user) return null;
    const configs = {
      verified: {
        icon: <ShieldCheck size={12} />,
        label: "Verified",
        className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
      },
      pending: {
        icon: <ShieldAlert size={12} />,
        label: "KYC Pending",
        className: "bg-amber-500/15 text-amber-400 border-amber-500/20 cursor-pointer animate-pulse",
      },
      not_started: {
        icon: <Shield size={12} />,
        label: "Verify KYC",
        className: "bg-red-500/15 text-red-400 border-red-500/20 cursor-pointer",
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

  // ── User nav links
  const UserLinks = () => (
    <>
      <Link to="/" className={navLinkClass("/")}>Home</Link>
      <Link to="/search-results" className={navLinkClass("/search-results")}>Find Rides</Link>
      <Link to="/my-bookings" className={navLinkClass("/my-bookings")}>
        <span className="flex items-center gap-1.5">
          <PackageSearch size={14} />
          My Bookings
        </span>
      </Link>
      {isAuthenticated && (
        <Link to="/my-rides" className={navLinkClass("/my-rides")}>My Rides</Link>
      )}
    </>
  );

  // ── Transporter nav links
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
          New Listing
        </span>
      </Link>
      <Link to="/enterprise/bookings" className={navLinkClass("/enterprise/bookings")}>
        Bookings
      </Link>
    </>
  );

  return (
    <nav className="bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/[0.06] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Car size={16} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Boot<span className="text-blue-400">Rider</span>
          </span>
          {isTransporter && (
            <span className="hidden sm:flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium px-2 py-0.5 rounded-full ml-1">
              <Truck size={10} />
              Enterprise
            </span>
          )}
        </Link>

        {/* ── Desktop Nav ── */}
        <div className="hidden md:flex items-center gap-7">
          {isTransporter ? <TransporterLinks /> : <UserLinks />}
        </div>

        {/* ── Desktop Auth ── */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <KycBadge />

              {/* User dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/8 border border-white/10 rounded-xl px-3 py-2 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-white text-sm font-medium">
                    {user?.name?.split(" ")[0] || "User"}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-[#111118] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-white/[0.06]">
                      <p className="text-white text-sm font-medium">{user?.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5 truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      {!isTransporter && (
                        <>
                          <Link
                            to="/create-rides"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition"
                          >
                            <Plus size={14} />
                            Create Ride
                          </Link>
                          <Link
                            to="/my-rides"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition"
                          >
                            <Car size={14} />
                            My Rides
                          </Link>
                        </>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition"
                      >
                        <LogOut size={14} />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-300 hover:text-white px-4 py-2 rounded-xl hover:bg-white/5 transition"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition shadow-lg shadow-blue-500/20"
              >
                Get started
              </Link>
            </div>
          )}
        </div>

        {/* ── Mobile toggle ── */}
        <button
          className="md:hidden text-gray-400 hover:text-white transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="md:hidden bg-[#0d0d14] border-t border-white/[0.06]">
          <div className="px-6 py-4 space-y-1">
            {isTransporter ? (
              <>
                <MobileLink to="/enterprise/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</MobileLink>
                <MobileLink to="/enterprise/create" onClick={() => setMenuOpen(false)}>New Listing</MobileLink>
                <MobileLink to="/enterprise/bookings" onClick={() => setMenuOpen(false)}>Bookings</MobileLink>
              </>
            ) : (
              <>
                <MobileLink to="/" onClick={() => setMenuOpen(false)}>Home</MobileLink>
                <MobileLink to="/search-results" onClick={() => setMenuOpen(false)}>Find Rides</MobileLink>
                <MobileLink to="/my-bookings" onClick={() => setMenuOpen(false)}>My Bookings</MobileLink>
                {isAuthenticated && (
                  <MobileLink to="/my-rides" onClick={() => setMenuOpen(false)}>My Rides</MobileLink>
                )}
              </>
            )}
          </div>

          {isAuthenticated ? (
            <div className="px-6 py-4 border-t border-white/[0.06] space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{user?.name}</p>
                  <p className="text-gray-500 text-xs">{user?.email}</p>
                </div>
                <div className="ml-auto">
                  <KycBadge />
                </div>
              </div>
              {!isTransporter && (
                <Link
                  to="/create-rides"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-xl py-2.5 text-sm font-medium"
                >
                  <Plus size={14} />
                  Create Ride
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl py-2.5 text-sm font-medium"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          ) : (
            <div className="px-6 py-4 border-t border-white/[0.06] flex gap-3">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/5 transition"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

// ── Mobile link helper
const MobileLink = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-3 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 text-sm font-medium transition"
  >
    {children}
  </Link>
);

export default Navbar;