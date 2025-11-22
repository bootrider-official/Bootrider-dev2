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


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { motion } from "framer-motion";

const LandingPage = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    passengers: 1,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://countriesnow.space/api/v0.1/countries/cities",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country: "India" }),
          }
        );
        const data = await res.json();
        const formattedCities = data.data.map((city) => ({
          value: city,
          label: city,
        }));
        setCities(formattedCities);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(
      `/search-results?from=${formData.from.value}&to=${formData.to.value}&date=${formData.date}&passengers=${formData.passengers}`
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-800 font-[Inter]">
      {/* Hero Section with Search */}
      <header
        className="relative w-full h-[85vh] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-end text-white"
        style={{
          backgroundImage: `url('/src/assets/generated-image.png')`,
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Search Form */}
        <motion.form
          onSubmit={handleSearch}
          className="relative z-10 w-[85%] md:w-[70%] bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="w-full md:flex-1">
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              From
            </label>
            <Select
              options={cities}
              isLoading={loading}
              onChange={(value) => handleChange("from", value)}
              placeholder="Select city"
              className="text-gray-700"
            />
          </div>

          <div className="w-full md:flex-1">
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              To
            </label>
            <Select
              options={cities}
              isLoading={loading}
              onChange={(value) => handleChange("to", value)}
              placeholder="Select city"
              className="text-gray-700"
            />
          </div>

          <div className="w-full md:w-40">
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="w-full md:w-40">
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Passengers
            </label>
            <input
              type="number"
              min="1"
              value={formData.passengers}
              onChange={(e) =>
                handleChange("passengers", Math.max(1, e.target.value))
              }
              className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-10 py-3 rounded-xl font-semibold shadow-lg transition-all hover:shadow-blue-400/40"
          >
            Search
          </motion.button>
        </motion.form>

        {/* Action Buttons */}
        <div className="relative z-10 flex justify-center gap-6 mb-12">
          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/create-rides")}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-10 py-4 rounded-xl shadow-xl hover:shadow-green-400/30 transition-all"
          >
            🚗 Create Ride
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/send-parcel")}
            className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-semibold px-10 py-4 rounded-xl shadow-xl hover:shadow-amber-400/30 transition-all"
          >
            📦 Send Parcel
          </motion.button>
        </div>
      </header>

      {/* About Section */}
      <section className="py-16 px-8 max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-blue-700 mb-6">
          What is BootRider?
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          BootRider is your all-in-one mobility and delivery platform. Whether
          you want to <span className="font-semibold text-blue-700">carpool</span> 
          to work or <span className="font-semibold text-blue-700">send a parcel</span> 
          across town, BootRider connects you with verified drivers headed your
          way — optimizing time, cost, and environmental impact.
        </p>
      </section>

      {/* Driver Promo Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-between py-28 px-8 md:px-24 bg-white overflow-hidden">
        {/* Left Text */}
        <motion.div
          className="max-w-lg space-y-6 z-10 text-center md:text-left"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 leading-snug">
            Driving in your car soon?
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Let's make this your least expensive journey ever.
          </p>

          <motion.button
            onClick={() => navigate("/create-rides")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="w-[70%] bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 
                       hover:from-green-600 hover:to-emerald-700 
                       text-white font-semibold text-lg px-10 py-5 
                       rounded-2xl shadow-lg hover:shadow-green-400/30 
                       transition-all duration-300 mx-auto md:mx-0"
          >
            🚗 Create Ride
          </motion.button>
        </motion.div>

        {/* Right Image */}
        <motion.div
          className="absolute md:relative right-[-10%] md:right-[-5%] w-[130%] md:w-[65%] flex justify-end"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.img
            src="/src/assets/carpool.png"
            alt="Carpool illustration"
            className="w-[100%] md:w-[120%] max-w-3xl object-contain drop-shadow-2xl"
            animate={{
              y: [0, -12, 0],
              rotate: [0, 1.2, -1.2, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-700 to-blue-900 text-white text-center py-6 mt-auto">
        <p className="text-sm opacity-90">
          © {new Date().getFullYear()} BootRider — Drive • Deliver • Earn • Connect
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
