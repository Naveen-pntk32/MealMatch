const express = require("express");
const route = express.Router();
const addfood = require('../../models/addweekly');
// const subscriptionSchema = require("../../models/subscriptions");
const user = require("../../models/UserModel");



route.get('/getall', async (req, res) => {
  try {
    const menus = await addfood.find();
    res.status(200).json({data : menus});
  } catch (error) {
    console.error('Error fetching weekly menus:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
})
route.post('/', async (req, res) => {
  try {
    const { cookId, menuItems } = req.body;

    // Check if cook exists
    const cook = await user.findById(cookId);
    if (!cook) return res.status(404).json({ message: 'Cook not found' });

    // Convert menuItems array into day-based object
    const menu = {};
    menuItems.forEach(item => {
      menu[item.day] = item.dishName;
    });

    // Upsert: create or update menu for the cook
    const weeklyMenu = await addfood.findOneAndUpdate(
      { cookId },
      { cookId, ...menu },
      { upsert: true, new: true }
    );

    res.status(201).json({
      message: 'Weekly menu added/updated successfully',
      menu: weeklyMenu,
    });
  } catch (error) {
    console.error('Error adding weekly menu:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = route;