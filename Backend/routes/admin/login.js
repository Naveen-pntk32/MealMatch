const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const route = express.Router();

// Admin credentials (should be in .env in production)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@mealmatch.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

route.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Verify admin credentials
        if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
            return res.status(401).json({ message: "Invalid admin credentials" });
        }

        // Generate admin token
        const token = jwt.sign(
            { email: ADMIN_EMAIL, role: 'ADMIN' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        );

        // Set JWT token cookie
        res.cookie('adminToken', token, {
            httpOnly: true,
            secure: false, // set to true in production with HTTPS
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({ 
            success: true, 
            message: "Admin login successful",
            admin: { email: ADMIN_EMAIL, role: 'ADMIN' }
        });

    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = route;

