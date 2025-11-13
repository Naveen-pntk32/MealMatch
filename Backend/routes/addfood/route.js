const express = require("express");
const route = express.Router();
const addfood = require('../../models/addweekly');
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
    const { cookId, monthlyPrice, menuItems } = req.body;

    // Validate cook existence
    const cook = await user.findById(cookId);
    if (!cook) {
      return res.status(404).json({ message: 'Cook not found' });
    }

    // Prepare weekly menu object dynamically
    const menuData = {
      cookId,
      monthlyPrice
    };

    // Apply provided day food details
    const days = [
      "Monday", "Tuesday", "Wednesday",
      "Thursday", "Friday", "Saturday", "Sunday"
    ];

    days.forEach(day => {
      if (menuItems[day]) {
        menuData[day] = menuItems[day]; // the full food object
      }
    });

    // Upsert (create or update)
    const weeklyMenu = await addfood.findOneAndUpdate(
      { cookId },
      menuData,
      { upsert: true, new: true }
    );

    res.status(201).json({
      message: "Weekly menu added/updated successfully",
      menu: weeklyMenu
    });

  } catch (error) {
    console.error("Error adding weekly menu:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = route;