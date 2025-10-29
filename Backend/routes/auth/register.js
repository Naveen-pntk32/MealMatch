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
    if (!user) {
      return res.status(404).json({ message: "User not found", id });
    }
    res.json(user);
  } catch (error) {
    console.error("[DEBUG] Error fetching user by id:", id, error);
    res.status(500).json({ message: "Server error", error: error.message, id });
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
      address,
      email,
      mobileNumber,
      aadharNumber,
      aadharDocument
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

    // ✅ Check cook-specific required fields
    if (role === 'COOK') {
      if (!aadharNumber) {
        return res.status(400).json({ message: "Aadhar number is required for cooks" });
      }
      if (!aadharDocument) {
        return res.status(400).json({ message: "Aadhar document is required for cooks" });
      }
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
      ...(role === 'COOK' && { aadharNumber, aadharDocument }),
      location: {
        name: locationName,
        address: address,
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
    res.status(500).json({ 
      message: "Server error", 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Update user profile
route.put('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find existing user first
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove password if it's in the updates
    delete updates.password;
    
    // Remove empty fields
    Object.keys(updates).forEach(key => {
      if (updates[key] === '' || updates[key] === null || updates[key] === undefined) {
        delete updates[key];
      }
    });

    // Create update object with existing values as fallback
    const updateData = {
      name: updates.name || existingUser.name,
      email: updates.email || existingUser.email,
      mobile: parseInt(updates.mobileNumber) || existingUser.mobile,
      foodPreference: updates.foodPreference || existingUser.foodPreference,
      profileImage: updates.profileImage || existingUser.profileImage,
      location: {
        name: existingUser.location.name, // Keep existing location name
        address: updates.address || existingUser.location.address,
        coordinates: {
          lat: existingUser.location.coordinates.lat, // Keep existing coordinates
          lon: existingUser.location.coordinates.lon
        }
      }
    };

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send back the updated user with formatted response
    res.json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        foodPreference: user.foodPreference,
        mobileNumber: user.mobile,
        profileImage: user.profileImage,
        location: user.location
      }
    });

  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
});

module.exports = route;
