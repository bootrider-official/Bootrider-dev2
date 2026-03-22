import React, { useState, useEffect, useRef, useCallback } from "react";
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
import ChatWidget from "../components/ChatWidget";
import { Link } from "react-router-dom";
import { X, Mail } from "lucide-react"; // add X and Mail if not already there
import logo from "../assets/logo.png";
/* ─── Scroll-reveal hook ─────────────────────────────────── */
const useScrollReveal = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);          // animate once
        }
      },
      { threshold: options.threshold ?? 0.15, rootMargin: options.rootMargin ?? "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
};

/* ─── Animated counter ───────────────────────────────────── */
const AnimatedStat = ({ value, label }) => {
  const ref = useRef(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Parse numeric part
          const numMatch = value.match(/[\d,]+/);
          if (numMatch) {
            const target = parseInt(numMatch[0].replace(/,/g, ""), 10);
            const prefix = value.slice(0, value.indexOf(numMatch[0]));
            const suffix = value.slice(value.indexOf(numMatch[0]) + numMatch[0].length);
            const duration = 1600;
            const start = performance.now();

            const step = (now) => {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              // ease-out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.round(target * eased);
              setDisplay(`${prefix}${current.toLocaleString("en-IN")}${suffix}`);
              if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          }
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref}>
      <p className="text-white font-black text-2xl md:text-3xl">{display}</p>
      <p className="text-blue-100 text-sm mt-0.5">{label}</p>
    </div>
  );
};

