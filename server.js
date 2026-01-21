const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
}));

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'dualoznebusiness@gmail.com',
        pass: process.env.EMAIL_PASSWORD || ''
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'Backend is running!' });
});

// Form submission endpoint
app.post('/api/submit-registration', async (req, res) => {
    try {
        const { name, email, skills, experience, portfolio } = req.body;
        const photoFile = req.files?.photo;
        const videoFile = req.files?.video;

        // Validate required fields
        if (!name || !email || !skills || !experience || !portfolio) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Build file attachments array
        const attachments = [];
        if (photoFile) {
            attachments.push({
                filename: photoFile.name,
                content: photoFile.data
            });
        }
        if (videoFile) {
            attachments.push({
                filename: videoFile.name,
                content: videoFile.data
            });
        }

        // Prepare email content
        const emailContent = `
            <h2>New Registration Submission</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Skills:</strong></p>
            <p>${escapeHtml(skills).replace(/\n/g, '<br>')}</p>
            <p><strong>Experience & Achievements:</strong></p>
            <p>${escapeHtml(experience).replace(/\n/g, '<br>')}</p>
            <p><strong>Portfolio URL:</strong> <a href="${escapeHtml(portfolio)}">${escapeHtml(portfolio)}</a></p>
            <hr>
            <p><em>Applicant Email: ${escapeHtml(email)}</em></p>
        `;

        // Send email to admin
        const adminMailOptions = {
            from: process.env.EMAIL_USER || 'dualoznebusiness@gmail.com',
            to: process.env.ADMIN_EMAIL || 'dualoznebusiness@gmail.com',
            subject: `New Team Registration: ${name}`,
            html: emailContent,
            attachments: attachments,
            replyTo: email
        };

        await transporter.sendMail(adminMailOptions);

        // Send confirmation email to applicant
        const confirmationMailOptions = {
            from: process.env.EMAIL_USER || 'dualoznebusiness@gmail.com',
            to: email,
            subject: 'Thank You for Your Application - Silent Brother',
            html: `
                <h2>Thank You for Your Application!</h2>
                <p>Dear ${escapeHtml(name)},</p>
                <p>We have received your registration submission. Our team will review your application and get back to you soon.</p>
                <p><strong>Application Details:</strong></p>
                <ul>
                    <li>Skills: ${escapeHtml(skills).replace(/\n/g, '<br>')}</li>
                    <li>Portfolio: <a href="${escapeHtml(portfolio)}">${escapeHtml(portfolio)}</a></li>
                </ul>
                <p>Best regards,<br><strong>Silent Brother Team</strong></p>
            `
        };

        await transporter.sendMail(confirmationMailOptions);

        res.json({
            success: true,
            message: 'Registration submitted successfully!'
        });

    } catch (error) {
        console.error('Email submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit registration. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Helper function to escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Start server
app.listen(PORT, () => {
    console.log(`✓ Backend server running on http://localhost:${PORT}`);
    console.log(`✓ Registration endpoint: POST http://localhost:${PORT}/api/submit-registration`);
    console.log(`✓ Health check: GET http://localhost:${PORT}/api/health`);
});
