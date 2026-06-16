const Admin = require('../models/Admin');
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// ─── In-memory OTP store  { email: { otp, expiresAt } } ────────────────────
const otpStore = {};

// ─── Helper: generate 6-digit OTP ───────────────────────────────────────────
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// ─── Helper: create the right transporter ───────────────────────────────────
// If real Gmail credentials are set in .env → use Gmail
// Otherwise → auto-create a free Ethereal test account (for development)
async function createTransporter() {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    const hasRealCreds =
        user && pass &&
        user !== 'your_gmail@gmail.com' &&
        pass !== 'your_app_password_here';

    if (hasRealCreds) {
        return {
            transport: nodemailer.createTransport({
                service: 'gmail',
                auth: { user, pass },
            }),
            from: `"Exam Prep Admin" <${user}>`,
            previewMode: false,
        };
    }

    // Dev fallback: auto-create Ethereal test account
    const testAccount = await nodemailer.createTestAccount();
    const transport = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
        tls: {
            rejectUnauthorized: false,   // fix self-signed cert error in dev
        },
    });
    return {
        transport,
        from: `"Exam Prep Admin" <${testAccount.user}>`,
        previewMode: true,
    };
}

// ─── GET / ───────────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
    return res.json("Api called");
});

// ─── POST /  (register admin – legacy) ──────────────────────────────────────
router.post('/', async (req, res) => {
    const reg = new Admin(req.body);
    await reg.save();
    return res.json("Admin added successfully");
});

// ─── POST /register  (Sign Up from login page) ───────────────────────────────
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existing = await Admin.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const newAdmin = new Admin({ name, email, password });
        await newAdmin.save();
        return res.status(201).json({ message: "Registered successfully" });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// ─── POST /login ─────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
        return res.status(400).json({ message: "Admin not found" });
    }
    if (admin.password === password) {
        return res.status(200).json({
            message: "Login Successfully",
            admin: { email: admin.email, id: admin._id, role: "Admin" }
        });
    } else {
        return res.json({ message: "Password not matched" });
    }
});

// ─── POST /send-otp  (Forgot Password – step 1) ──────────────────────────────
router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "No admin found with this email" });
        }

        // Generate OTP with 5-min expiry
        const otp = generateOTP();
        otpStore[email] = {
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000,
        };

        // Always log OTP to server console (useful in dev)
        console.log(`\n🔐 OTP for ${email}: ${otp} (expires in 5 min)\n`);

        // Send email
        const { transport, from, previewMode } = await createTransporter();

        const info = await transport.sendMail({
            from,
            to: email,
            subject: "Your Admin Login OTP",
            html: `
                <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e0e0e0;border-radius:12px;">
                    <h2 style="color:#1a73e8;margin-bottom:8px;">Admin Login OTP</h2>
                    <p style="color:#555;">Use the code below to log in. It expires in <strong>5 minutes</strong>.</p>
                    <div style="font-size:40px;font-weight:bold;letter-spacing:12px;color:#1a1a1a;background:#f5f5f5;padding:20px;border-radius:8px;text-align:center;margin:24px 0;">
                        ${otp}
                    </div>
                    <p style="color:#999;font-size:13px;">If you didn't request this, please ignore this email.</p>
                </div>
            `,
        });

        // In dev/preview mode, send the preview URL back so user can see the email
        if (previewMode) {
            const previewUrl = nodemailer.getTestMessageUrl(info);
            console.log(`📧 Preview email at: ${previewUrl}`);
            return res.status(200).json({
                message: "OTP sent successfully",
                devNote: "Gmail not configured – using test email.",
                previewUrl,       // frontend will show this link
                otp,              // also return OTP directly in dev mode
            });
        }

        return res.status(200).json({ message: "OTP sent successfully" });

    } catch (error) {
        console.error("Send OTP error:", error.message);
        return res.status(500).json({ message: "Failed to send OTP: " + error.message });
    }
});

// ─── POST /verify-otp  (Forgot Password – step 2) ────────────────────────────
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const record = otpStore[email];
        if (!record) {
            return res.status(400).json({ message: "No OTP found. Please request a new one." });
        }
        if (Date.now() > record.expiresAt) {
            delete otpStore[email];
            return res.status(400).json({ message: "OTP has expired. Please request a new one." });
        }
        if (record.otp !== otp.trim()) {
            return res.status(400).json({ message: "Invalid OTP. Please try again." });
        }

        delete otpStore[email];
        const admin = await Admin.findOne({ email });

        return res.status(200).json({
            message: "Login Successfully",
            admin: { email: admin.email, id: admin._id, role: "Admin" }
        });
    } catch (error) {
        console.error("Verify OTP error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// ─── PUT /change/:id  (Change Password) ──────────────────────────────────────
router.put('/change/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { op, np, cnp } = req.body;

        if (!op || !np || !cnp) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (np !== cnp) {
            return res.status(400).json({ message: "New passwords do not match" });
        }

        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        if (admin.password !== op) {
            return res.status(400).json({ message: "Incorrect old password" });
        }

        admin.password = np;
        await admin.save();
        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Change password error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;