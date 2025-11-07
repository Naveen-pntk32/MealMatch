const express = require("express");
const User = require('../../models/UserModel');
const route = express.Router();
const verifyAdmin = require('./middleware');

// Get all users (students and cooks)
route.get("/", verifyAdmin, async (req, res) => {
    try {
        // Get all users (both students and cooks)
        const users = await User.find()
            .select('-password -aadharDocument') // Exclude sensitive data
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            users: users.map(user => ({
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                status: user.status || (user.role === 'COOK' ? 'PENDING' : null), // Default status for cooks
                foodPreference: user.foodPreference,
                profileImage: user.profileImage,
                location: user.location,
                aadharNumber: user.aadharNumber,
                createdAt: user.createdAt
            }))
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Verify existing cook (for cooks without status)
route.put("/:id/verify", verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Only verify cooks
        if (user.role !== 'COOK') {
            return res.status(400).json({ message: 'Only cooks can be verified' });
        }

        // If it's a cook without status or with non-VERIFIED status, set it to VERIFIED
        if (!user.status || user.status !== 'VERIFIED') {
            user.status = 'VERIFIED';
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: `Cook ${user.name} has been verified`,
            user: {
                id: user._id,
                name: user.name,
                status: user.status
            }
        });
    } catch (error) {
        console.error('Error verifying cook:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = route;

