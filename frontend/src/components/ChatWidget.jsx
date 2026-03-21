// frontend/src/components/ChatWidget.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    MessageCircle, X, Send, Car, Package,
    Calendar, Clock, Users, Star, ShieldCheck,
    ChevronRight, Bot, Loader2
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── Quick suggestion chips ────────────────────────────────────────────────────
const SUGGESTIONS = [
    "Delhi se Noida jana hai aaj",
    "Kal subah airport ke liye ride chahiye",
    "Parcel bhejni hai Gurgaon",
    "How does BootRider work?",
];

// ── Ride Card inside chat ─────────────────────────────────────────────────────
const ChatRideCard = ({ ride, navigate }) => {
    const isVerified = ride.driver?.kycStatus === "verified";
    const rating = ride.driver?.rating || 0;
    const hasRatings = ride.driver?.totalRatings > 0;
    const rideId = ride._id || ride.id;

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-3 hover:border-blue-300 hover:shadow-sm transition-all">
            {/* Route */}
            <div className="flex items-start gap-2 mb-2">
                <div className="flex flex-col items-center gap-0.5 pt-1 shrink-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <div className="w-px h-3 bg-slate-200" />
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-slate-800 font-semibold text-xs truncate">
                        {ride.from?.name?.split(",")[0] || "—"}
                    </p>
                    <p className="text-slate-500 text-xs truncate mt-0.5">
                        {ride.to?.name?.split(",")[0] || "—"}
                    </p>
                </div>
                <div className="text-right shrink-0">
                    <p className="text-blue-600 font-black text-base">₹{ride.pricePerSeat}</p>
                    <p className="text-slate-400 text-[10px]">per seat</p>
                </div>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                {ride.date && (
                    <span className="flex items-center gap-0.5 text-[10px] text-slate-400">
                        <Calendar size={9} />
                        {new Date(ride.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                )}
                {ride.time && (
                    <span className="flex items-center gap-0.5 text-[10px] text-slate-400">
                        <Clock size={9} />
                        {ride.time}
                    </span>
                )}
                <span className="flex items-center gap-0.5 text-[10px] text-slate-400">
                    <Users size={9} />
                    {ride.availableSeats} seats
                </span>
                {ride.acceptsParcels && (
                    <span className="flex items-center gap-0.5 text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">
                        <Package size={8} />
                        Boot
                    </span>
                )}
                {ride.bookingPreference === "instant" && (
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                        Instant
                    </span>
                )}
            </div>

            {/* Driver + CTA */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[9px] font-bold overflow-hidden">
                        {ride.driver?.profilePhoto ? (
                            <img src={ride.driver.profilePhoto} alt="" className="w-full h-full object-cover" />
                        ) : (
                            ride.driver?.name?.[0]?.toUpperCase() || "D"
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-0.5">
                            <p className="text-[10px] text-slate-600 font-medium">
                                {ride.driver?.name?.split(" ")[0] || "Driver"}
                            </p>
                            {isVerified && <ShieldCheck size={8} className="text-emerald-500" />}
                        </div>
                        {hasRatings && (
                            <div className="flex items-center gap-0.5">
                                <Star size={8} className="text-amber-400 fill-amber-400" />
                                <span className="text-[9px] text-slate-400">{rating.toFixed(1)}</span>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => navigate(`/ride/${rideId}`)}
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition"
                >
                    Book Now
                    <ChevronRight size={9} />
                </button>
            </div>
        </div>
    );
};

// ── Message bubble ────────────────────────────────────────────────────────────
const Message = ({ msg, navigate }) => {
    const isUser = msg.role === "user";

    return (
        <div className={`flex gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
            {/* Avatar */}
            {!isUser && (
                <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={14} className="text-white" />
                </div>
            )}

            <div className={`flex flex-col gap-1.5 max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
                {/* Text bubble */}
                {msg.content && (
                    <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${isUser
                            ? "bg-blue-600 text-white rounded-tr-sm"
                            : "bg-slate-100 text-slate-800 rounded-tl-sm"
                        }`}>
                        {msg.content}
                    </div>
                )}

                {/* Ride cards */}
                {msg.rides && msg.rides.length > 0 && (
                    <div className="flex flex-col gap-2 w-full">
                        <p className="text-[10px] text-slate-400 px-1">
                            {msg.rides.length} ride{msg.rides.length > 1 ? "s" : ""} found:
                        </p>
                        {msg.rides.map((ride) => (
                            <ChatRideCard key={ride._id || ride.id} ride={ride} navigate={navigate} />
                        ))}
                    </div>
                )}

                {/* Timestamp */}
                <span className="text-[9px] text-slate-300 px-1">
                    {new Date(msg.ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </span>
            </div>
        </div>
    );
};

// ── Main ChatWidget ───────────────────────────────────────────────────────────
const ChatWidget = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasUnread, setHasUnread] = useState(true);

    const [messages, setMessages] = useState([
        {
            role: "bot",
            content: "Namaste! 👋 Main BootBot hoon. Kahan jana hai? Date aur destination batao — main aapke liye rides dhundhunga!",
            ts: Date.now(),
        },
    ]);

    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    // Scroll to bottom on new messages
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Focus input when opened
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 100);
            setHasUnread(false);
        }
    }, [open]);

    // Build history for API (last 6 turns, text only)
    const buildHistory = () =>
        messages
            .filter((m) => m.content)
            .slice(-6)
            .map((m) => ({
                role: m.role === "user" ? "user" : "assistant",
                content: m.content,
            }));

    const sendMessage = async (text) => {
        const msg = (text || input).trim();
        if (!msg || loading) return;

        setInput("");
        setHasUnread(false);

        // Add user message
        setMessages((prev) => [
            ...prev,
            { role: "user", content: msg, ts: Date.now() },
        ]);

        setLoading(true);

        try {
            const { data } = await axios.post(`${BASE_URL}/chat`, {
                userMessage: msg,
                history: buildHistory(),
            });

            setMessages((prev) => [
                ...prev,
                {
                    role: "bot",
                    content: data.reply,
                    rides: data.rides || [],
                    ts: Date.now(),
                },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "bot",
                    content: "Sorry, kuch problem ho gayi. Please dobara try karein.",
                    ts: Date.now(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* ── Chat Window ── */}
            {open && (
                <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
                    style={{ height: "520px" }}
                >
                    {/* Header */}
                    <div className="bg-blue-600 px-4 py-3 flex items-center gap-3 shrink-0">
                        <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                            <Bot size={18} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-bold text-sm">BootBot</p>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                <p className="text-blue-100 text-xs">Online · Find rides instantly</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-full transition"
                        >
                            <X size={15} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-slate-50">
                        {messages.map((msg, i) => (
                            <Message key={i} msg={msg} navigate={navigate} />
                        ))}

                        {/* Typing indicator */}
                        {loading && (
                            <div className="flex gap-2">
                                <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                                    <Bot size={14} className="text-white" />
                                </div>
                                <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-3 py-2.5 flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Suggestion chips — only show if just 1 message */}
                    {messages.length === 1 && (
                        <div className="px-3 py-2 flex gap-1.5 flex-wrap border-t border-slate-100 bg-white shrink-0">
                            {SUGGESTIONS.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => sendMessage(s)}
                                    className="text-[10px] text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-full transition whitespace-nowrap"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div className="px-3 py-2.5 border-t border-slate-200 bg-white shrink-0 flex items-center gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="e.g. Kal 3 baje Delhi se Noida..."
                            className="flex-1 text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                            disabled={loading}
                        />
                        <button
                            onClick={() => sendMessage()}
                            disabled={!input.trim() || loading}
                            className="w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-full flex items-center justify-center transition shrink-0"
                        >
                            {loading ? (
                                <Loader2 size={13} className="animate-spin text-slate-400" />
                            ) : (
                                <Send size={13} />
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Floating Bubble ── */}
            <button
                onClick={() => { setOpen((prev) => !prev); setHasUnread(false); }}
                className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                aria-label="Open chat"
            >
                {open ? (
                    <X size={22} className="text-white" />
                ) : (
                    <MessageCircle size={22} className="text-white" />
                )}

                {/* Unread dot */}
                {hasUnread && !open && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-white text-[8px] font-bold">1</span>
                    </span>
                )}
            </button>
        </>
    );
};

export default ChatWidget;