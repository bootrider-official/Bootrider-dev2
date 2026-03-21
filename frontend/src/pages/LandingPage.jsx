import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MapPin, Calendar, Users, Search, ArrowRight,
  Shield, Zap, TrendingUp, Star, Package,
  Car, Truck, ChevronRight, Check, Clock,
  BadgeCheck, Heart, Leaf
} from "lucide-react";
import heroBg from "../assets/hero-car.png";
import featureCarpool from "../assets/feature-carpool.png";
import featureParcel from "../assets/feature-parcel.png";
import enterpriseTruck from "../assets/enterprise-truck.png";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isTransporter = user?.role === "transporter";

  const [searchMode, setSearchMode] = useState("passenger"); // "passenger" | "parcel"
  const [form, setForm] = useState({
    from: "", to: "", date: "", passengers: 1,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!form.from || !form.to) return;
    navigate(
      `/search-results?from=${encodeURIComponent(form.from)}&to=${encodeURIComponent(form.to)}&date=${form.date}&passengers=${form.passengers}&mode=${searchMode}`
    );
  };

  // ── Transporter landing ──────────────────────────────────────────────────
  if (isTransporter) {
    return <TransporterLanding navigate={navigate} user={user} />;
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ══════════════════════════════════════════
          HERO — Dark illustrated background
      ══════════════════════════════════════════ */}
      <section
        className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/70 via-[#0a1628]/50 to-[#0a1628]/80" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col items-center">

          {/* Badge */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-white/90 text-sm font-medium">
              Now live across Delhi NCR
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white text-center leading-tight mb-4 tracking-tight">
            DRIVE.{" "}
            <span
              style={{
                color: "#4dd9e0",
                textShadow: "0 0 40px rgba(77,217,224,0.4)",
              }}
            >
              DELIVER.
            </span>{" "}
            EARN.
          </h1>

          <p className="text-white/70 text-lg md:text-xl text-center max-w-xl mb-10 leading-relaxed">
            Share your ride, split your costs, and deliver parcels on your
            existing route. India's smartest carpooling platform.
          </p>

          {/* ── Search Card ── */}
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">

            {/* Mode toggle */}
            <div className="flex border-b border-slate-100">
              <button
                onClick={() => setSearchMode("passenger")}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition ${searchMode === "passenger"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                <Car size={16} />
                Find a ride
              </button>
              <button
                onClick={() => setSearchMode("parcel")}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition ${searchMode === "parcel"
                  ? "text-amber-600 border-b-2 border-amber-500 bg-amber-50/50"
                  : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                <Package size={16} />
                Send a parcel
              </button>
            </div>

            {/* Search form */}
            <form onSubmit={handleSearch} className="p-4">
              <div className="flex flex-col md:flex-row gap-3 mb-3">
                {/* From */}
                <div className="flex-1 relative">
                  <MapPin
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Leaving from"
                    value={form.from}
                    onChange={(e) => setForm({ ...form, from: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>

                {/* To */}
                <div className="flex-1 relative">
                  <MapPin
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Going to"
                    value={form.to}
                    onChange={(e) => setForm({ ...form, to: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>

                {/* Date */}
                <div className="relative">
                  <Calendar
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full md:w-36 border border-slate-200 rounded-xl pl-9 pr-3 py-3 text-slate-800 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition [color-scheme:light]"
                  />
                </div>

                {/* Passengers or weight */}
                {searchMode === "passenger" ? (
                  <div className="relative">
                    <Users
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <select
                      value={form.passengers}
                      onChange={(e) => setForm({ ...form, passengers: e.target.value })}
                      className="w-full md:w-36 border border-slate-200 rounded-xl pl-9 pr-3 py-3 text-slate-800 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition appearance-none bg-white"
                    >
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>
                          {n} passenger{n > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="relative">
                    <Package
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <select
                      className="w-full md:w-36 border border-slate-200 rounded-xl pl-9 pr-3 py-3 text-slate-800 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition appearance-none bg-white"
                    >
                      <option>Small parcel</option>
                      <option>Medium parcel</option>
                      <option>Large parcel</option>
                    </select>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className={`w-full font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-sm text-white ${searchMode === "passenger"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-amber-500 hover:bg-amber-600"
                  }`}
              >
                <Search size={16} />
                {searchMode === "passenger"
                  ? "Search available rides"
                  : "Find boot space"}
              </button>
            </form>

            {/* Quick links */}
            <div className="px-4 pb-4 flex flex-wrap items-center gap-1 text-xs">
              <span className="text-slate-400">Popular:</span>
              {["Noida → Delhi", "Mathura → Agra", "Gurgaon → Delhi", "Noida → Mathura"].map(
                (route) => (
                  <button
                    key={route}
                    onClick={() => {
                      const [f, t] = route.split(" → ");
                      setForm({ ...form, from: f, to: t });
                    }}
                    className="text-blue-600 hover:text-blue-700 hover:underline px-1 py-0.5 transition"
                  >
                    {route}
                  </button>
                )
              )}
            </div>
          </div>

          {/* CTA row */}
          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={() => isAuthenticated ? navigate("/create-rides") : navigate("/signup")}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold px-5 py-2.5 rounded-xl transition text-sm"
            >
              <Car size={15} />
              Offer a ride
            </button>
            <button
              onClick={() => navigate("/transporter/signup")}
              className="flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 backdrop-blur-sm border border-amber-400/30 text-amber-300 font-semibold px-5 py-2.5 rounded-xl transition text-sm"
            >
              <Truck size={15} />
              Enterprise
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-10 bg-gradient-to-b from-white to-transparent" />
          <span className="text-white text-xs tracking-widest uppercase">Scroll</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TRUST BAR
      ══════════════════════════════════════════ */}
      <section className="bg-blue-600 py-5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "2,400+", label: "Active drivers" },
              { value: "18,000+", label: "Parcels delivered" },
              { value: "60%", label: "Cheaper than courier" },
              { value: "4.8★", label: "Average rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-white font-black text-2xl">{stat.value}</p>
                <p className="text-blue-100 text-sm mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS — Passengers
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100 mb-5">
                <Car size={12} />
                For passengers
              </span>
              <h2 className="text-4xl font-black text-slate-900 mb-4 leading-tight">
                Travel anywhere.
                <span className="text-blue-600"> Spend smarter.</span>
              </h2>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                Find verified drivers going your way and share the cost.
                Same-day travel, real people, real savings.
              </p>

              <div className="space-y-5">
                {[
                  {
                    icon: <Search size={18} className="text-blue-600" />,
                    title: "Search your route",
                    desc: "Enter your city and find drivers going the same way today.",
                  },
                  {
                    icon: <BadgeCheck size={18} className="text-blue-600" />,
                    title: "Choose a verified driver",
                    desc: "All drivers are KYC verified. Check profiles, ratings and preferences.",
                  },
                  {
                    icon: <Zap size={18} className="text-blue-600" />,
                    title: "Book instantly",
                    desc: "Request your seat. Get confirmed. Show up and ride.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-slate-800 font-semibold">{item.title}</p>
                      <p className="text-slate-500 text-sm mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate("/search-results")}
                className="mt-8 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl transition shadow-sm"
              >
                Find a ride
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={featureCarpool}
                  alt="Carpooling"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.style.background = "#EFF6FF";
                    e.target.parentElement.style.height = "400px";
                  }}
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl border border-slate-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    R
                  </div>
                  <div>
                    <p className="text-slate-800 text-sm font-semibold">Rahul · ★ 4.9</p>
                    <p className="text-slate-400 text-xs">Noida → Delhi · ₹120</p>
                  </div>
                  <span className="ml-2 bg-emerald-50 text-emerald-600 text-xs font-medium px-2 py-1 rounded-full border border-emerald-100">
                    Instant
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS — Parcels
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 md:order-1">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={featureParcel}
                  alt="Send parcel"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.style.background = "#FFFBEB";
                    e.target.parentElement.style.height = "400px";
                  }}
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-amber-500 text-black text-xs font-black px-3 py-2 rounded-2xl shadow-lg">
                60% cheaper
                <br />
                than courier
              </div>
            </div>

            <div className="order-1 md:order-2">
              <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-amber-100 mb-5">
                <Package size={12} />
                Send parcels
              </span>
              <h2 className="text-4xl font-black text-slate-900 mb-4 leading-tight">
                Same-day delivery.
                <span className="text-amber-500"> Half the price.</span>
              </h2>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                Send packages with verified drivers already going your way.
                Faster than courier, cheaper than post.
              </p>

              <div className="space-y-4">
                {[
                  "Delivered same day — not 2-3 days",
                  "60% cheaper than traditional couriers",
                  "Photo proof at pickup and delivery",
                  "Track your parcel in real time",
                  "All drivers KYC verified",
                ].map((point, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                      <Check size={11} className="text-amber-600" />
                    </div>
                    <p className="text-slate-600 text-sm">{point}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setSearchMode("parcel");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="mt-8 flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3.5 rounded-xl transition shadow-sm"
              >
                Send a parcel
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOR DRIVERS
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-100 mb-4">
              <TrendingUp size={12} />
              For drivers
            </span>
            <h2 className="text-4xl font-black text-slate-900 mb-4">
              Your daily commute.
              <span className="text-emerald-600"> Now earning.</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              You're already making the trip. List your ride in 2 minutes
              and let Bootrider fill your empty seats and boot space.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: <Clock size={22} className="text-blue-600" />,
                bg: "bg-blue-50",
                title: "2 minutes to list",
                desc: "Our guided flow makes it effortless. Add your route, set your price, choose preferences.",
              },
              {
                icon: <TrendingUp size={22} className="text-emerald-600" />,
                bg: "bg-emerald-50",
                title: "Earn ₹800–2000/month",
                desc: "Daily commuters save significantly on fuel. Parcel deliveries add extra income on top.",
              },
              {
                icon: <Shield size={22} className="text-purple-600" />,
                bg: "bg-purple-50",
                title: "You control everything",
                desc: "Review requests, set preferences — smoking, pets, music. Your car, your rules.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition"
              >
                <div className={`w-12 h-12 ${card.bg} rounded-2xl flex items-center justify-center mb-4`}>
                  {card.icon}
                </div>
                <h3 className="text-slate-800 font-bold mb-2">{card.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => isAuthenticated ? navigate("/create-rides") : navigate("/signup")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition shadow-sm text-lg"
            >
              <Car size={18} />
              {isAuthenticated ? "List a ride now" : "Start for free"}
              <ArrowRight size={16} />
            </button>
            <p className="text-slate-400 text-sm mt-3">
              Free to join · No subscription · Earn from day one
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TRUST & SAFETY
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-900 mb-4">
              Built for trust
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Safety isn't a feature — it's the foundation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: <BadgeCheck size={24} className="text-blue-600" />,
                bg: "bg-blue-50 border-blue-100",
                title: "KYC verified",
                desc: "Every driver verifies identity with Aadhaar before listing a single ride.",
              },
              {
                icon: <Star size={24} className="text-amber-500" />,
                bg: "bg-amber-50 border-amber-100",
                title: "Ratings & reviews",
                desc: "Both drivers and passengers rate each other. Accountability on both sides.",
              },
              {
                icon: <Shield size={24} className="text-emerald-600" />,
                bg: "bg-emerald-50 border-emerald-100",
                title: "Photo proof",
                desc: "Drivers upload photos at parcel pickup and delivery. No disputes.",
              },
              {
                icon: <Heart size={24} className="text-pink-500" />,
                bg: "bg-pink-50 border-pink-100",
                title: "Community driven",
                desc: "Real people, real routes. Not strangers — neighbours sharing the road.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`${item.bg} border rounded-2xl p-6`}
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-slate-800 font-bold mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ENTERPRISE BANNER
      ══════════════════════════════════════════ */}
      {!isAuthenticated && (
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{ minHeight: "280px" }}
            >
              {/* BG image */}
              <img
                src={enterpriseTruck}
                alt="Enterprise"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent" />

              <div className="relative z-10 p-10 md:p-14 max-w-lg">
                <span className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                  <Truck size={12} />
                  Enterprise
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                  Own a truck or fleet?
                  <span className="block text-amber-400">Stop running empty.</span>
                </h2>
                <p className="text-white/70 mb-8 leading-relaxed">
                  Monetise empty return trips. Connect with businesses that
                  need same-day freight. Turn dead weight into revenue.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate("/transporter/signup")}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl transition shadow-lg"
                  >
                    Register your fleet
                    <ArrowRight size={15} />
                  </button>
                  <button
                    onClick={() => navigate("/transporter/login")}
                    className="flex items-center gap-2 border border-white/20 text-white hover:bg-white/10 font-medium px-6 py-3 rounded-xl transition text-sm"
                  >
                    Already registered
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          ENVIRONMENT STRIP
      ══════════════════════════════════════════ */}
      <section className="py-12 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Leaf size={22} className="text-white" />
            <h3 className="text-white font-black text-xl">
              Every ride shared = fewer cars on the road
            </h3>
          </div>
          <p className="text-emerald-100 text-sm">
            Bootrider riders have collectively saved an estimated{" "}
            <span className="font-bold text-white">142 tonnes of CO₂</span>{" "}
            this year. Small choices. Big impact.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA
      ══════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-black text-slate-900 mb-4 leading-tight">
            Ready to ride
            <span className="text-blue-600"> smarter?</span>
          </h2>
          <p className="text-slate-500 text-lg mb-10">
            Join thousands of drivers and senders already using Bootrider
            across Delhi NCR.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(isAuthenticated ? "/create-rides" : "/signup")}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition shadow-sm text-lg"
            >
              {isAuthenticated ? "List a ride" : "Get started free"}
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate("/search-results")}
              className="flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-blue-300 text-slate-600 hover:text-blue-600 font-semibold px-8 py-4 rounded-xl transition"
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
      <footer className="bg-slate-900 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Car size={14} className="text-white" />
                </div>
                <span className="text-white font-black text-lg">
                  Boot<span className="text-blue-400">Rider</span>
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                India's smartest carpooling and parcel sharing platform.
              </p>
            </div>

            {[
              {
                title: "Riders",
                links: ["Find a ride", "Send a parcel", "How it works", "Safety"],
              },
              {
                title: "Drivers",
                links: ["Offer a ride", "Register boot space", "Earnings", "KYC verification"],
              },
              {
                title: "Company",
                links: ["About us", "Blog", "Contact", "Terms & Privacy"],
              },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-white font-semibold text-sm mb-3">{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <span className="text-slate-400 text-sm hover:text-white cursor-pointer transition">
                        {link}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © 2025 Bootrider. Made with ❤️ for NCR commuters.
            </p>
            <p className="text-slate-600 text-xs">
              Delhi · Noida · Gurgaon · Mathura · Agra
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ══════════════════════════════════════════
// TRANSPORTER LANDING
// ══════════════════════════════════════════
const TransporterLanding = ({ navigate, user }) => {
  const [form, setForm] = useState({ from: "", to: "", date: "", weightKg: "" });

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(
      `/enterprise/search?from=${encodeURIComponent(form.from)}&to=${encodeURIComponent(form.to)}&date=${form.date}&weightKg=${form.weightKg}`
    );
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section
        className="relative min-h-[85vh] flex flex-col items-center justify-center"
        style={{
          backgroundImage: `url(${enterpriseTruck})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/80" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Truck size={12} />
            Enterprise Dashboard
          </span>

          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
            Welcome back,
            <span className="block text-amber-400">
              {user?.name?.split(" ")[0]}.
            </span>
          </h1>

          <p className="text-white/70 text-lg mb-10">
            Manage your fleet, accept cargo bookings, and track your earnings.
          </p>

          {/* Enterprise search */}
          <div className="bg-white rounded-2xl shadow-2xl p-5 max-w-2xl mx-auto">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-4 text-left">
              Find cargo loads for your return trips
            </p>
            <form onSubmit={handleSearch} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                  <input
                    type="text"
                    placeholder="Origin city"
                    value={form.from}
                    onChange={(e) => setForm({ ...form, from: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl pl-8 pr-3 py-3 text-slate-800 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
                  />
                </div>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                  <input
                    type="text"
                    placeholder="Destination city"
                    value={form.to}
                    onChange={(e) => setForm({ ...form, to: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl pl-8 pr-3 py-3 text-slate-800 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl pl-8 pr-3 py-3 text-slate-800 text-sm focus:outline-none focus:border-amber-400 transition [color-scheme:light]"
                  />
                </div>
                <div className="relative">
                  <Package size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    placeholder="Min capacity (kg)"
                    value={form.weightKg}
                    onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl pl-8 pr-3 py-3 text-slate-800 text-sm focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
              >
                <Search size={16} />
                Search cargo loads
              </button>
            </form>
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            <button
              onClick={() => navigate("/enterprise/dashboard")}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-5 py-2.5 rounded-xl transition text-sm"
            >
              <TrendingUp size={14} />
              My dashboard
            </button>
            <button
              onClick={() => navigate("/enterprise/create")}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 rounded-xl transition text-sm"
            >
              <Truck size={14} />
              New listing
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;