// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Select from "react-select";

// const LandingPage = () => {
//   const [cities, setCities] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     from: "",
//     to: "",
//     date: "",
//     passengers: 1,
//   });

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCities = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(
//           "https://countriesnow.space/api/v0.1/countries/cities",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ country: "India" }),
//           }
//         );
//         const data = await res.json();
//         const formattedCities = data.data.map((city) => ({
//           value: city,
//           label: city,
//         }));
//         setCities(formattedCities);
//       } catch (error) {
//         console.error("Error fetching cities:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCities();
//   }, []);

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     navigate(
//       `/search-results?from=${formData.from.value}&to=${formData.to.value}&date=${formData.date}&passengers=${formData.passengers}`
//     );
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-800">
//       {/* Hero Section with Search */}
//       <header
//   className="relative w-full h-[85vh] bg-cover bg-center bg-no-repeat flex items-end justify-center text-white"
//   style={{
//     backgroundImage: `url('/src/assets/generated-image.png')`,
//   }}
// >
//   {/* Dark overlay for readability */}
//   <div className="absolute inset-0 bg-black/40"></div>

//   {/* Search Form */}
//   <form
//     onSubmit={handleSearch}
//     className="relative z-10 w-[70%] bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-10 font-[Poppins]"
//   >
//     <div className="w-full md:flex-1">
//       <label className="block text-sm font-semibold text-gray-600 mb-2">
//         From
//       </label>
//       <Select
//         options={cities}
//         isLoading={loading}
//         onChange={(value) => handleChange("from", value)}
//         placeholder="Select city"
//         className="text-gray-700"
//       />
//     </div>

//     <div className="w-full md:flex-1">
//       <label className="block text-sm font-semibold text-gray-600 mb-2">
//         To
//       </label>
//       <Select
//         options={cities}
//         isLoading={loading}
//         onChange={(value) => handleChange("to", value)}
//         placeholder="Select city"
//         className="text-gray-700"
//       />
//     </div>

//     <div className="w-full md:w-40">
//       <label className="block text-sm font-semibold text-gray-600 mb-2">
//         Date
//       </label>
//       <input
//         type="date"
//         value={formData.date}
//         onChange={(e) => handleChange("date", e.target.value)}
//         className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
//         required
//       />
//     </div>

//     <div className="w-full md:w-40">
//       <label className="block text-sm font-semibold text-gray-600 mb-2">
//         Passengers
//       </label>
//       <input
//         type="number"
//         min="1"
//         value={formData.passengers}
//         onChange={(e) =>
//           handleChange("passengers", Math.max(1, e.target.value))
//         }
//         className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
//         required
//       />
//     </div>

//     <button
//       type="submit"
//       className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-10 py-3 rounded-xl font-semibold shadow-lg transition-all hover:scale-105 hover:shadow-blue-400/40"
//     >
//       Search
//     </button>
//   </form>

//    <div className="flex justify-center gap-6 mt-10">
//           <button
//             onClick={() => navigate("/create-rides")}
//             className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition-transform transform hover:scale-105"
//           >
//             🚗 Create Ride
//           </button>
//           <button
//             onClick={() => navigate("/send-parcel")}
//             className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition-transform transform hover:scale-105"
//           >
//             📦 Send Parcel
//           </button>
//         </div>
// </header>





//       {/* About Section */}
//       <section className="py-16 px-8 max-w-6xl mx-auto text-center">
//         <h2 className="text-4xl font-bold text-blue-700 mb-6">
//           What is BootRider?
//         </h2>
//         <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
//           BootRider is your all-in-one mobility and delivery platform. Whether
//           you want to
//           <span className="font-semibold text-blue-700"> carpool</span> to work
//           or
//           <span className="font-semibold text-blue-700"> send a parcel</span>{" "}
//           across town, BootRider connects you with verified drivers headed your
//           way — optimizing time, cost, and environmental impact.
//         </p>
//       </section>




//    <section className="relative flex flex-col md:flex-row items-center justify-between py-28 px-8 md:px-24 bg-white font-[Inter] overflow-hidden">
//   {/* Left Text Section */}
//   <motion.div
//     className="max-w-lg space-y-6 z-10 text-center md:text-left"
//     initial={{ opacity: 0, x: -50 }}
//     whileInView={{ opacity: 1, x: 0 }}
//     transition={{ duration: 0.8, ease: "easeOut" }}
//     viewport={{ once: true }}
//   >
//     <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 leading-snug">
//       Driving in your car soon?
//     </h2>
//     <p className="text-gray-600 text-lg leading-relaxed">
//       Let's make this your least expensive journey ever.
//     </p>

//     <motion.button
//       onClick={() => navigate("/create-rides")}
//       whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0, 128, 0, 0.3)" }}
//       whileTap={{ scale: 0.97 }}
//       className="w-[70%] md:w-[70%] mx-auto md:mx-0 
//                  bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 
//                  hover:from-green-600 hover:to-emerald-700 
//                  text-white font-semibold text-lg px-10 py-5 
//                  rounded-2xl shadow-lg transition-all duration-300"
//     >
//       🚗 Create Ride
//     </motion.button>
//   </motion.div>

//   {/* Right Image Section */}
//   <motion.div
//     className="absolute md:relative right-[-10%] md:right-[-5%] w-[130%] md:w-[65%] flex justify-end"
//     initial={{ opacity: 0, x: 100 }}
//     whileInView={{ opacity: 1, x: 0 }}
//     transition={{ duration: 1, ease: "easeOut" }}
//     viewport={{ once: true }}
//   >
//     <motion.img
//       src="/src/assets/carpool.png"
//       alt="Carpool illustration"
//       className="w-[100%] md:w-[120%] max-w-3xl object-contain drop-shadow-2xl"
//       animate={{
//         y: [0, -10, 0],
//         rotate: [0, 1.5, -1.5, 0],
//       }}
//       transition={{
//         duration: 5,
//         repeat: Infinity,
//         ease: "easeInOut",
//       }}
//     />
//   </motion.div>
// </section>



//       {/* Footer */}
//       <footer className="bg-gradient-to-r from-blue-700 to-blue-900 text-white text-center py-6 mt-auto">
//         <p className="text-sm opacity-90">
//           © {new Date().getFullYear()} BootRider — Drive • Deliver • Earn •
//           Connect
//         </p>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;
// .


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Select from "react-select";
// import { motion } from "framer-motion";

// const LandingPage = () => {
//   const [cities, setCities] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     from: "",
//     to: "",
//     date: "",
//     passengers: 1,
//   });

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCities = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(
//           "https://countriesnow.space/api/v0.1/countries/cities",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ country: "India" }),
//           }
//         );
//         const data = await res.json();
//         const formattedCities = data.data.map((city) => ({
//           value: city,
//           label: city,
//         }));
//         setCities(formattedCities);
//       } catch (error) {
//         console.error("Error fetching cities:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCities();
//   }, []);

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     navigate(
//       `/search-results?from=${formData.from.value}&to=${formData.to.value}&date=${formData.date}&passengers=${formData.passengers}`
//     );
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-800 font-[Inter]">
//       {/* Hero Section with Search */}
//       <header
//         className="relative w-full h-[85vh] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-end text-white"
//         style={{
//           backgroundImage: `url('/src/assets/generated-image.png')`,
//         }}
//       >
//         <div className="absolute inset-0 bg-black/40"></div>

//         {/* Search Form */}
//         <motion.form
//           onSubmit={handleSearch}
//           className="relative z-10 w-[85%] md:w-[70%] bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-10"
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//         >
//           <div className="w-full md:flex-1">
//             <label className="block text-sm font-semibold text-gray-600 mb-2">
//               From
//             </label>
//             <Select
//               options={cities}
//               isLoading={loading}
//               onChange={(value) => handleChange("from", value)}
//               placeholder="Select city"
//               className="text-gray-700"
//             />
//           </div>

//           <div className="w-full md:flex-1">
//             <label className="block text-sm font-semibold text-gray-600 mb-2">
//               To
//             </label>
//             <Select
//               options={cities}
//               isLoading={loading}
//               onChange={(value) => handleChange("to", value)}
//               placeholder="Select city"
//               className="text-gray-700"
//             />
//           </div>

//           <div className="w-full md:w-40">
//             <label className="block text-sm font-semibold text-gray-600 mb-2">
//               Date
//             </label>
//             <input
//               type="date"
//               value={formData.date}
//               onChange={(e) => handleChange("date", e.target.value)}
//               className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           <div className="w-full md:w-40">
//             <label className="block text-sm font-semibold text-gray-600 mb-2">
//               Passengers
//             </label>
//             <input
//               type="number"
//               min="1"
//               value={formData.passengers}
//               onChange={(e) =>
//                 handleChange("passengers", Math.max(1, e.target.value))
//               }
//               className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           <motion.button
//             type="submit"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.97 }}
//             className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-10 py-3 rounded-xl font-semibold shadow-lg transition-all hover:shadow-blue-400/40"
//           >
//             Search
//           </motion.button>
//         </motion.form>

//         {/* Action Buttons */}
//         <div className="relative z-10 flex justify-center gap-6 mb-12">
//           <motion.button
//             whileHover={{ scale: 1.07 }}
//             whileTap={{ scale: 0.96 }}
//             onClick={() => navigate("/create-rides")}
//             className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-10 py-4 rounded-xl shadow-xl hover:shadow-green-400/30 transition-all"
//           >
//             🚗 Create Ride
//           </motion.button>
//           <motion.button
//             whileHover={{ scale: 1.07 }}
//             whileTap={{ scale: 0.96 }}
//             onClick={() => navigate("/send-parcel")}
//             className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-semibold px-10 py-4 rounded-xl shadow-xl hover:shadow-amber-400/30 transition-all"
//           >
//             📦 Send Parcel
//           </motion.button>
//         </div>
//       </header>

//       {/* About Section */}
//       <section className="py-16 px-8 max-w-6xl mx-auto text-center">
//         <h2 className="text-4xl font-bold text-blue-700 mb-6">
//           What is BootRider?
//         </h2>
//         <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
//           BootRider is your all-in-one mobility and delivery platform. Whether
//           you want to <span className="font-semibold text-blue-700">carpool</span> 
//           to work or <span className="font-semibold text-blue-700">send a parcel</span> 
//           across town, BootRider connects you with verified drivers headed your
//           way — optimizing time, cost, and environmental impact.
//         </p>
//       </section>

//       {/* Driver Promo Section */}
//       <section className="relative flex flex-col md:flex-row items-center justify-between py-28 px-8 md:px-24 bg-white overflow-hidden">
//         {/* Left Text */}
//         <motion.div
//           className="max-w-lg space-y-6 z-10 text-center md:text-left"
//           initial={{ opacity: 0, x: -50 }}
//           whileInView={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//           viewport={{ once: true }}
//         >
//           <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 leading-snug">
//             Driving in your car soon?
//           </h2>
//           <p className="text-gray-600 text-lg leading-relaxed">
//             Let's make this your least expensive journey ever.
//           </p>

//           <motion.button
//             onClick={() => navigate("/create-rides")}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.97 }}
//             className="w-[70%] bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 
//                        hover:from-green-600 hover:to-emerald-700 
//                        text-white font-semibold text-lg px-10 py-5 
//                        rounded-2xl shadow-lg hover:shadow-green-400/30 
//                        transition-all duration-300 mx-auto md:mx-0"
//           >
//             🚗 Create Ride
//           </motion.button>
//         </motion.div>

//         {/* Right Image */}
//         <motion.div
//           className="absolute md:relative right-[-10%] md:right-[-5%] w-[130%] md:w-[65%] flex justify-end"
//           initial={{ opacity: 0, x: 100 }}
//           whileInView={{ opacity: 1, x: 0 }}
//           transition={{ duration: 1, ease: "easeOut" }}
//           viewport={{ once: true }}
//         >
//           <motion.img
//             src="/src/assets/carpool.png"
//             alt="Carpool illustration"
//             className="w-[100%] md:w-[120%] max-w-3xl object-contain drop-shadow-2xl"
//             animate={{
//               y: [0, -12, 0],
//               rotate: [0, 1.2, -1.2, 0],
//             }}
//             transition={{
//               duration: 5,
//               repeat: Infinity,
//               ease: "easeInOut",
//             }}
//           />
//         </motion.div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gradient-to-r from-blue-700 to-blue-900 text-white text-center py-6 mt-auto">
//         <p className="text-sm opacity-90">
//           © {new Date().getFullYear()} BootRider — Drive • Deliver • Earn • Connect
//         </p>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;




import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Car, Package, ArrowRight, MapPin, Calendar,
  Users, Shield, Zap, TrendingUp, Star,
  ChevronRight, Truck, Clock
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    from: "",
    to: "",
    date: "",
    passengers: 1,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(
      `/search-results?from=${form.from}&to=${form.to}&date=${form.date}&passengers=${form.passengers}`
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20 pb-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-blue-400 text-sm font-medium">
                Now live across Delhi NCR
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-8">
              Drive.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-400">
                Deliver.
              </span>
              <br />
              Earn.
            </h1>

            <p className="text-gray-400 text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto mb-14">
              Share your empty boot space on your daily commute.
              Help parcels reach their destination while you earn extra income —
              on the route you already take.
            </p>

            {/* ── Search Card ── */}
            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 max-w-3xl mx-auto shadow-2xl">
              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                  {/* From */}
                  <div className="relative md:col-span-1">
                    <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      placeholder="From"
                      value={form.from}
                      onChange={(e) => setForm({ ...form, from: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/40 transition"
                    />
                  </div>

                  {/* To */}
                  <div className="relative md:col-span-1">
                    <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-500" />
                    <input
                      type="text"
                      placeholder="To"
                      value={form.to}
                      onChange={(e) => setForm({ ...form, to: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/40 transition"
                    />
                  </div>

                  {/* Date */}
                  <div className="relative">
                    <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-3 text-white text-sm focus:outline-none focus:border-blue-500/40 transition [color-scheme:dark]"
                    />
                  </div>

                  {/* Passengers */}
                  <div className="relative">
                    <Users size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <select
                      value={form.passengers}
                      onChange={(e) => setForm({ ...form, passengers: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-3 text-white text-sm focus:outline-none focus:border-blue-500/40 transition appearance-none [color-scheme:dark]"
                    >
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n} className="bg-[#111]">
                          {n} passenger{n > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  Search available rides
                  <ArrowRight size={16} />
                </button>
              </form>

              {/* Quick actions */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/[0.06]">
                <span className="text-gray-600 text-xs">Quick actions:</span>
                <button
                  onClick={() => isAuthenticated ? navigate("/create-rides") : navigate("/signup")}
                  className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition font-medium"
                >
                  <Car size={12} />
                  List your ride
                </button>
                <span className="text-gray-700">·</span>
                <button
                  onClick={() => navigate("/send-parcel")}
                  className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition font-medium"
                >
                  <Package size={12} />
                  Send a parcel
                </button>
                <span className="text-gray-700">·</span>
                <button
                  onClick={() => navigate("/transporter/login")}
                  className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition font-medium"
                >
                  <Truck size={12} />
                  Enterprise
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
          <span className="text-white text-xs tracking-widest uppercase">Scroll</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════ */}
      <section className="border-y border-white/[0.06] bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "2,400+", label: "Active drivers", icon: <Car size={16} /> },
              { value: "18,000+", label: "Parcels delivered", icon: <Package size={16} /> },
              { value: "₹850", label: "Avg. monthly earned", icon: <TrendingUp size={16} /> },
              { value: "4.8★", label: "Platform rating", icon: <Star size={16} /> },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-2 text-blue-400 mb-2">
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-3">
              How it works
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Simple as three steps
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* For drivers */}
            <div>
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Car size={16} className="text-blue-400" />
                </div>
                <span className="text-white font-semibold">For drivers</span>
              </div>
              <div className="space-y-6">
                {[
                  {
                    step: "01",
                    title: "List your ride",
                    desc: "Add your route, time, available seats and boot space. Takes under 2 minutes.",
                  },
                  {
                    step: "02",
                    title: "Accept requests",
                    desc: "Review booking requests from passengers and parcel senders. Accept who you're comfortable with.",
                  },
                  {
                    step: "03",
                    title: "Earn on the way",
                    desc: "Complete the trip and earn. Your daily commute just became a revenue stream.",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-5">
                    <span className="text-blue-500/40 font-mono text-sm font-bold mt-1 shrink-0 w-6">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For senders */}
            <div>
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                  <Package size={16} className="text-emerald-400" />
                </div>
                <span className="text-white font-semibold">For parcel senders</span>
              </div>
              <div className="space-y-6">
                {[
                  {
                    step: "01",
                    title: "Search a route",
                    desc: "Enter where your parcel needs to go. See all drivers heading that way today.",
                  },
                  {
                    step: "02",
                    title: "Book boot space",
                    desc: "Choose a driver, select your parcel size. Pay a fraction of courier rates.",
                  },
                  {
                    step: "03",
                    title: "Same-day delivery",
                    desc: "Your parcel travels with a verified driver and arrives the same day. Track every step.",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-5">
                    <span className="text-emerald-500/40 font-mono text-sm font-bold mt-1 shrink-0 w-6">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES GRID
      ══════════════════════════════════════════ */}
      <section className="py-20 px-6 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-3">
              Why Bootrider
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Built for trust
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: <Shield size={20} className="text-blue-400" />,
                bg: "bg-blue-500/10",
                title: "KYC Verified drivers",
                desc: "Every driver goes through Aadhaar-linked KYC verification before they can list a ride.",
              },
              {
                icon: <Zap size={20} className="text-amber-400" />,
                bg: "bg-amber-500/10",
                title: "Same-day delivery",
                desc: "Parcels travel with drivers on their existing routes. Faster than any courier service.",
              },
              {
                icon: <TrendingUp size={20} className="text-emerald-400" />,
                bg: "bg-emerald-500/10",
                title: "60% cheaper",
                desc: "Boot space sharing costs a fraction of traditional courier rates. No middlemen.",
              },
              {
                icon: <Star size={20} className="text-purple-400" />,
                bg: "bg-purple-500/10",
                title: "Ratings & reviews",
                desc: "Both drivers and senders are rated after every trip. Accountability built in.",
              },
              {
                icon: <Clock size={20} className="text-pink-400" />,
                bg: "bg-pink-500/10",
                title: "Real-time tracking",
                desc: "Know exactly where your parcel is. Photo confirmation at pickup and delivery.",
              },
              {
                icon: <Truck size={20} className="text-indigo-400" />,
                bg: "bg-indigo-500/10",
                title: "Enterprise fleet",
                desc: "Truck owners can monetise empty return trips. Full logistics for B2B senders.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all group"
              >
                <div className={`w-10 h-10 ${feature.bg} rounded-xl flex items-center justify-center mb-5`}>
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ENTERPRISE BANNER
      ══════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-3xl p-10 md:p-16 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
            <div className="relative z-10 md:flex items-center justify-between gap-10">
              <div className="mb-8 md:mb-0">
                <div className="flex items-center gap-2 mb-4">
                  <Truck size={18} className="text-amber-400" />
                  <span className="text-amber-400 text-sm font-medium tracking-wide uppercase">
                    Enterprise
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Own a truck or fleet?
                </h2>
                <p className="text-gray-400 text-lg max-w-lg leading-relaxed">
                  Stop running empty on return trips. List your available
                  cargo space and connect with businesses that need
                  same-day freight. Turn dead weight into revenue.
                </p>
              </div>
              <div className="flex flex-col gap-3 shrink-0">
                <button
                  onClick={() => navigate("/transporter/signup")}
                  className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-8 py-3.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap"
                >
                  Register your fleet
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => navigate("/transporter/login")}
                  className="border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 font-medium px-8 py-3.5 rounded-xl transition text-center text-sm"
                >
                  Already registered? Sign in
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA
      ══════════════════════════════════════════ */}
      <section className="py-28 px-6 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to ride
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              smarter?
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Join thousands of drivers and senders already using Bootrider
            across Delhi NCR.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(isAuthenticated ? "/create-rides" : "/signup")}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              {isAuthenticated ? "List a ride" : "Start for free"}
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate("/search-results")}
              className="border border-white/10 hover:bg-white/5 text-gray-300 font-medium px-8 py-4 rounded-xl transition flex items-center justify-center gap-2"
            >
              Browse rides
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="border-t border-white/[0.06] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <Car size={14} className="text-white" />
              </div>
              <span className="text-white font-bold">
                Boot<span className="text-blue-400">Rider</span>
              </span>
            </div>
            <div className="flex items-center gap-8 text-gray-500 text-sm">
              <span className="hover:text-gray-300 cursor-pointer transition">About</span>
              <span className="hover:text-gray-300 cursor-pointer transition">Privacy</span>
              <span className="hover:text-gray-300 cursor-pointer transition">Terms</span>
              <span className="hover:text-gray-300 cursor-pointer transition">Contact</span>
            </div>
            <p className="text-gray-600 text-sm">
              © 2025 Bootrider. Built for NCR commuters.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;