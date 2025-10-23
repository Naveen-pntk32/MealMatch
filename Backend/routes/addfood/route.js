const express = require("express");
const route = express.Router();
const addfood = require('../../models/addweekly');

router.post('/', async (req, res) => {
  try {
    const { cookId, menuItems } = req.body;

    // Check if cook exists
    const cook = await Cook.findById(cookId);
    if (!cook) {
      return res.status(404).json({ message: 'Cook not found' });
    }

    // Validate menu items array
    if (!Array.isArray(menuItems) || menuItems.length === 0) {
      return res.status(400).json({ message: 'Menu items must be a non-empty array' });
    }

    // Format menu items
    const menuData = menuItems.map(item => ({
      cookId,
      day: item.day,
      dishName: item.dishName,
    }));

    // Save all menu items at once
    const createdMenus = await addfood.insertMany(menuData);

    res.status(201).json({
      message: 'Weekly menu added successfully',
      menus: createdMenus,
    });
  } catch (error) {
    console.error('Error adding weekly menu:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;