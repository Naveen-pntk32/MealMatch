const express = require("express");
const bcrypt = require("bcrypt");
const route = express.Router();
const User = require('../../models/UserModel');
const verifyToken = require("../middleware/middleware");


// remove in production
route.get("/user",async(req,res)=>{
  try {
     const data = await User.find();
  res.json(data);
  } catch (error) {
    res.status(500).json({message : "server error"})
  }

})

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
      email,
      mobileNumber
    } = req.body;

    if (!email || !password || !name || !role || !locationName || !locationLatitude || !locationLongitude || !mobileNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

   
    const newUser = await User.create({
      name,
      role,
      email,
      foodPreference,
      location: {
        name: locationName,
        coordinates: {
          lat: locationLatitude,
          lon: locationLongitude
        }
      },
      mobile: mobileNumber,
      password: hashedPassword
    });

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