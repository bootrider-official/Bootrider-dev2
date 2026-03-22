import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    Car, Package, Truck, Shield, Users, TrendingUp,
    Zap, Heart, Leaf, ArrowRight, MapPin, Star,
    ChevronDown, Play, Check, Globe, Award, Clock
} from "lucide-react";
import logo from "../assets/logo.png";

// ── Counter animation hook ────────────────────────────────────────────────────
const useCounter = (target, duration = 2000, start = false) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [start, target, duration]);
    return count;
};

// ── Intersection observer hook ────────────────────────────────────────────────
const useInView = (threshold = 0.3) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setInView(true); },
            { threshold }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);
    return [ref, inView];
};

// ── Animated stat ─────────────────────────────────────────────────────────────
const AnimatedStat = ({ value, suffix = "", label, inView }) => {
    const count = useCounter(value, 2000, inView);
    return (
        <div className="text-center">
            <p className="text-4xl md:text-5xl font-black text-white">
                {count.toLocaleString()}{suffix}
            </p>
            <p className="text-slate-400 text-sm mt-2">{label}</p>
        </div>
    );
};

const AboutPage = () => {
    const navigate = useNavigate();
    const [statsRef, statsInView] = useInView(0.3);
    const [activeTab, setActiveTab] = useState("passenger");
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

    return (
        <div className="min-h-screen bg-white">

            {/* ══════════════════════════════════════════
          HERO — Dark
      ══════════════════════════════════════════ */}
            <section className="relative min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center overflow-hidden px-4">

                {/* BG effects */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }} />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    {/* Logo */}
                    <div className="flex justify-center mb-10">
                        <img src={logo} alt="Bootrider" className="h-16 w-auto object-contain" />
                    </div>

                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                        <span className="text-blue-300 text-sm font-medium">
                            Built in India · For India
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
                        We're making
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">
                            every trip count.
                        </span>
                    </h1>

                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
                        Bootrider is India's first carpooling + parcel delivery platform
                        built for the daily commuter. Share your ride, fill your boot space,
                        and earn from trips you were already making.
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            onClick={() => navigate("/signup")}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition shadow-lg shadow-blue-500/20"
                        >
                            Join Bootrider
                            <ArrowRight size={16} />
                        </button>
                        <button
                            onClick={() => document.getElementById("story").scrollIntoView({ behavior: "smooth" })}
                            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-xl transition"
                        >
                            Our story
                            <ChevronDown size={16} />
                        </button>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
                    <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
                </div>
            </section>

            {/* ══════════════════════════════════════════
          STATS — Dark
      ══════════════════════════════════════════ */}
            <section ref={statsRef} className="bg-[#0f1623] py-20 px-4">
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
                    <AnimatedStat value={2400} suffix="+" label="Active drivers" inView={statsInView} />
                    <AnimatedStat value={18000} suffix="+" label="Parcels delivered" inView={statsInView} />
                    <AnimatedStat value={142} suffix="T" label="CO₂ saved (tonnes)" inView={statsInView} />
                    <AnimatedStat value={60} suffix="%" label="Cheaper than courier" inView={statsInView} />
                </div>
            </section>

            {/* ══════════════════════════════════════════
          OUR STORY — White
      ══════════════════════════════════════════ */}
            <section id="story" className="py-24 bg-white px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100 mb-5">
                                Our story
                            </span>
                            <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">
                                Born from a
                                <span className="text-blue-600"> real problem.</span>
                            </h2>
                            <div className="space-y-4 text-slate-600 leading-relaxed">
                                <p>
                                    Every day, thousands of cars travel the Noida–Delhi corridor with
                                    empty seats and empty boot spaces. Meanwhile, people wait for
                                    rides and courier companies charge a fortune for same-day delivery.
                                </p>
                                <p>
                                    We asked a simple question: <strong className="text-slate-800">what if the car going past you
                                        could drop your package too?</strong>
                                </p>
                                <p>
                                    Bootrider was built to answer that question. We connect drivers
                                    who are already making a trip with passengers who need a ride
                                    and senders who need a parcel delivered — all in one platform.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                {
                                    year: "2024",
                                    title: "Idea & Research",
                                    desc: "Identified the gap between empty car boots and expensive courier services in NCR.",
                                    color: "bg-blue-600",
                                },
                                {
                                    year: "2025",
                                    title: "Platform Built",
                                    desc: "Developed full-stack carpooling + parcel marketplace with KYC verification.",
                                    color: "bg-indigo-600",
                                },
                                {
                                    year: "2025",
                                    title: "NCR Launch",
                                    desc: "Live across Noida, Delhi, Gurgaon, Mathura and Agra corridors.",
                                    color: "bg-emerald-600",
                                },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center shrink-0`}>
                                            <span className="text-white text-xs font-bold">{item.year}</span>
                                        </div>
                                        {i < 2 && <div className="w-px flex-1 bg-slate-200 mt-2" />}
                                    </div>
                                    <div className="pb-6">
                                        <p className="text-slate-800 font-bold">{item.title}</p>
                                        <p className="text-slate-500 text-sm mt-1 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
          HOW IT WORKS — Tabs
      ══════════════════════════════════════════ */}
            <section className="py-24 bg-slate-50 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-black text-slate-900 mb-4">
                            How Bootrider works
                        </h2>
                        <p className="text-slate-500 text-lg max-w-xl mx-auto">
                            Three types of users. One seamless platform.
                        </p>
                    </div>

                    {/* Tab switcher */}
                    <div className="flex justify-center mb-10">
                        <div className="flex bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
                            {[
                                { id: "passenger", label: "Passenger", icon: <Users size={14} /> },
                                { id: "driver", label: "Driver", icon: <Car size={14} /> },
                                { id: "sender", label: "Parcel sender", icon: <Package size={14} /> },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id
                                            ? "bg-blue-600 text-white shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab content */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                        {activeTab === "passenger" && (
                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    { step: "01", icon: <MapPin size={20} className="text-blue-600" />, title: "Search your route", desc: "Enter your pickup and destination. We find drivers going the same way." },
                                    { step: "02", icon: <ShieldCheck size={20} className="text-blue-600" />, title: "Pick a verified driver", desc: "View driver profiles, ratings, preferences and vehicle info before booking." },
                                    { step: "03", icon: <Zap size={20} className="text-blue-600" />, title: "Ride & rate", desc: "Book instantly or request approval. Travel comfortably and rate your experience." },
                                ].map((item) => (
                                    <div key={item.step} className="text-center">
                                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            {item.icon}
                                        </div>
                                        <p className="text-blue-500 font-mono text-xs font-bold mb-2">{item.step}</p>
                                        <p className="text-slate-800 font-bold mb-2">{item.title}</p>
                                        <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === "driver" && (
                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    { step: "01", icon: <Car size={20} className="text-emerald-600" />, title: "List your ride", desc: "Set your route, time, seats, price and preferences in under 2 minutes." },
                                    { step: "02", icon: <Package size={20} className="text-emerald-600" />, title: "Register boot space", desc: "Optionally offer your boot space for parcel delivery on the same route." },
                                    { step: "03", icon: <TrendingUp size={20} className="text-emerald-600" />, title: "Earn on every trip", desc: "Accept passengers and parcels. Offset your fuel costs and earn extra income." },
                                ].map((item) => (
                                    <div key={item.step} className="text-center">
                                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            {item.icon}
                                        </div>
                                        <p className="text-emerald-500 font-mono text-xs font-bold mb-2">{item.step}</p>
                                        <p className="text-slate-800 font-bold mb-2">{item.title}</p>
                                        <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === "sender" && (
                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    { step: "01", icon: <Package size={20} className="text-amber-600" />, title: "Find a driver", desc: "Search rides going your parcel's route. Filter by boot space availability." },
                                    { step: "02", icon: <Shield size={20} className="text-amber-600" />, title: "Book boot space", desc: "Select parcel size, weight and receiver details. Pay the segment price." },
                                    { step: "03", icon: <MapPin size={20} className="text-amber-600" />, title: "Track & receive", desc: "Get photo proof at pickup and delivery. Track your parcel in real time." },
                                ].map((item) => (
                                    <div key={item.step} className="text-center">
                                        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            {item.icon}
                                        </div>
                                        <p className="text-amber-500 font-mono text-xs font-bold mb-2">{item.step}</p>
                                        <p className="text-slate-800 font-bold mb-2">{item.title}</p>
                                        <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
          VALUES — White
      ══════════════════════════════════════════ */}
            <section className="py-24 bg-white px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-4xl font-black text-slate-900 mb-4">
                            What we stand for
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: <Shield size={24} className="text-blue-600" />,
                                bg: "bg-blue-50 border-blue-100",
                                title: "Safety first",
                                desc: "Every driver is KYC verified with Aadhaar before listing a single ride.",
                            },
                            {
                                icon: <Heart size={24} className="text-pink-500" />,
                                bg: "bg-pink-50 border-pink-100",
                                title: "Community",
                                desc: "Real people, real routes. Not strangers — neighbours sharing the road.",
                            },
                            {
                                icon: <Leaf size={24} className="text-emerald-600" />,
                                bg: "bg-emerald-50 border-emerald-100",
                                title: "Sustainability",
                                desc: "Every shared seat means one fewer car on the road and less CO₂ in the air.",
                            },
                            {
                                icon: <Globe size={24} className="text-indigo-600" />,
                                bg: "bg-indigo-50 border-indigo-100",
                                title: "Accessibility",
                                desc: "Affordable travel and delivery for everyone, not just those who can pay courier prices.",
                            },
                        ].map((v) => (
                            <div key={v.title} className={`${v.bg} border rounded-2xl p-6`}>
                                <div className="mb-4">{v.icon}</div>
                                <h3 className="text-slate-800 font-bold mb-2">{v.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
          TEAM — Dark
      ══════════════════════════════════════════ */}
            <section className="py-24 bg-[#0a0a0f] px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-black text-white mb-4">
                        Built by commuters,
                        <span className="text-blue-400"> for commuters.</span>
                    </h2>
                    <p className="text-gray-400 text-lg mb-16 max-w-2xl mx-auto leading-relaxed">
                        We're a team of students and engineers from the NCR who experienced
                        the problem firsthand — expensive courier rates, empty car seats, and
                        no good platform to solve both at once.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        {[
                            {
                                icon: <Award size={22} className="text-amber-400" />,
                                bg: "bg-amber-500/10 border-amber-500/20",
                                title: "College project",
                                desc: "Started as a final year project. Now solving real problems for real commuters.",
                            },
                            {
                                icon: <Globe size={22} className="text-blue-400" />,
                                bg: "bg-blue-500/10 border-blue-500/20",
                                title: "NCR focused",
                                desc: "Deeply built for the Noida↔Delhi corridor with plans to expand pan-India.",
                            },
                            {
                                icon: <Zap size={22} className="text-emerald-400" />,
                                bg: "bg-emerald-500/10 border-emerald-500/20",
                                title: "Moving fast",
                                desc: "New features every week. We listen to every driver and sender on the platform.",
                            },
                        ].map((item) => (
                            <div key={item.title} className={`${item.bg} border rounded-2xl p-6 text-left`}>
                                <div className="mb-3">{item.icon}</div>
                                <p className="text-white font-bold mb-1">{item.title}</p>
                                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
          FAQ — White
      ══════════════════════════════════════════ */}
            <section className="py-24 bg-white px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-4xl font-black text-slate-900 mb-4">
                            Frequently asked
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {[
                            {
                                q: "Is Bootrider safe to use?",
                                a: "Yes. Every driver on Bootrider is verified with Aadhaar KYC before listing any ride. Both drivers and passengers rate each other after every trip, creating a community accountability system.",
                            },
                            {
                                q: "How is Bootrider different from Ola/Uber?",
                                a: "Bootrider is not a taxi service. It's a carpooling platform — drivers are already making the trip for their own reasons and share the cost with passengers. This makes it significantly cheaper. Plus, no driver is ever 'on duty' — they list rides at their own convenience.",
                            },
                            {
                                q: "How does parcel delivery work?",
                                a: "Drivers can register their boot space when listing a ride. Senders find rides going their parcel's route and book the boot space. The driver picks up the parcel, transports it on their existing trip, and delivers it. Photo proof is required at both pickup and delivery.",
                            },
                            {
                                q: "What areas does Bootrider cover?",
                                a: "We currently cover the Noida↔Delhi↔Gurgaon corridor and the Mathura↔Agra stretch. We're expanding to more NCR cities and beyond based on driver demand.",
                            },
                            {
                                q: "How do I get paid as a driver?",
                                a: "Passengers pay drivers directly for the trip. Parcel senders pay the agreed boot space price. Bootrider does not take a commission during the current phase — all earnings go directly to you.",
                            },
                            {
                                q: "What if I need to cancel a ride?",
                                a: "Both drivers and passengers can cancel rides. We ask that cancellations be made as early as possible out of respect for other users. Repeated cancellations may affect your rating.",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="border border-slate-200 rounded-2xl overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleFaq(i)}
                                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition"
                                >
                                    <span className="text-slate-800 font-semibold text-sm">
                                        {item.q}
                                    </span>
                                    <ChevronDown
                                        size={16}
                                        className={`text-slate-400 shrink-0 ml-4 transition-transform ${openFaq === i ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>
                                {openFaq === i && (
                                    <div className="px-6 pb-5">
                                        <p className="text-slate-500 text-sm leading-relaxed">{item.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
          CTA — Dark
      ══════════════════════════════════════════ */}
            <section className="py-24 bg-[#0a0a0f] px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <img src={logo} alt="Bootrider" className="h-12 w-auto mx-auto mb-8 object-contain" />
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                        Ready to make every
                        <span className="text-blue-400"> trip count?</span>
                    </h2>
                    <p className="text-gray-400 text-lg mb-10">
                        Join thousands of drivers and senders across Delhi NCR.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            onClick={() => navigate("/signup")}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition shadow-lg shadow-blue-500/20"
                        >
                            Create free account
                            <ArrowRight size={16} />
                        </button>
                        <button
                            onClick={() => navigate("/search-results")}
                            className="flex items-center gap-2 border border-white/10 hover:bg-white/5 text-white font-semibold px-8 py-4 rounded-xl transition"
                        >
                            Browse rides
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

// ── ShieldCheck needed locally ────────────────────────────────────────────────
const ShieldCheck = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
    </svg>
);

export default AboutPage;