/* ═════════════════════════════════════════════════════════ */
/*  LANDING PAGE                                            */
/* ═════════════════════════════════════════════════════════ */
const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isTransporter = user?.role === "transporter";

  const [searchMode, setSearchMode] = useState("passenger");
  const [form, setForm] = useState({
    from: "", to: "", date: "", passengers: 1,
  });

  // ── Parallax ──
  const heroRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (bgRef.current && heroRef.current) {
            const rect = heroRef.current.getBoundingClientRect();
            if (rect.bottom > 0) {
              const scrolled = window.scrollY;
              bgRef.current.style.transform = `translate3d(0, ${scrolled * 0.4}px, 0) scale(1.15)`;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Scroll-reveal refs ──
  const trustRef = useScrollReveal();
  const passengerText = useScrollReveal();
  const passengerImg = useScrollReveal({ threshold: 0.1 });
  const parcelImg = useScrollReveal({ threshold: 0.1 });
  const parcelText = useScrollReveal();
  const driverHeader = useScrollReveal();
  const driverCards = useScrollReveal();
  const driverCta = useScrollReveal();
  const trustHeader = useScrollReveal();
  const trustCards = useScrollReveal();
  const enterpriseRef = useScrollReveal({ threshold: 0.1 });
  const envRef = useScrollReveal();
  const ctaRef = useScrollReveal();
  const [showContact, setShowContact] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!form.from || !form.to) return;
    navigate(
      `/search-results?from=${encodeURIComponent(form.from)}&to=${encodeURIComponent(form.to)}&date=${form.date}&passengers=${form.passengers}&mode=${searchMode}`
    );
  };

  if (isTransporter) {
    return <TransporterLanding navigate={navigate} user={user} />;
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Parallax background */}
        <div
          ref={bgRef}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
            backgroundRepeat: "no-repeat",
            willChange: "transform",
            transform: "translate3d(0, 0, 0) scale(1.15)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/70 via-[#0a1628]/50 to-[#0a1628]/80" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col items-center">

          {/* Badge — animated entry */}
          <div className="hero-animate-badge flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-white/90 text-sm font-medium">
              Now live across Delhi NCR
            </span>
          </div>

          {/* Title */}
          <h1 className="hero-animate-title text-5xl md:text-6xl lg:text-7xl font-black text-white text-center leading-tight mb-4 tracking-tight">
            DRIVE.{" "}
            <span style={{ color: "#4dd9e0", textShadow: "0 0 40px rgba(77,217,224,0.4)" }}>
              DELIVER.
            </span>{" "}
            EARN.
          </h1>

          <p className="hero-animate-subtitle text-white/70 text-lg md:text-xl text-center max-w-xl mb-10 leading-relaxed">
            Share your ride, split your costs, and deliver parcels on your
            existing route. India's smartest carpooling platform.
          </p>

          {/* Search Card */}
          <div className="hero-animate-card w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
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

            <form onSubmit={handleSearch} className="p-4">
              <div className="flex flex-col md:flex-row gap-3 mb-3">
                <div className="flex-1 relative">
                  <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-500" />
                  <input
                    type="text"
                    placeholder="Leaving from"
                    value={form.from}
                    onChange={(e) => setForm({ ...form, from: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />
                  <input
                    type="text"
                    placeholder="Going to"
                    value={form.to}
                    onChange={(e) => setForm({ ...form, to: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full md:w-36 border border-slate-200 rounded-xl pl-9 pr-3 py-3 text-slate-800 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition [color-scheme:light]"
                  />
                </div>
                {searchMode === "passenger" ? (
                  <div className="relative">
                    <Users size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                      value={form.passengers}
                      onChange={(e) => setForm({ ...form, passengers: e.target.value })}
                      className="w-full md:w-36 border border-slate-200 rounded-xl pl-9 pr-3 py-3 text-slate-800 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition appearance-none bg-white"
                    >
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>{n} passenger{n > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="relative">
                    <Package size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select className="w-full md:w-36 border border-slate-200 rounded-xl pl-9 pr-3 py-3 text-slate-800 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition appearance-none bg-white">
                      <option>Small parcel</option>
                      <option>Medium parcel</option>
                      <option>Large parcel</option>
                    </select>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className={`btn-press w-full font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-sm text-white ${searchMode === "passenger"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-amber-500 hover:bg-amber-600"
                  }`}
              >
                <Search size={16} />
                {searchMode === "passenger" ? "Search available rides" : "Find boot space"}
              </button>
            </form>

            <div className="px-4 pb-4 flex flex-wrap items-center gap-1 text-xs">
              <span className="text-slate-400">Popular:</span>
              {["Noida → Delhi", "Mathura → Agra", "Gurgaon → Delhi", "Noida → Mathura"].map((route) => (
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
              ))}
            </div>
          </div>

          <div className="hero-animate-cta flex items-center gap-4 mt-8">
            <button
              onClick={() => isAuthenticated ? navigate("/create-rides") : navigate("/signup")}
              className="btn-press flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold px-5 py-2.5 rounded-xl transition text-sm"
            >
              <Car size={15} />
              Offer a ride
            </button>
            <button
              onClick={() => navigate("/transporter/signup")}
              className="btn-press flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 backdrop-blur-sm border border-amber-400/30 text-amber-300 font-semibold px-5 py-2.5 rounded-xl transition text-sm"
            >
              <Truck size={15} />
              Enterprise
            </button>
          </div>
        </div>

        <div className="hero-animate-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-10 bg-gradient-to-b from-white to-transparent animate-float" />
          <span className="text-white text-xs tracking-widest uppercase">Scroll</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TRUST BAR
      ══════════════════════════════════════════ */}
      <section className="bg-blue-600 py-5">
        <div ref={trustRef} className="stagger-children max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "2,400+", label: "Active drivers" },
              { value: "18,000+", label: "Parcels delivered" },
              { value: "60%", label: "Cheaper than courier" },
              { value: "4.8★", label: "Average rating" },
            ].map((stat) => (
              <AnimatedStat key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS — Passengers
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div ref={passengerText} className="scroll-slide-left">
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
                  { icon: <Search size={18} className="text-blue-600" />, title: "Search your route", desc: "Enter your city and find drivers going the same way today." },
                  { icon: <BadgeCheck size={18} className="text-blue-600" />, title: "Choose a verified driver", desc: "All drivers are KYC verified. Check profiles, ratings and preferences." },
                  { icon: <Zap size={18} className="text-blue-600" />, title: "Book instantly", desc: "Request your seat. Get confirmed. Show up and ride." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-slate-800 font-semibold">{item.title}</p>
                      <p className="text-slate-500 text-sm mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/search-results")}
                className="btn-press mt-8 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl transition shadow-sm group"
              >
                Find a ride
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div ref={passengerImg} className="scroll-slide-right relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={featureCarpool}
                  alt="Carpooling"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.style.background = "#EFF6FF";
                    e.target.parentElement.style.height = "400px";
                  }}
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl border border-slate-100 px-4 py-3 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">R</div>
                  <div>
                    <p className="text-slate-800 text-sm font-semibold">Rahul · ★ 4.9</p>
                    <p className="text-slate-400 text-xs">Noida → Delhi · ₹120</p>
                  </div>
                  <span className="ml-2 bg-emerald-50 text-emerald-600 text-xs font-medium px-2 py-1 rounded-full border border-emerald-100">Instant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS — Parcels
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-slate-50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div ref={parcelImg} className="scroll-slide-left relative order-2 md:order-1">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={featureParcel}
                  alt="Send parcel"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.style.background = "#FFFBEB";
                    e.target.parentElement.style.height = "400px";
                  }}
                />
              </div>
              <div className="absolute -top-4 -right-4 bg-amber-500 text-black text-xs font-black px-3 py-2 rounded-2xl shadow-lg animate-float">
                60% cheaper<br />than courier
              </div>
            </div>

            <div ref={parcelText} className="scroll-slide-right order-1 md:order-2">
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
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="w-5 h-5 bg-amber-100 group-hover:bg-amber-200 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300">
                      <Check size={11} className="text-amber-600" />
                    </div>
                    <p className="text-slate-600 text-sm">{point}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setSearchMode("parcel"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="btn-press mt-8 flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3.5 rounded-xl transition shadow-sm group"
              >
                Send a parcel
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOR DRIVERS
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div ref={driverHeader} className="scroll-fade-up text-center mb-14">
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

          <div ref={driverCards} className="stagger-children grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: <Clock size={22} className="text-blue-600" />, bg: "bg-blue-50", title: "2 minutes to list", desc: "Our guided flow makes it effortless. Add your route, set your price, choose preferences." },
              { icon: <TrendingUp size={22} className="text-emerald-600" />, bg: "bg-emerald-50", title: "Earn ₹800–2000/month", desc: "Daily commuters save significantly on fuel. Parcel deliveries add extra income on top." },
              { icon: <Shield size={22} className="text-purple-600" />, bg: "bg-purple-50", title: "You control everything", desc: "Review requests, set preferences — smoking, pets, music. Your car, your rules." },
            ].map((card) => (
              <div key={card.title} className="card-hover bg-white border border-slate-200 rounded-2xl p-6">
                <div className={`w-12 h-12 ${card.bg} rounded-2xl flex items-center justify-center mb-4`}>{card.icon}</div>
                <h3 className="text-slate-800 font-bold mb-2">{card.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          <div ref={driverCta} className="scroll-fade-up text-center">
            <button
              onClick={() => isAuthenticated ? navigate("/create-rides") : navigate("/signup")}
              className="btn-press inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition shadow-sm text-lg group"
            >
              <Car size={18} />
              {isAuthenticated ? "List a ride now" : "Start for free"}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-slate-400 text-sm mt-3">Free to join · No subscription · Earn from day one</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TRUST & SAFETY
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-slate-50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div ref={trustHeader} className="scroll-fade-up text-center mb-14">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Built for trust</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">Safety isn't a feature — it's the foundation.</p>
          </div>
          <div ref={trustCards} className="stagger-children grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <BadgeCheck size={24} className="text-blue-600" />, bg: "bg-blue-50 border-blue-100", title: "KYC verified", desc: "Every driver verifies identity with Aadhaar before listing a single ride." },
              { icon: <Star size={24} className="text-amber-500" />, bg: "bg-amber-50 border-amber-100", title: "Ratings & reviews", desc: "Both drivers and passengers rate each other. Accountability on both sides." },
              { icon: <Shield size={24} className="text-emerald-600" />, bg: "bg-emerald-50 border-emerald-100", title: "Photo proof", desc: "Drivers upload photos at parcel pickup and delivery. No disputes." },
              { icon: <Heart size={24} className="text-pink-500" />, bg: "bg-pink-50 border-pink-100", title: "Community driven", desc: "Real people, real routes. Not strangers — neighbours sharing the road." },
            ].map((item) => (
              <div key={item.title} className={`card-hover ${item.bg} border rounded-2xl p-6`}>
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
        <section className="py-16 bg-white overflow-hidden">
          <div className="max-w-6xl mx-auto px-6">
            <div ref={enterpriseRef} className="scroll-scale-up relative rounded-3xl overflow-hidden" style={{ minHeight: "280px" }}>
              <img
                src={enterpriseTruck}
                alt="Enterprise"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => { e.target.style.display = "none"; }}
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
                  Monetise empty return trips. Connect with businesses that need same-day freight.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate("/transporter/signup")}
                    className="btn-press flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl transition shadow-lg group"
                  >
                    Register your fleet
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => navigate("/transporter/login")}
                    className="btn-press flex items-center gap-2 border border-white/20 text-white hover:bg-white/10 font-medium px-6 py-3 rounded-xl transition text-sm"
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
      <section className="py-12 bg-emerald-600 overflow-hidden">
        <div ref={envRef} className="scroll-fade-up max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Leaf size={22} className="text-white" />
            <h3 className="text-white font-black text-xl">Every ride shared = fewer cars on the road</h3>
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
      <section className="py-24 bg-white overflow-hidden">
        <div ref={ctaRef} className="scroll-fade-up max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-black text-slate-900 mb-4 leading-tight">
            Ready to ride
            <span className="text-blue-600"> smarter?</span>
          </h2>
          <p className="text-slate-500 text-lg mb-10">
            Join thousands of drivers and senders already using Bootrider across Delhi NCR.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(isAuthenticated ? "/create-rides" : "/signup")}
              className="btn-press flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition shadow-sm text-lg group"
            >
              {isAuthenticated ? "List a ride" : "Get started free"}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/search-results")}
              className="btn-press flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-blue-300 text-slate-600 hover:text-blue-600 font-semibold px-8 py-4 rounded-xl transition"
            >
              Browse rides
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>
      {/* ══════════════════════════════════════════
    CONTACT MODAL
══════════════════════════════════════════ */}
      {showContact && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowContact(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className="relative bg-[#0a0a0f] border border-white/10 rounded-3xl p-10 max-w-md w-full text-center shadow-2xl z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setShowContact(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition"
            >
              <X size={14} />
            </button>

            {/* Logo */}
            <img src={logo} alt="Bootrider" className="h-10 w-auto mx-auto mb-6 object-contain" />

            <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
              <Mail size={22} className="text-blue-400" />
            </div>

            <h2 className="text-2xl font-black text-white mb-2">Contact Us</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Have a question, feedback or partnership inquiry?
              We'd love to hear from you.
            </p>


            <a href="mailto:[EMAIL_ADDRESS]"
              className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-4 rounded-xl transition shadow-lg shadow-blue-500/20 mb-4"
            >
              <Mail size={16} />
              bootrider.in@gmail.com
            </a>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white text-xs font-semibold mb-1">Response time</p>
                <p className="text-gray-400 text-xs">Within 24–48 hours</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white text-xs font-semibold mb-1">Support hours</p>
                <p className="text-gray-400 text-xs">Mon–Sat, 9am–6pm</p>
              </div>
            </div>

            <p className="text-gray-600 text-xs mt-6">
              For urgent issues, include "URGENT" in your subject line.
            </p>
          </div>
        </div>
      )
      }

      {/* ══════════════════════════════════════════
    FOOTER
══════════════════════════════════════════ */}
      <footer className="bg-slate-900 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

            {/* Brand */}
            <div>
              <img src={logo} alt="Bootrider" className="h-8 w-auto object-contain mb-4" />
              <p className="text-slate-400 text-sm leading-relaxed">
                India's smartest carpooling and parcel sharing platform.
              </p>
            </div>

            {/* Riders */}
            <div>
              <p className="text-white font-semibold text-sm mb-3">Riders</p>
              <ul className="space-y-2">
                {[
                  { label: "Find a ride", to: "/search-results" },
                  { label: "Send a parcel", to: "/search-results?mode=parcel" },
                  { label: "How it works", to: "/about" },
                  { label: "Safety", to: "/about#safety" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-slate-400 text-sm hover:text-white transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Drivers */}
            <div>
              <p className="text-white font-semibold text-sm mb-3">Drivers</p>
              <ul className="space-y-2">
                {[
                  { label: "Offer a ride", to: "/create-rides" },
                  { label: "Register boot space", to: "/create-rides" },
                  { label: "Earnings", to: "/about" },
                  { label: "KYC verification", to: "/kyc-form" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-slate-400 text-sm hover:text-white transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-white font-semibold text-sm mb-3">Company</p>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-slate-400 text-sm hover:text-white transition">
                    About us
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setShowContact(true)}
                    className="text-slate-400 text-sm hover:text-white transition text-left"
                  >
                    Contact us
                  </button>
                </li>
                <li>
                  <Link to="/terms" className="text-slate-400 text-sm hover:text-white transition">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/terms#privacy" className="text-slate-400 text-sm hover:text-white transition">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
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

      {/* ── ChatWidget — floating bottom-right ── */}
      <ChatWidget />

    </div >
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
          <span className="hero-animate-badge inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Truck size={12} />
            Enterprise Dashboard
          </span>
          <h1 className="hero-animate-title text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
            Welcome back,
            <span className="block text-amber-400">{user?.name?.split(" ")[0]}.</span>
          </h1>
          <p className="hero-animate-subtitle text-white/70 text-lg mb-10">
            Manage your fleet, accept cargo bookings, and track your earnings.
          </p>

          <div className="hero-animate-card bg-white rounded-2xl shadow-2xl p-5 max-w-2xl mx-auto">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-4 text-left">
              Find cargo loads for your return trips
            </p>
            <form onSubmit={handleSearch} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                  <input type="text" placeholder="Origin city" value={form.from}
                    onChange={(e) => setForm({ ...form, from: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl pl-8 pr-3 py-3 text-slate-800 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition" />
                </div>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                  <input type="text" placeholder="Destination city" value={form.to}
                    onChange={(e) => setForm({ ...form, to: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl pl-8 pr-3 py-3 text-slate-800 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input type="date" value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl pl-8 pr-3 py-3 text-slate-800 text-sm focus:outline-none focus:border-amber-400 transition [color-scheme:light]" />
                </div>
                <div className="relative">
                  <Package size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="number" placeholder="Min capacity (kg)" value={form.weightKg}
                    onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl pl-8 pr-3 py-3 text-slate-800 text-sm focus:outline-none focus:border-amber-400 transition" />
                </div>
              </div>
              <button type="submit"
                className="btn-press w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2">
                <Search size={16} />
                Search cargo loads
              </button>
            </form>
          </div>

          <div className="hero-animate-cta flex flex-wrap gap-3 justify-center mt-6">
            <button onClick={() => navigate("/enterprise/dashboard")}
              className="btn-press flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-5 py-2.5 rounded-xl transition text-sm">
              <TrendingUp size={14} />
              My dashboard
            </button>
            <button onClick={() => navigate("/enterprise/create")}
              className="btn-press flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 rounded-xl transition text-sm">
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