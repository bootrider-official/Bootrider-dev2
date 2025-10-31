import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const token = useSelector((state) => state.auth.token);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-800">
      {/* Hero Section */}
      <header className="w-full py-20 px-6 text-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white shadow-lg">
        <h1 className="text-6xl font-extrabold mb-4 tracking-tight drop-shadow-md">
          BootRider
        </h1>
        <p className="text-xl max-w-3xl mx-auto leading-relaxed mb-8">
          Connecting people, parcels, and possibilities.  
          <br />
          <span className="font-semibold text-blue-200">
            Carpool smarter. Deliver faster. Earn effortlessly.
          </span>
        </p>

        {token ? (
          <div className="flex justify-center gap-6">
            <Link
              to="/rides"
              className="bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 hover:bg-blue-50 transition-all"
            >
              Find a Ride
            </Link>
            <Link
              to="/parcels"
              className="bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 hover:bg-blue-600 transition-all"
            >
              Send a Parcel
            </Link>
          </div>
        ) : (
          <div className="flex justify-center gap-6">
            <Link
              to="/signup"
              className="bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-50 transition-all"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="border-2 border-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-700 transition-all"
            >
              Log In
            </Link>
          </div>
        )}
      </header>

      {/* About Section */}
      <section className="py-16 px-8 max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-blue-700 mb-6">
          What is BootRider?
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          BootRider is your all-in-one mobility and delivery platform. Whether you want to
          <span className="font-semibold text-blue-700"> carpool</span> to work or
          <span className="font-semibold text-blue-700"> send a parcel</span> across town,
          BootRider connects you with verified drivers headed in your direction — optimizing time,
          cost, and environmental impact.
        </p>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-r from-blue-100 to-blue-50 py-16 px-8">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-12">
          Why Choose BootRider?
        </h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">
              🚗 Smart Carpooling
            </h3>
            <p className="text-gray-600">
              Save on travel costs by sharing rides with trusted drivers heading your way.
              Reduce traffic, fuel use, and carbon emissions effortlessly.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">
              📦 Parcel Delivery Made Easy
            </h3>
            <p className="text-gray-600">
              Send packages safely using spare boot space. Track deliveries and get real-time
              updates — all within the same app.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">
              💰 Earn on the Go
            </h3>
            <p className="text-gray-600">
              Drivers can accept ride or parcel requests, making every trip more rewarding.
              Drive smarter — not farther.
            </p>
          </div>
        </div>
      </section>

      {/* Dual CTA Section */}
      <section className="py-20 px-8 text-center">
        <h2 className="text-4xl font-bold text-blue-700 mb-8">
          Ready to Ride or Deliver?
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          Join the growing BootRider community and experience a new way of mobility.
        </p>

        {token ? (
          <div className="flex justify-center gap-6">
            <Link
              to="/rides"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
            >
              Explore Rides
            </Link>
            <Link
              to="/parcels"
              className="bg-white border-2 border-blue-600 text-blue-700 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
            >
              Deliver Parcels
            </Link>
          </div>
        ) : (
          <div className="flex justify-center gap-6">
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="border-2 border-blue-600 text-blue-700 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
            >
              Log In
            </Link>
          </div>
        )}
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
