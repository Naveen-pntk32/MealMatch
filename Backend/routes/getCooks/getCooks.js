const express = require("express");
const router = express.Router();
const Cook = require("../../models/UserModel");      // your cook model
const AddFood = require("../../models/addweekly"); // your food/menu model

// ✅ Get cook details + menu by cookId
router.get("/full/:cookId", async (req, res) => {
  const { cookId } = req.params;

  try {
    // 1️⃣ Get cook details
    const cook = await Cook.findById(cookId);
    if (!cook) {
      return res.status(404).json({ success: false, message: "Cook not found" });
    }

    // 2️⃣ Get menu details for the same cook
    const menu = await AddFood.findOne({ cookId });
    if (!menu) {
      return res.status(404).json({ success: false, message: "Menu not found for this cook" });
    }

    // 3️⃣ Send combined response
    res.status(200).json({
      success: true,
      cook,
      menu
    });

  } catch (error) {
    console.error("Error fetching full cook details:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

module.exports = router;
