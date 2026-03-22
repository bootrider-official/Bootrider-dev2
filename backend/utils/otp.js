import axios from "axios";

// ── In-memory OTP store ───────────────────────────────────────────────────────
// { phone: { otp, expiresAt, attempts } }
const otpStore = new Map();

// ── Generate 4-digit OTP ──────────────────────────────────────────────────────
const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

// ── Send OTP via 2factor.in ───────────────────────────────────────────────────
export const sendOtp = async (phone) => {
    const otp = generateOtp();

    try {
        const response = await axios.get(
            `https://2factor.in/API/V1/${process.env.OTP_API_KEY}/SMS/${phone}/${otp}/Bootrider`
        );

        if (response.data.Status !== "Success") {
            throw new Error("Failed to send OTP via 2factor.in");
        }

        // ── Store OTP with 10 minute expiry ──
        otpStore.set(phone, {
            otp,
            expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
            attempts: 0,
        });

        console.log(`✅ OTP sent to ${phone}: ${otp}`); // dev log
        return { success: true, sessionId: response.data.Details };
    } catch (error) {
        console.error("❌ OTP send error:", error.message);
        throw new Error("Failed to send OTP. Please try again.");
    }
};

// ── Verify OTP ────────────────────────────────────────────────────────────────
export const verifyOtp = (phone, otp) => {
    const record = otpStore.get(phone);

    if (!record) {
        return { valid: false, reason: "OTP not found. Please request a new one." };
    }

    if (Date.now() > record.expiresAt) {
        otpStore.delete(phone);
        return { valid: false, reason: "OTP has expired. Please request a new one." };
    }

    // ── Max 3 attempts ──
    if (record.attempts >= 3) {
        otpStore.delete(phone);
        return { valid: false, reason: "Too many attempts. Please request a new OTP." };
    }

    if (record.otp !== otp.toString()) {
        record.attempts += 1;
        otpStore.set(phone, record);
        return {
            valid: false,
            reason: `Incorrect OTP. ${3 - record.attempts} attempt${3 - record.attempts !== 1 ? "s" : ""} remaining.`,
        };
    }

    // ── Valid — clear from store ──
    otpStore.delete(phone);
    return { valid: true };
};

// ── Check if OTP was recently sent (rate limit: 1 per 60s) ───────────────────
export const canSendOtp = (phone) => {
    const record = otpStore.get(phone);
    if (!record) return true;

    const sentAt = record.expiresAt - 10 * 60 * 1000;
    const secondsSinceSent = (Date.now() - sentAt) / 1000;
    return secondsSinceSent > 60;
};