const Examinee = require('../models/Examinee')
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// ─── In-memory OTP store  { email: { otp, expiresAt } } ────────────────────
const otpStore = {};

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

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
            rejectUnauthorized: false,
        },
    });
    return {
        transport,
        from: `"Exam Prep Admin" <${testAccount.user}>`,
        previewMode: true,
    };
}

router.post('/', async (req, res) => {
    const {email}=req.body
    const ex = Examinee.findOne({email:email})
    if(!ex){
        return res.json({message:"Details already exist"})
    }
    const user = await new Examinee(req.body);
    user.save();
    return res.json("Regestration Successfully")
})

router.get('/', async (req, res) => {
    const user = await Examinee.find();
    return res.json(user)
}) 
router.post('/login', async(req,res)=>{
    const {email,password}= req.body;
    const user = await Examinee.findOne({email:email});
    console.log(user)
    if(!user){
        return res.status(400).json("user not found")
    }
    if(user.password==password){
        return res.status(200).json({message:"Login Successfully",user:{
            email:user.email,
            id:user._id,
            role:"user"
        }})
    }else{
        return res.json({message:"password not matched"})
    }
})


// Change password
router.put('/changepassword/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { op, np, cnp } = req.body;

        if (!op || !np || !cnp) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (np !== cnp) {
            return res.status(400).json({ message: "New passwords do not match" });
        }

        const user = await Examinee.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.password !== op) {
            return res.status(400).json({ message: "Incorrect current password" });
        }

        user.password = np;
        await user.save();
        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Change password error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// ─── POST /send-otp  (Forgot Password – step 1) ──────────────────────────────
router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await Examinee.findOne({ email });
        if (!user) return res.status(404).json({ message: "No user found with this email" });

        const otp = generateOTP();
        otpStore[email] = {
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000,
        };

        console.log(`\n🔐 OTP for User ${email}: ${otp} (expires in 5 min)\n`);

        const { transport, from, previewMode } = await createTransporter();

        const info = await transport.sendMail({
            from,
            to: email,
            subject: "Your User Login OTP",
            html: `
                <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e0e0e0;border-radius:12px;">
                    <h2 style="color:#1a73e8;margin-bottom:8px;">User Login OTP</h2>
                    <p style="color:#555;">Use the code below to reset your password or log in. It expires in <strong>5 minutes</strong>.</p>
                    <div style="font-size:40px;font-weight:bold;letter-spacing:12px;color:#1a1a1a;background:#f5f5f5;padding:20px;border-radius:8px;text-align:center;margin:24px 0;">
                        ${otp}
                    </div>
                </div>
            `,
        });

        if (previewMode) {
            const previewUrl = nodemailer.getTestMessageUrl(info);
            console.log(`📧 Preview email at: ${previewUrl}`);
            return res.status(200).json({
                message: "OTP sent successfully",
                devNote: "Gmail not configured – using test email.",
                previewUrl,
                otp,
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
        if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

        const record = otpStore[email];
        if (!record) return res.status(400).json({ message: "No OTP found. Please request a new one." });
        if (Date.now() > record.expiresAt) {
            delete otpStore[email];
            return res.status(400).json({ message: "OTP has expired. Please request a new one." });
        }
        if (record.otp !== otp.trim()) return res.status(400).json({ message: "Invalid OTP. Please try again." });

        // OTP verified successfully. Note: we don't delete the OTP here if we want them to reset the password next.
        // We'll let them reset, and the reset route can delete it, or we delete it and issue a temporary token.
        // For simplicity, we just delete it and return success, relying on the frontend to allow password reset.
        // Alternatively, we return the user data so they can log in directly if they choose.
        delete otpStore[email];
        const user = await Examinee.findOne({ email });

        return res.status(200).json({
            message: "OTP Verified",
            user: { email: user.email, id: user._id, role: "user" }
        });
    } catch (error) {
        console.error("Verify OTP error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// ─── PUT /reset-password  (Forgot Password – step 3) ─────────────────────────
router.put('/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) return res.status(400).json({ message: "Email and new password are required" });

        const user = await Examinee.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        user.password = newPassword;
        await user.save();
        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const user = await Examinee.findByIdAndUpdate(id, req.body);
    return res.json("Update Successfully")
})


router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const user = await Examinee.findByIdAndDelete(id);
    return res.json("Deleted Successfully")
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const user = await Examinee.findById(id)
    return res.json(user)
})
module.exports= router