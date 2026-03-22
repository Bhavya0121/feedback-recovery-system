require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { generateSurveyToken } = require('./backend/utils/tokenManager');
const { getEmailHtml } = require('./backend/utils/emailTemplate');
const { checkAlreadySubmitted } = require('./backend/utils/checkReview');

const app = express();

// --- Middleware (Sabse upar taaki har route pe chale) ---
app.use(cors());
app.use(express.json());

// --- 1. AI Call Status Webhook (Step 1 Trigger) ---
app.post('/api/call-status-webhook', async (req, res) => {
    const { customerId, orderId, callStatus, email, firstName, brandName } = req.body;

    console.log(`📞 Call Status Received for ${firstName}: ${callStatus}`);

    if (callStatus === 'not_answered' || callStatus === 'failed') {
        console.log("⚠️ Call missed. Triggering Email Connect fallback...");

        try {
            const alreadyDone = await checkAlreadySubmitted(orderId);
            if (alreadyDone) {
                return res.status(200).json({ success: false, message: "Review already exists. Skipping email." });
            }

            await triggerEmailLogic(email, firstName, orderId, customerId, brandName); 
            
            return res.status(200).json({
                success: true,
                message: "Call missed, Email sent as fallback."
            });
        } catch (err) {
            console.error("❌ Webhook Email Error:", err);
            return res.status(500).json({ error: "Email failed to send", details: err.message });
        }
    } else {
        console.log("✅ Customer answered the call. No email needed.");
        return res.status(200).json({ message: "Call was successful. No fallback required." });
    }
});

// --- 2. Manual/Direct Email Trigger ---
app.post('/api/trigger-email', async (req, res) => {
    const { customerId, firstName, email, orderId, brandName } = req.body;

    try {
        const alreadyDone = await checkAlreadySubmitted(orderId);
        if (alreadyDone) {
            return res.status(400).json({ success: false, message: "Review already submitted." });
        }

        await triggerEmailLogic(email, firstName, orderId, customerId, brandName);

        console.log(`✅ Direct Email Sent to: ${email}`);
        return res.status(200).json({ success: true, message: "Check your inbox! Email sent." });

    } catch (error) {
        console.error("❌ Backend Error:", error);
        if (!res.headersSent) {
            return res.status(500).json({ 
                success: false, 
                error: "Internal Server Error",
                details: error.message 
            });
        }
    }
});

// --- 3. Final Submission API (New: Ratings Save karne ke liye) ---
app.post('/api/submit-review', async (req, res) => {
    try {
        const { token, responses } = req.body;

        console.log(`📥 Review Received for Token: ${token}`);
        
        // Data structure as per Step 5 requirements
        const reviewData = {
            q1_rating: responses.q1,
            q2_rating: responses.q2,
            q3_rating: responses.q3,
            q4_rating: responses.q4,
            q5_text: responses.q5,
            channel: 'email',
            survey_submitted_at: new Date().toISOString()
        };

        // Terminal mein data print hoga
        console.log("✅ Storing Response in Database:", reviewData);

        return res.status(200).json({ 
            success: true, 
            message: "Review submitted successfully!" 
        });
    } catch (error) {
        console.error("❌ Submission Error:", error);
        return res.status(500).json({ error: "Failed to save review" });
    }
});

// --- 4. Email Helper Function (Reusable Logic) ---
async function triggerEmailLogic(email, firstName, orderId, customerId, brandName = "Our Brand") {
    const token = generateSurveyToken(customerId, orderId);
    const surveyLink = `http://localhost:5173/survey/${token}`;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    const mailOptions = {
        from: `"${brandName}" <${process.env.EMAIL}>`,
        to: email,
        subject: `Order #${orderId} - We value your feedback!`,
        html: getEmailHtml(firstName, brandName, orderId, surveyLink)
    };

    return await transporter.sendMail(mailOptions);
}

// --- 5. Server Start ---
const PORT = 5002;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});