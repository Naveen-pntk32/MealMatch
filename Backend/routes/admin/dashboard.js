const express = require("express");
const User = require('../../models/UserModel');
const Subscription = require('../../models/subscriptions');
const route = express.Router();
const verifyAdmin = require('./middleware');

// Get dashboard statistics
route.get("/stats", verifyAdmin, async (req, res) => {
    try {
        // Get total cooks
        const totalCooks = await User.countDocuments({ role: 'COOK' });
        
        // Get cooks by status
        const pendingCooks = await User.countDocuments({ role: 'COOK', status: 'PENDING' });
        const verifiedCooks = await User.countDocuments({ role: 'COOK', status: 'VERIFIED' });
        const rejectedCooks = await User.countDocuments({ role: 'COOK', status: 'REJECTED' });
        
        // Get total users (students)
        const totalUsers = await User.countDocuments({ role: 'STUDENT' });

        res.status(200).json({
            success: true,
            stats: {
                totalCooks,
                pendingCooks,
                verifiedCooks,
                rejectedCooks,
                totalUsers
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get recent activities
route.get("/activities", verifyAdmin, async (req, res) => {
    try {
        const activities = [];

        // Recent cook registrations
        const recentCooks = await User.find({ role: 'COOK' })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name createdAt status');

        recentCooks.forEach(cook => {
            activities.push({
                id: `cook-${cook._id}`,
                type: 'COOK_REGISTERED',
                text: `New cook registered: ${cook.name}`,
                timestamp: cook.createdAt
            });
        });

        // Recent subscriptions
        const recentSubscriptions = await Subscription.find()
            .populate('studentId', 'name')
            .populate('cookId', 'name')
            .sort({ startDate: -1 })
            .limit(5);

        recentSubscriptions.forEach(sub => {
            activities.push({
                id: `sub-${sub._id}`,
                type: 'SUBSCRIPTION',
                text: `User ${sub.studentId?.name || 'Unknown'} subscribed to ${sub.cookId?.name || 'Unknown'}`,
                timestamp: sub.startDate
            });
        });

        // Recent status changes (we'll track this in the update status endpoint)
        // For now, sort all activities by timestamp
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        res.status(200).json({
            success: true,
            activities: activities.slice(0, 10) // Return top 10 most recent
        });
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = route;

