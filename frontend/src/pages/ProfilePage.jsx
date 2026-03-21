import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { loginSuccess } from "../redux/authSlice";
import {
    Camera, Star, ShieldCheck, Shield,
    Car, Package, Calendar, Edit3,
    Check, X, User, Music, MessageCircle,
    Cigarette, PawPrint, ChevronRight,
    MapPin, Award
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── Preference config ────────────────────────────────────────────────────────
const PREF_CONFIG = {
    music: {
        label: "Music",
        icon: <Music size={14} />,
        options: [
            { value: "no_music", label: "No music" },
            { value: "sometimes", label: "Sometimes" },
            { value: "always", label: "Always" },
        ],
    },
    chat: {
        label: "Chat",
        icon: <MessageCircle size={14} />,
        options: [
            { value: "quiet", label: "I prefer quiet" },
            { value: "chatty", label: "I love to chat" },
            { value: "no_preference", label: "No preference" },
        ],
    },
    smoking: {
        label: "Smoking",
        icon: <Cigarette size={14} />,
        options: [
            { value: "never", label: "No smoking" },
            { value: "sometimes", label: "Sometimes ok" },
            { value: "fine", label: "Fine with it" },
        ],
    },
    pets: {
        label: "Pets",
        icon: <PawPrint size={14} />,
        options: [
            { value: "love_them", label: "Love pets" },
            { value: "fine", label: "Fine with pets" },
            { value: "prefer_not", label: "Prefer not" },
        ],
    },
};

const GENDER_LABELS = {
    man: "Man",
    woman: "Woman",
    prefer_not_to_say: "Prefer not to say",
};

const ProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user: authUser, token } = useSelector((state) => state.auth);

    const isOwnProfile = !id || id === (authUser?._id || authUser?.id);

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("view");
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [error, setError] = useState("");

    // ── Edit form state ──────────────────────────────────────────────────────
    const [form, setForm] = useState({
        name: "",
        age: "",
        gender: "",
        bio: "",
        phone: "",
        preferences: {
            music: "no_preference",
            chat: "no_preference",
            smoking: "never",
            pets: "fine",
        },
    });
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const url = id && !isOwnProfile
                ? `${BASE_URL}/users/profile/${id}`
                : `${BASE_URL}/users/profile`;

            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setProfile(res.data);
            if (isOwnProfile) {
                setForm({
                    name: res.data.name || "",
                    age: res.data.age || "",
                    gender: res.data.gender || "",
                    bio: res.data.bio || "",
                    phone: res.data.phone || "",
                    preferences: {
                        music: res.data.preferences?.music || "no_preference",
                        chat: res.data.preferences?.chat || "no_preference",
                        smoking: res.data.preferences?.smoking || "never",
                        pets: res.data.preferences?.pets || "fine",
                    },
                });
            }
        } catch (err) {
            console.error("Error fetching profile:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [id]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");
        setSaveSuccess(false);

        try {
            const data = new FormData();
            data.append("name", form.name);
            if (form.age) data.append("age", form.age);
            if (form.gender) data.append("gender", form.gender);
            data.append("bio", form.bio);
            if (form.phone) data.append("phone", form.phone);
            data.append("preferences", JSON.stringify(form.preferences));
            if (photoFile) data.append("file", photoFile);

            const res = await axios.put(`${BASE_URL}/users/profile`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            setProfile(res.data.user);
            dispatch(loginSuccess({ token, user: res.data.user }));
            setSaveSuccess(true);
            setActiveTab("view");
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-slate-500">Profile not found.</p>
            </div>
        );
    }

    const memberSince = new Date(profile.createdAt).toLocaleDateString("en-IN", {
        month: "long", year: "numeric",
    });

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-3xl mx-auto px-4 py-8">

                {/* ── Profile header card ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-5">

                    {/* Cover strip */}
                    <div className="h-24 bg-gradient-to-r from-blue-600 to-blue-400" />

                    <div className="px-6 pb-6">
                        <div className="flex items-end justify-between -mt-12 mb-4">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-blue-100 flex items-center justify-center">
                                    {profile.profilePhoto ? (
                                        <img
                                            src={profile.profilePhoto}
                                            alt={profile.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-blue-600 font-bold text-3xl">
                                            {profile.name?.[0]?.toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                {isOwnProfile && activeTab === "edit" && (
                                    <label className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-blue-700 transition">
                                        <Camera size={13} className="text-white" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handlePhotoChange}
                                        />
                                    </label>
                                )}
                            </div>

                            {/* Badges */}
                            <div className="flex items-center gap-2 mb-2">
                                {profile.kycStatus === "verified" ? (
                                    <span className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">
                                        <ShieldCheck size={12} />
                                        Verified
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-500 text-xs font-medium px-2.5 py-1 rounded-full">
                                        <Shield size={12} />
                                        Not verified
                                    </span>
                                )}
                                {profile.rating > 0 && (
                                    <span className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-2.5 py-1 rounded-full">
                                        <Star size={12} className="fill-amber-500 text-amber-500" />
                                        {profile.rating?.toFixed(1)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Name + meta */}
                        <h1 className="text-xl font-bold text-slate-900 mb-1">
                            {profile.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                                <Calendar size={13} />
                                Member since {memberSince}
                            </span>
                            {profile.age && (
                                <span>{profile.age} years old</span>
                            )}
                            {profile.gender && (
                                <span className="capitalize">
                                    {GENDER_LABELS[profile.gender] || profile.gender}
                                </span>
                            )}
                        </div>

                        {/* Stats row */}
                        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-100">
                            <div className="text-center">
                                <p className="text-xl font-bold text-slate-900">
                                    {profile.totalRidesAsDriver || 0}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">Rides as driver</p>
                            </div>
                            <div className="text-center border-x border-slate-100">
                                <p className="text-xl font-bold text-slate-900">
                                    {profile.totalRidesAsPassenger || 0}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">As passenger</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold text-slate-900">
                                    {profile.totalRatings || 0}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">Reviews</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Tabs ── */}
                {isOwnProfile && (
                    <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-5 w-fit shadow-sm">
                        {[
                            { id: "view", label: "My profile" },
                            { id: "edit", label: "Edit profile" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab.id
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* ══ VIEW TAB ══ */}
                {activeTab === "view" && (
                    <div className="space-y-4">

                        {/* About */}
                        {profile.bio && (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                                    About
                                </h3>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    {profile.bio}
                                </p>
                            </div>
                        )}

                        {/* Preferences */}
                        {profile.preferences && (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
                                    Travel preferences
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(PREF_CONFIG).map(([key, config]) => {
                                        const value = profile.preferences?.[key];
                                        const option = config.options.find((o) => o.value === value);
                                        return (
                                            <div
                                                key={key}
                                                className="flex items-center gap-3 bg-slate-50 rounded-xl p-3"
                                            >
                                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                                    {config.icon}
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-400">{config.label}</p>
                                                    <p className="text-sm font-medium text-slate-700">
                                                        {option?.label || "Not set"}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Vehicle info (transporters) */}
                        {profile.role === "transporter" && profile.vehicleInfo?.vehicleType && (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
                                    Vehicle
                                </h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <Car size={18} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-slate-700 font-medium">
                                            {profile.vehicleInfo.vehicleType}
                                        </p>
                                        <p className="text-slate-400 text-sm font-mono">
                                            {profile.vehicleInfo.registrationNo}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CTA for own empty profile */}
                        {isOwnProfile && !profile.bio && (
                            <div
                                onClick={() => setActiveTab("edit")}
                                className="bg-blue-50 border border-blue-200 border-dashed rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:bg-blue-100 transition"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                        <Edit3 size={16} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-blue-700 font-medium text-sm">
                                            Complete your profile
                                        </p>
                                        <p className="text-blue-500 text-xs mt-0.5">
                                            Add a photo, bio and preferences to build trust
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-blue-400" />
                            </div>
                        )}
                    </div>
                )}

                {/* ══ EDIT TAB ══ */}
                {activeTab === "edit" && isOwnProfile && (
                    <div className="space-y-4">

                        {/* Photo preview */}
                        {photoPreview && (
                            <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4">
                                <img
                                    src={photoPreview}
                                    alt="Preview"
                                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                                />
                                <div>
                                    <p className="text-slate-700 text-sm font-medium">
                                        New photo selected
                                    </p>
                                    <button
                                        onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
                                        className="text-red-400 text-xs mt-1 hover:text-red-500 transition"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Basic info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                                Basic info
                            </h3>

                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1.5">
                                    Full name
                                </label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1.5">
                                        Age
                                    </label>
                                    <input
                                        type="number"
                                        min="18"
                                        max="80"
                                        value={form.age}
                                        onChange={(e) => setForm({ ...form, age: e.target.value })}
                                        placeholder="e.g. 28"
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1.5">
                                        Gender
                                    </label>
                                    <select
                                        value={form.gender}
                                        onChange={(e) => setForm({ ...form, gender: e.target.value })}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white"
                                    >
                                        <option value="">Select</option>
                                        <option value="man">Man</option>
                                        <option value="woman">Woman</option>
                                        <option value="prefer_not_to_say">Prefer not to say</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1.5">
                                    Phone number
                                </label>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    placeholder="e.g. 9876543210"
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1.5">
                                    About me
                                    <span className="ml-1 text-slate-400 font-normal">
                                        ({form.bio.length}/300)
                                    </span>
                                </label>
                                <textarea
                                    rows={3}
                                    value={form.bio}
                                    onChange={(e) =>
                                        setForm({ ...form, bio: e.target.value.slice(0, 300) })
                                    }
                                    placeholder='e.g. "Daily commuter on Noida–Delhi route. I enjoy good music and friendly conversation!"'
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition resize-none"
                                />
                            </div>
                        </div>

                        {/* Preferences */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-5">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                                Travel preferences
                            </h3>

                            {Object.entries(PREF_CONFIG).map(([key, config]) => (
                                <div key={key}>
                                    <label className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
                                        <span className="text-blue-600">{config.icon}</span>
                                        {config.label}
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {config.options.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() =>
                                                    setForm({
                                                        ...form,
                                                        preferences: {
                                                            ...form.preferences,
                                                            [key]: opt.value,
                                                        },
                                                    })
                                                }
                                                className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${form.preferences[key] === opt.value
                                                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                                        : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
                                <X size={14} className="text-red-500" />
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Save button */}
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                        >
                            {saving ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Check size={16} />
                                    Save profile
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;