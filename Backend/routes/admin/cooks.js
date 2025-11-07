const express = require("express");
const User = require('../../models/UserModel');
const route = express.Router();
const verifyAdmin = require('./middleware');

// Get cooks by status
route.get("/", verifyAdmin, async (req, res) => {
    try {
        const { status } = req.query; // PENDING, VERIFIED, REJECTED

        let query = { role: 'COOK' };
        if (status && ['PENDING', 'VERIFIED', 'REJECTED'].includes(status)) {
            query.status = status;
        }

        const cooks = await User.find(query)
            .select('-password -aadharDocument') // Exclude sensitive data
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            cooks: cooks.map(cook => ({
                id: cook._id,
                name: cook.name,
                email: cook.email,
                mobile: cook.mobile,
                aadharNumber: cook.aadharNumber,
                status: cook.status,
                profileImage: cook.profileImage,
                location: cook.location,
                createdAt: cook.createdAt
            }))
        });
    } catch (error) {
        console.error('Error fetching cooks:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update cook status
route.put("/:id/status", verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['PENDING', 'VERIFIED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be PENDING, VERIFIED, or REJECTED' });
        }

        const cook = await User.findById(id);
        if (!cook) {
            return res.status(404).json({ message: 'Cook not found' });
        }

        if (cook.role !== 'COOK') {
            return res.status(400).json({ message: 'User is not a cook' });
        }

        const oldStatus = cook.status;
        cook.status = status;
        await cook.save();

        res.status(200).json({
            success: true,
            message: `Cook status updated from ${oldStatus} to ${status}`,
            cook: {
                id: cook._id,
                name: cook.name,
                status: cook.status
            }
        });
    } catch (error) {
        console.error('Error updating cook status:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = route;

