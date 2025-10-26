const express = require("express");
const route = express.Router();
const User = require('../../models/UserModel');
const getNearbyCook = require("./getnear");

route.post("/", async (req, res ) => {
    try {
        const { lat, lon ,radius } = req.body;
        console.log(req.body);
         const token = req.cookies.token; 
        console.log(token);

        if (lat == null || lon == null) {
            return res.status(400).json({ message: "lat and lon are required" });
        }

        const target = { lat: parseFloat(lat), lon: parseFloat(lon) };
        const cooks = await User.find({ role: "COOK" });

        const result = getNearbyCook(target, cooks, radius);
        res.json({ result });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = route
