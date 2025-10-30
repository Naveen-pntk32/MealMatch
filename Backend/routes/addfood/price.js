const express = require("express");
const route = express.Router();
const addfood = require('../../models/addweekly');
const user = require("../../models/UserModel");

// Update only monthly price
route.put('/', async (req, res) => {
  try {
    const { cookId, monthlyPrice } = req.body;
    if (!cookId) return res.status(400).json({ message: 'cookId is required' });

    const cook = await user.findById(cookId);
    if (!cook) return res.status(404).json({ message: 'Cook not found' });

    const updated = await addfood.findOneAndUpdate(
      { cookId },
      { $set: { monthlyPrice } },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, message: 'Monthly price updated', menu: updated });
  } catch (error) {
    console.error('Error updating monthly price:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = route;


