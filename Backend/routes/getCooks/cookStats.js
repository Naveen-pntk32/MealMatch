const express = require("express");
const route = express.Router();
const Subscription = require('../../models/subscriptions');
const AddFood = require('../../models/addweekly');
const mongoose = require('mongoose');

route.get("/stats/:cookId", async (req, res) => {
  try {
    const { cookId } = req.params;
    console.log('Fetching stats for cookId:', cookId);

    // Convert cookId to ObjectId
    const cookObjectId = new mongoose.Types.ObjectId(cookId);
    const currentDate = new Date();

    // Get all subscriptions for this cook to debug
    const allSubs = await Subscription.find({ cookId: cookObjectId });
    console.log('All subscriptions found:', allSubs);

    // Get active subscribers count (status: ACCEPTED)
    const query = {
      cookId: cookObjectId,
      status: 'ACCEPTED'
    };
    console.log('Query:', query);

    const activeSubscribers = await Subscription.countDocuments(query);
    console.log('Active subscribers found:', activeSubscribers);

    // Get cook's menu to get the monthly price
    const menu = await AddFood.findOne({ cookId });
    const monthlyPrice = menu ? menu.monthlyPrice : 0;

    // Calculate monthly revenue
    const monthlyRevenue = activeSubscribers * monthlyPrice;

    // Get total subscriptions (for reviewing purposes)
    const totalSubscriptions = await Subscription.countDocuments({
      cookId,
      status: 'ACCEPTED'
    });

    const stats = {
      activeSubscribers,
      monthlyRevenue,
      totalSubscriptions,
      monthlyPrice
    };

    res.json(stats);
  } catch (error) {
    console.error("Error fetching cook stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = route;