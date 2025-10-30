const express = require("express");
const router = express.Router();
const User = require("../../../models/UserModel");
const AddFood = require("../../../models/addweekly"); 

// ✅ Get ALL cooks with food details
router.get("/", async (req, res) => {
  try {
    // Get all cooks
    const cooks = await User.find({ role: "COOK" });

    if (!cooks.length) {
      return res.status(404).json({
        success: false,
        message: "No cooks found",
      });
    }

    // For each cook, find their food details (if any)
    const cooksWithFood = await Promise.all(
      cooks.map(async (cook) => {
        const food = await AddFood.findOne({ cookId: cook._id });
        return {
          cook,
          food: food || null, // if no food found, return null
        };
      })
    );

    res.status(200).json({
      success: true,
      total: cooks.length,
      cooks: cooksWithFood,
    });
  } catch (err) {
    console.error("Error fetching cooks:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// ✅ Get ONE cook by ID with food details
router.get("/:cookId", async (req, res) => {
  try {
    const cook = await User.findOne({
      _id: req.params.cookId,
      role: "COOK",
    });

    if (!cook) {
      return res.status(404).json({
        success: false,
        message: "Cook not found or not a COOK role",
      });
    }

    const food = await AddFood.findOne({ cookId: cook._id });

    res.status(200).json({
      success: true,
      cook,
      food: food || null,
    });
  } catch (err) {
    console.error("Error fetching cook:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.delete("/:cookId", async (req, res) => {
  try {
    const cook = await User.findOneAndDelete({
      _id: req.params.cookId,
      role: "COOK",
    });

    if (!cook) {
      return res.status(404).json({
        success: false,
        message: "Cook not found or not a COOK role",
      });
    }

    // Optionally, you can also delete the associated food details
    await AddFood.deleteMany({ cookId: cook._id });

    res.status(200).json({
      success: true,
      message: "Cook deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting cook:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});



module.exports = router;
