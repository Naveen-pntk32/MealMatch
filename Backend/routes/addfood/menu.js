const express = require("express");
const route = express.Router();
const addfood = require('../../models/addweekly');
const user = require("../../models/UserModel");

// Update only menu (days, dishes, descriptions) preserving existing price
route.put('/', async (req, res) => {
  try {
    const { cookId, menuItems } = req.body;
    if (!cookId) return res.status(400).json({ message: 'cookId is required' });
    if (!Array.isArray(menuItems)) return res.status(400).json({ message: 'menuItems array is required' });

    const cook = await user.findById(cookId);
    if (!cook) return res.status(404).json({ message: 'Cook not found' });

    // Build $set updates for each day key
    const setUpdates = {};
    menuItems.forEach(item => {
      setUpdates[item.day] = {
        dish: item.dishName,
        description: item.description || ''
      };
    });

    const updated = await addfood.findOneAndUpdate(
      { cookId },
      { $set: { cookId, ...setUpdates } },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, message: 'Menu updated', menu: updated });
  } catch (error) {
    console.error('Error updating menu:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = route;


