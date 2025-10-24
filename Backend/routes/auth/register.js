const express = require("express");
const bcrypt = require("bcrypt");
const route = express.Router();
const User = require('../../models/UserModel');
const verifyToken = require("../middleware/middleware");


route.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Route 2: Get single user by ID
route.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// module.exports = route;


route.post('/', async (req, res) => {
  try {
    const {
      name,
      password,
      role,
      foodPreference,
      locationName,
      locationLatitude,
      locationLongitude,
      address,          // ✅ Added
      email,
      mobileNumber
    } = req.body;

    // ✅ Check all required fields
    if (
      !email ||
      !password ||
      !name ||
      !role ||
      !locationName ||
      !locationLatitude ||
      !locationLongitude ||
      !mobileNumber ||
      !address             // ✅ Added to validation
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const newUser = await User.create({
      name,
      role,
      email,
      foodPreference,
      mobile: mobileNumber,
      password: hashedPassword,
      location: {
        name: locationName,
        address: address,   // ✅ Added
        coordinates: {
          lat: locationLatitude,
          lon: locationLongitude
        }
      }
    });

    // ✅ Response
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error("Error creating user:", error); // remove in production
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = route;
