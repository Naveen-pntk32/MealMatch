const express = require("express");
const User = require("../../../models/UserModel");
const router = express.Router();

// 🟥 Suspend a user
router.post("/suspend/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // If already suspended
    if (user.status === "SUSPENDED") {
      return res.status(400).json({ success: false, message: "User is already suspended" });
    }

    user.status = "SUSPENDED";
    await user.save();

    res.status(200).json({ success: true, message: "User has been suspended" });
  } catch (error) {
    console.error("Error suspending user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🟩 Unsuspend a user
router.post("/unsuspend/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // If already active
    if (user.status === "ACTIVE") {
      return res.status(400).json({ success: false, message: "User is already active" });
    }

    user.status = "ACTIVE";
    await user.save();

    res.status(200).json({ success: true, message: "User has been unsuspended" });
  } catch (error) {
    console.error("Error unsuspending user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
