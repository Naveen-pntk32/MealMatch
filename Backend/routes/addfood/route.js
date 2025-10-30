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


// Get menu by cookId
route.get('/:id', async (req, res) => {
  const cookId = req.params.id;

  try {
    const menu = await addfood.findOne({ cookId }); // Find menu for specific cook

    if (!menu) {
      return res.status(404).json({ message: 'Menu not found for this cook' });
    }

    res.status(200).json({ menu });
  } catch (error) {
    console.error('Error fetching menu for cook:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

route.post('/', async (req, res) => {
  try {
    const { cookId, menuItems, monthlyPrice } = req.body;

    // Validate cook existence
    const cook = await user.findById(cookId);
    if (!cook) {
      return res.status(404).json({ message: 'Cook not found' });
    }

    // Convert menuItems array into an object by day
    const menu = {};
    menuItems.forEach(item => {
      menu[item.day] = item.dishName;
    });

    // Create or update weekly menu (upsert)
    const weeklyMenu = await addfood.findOneAndUpdate(
      { cookId },
      { cookId, ...menu, monthlyPrice },
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

route.patch("/:cookId", async (req, res) => {
  try {
    const { cookId } = req.params;
    const updates = req.body;

    // ✅ Ensure there’s at least one valid field to update
    const validFields = [
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "monthlyPrice"
    ];
    const updateData = {};

    for (const key of validFields) {
      if (updates[key] !== undefined) {
        updateData[key] = updates[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields provided for update" });
    }

    // ✅ Find and update the cook's weekly menu
    const updatedMenu = await addfood.findOneAndUpdate(
      { _id : cookId },
      { $set: updateData },
      { new: true }
    );

    if (!updatedMenu) {
      return res.status(404).json({ message: "Weekly menu not found for this cook" });
    }

    res.status(200).json({
      message: "Weekly menu updated successfully",
      updatedMenu,
    });
  } catch (error) {
    console.error("Error updating weekly menu:", error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = route;