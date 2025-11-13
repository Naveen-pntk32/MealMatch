const express = require("express");
const route = express.Router();
const addfood = require('../../models/addweekly');


route.post('/filter-food', async (req, res) => {
  try {
    const { type, cuisine, tasteProfile, healthGoals, studentPreferences, amount } = req.body;

    // Build dynamic filter
    const days = [
      "Monday", "Tuesday", "Wednesday",
      "Thursday", "Friday", "Saturday", "Sunday"
    ];

    // MongoDB OR condition for checking all days
    const orConditions = [];

    days.forEach(day => {
      const dayFilter = {};

      if (type) dayFilter[`${day}.type`] = type;
      if (cuisine) dayFilter[`${day}.cuisine`] = cuisine;
      if (tasteProfile) dayFilter[`${day}.tasteProfile`] = tasteProfile;
      if (healthGoals) dayFilter[`${day}.healthGoals`] = healthGoals;
      if (studentPreferences) dayFilter[`${day}.studentPreferences`] = studentPreferences;
      if (amount) dayFilter[`${day}.amount`] = amount;

      // Add only if at least one filter is applied
      if (Object.keys(dayFilter).length > 0) {
        orConditions.push(dayFilter);
      }
    });

    // If no filters provided
    if (orConditions.length === 0) {
      return res.status(400).json({ message: "No filters provided" });
    }

    // Query DB
    const cooks = await addfood.find({ $or: orConditions });

    // Return only cookId list
    const cookIds = cooks.map(item => item.cookId);

    res.status(200).json({
      message: "Filtered cooks fetched successfully",
      cookIds,
      count: cookIds.length,
    });

  } catch (error) {
    console.error("Error filtering cooks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
module.exports = route;
