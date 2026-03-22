import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Shield, FileText, Eye, Lock, Users,
    AlertTriangle, Scale, Phone, Mail,
    ChevronDown, ChevronUp, ArrowUp
} from "lucide-react";
import logo from "../assets/logo.png";

const SECTIONS = [
    { id: "definitions", label: "Definitions" },
    { id: "eligibility", label: "Eligibility" },
    { id: "services", label: "Our Services" },
    { id: "user-obligations", label: "User Obligations" },
    { id: "kyc", label: "KYC & Verification" },
    { id: "payments", label: "Payments & Pricing" },
    { id: "liability", label: "Liability" },
    { id: "prohibited", label: "Prohibited Activities" },
    { id: "termination", label: "Termination" },
    { id: "privacy", label: "Privacy Policy" },
    { id: "data", label: "Data Collection" },
    { id: "cookies", label: "Cookies" },
    { id: "grievance", label: "Grievance Officer" },
    { id: "governing", label: "Governing Law" },
];

const TermsPage = () => {
    const [activeSection, setActiveSection] = useState("definitions");
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);

            // Auto-highlight active section
            const sections = SECTIONS.map((s) => document.getElementById(s.id));
            const scrollPos = window.scrollY + 140;
            for (let i = sections.length - 1; i >= 0; i--) {
                if (sections[i] && sections[i].offsetTop <= scrollPos) {
                    setActiveSection(SECTIONS[i].id);
                    break;
                }
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) {
            window.scrollTo({ top: el.offsetTop - 100, behavior: "smooth" });
            setActiveSection(id);
            setMobileMenuOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">

            {/* ══ Hero ══ */}
            <section className="bg-[#0a0a0f] px-4 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <img src={logo} alt="Bootrider" className="h-12 w-auto mx-auto mb-8 object-contain" />
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
                        <Scale size={14} className="text-blue-400" />
                        <span className="text-blue-300 text-sm font-medium">Legal Documents</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                        Terms of Service &
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                            Privacy Policy
                        </span>
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Last updated: March 2025 · Effective date: March 1, 2025
                    </p>
                    <p className="text-gray-500 text-sm mt-3 max-w-xl mx-auto">
                        These terms govern your use of Bootrider's platform. By using our
                        services, you agree to these terms in accordance with Indian law.
                    </p>
                </div>
            </section>

            {/* ══ Mobile TOC toggle ══ */}
            <div className="lg:hidden sticky top-16 z-30 bg-white border-b border-slate-200 px-4 py-3">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="w-full flex items-center justify-between text-slate-700 font-semibold text-sm"
                >
                    <span className="flex items-center gap-2">
                        <FileText size={15} />
                        Table of Contents
                    </span>
                    {mobileMenuOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {mobileMenuOpen && (
                    <div className="mt-3 space-y-1 max-h-64 overflow-y-auto">
                        {SECTIONS.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => scrollTo(s.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${activeSection === s.id
                                        ? "bg-blue-50 text-blue-600 font-medium"
                                        : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="flex gap-10">

                    {/* ══ Desktop Sidebar TOC ══ */}
                    <aside className="hidden lg:block w-56 shrink-0">
                        <div className="sticky top-24">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">
                                Contents
                            </p>
                            <nav className="space-y-1">
                                {SECTIONS.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => scrollTo(s.id)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${activeSection === s.id
                                                ? "bg-blue-50 text-blue-600 font-medium border-l-2 border-blue-600"
                                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                                            }`}
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </nav>

                            <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-4">
                                <p className="text-slate-600 text-xs font-semibold mb-2">Questions?</p>
                                <p className="text-slate-400 text-xs leading-relaxed mb-3">
                                    Our team is here to help with any legal queries.
                                </p>

                                <a href="mailto:bootrider.in@gmail.com"
                                className="text-blue-600 text-xs font-medium hover:underline"
                >
                                bootrider.in@gmail.com
                            </a>
                        </div>
                </div>
            </aside>

            {/* ══ Main content ══ */}
            <main className="flex-1 min-w-0">
                <div className="prose prose-slate max-w-none">

                    {/* ── Intro ── */}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-10">
                        <div className="flex items-start gap-3">
                            <AlertTriangle size={18} className="text-blue-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-blue-800 font-semibold text-sm mb-1">
                                    Please read carefully
                                </p>
                                <p className="text-blue-700 text-sm leading-relaxed">
                                    These Terms of Service ("Terms") constitute a legally binding
                                    agreement between you and Bootrider ("Company", "we", "us").
                                    By accessing or using our platform, you acknowledge that you
                                    have read, understood, and agree to be bound by these Terms.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ──────────────────────────────────────
                  TERMS OF SERVICE
              ────────────────────────────────────── */}
                    <SectionHeader icon={<Scale size={18} />} label="Terms of Service" />

                    {/* 1. Definitions */}
                    <Section id="definitions" title="1. Definitions">
                        <p>For the purpose of these Terms:</p>
                        <ul>
                            <li><strong>"Platform"</strong> means the Bootrider website, mobile application and all associated services accessible at bootrider.in.</li>
                            <li><strong>"User"</strong> means any individual who accesses or uses the Platform, including Drivers, Passengers, and Parcel Senders.</li>
                            <li><strong>"Driver"</strong> means a User who lists rides and/or boot space on the Platform.</li>
                            <li><strong>"Passenger"</strong> means a User who books seats on a listed ride.</li>
                            <li><strong>"Parcel Sender"</strong> means a User who books boot space for parcel delivery.</li>
                            <li><strong>"Transporter"</strong> means a User who operates commercial vehicles and uses the Enterprise listing feature.</li>
                            <li><strong>"Ride"</strong> means a trip listed by a Driver on the Platform.</li>
                            <li><strong>"Boot Space"</strong> means the cargo space in a Driver's vehicle offered for parcel delivery.</li>
                            <li><strong>"KYC"</strong> means Know Your Customer verification as required under applicable Indian law.</li>
                            <li><strong>"Content"</strong> means all information, data, text, photos, and other materials uploaded to the Platform.</li>
                        </ul>
                    </Section>

                    {/* 2. Eligibility */}
                    <Section id="eligibility" title="2. Eligibility">
                        <p>To use the Bootrider Platform, you must:</p>
                        <ul>
                            <li>Be at least 18 years of age.</li>
                            <li>Be a citizen or legal resident of India.</li>
                            <li>Possess a valid mobile number registered in India.</li>
                            <li>Have the legal capacity to enter into binding contracts under the Indian Contract Act, 1872.</li>
                            <li>Not have been previously suspended or removed from the Platform.</li>
                        </ul>
                        <p>
                            Drivers must additionally hold a valid Indian driving licence and
                            vehicle registration certificate. Commercial transporters must comply
                            with all applicable Motor Vehicles Act, 1988 requirements.
                        </p>
                    </Section>

                    {/* 3. Services */}
                    <Section id="services" title="3. Our Services">
                        <p>
                            Bootrider is a technology platform that facilitates connections
                            between Drivers and Passengers for carpooling, and between Drivers
                            and Parcel Senders for peer-to-peer parcel delivery. We are a
                            marketplace and not a transport company.
                        </p>
                        <p>
                            <strong>Bootrider does not:</strong>
                        </p>
                        <ul>
                            <li>Employ drivers or act as a transport operator.</li>
                            <li>Guarantee the availability of rides or delivery services.</li>
                            <li>Own, operate or control any vehicle on the Platform.</li>
                            <li>Act as an insurance provider for any journey or parcel.</li>
                        </ul>
                        <p>
                            All transport arrangements are made directly between Users.
                            Bootrider acts solely as an intermediary platform under the
                            Information Technology Act, 2000 and the IT (Intermediary Guidelines
                            and Digital Media Ethics Code) Rules, 2021.
                        </p>
                    </Section>

                    {/* 4. User Obligations */}
                    <Section id="user-obligations" title="4. User Obligations">
                        <p>As a User of the Platform, you agree to:</p>
                        <ul>
                            <li>Provide accurate, current and complete information during registration and use.</li>
                            <li>Maintain the confidentiality of your account credentials.</li>
                            <li>Promptly notify us of any unauthorised use of your account.</li>
                            <li>Use the Platform only for lawful purposes.</li>
                            <li>Treat all other Users with respect and dignity.</li>
                            <li>Honour commitments made through the Platform (confirmed rides, bookings).</li>
                            <li>Not share or sell your account to any third party.</li>
                        </ul>
                        <p>
                            <strong>Drivers additionally agree to:</strong>
                        </p>
                        <ul>
                            <li>Maintain a valid driving licence and vehicle registration at all times.</li>
                            <li>Ensure the vehicle is roadworthy and adequately insured.</li>
                            <li>Comply with all applicable traffic laws and regulations.</li>
                            <li>Not drive under the influence of alcohol or substances.</li>
                            <li>Carry passengers and parcels safely and deliver them to the agreed destination.</li>
                            <li>Provide photo proof of parcel pickup and delivery when required.</li>
                        </ul>
                    </Section>

                    {/* 5. KYC */}
                    <Section id="kyc" title="5. KYC & Verification">
                        <p>
                            In compliance with applicable Indian regulations, Bootrider
                            requires all Drivers to complete KYC verification before listing
                            rides. This involves submission of Aadhaar card information.
                        </p>
                        <p>
                            KYC data is processed in accordance with the Aadhaar (Targeted
                            Delivery of Financial and Other Subsidies, Benefits and Services)
                            Act, 2016 and the Personal Data Protection framework. We collect
                            only what is necessary for identity verification and do not store
                            Aadhaar numbers in our databases.
                        </p>
                        <p>
                            Providing false or misleading KYC information is a violation of
                            these Terms and may constitute an offence under Section 66C of the
                            Information Technology Act, 2000.
                        </p>
                    </Section>

                    {/* 6. Payments */}
                    <Section id="payments" title="6. Payments & Pricing">
                        <p>
                            All pricing on the Platform is set by Drivers and is displayed
                            transparently before booking. Payments are made directly between
                            Users. Bootrider does not process payments and does not take a
                            commission during the current phase of operations.
                        </p>
                        <p>
                            Users acknowledge that:
                        </p>
                        <ul>
                            <li>Prices represent cost-sharing arrangements and not commercial fares.</li>
                            <li>Prices for partial routes (stopover segments) are set by Drivers based on distance proportions.</li>
                            <li>Bootrider provides suggested pricing as a reference only.</li>
                            <li>Any disputes regarding payments are between Users and must be resolved amongst themselves.</li>
                        </ul>
                        <p>
                            Any applicable GST or other taxes on services rendered between
                            commercial parties are the responsibility of the respective Users.
                            Bootrider does not provide tax advice.
                        </p>
                    </Section>

                    {/* 7. Liability */}
                    <Section id="liability" title="7. Limitation of Liability">
                        <p>
                            To the maximum extent permitted under applicable Indian law,
                            Bootrider shall not be liable for:
                        </p>
                        <ul>
                            <li>Any injury, loss, damage or death arising from the use of the Platform or any ride arranged through it.</li>
                            <li>Loss or damage to parcels during transport.</li>
                            <li>Actions, omissions or conduct of any User.</li>
                            <li>Technical failures, interruptions or errors in the Platform.</li>
                            <li>Cancellations or no-shows by Drivers or Passengers.</li>
                            <li>Delays in delivery of parcels.</li>
                        </ul>
                        <p>
                            Users are strongly advised to exercise independent judgment when
                            choosing to travel with or accept parcels from other Users.
                            Bootrider's aggregate liability in any circumstance shall not
                            exceed ₹1,000 (Rupees One Thousand Only).
                        </p>
                    </Section>

                    {/* 8. Prohibited */}
                    <Section id="prohibited" title="8. Prohibited Activities">
                        <p>The following activities are strictly prohibited on the Platform:</p>
                        <ul>
                            <li>Transporting prohibited, illegal or dangerous goods including narcotics, weapons, explosives or contraband.</li>
                            <li>Using the Platform for commercial taxi or courier services not disclosed to Bootrider.</li>
                            <li>Harassment, discrimination or abuse of any User based on gender, religion, caste, race or any protected characteristic.</li>
                            <li>Posting false reviews, ratings or misleading information.</li>
                            <li>Creating multiple accounts to circumvent suspensions.</li>
                            <li>Scraping, crawling or reverse engineering the Platform.</li>
                            <li>Any activity that violates the Indian Penal Code, 1860 or any other applicable law.</li>
                        </ul>
                        <p>
                            Violation of these prohibitions may result in immediate account
                            termination and may be reported to law enforcement authorities.
                        </p>
                    </Section>

                    {/* 9. Termination */}
                    <Section id="termination" title="9. Termination">
                        <p>
                            Bootrider reserves the right to suspend or permanently terminate
                            any User account at its sole discretion, with or without notice,
                            for violations of these Terms or for any conduct that we deem
                            harmful to other Users or the Platform.
                        </p>
                        <p>
                            Users may deactivate their accounts at any time by contacting
                            us at bootrider.in@gmail.com. Upon deactivation, your personal
                            data will be handled in accordance with our Privacy Policy and
                            applicable data retention laws.
                        </p>
                    </Section>

                    {/* ──────────────────────────────────────
                  PRIVACY POLICY
              ────────────────────────────────────── */}
                    <SectionHeader icon={<Lock size={18} />} label="Privacy Policy" />

                    {/* 10. Privacy */}
                    <Section id="privacy" title="10. Privacy Policy">
                        <p>
                            This Privacy Policy describes how Bootrider ("we", "us", "our")
                            collects, uses, stores and shares your personal information when
                            you use our Platform. This policy is compliant with the
                            Information Technology Act, 2000, the IT (Amendment) Act, 2008,
                            and the IT (Reasonable Security Practices and Procedures and
                            Sensitive Personal Data or Information) Rules, 2011.
                        </p>
                        <p>
                            By using the Platform, you consent to the collection and use of
                            your information as described in this Privacy Policy.
                        </p>
                    </Section>

                    {/* 11. Data */}
                    <Section id="data" title="11. Data We Collect">
                        <p>We collect the following categories of information:</p>

                        <p><strong>Account Information:</strong></p>
                        <ul>
                            <li>Full name, email address, phone number and password (hashed).</li>
                            <li>Profile photo (optional).</li>
                            <li>Date of birth, gender and bio (optional).</li>
                        </ul>

                        <p><strong>Verification Data:</strong></p>
                        <ul>
                            <li>Aadhaar card image (for KYC verification only — not stored post-verification).</li>
                            <li>Vehicle registration number and vehicle photos (for Drivers).</li>
                        </ul>

                        <p><strong>Usage Data:</strong></p>
                        <ul>
                            <li>Ride history, booking history and parcel delivery records.</li>
                            <li>Ratings and reviews given and received.</li>
                            <li>Location data for ride matching and route display (only when you use the Platform).</li>
                            <li>Device information, IP address and browser type.</li>
                        </ul>

                        <p><strong>Communication Data:</strong></p>
                        <ul>
                            <li>Any messages or support requests sent to us.</li>
                        </ul>

                        <p>
                            We do not collect sensitive financial information such as credit
                            card numbers. All payment arrangements are between Users directly.
                        </p>

                        <p><strong>How we use your data:</strong></p>
                        <ul>
                            <li>To provide, maintain and improve the Platform.</li>
                            <li>To verify your identity and prevent fraud.</li>
                            <li>To facilitate connections between Drivers and Passengers.</li>
                            <li>To send service notifications, OTPs and updates.</li>
                            <li>To resolve disputes and enforce our Terms.</li>
                            <li>To comply with legal obligations under Indian law.</li>
                        </ul>

                        <p><strong>Data sharing:</strong></p>
                        <ul>
                            <li>We share your name, rating and vehicle details with other Users only as necessary to facilitate a booking.</li>
                            <li>Phone numbers are only shared after a booking is confirmed.</li>
                            <li>We do not sell your personal data to third parties.</li>
                            <li>We may share data with law enforcement when required by law.</li>
                            <li>We use Cloudinary for secure image storage.</li>
                        </ul>

                        <p><strong>Data retention:</strong></p>
                        <p>
                            We retain your account data for as long as your account is active.
                            Upon account deletion, personal data is anonymised within 30 days
                            except where retention is required by law (e.g. for tax or legal
                            compliance purposes).
                        </p>

                        <p><strong>Your rights:</strong></p>
                        <ul>
                            <li>Right to access your personal data held by us.</li>
                            <li>Right to correct inaccurate data.</li>
                            <li>Right to request deletion of your data (subject to legal requirements).</li>
                            <li>Right to withdraw consent for data processing.</li>
                        </ul>
                        <p>
                            To exercise these rights, email us at bootrider.in@gmail.com.
                        </p>
                    </Section>

                    {/* 12. Cookies */}
                    <Section id="cookies" title="12. Cookies & Tracking">
                        <p>
                            We use cookies and similar tracking technologies to enhance your
                            experience on the Platform. Cookies are small data files stored
                            on your device.
                        </p>
                        <p>We use the following types of cookies:</p>
                        <ul>
                            <li><strong>Essential cookies:</strong> Required for the Platform to function (authentication, session management).</li>
                            <li><strong>Analytics cookies:</strong> Help us understand how Users interact with the Platform to improve it.</li>
                            <li><strong>Preference cookies:</strong> Remember your settings and preferences.</li>
                        </ul>
                        <p>
                            You can control cookies through your browser settings. Disabling
                            essential cookies may affect Platform functionality. We do not
                            use third-party advertising cookies.
                        </p>
                    </Section>

                    {/* 13. Grievance */}
                    <Section id="grievance" title="13. Grievance Officer">
                        <p>
                            In accordance with the Information Technology Act, 2000 and the
                            IT (Intermediary Guidelines and Digital Media Ethics Code) Rules,
                            2021, the details of our Grievance Officer are:
                        </p>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 my-4">
                            <p className="font-semibold text-slate-800 mb-3">Grievance Officer — Bootrider</p>
                            <div className="space-y-2 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                    <Mail size={14} className="text-slate-400" />
                                    <a href="mailto:bootrider.in@gmail.com" className="text-blue-600 hover:underline">
                                        bootrider.in@gmail.com
                                    </a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-slate-400" />
                                    <span>Noida, Uttar Pradesh, India</span>
                                </div>
                            </div>
                            <p className="text-slate-500 text-xs mt-3">
                                Grievances will be acknowledged within 24 hours and resolved
                                within 15 days as required by law.
                            </p>
                        </div>
                    </Section>

                    {/* 14. Governing Law */}
                    <Section id="governing" title="14. Governing Law & Dispute Resolution">
                        <p>
                            These Terms shall be governed by and construed in accordance with
                            the laws of India. Any disputes arising out of or in connection
                            with these Terms shall be subject to the exclusive jurisdiction
                            of the courts at Noida, Uttar Pradesh, India.
                        </p>
                        <p>
                            Users are encouraged to first attempt resolution through our
                            Grievance Officer before initiating legal proceedings.
                        </p>
                        <p>
                            In the event of any dispute that cannot be resolved through
                            mutual discussion, the same shall be referred to arbitration
                            under the Arbitration and Conciliation Act, 1996, with a
                            sole arbitrator appointed by mutual consent.
                        </p>
                        <p>
                            These Terms were last updated on March 1, 2025. We reserve the
                            right to modify these Terms at any time. Continued use of the
                            Platform after any changes constitutes your acceptance of the
                            revised Terms. Users will be notified of significant changes via
                            email or SMS.
                        </p>

                        {/* Final note */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mt-6">
                            <p className="text-slate-500 text-sm leading-relaxed">
                                For all legal notices, correspondence, or queries, please
                                contact us at{" "}
                                <a href="mailto:bootrider.in@gmail.com" className="text-blue-600 hover:underline font-medium">
                                    bootrider.in@gmail.com
                                </a>
                                . We are committed to responding to all queries within 48
                                business hours.
                            </p>
                        </div>
                    </Section>

                </div>
            </main>
        </div>
      </div >

    {/* ── Back to top ── */ }
{
    showBackToTop && (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center transition z-50"
        >
            <ArrowUp size={18} />
        </button>
    )
}
    </div >
  );
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const SectionHeader = ({ icon, label }) => (
    <div className="flex items-center gap-3 mb-8 mt-12 first:mt-0">
        <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-600">
            {icon}
        </div>
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-wide">
            {label}
        </h2>
    </div>
);

const Section = ({ id, title, children }) => (
    <div id={id} className="mb-10 scroll-mt-28">
        <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            {title}
        </h3>
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_strong]:text-slate-800 [&_strong]:font-semibold">
            {children}
        </div>
    </div>
);

const MapPin = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        strokeLinejoin="round" className={className}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

export default TermsPage;