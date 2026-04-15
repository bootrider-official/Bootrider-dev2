


import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
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
        <Link to="/" className="flex items-center shrink-0">
          <img
            src={logo}
            alt="Bootrider"
            className="h-12 w-auto object-contain"
          />
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
// import React, { useState } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../redux/authSlice";
// import {
//   Menu, X, ChevronDown, Truck, Car,
//   User, LogOut, Plus, Package, ShieldCheck,
//   LayoutDashboard
// } from "lucide-react";
// import logo from "../assets/logo.png";

// const Navbar = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { isAuthenticated, user } = useSelector((state) => state.auth);

//   const [menuOpen, setMenuOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const isTransporter = user?.role === "transporter";
//   const isVerified = user?.kycStatus === "verified";

//   const handleLogout = () => {
//     dispatch(logout());
//     localStorage.removeItem("token");
//     navigate("/");
//     setDropdownOpen(false);
//     setMenuOpen(false);
//   };

//   // ── Hide navbar on auth pages ────────────────────────────────────────────
//   const authPages = ["/login", "/signup", "/transporter/login", "/transporter/signup", "/forgot-password"];
//   if (authPages.includes(location.pathname)) return null;

//   return (
//     <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
//       <div className="max-w-6xl mx-auto px-4">
//         <div className="flex items-center justify-between h-16">

//           {/* ── Logo ── */}
//           <Link to="/" className="flex items-center shrink-0">
//             <img
//               src={logo}
//               alt="Bootrider"
//               className="h-9 w-auto object-contain"
//             />
//           </Link>

//           {/* ── Desktop nav ── */}
//           <div className="hidden md:flex items-center gap-6">
//             {!isTransporter && (
//               <>
//                 <Link
//                   to="/search-results"
//                   className="text-slate-600 hover:text-blue-600 text-sm font-medium transition"
//                 >
//                   Find a ride
//                 </Link>
//                 <Link
//                   to="/about"
//                   className="text-slate-600 hover:text-blue-600 text-sm font-medium transition"
//                 >
//                   About
//                 </Link>
//               </>
//             )}
//             {isTransporter && (
//               <Link
//                 to="/enterprise/dashboard"
//                 className="text-slate-600 hover:text-amber-600 text-sm font-medium transition flex items-center gap-1.5"
//               >
//                 <LayoutDashboard size={14} />
//                 Dashboard
//               </Link>
//             )}
//           </div>

//           {/* ── Right side ── */}
//           <div className="flex items-center gap-3">

//             {/* Not logged in */}
//             {!isAuthenticated && (
//               <>
//                 <Link
//                   to="/login"
//                   className="hidden md:block text-slate-600 hover:text-slate-900 text-sm font-medium transition"
//                 >
//                   Sign in
//                 </Link>
//                 <Link
//                   to="/signup"
//                   className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition shadow-sm"
//                 >
//                   Get started
//                 </Link>
//               </>
//             )}

//             {/* Logged in */}
//             {isAuthenticated && (
//               <div className="flex items-center gap-3">

//                 {/* Offer ride button — regular users */}
//                 {!isTransporter && (
//                   <Link
//                     to="/create-rides"
//                     className="hidden md:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition shadow-sm"
//                   >
//                     <Plus size={14} />
//                     Offer a ride
//                   </Link>
//                 )}

//                 {/* New listing — transporters */}
//                 {isTransporter && (
//                   <Link
//                     to="/enterprise/create"
//                     className="hidden md:flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-black text-sm font-semibold px-4 py-2 rounded-xl transition shadow-sm"
//                   >
//                     <Plus size={14} />
//                     New listing
//                   </Link>
//                 )}

//                 {/* Profile dropdown */}
//                 <div className="relative">
//                   <button
//                     onClick={() => setDropdownOpen(!dropdownOpen)}
//                     className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 transition"
//                   >
//                     {/* Avatar */}
//                     <div className={`w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-white text-xs font-bold ${isTransporter ? "bg-amber-500" : "bg-blue-600"
//                       }`}>
//                       {user?.profilePhoto ? (
//                         <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
//                       ) : (
//                         user?.name?.[0]?.toUpperCase() || "U"
//                       )}
//                     </div>
//                     <span className="hidden md:block text-slate-700 text-sm font-medium max-w-[100px] truncate">
//                       {user?.name?.split(" ")[0]}
//                     </span>
//                     {isTransporter && (
//                       <span className="hidden md:block bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
//                         Fleet
//                       </span>
//                     )}
//                     {isVerified && !isTransporter && (
//                       <ShieldCheck size={13} className="hidden md:block text-emerald-500" />
//                     )}
//                     <ChevronDown size={13} className={`text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
//                   </button>

//                   {/* Dropdown */}
//                   {dropdownOpen && (
//                     <>
//                       <div
//                         className="fixed inset-0 z-40"
//                         onClick={() => setDropdownOpen(false)}
//                       />
//                       <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50">

//                         {/* User info */}
//                         <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
//                           <p className="text-slate-800 text-sm font-semibold truncate">{user?.name}</p>
//                           <p className="text-slate-400 text-xs truncate mt-0.5">{user?.email || user?.phone}</p>
//                         </div>

//                         <div className="py-1">
//                           {!isTransporter && (
//                             <>
//                               <DropItem icon={<User size={14} />} label="Profile" to="/profile" onClose={() => setDropdownOpen(false)} />
//                               <DropItem icon={<Car size={14} />} label="My rides" to="/my-rides" onClose={() => setDropdownOpen(false)} />
//                               <DropItem icon={<Package size={14} />} label="My bookings" to="/my-bookings" onClose={() => setDropdownOpen(false)} />
//                             </>
//                           )}
//                           {isTransporter && (
//                             <>
//                               <DropItem icon={<LayoutDashboard size={14} />} label="Dashboard" to="/enterprise/dashboard" onClose={() => setDropdownOpen(false)} />
//                               <DropItem icon={<Truck size={14} />} label="New listing" to="/enterprise/create" onClose={() => setDropdownOpen(false)} />
//                             </>
//                           )}
//                           {!isVerified && (
//                             <DropItem
//                               icon={<ShieldCheck size={14} />}
//                               label="Complete KYC"
//                               to="/kyc-form"
//                               onClose={() => setDropdownOpen(false)}
//                               highlight
//                             />
//                           )}
//                         </div>

//                         <div className="border-t border-slate-100 py-1">
//                           <button
//                             onClick={handleLogout}
//                             className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 text-sm transition"
//                           >
//                             <LogOut size={14} />
//                             Sign out
//                           </button>
//                         </div>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Mobile menu button */}
//             <button
//               onClick={() => setMenuOpen(!menuOpen)}
//               className="md:hidden p-2 text-slate-500 hover:text-slate-700 transition"
//             >
//               {menuOpen ? <X size={20} /> : <Menu size={20} />}
//             </button>
//           </div>
//         </div>

//         {/* ── Mobile menu ── */}
//         {menuOpen && (
//           <div className="md:hidden border-t border-slate-100 py-4 space-y-1">
//             {!isTransporter && (
//               <>
//                 <MobileItem label="Find a ride" to="/search-results" onClose={() => setMenuOpen(false)} />
//                 <MobileItem label="About" to="/about" onClose={() => setMenuOpen(false)} />
//               </>
//             )}
//             {isAuthenticated && !isTransporter && (
//               <>
//                 <MobileItem label="Offer a ride" to="/create-rides" onClose={() => setMenuOpen(false)} highlight />
//                 <MobileItem label="My rides" to="/my-rides" onClose={() => setMenuOpen(false)} />
//                 <MobileItem label="My bookings" to="/my-bookings" onClose={() => setMenuOpen(false)} />
//                 <MobileItem label="Profile" to="/profile" onClose={() => setMenuOpen(false)} />
//               </>
//             )}
//             {isAuthenticated && isTransporter && (
//               <>
//                 <MobileItem label="Dashboard" to="/enterprise/dashboard" onClose={() => setMenuOpen(false)} />
//                 <MobileItem label="New listing" to="/enterprise/create" onClose={() => setMenuOpen(false)} />
//               </>
//             )}
//             {!isAuthenticated && (
//               <>
//                 <MobileItem label="Sign in" to="/login" onClose={() => setMenuOpen(false)} />
//                 <MobileItem label="Create account" to="/signup" onClose={() => setMenuOpen(false)} highlight />
//               </>
//             )}
//             {isAuthenticated && (
//               <button
//                 onClick={handleLogout}
//                 className="w-full text-left px-4 py-2.5 text-red-500 text-sm font-medium"
//               >
//                 Sign out
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// // ── Helpers ──────────────────────────────────────────────────────────────────
// const DropItem = ({ icon, label, to, onClose, highlight }) => (
//   <Link
//     to={to}
//     onClick={onClose}
//     className={`flex items-center gap-3 px-4 py-2.5 text-sm transition ${highlight
//         ? "text-blue-600 hover:bg-blue-50 font-medium"
//         : "text-slate-600 hover:bg-slate-50"
//       }`}
//   >
//     <span className={highlight ? "text-blue-500" : "text-slate-400"}>{icon}</span>
//     {label}
//   </Link>
// );

// const MobileItem = ({ label, to, onClose, highlight }) => (
//   <Link
//     to={to}
//     onClick={onClose}
//     className={`block px-4 py-2.5 text-sm font-medium rounded-xl transition ${highlight
//         ? "bg-blue-600 text-white mx-2"
//         : "text-slate-600 hover:bg-slate-50"
//       }`}
//   >
//     {label}
//   </Link>
// );

// export default Navbar;