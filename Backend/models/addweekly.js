const mongoose = require('mongoose');

// Sub-schema for each day's food details
const dayFoodSchema = new mongoose.Schema({
  dish: { type: String, required: false },
  description: { type: String, required: false },

  type: { 
    type: String, 
    enum: ["veg", "non-veg"], 
    required: false 
  },

  cuisine: { 
    type: String, 
    enum: ["north-indian", "south-indian", "chinese", "continental", "other"],
    required: false
  },

  tasteProfile: [{ 
    type: String,
    enum: ["sour", "salty", "spicy", "sweet", "bitter", "umami", "mild"]
  }],

  healthGoals: [{
    type: String,
    enum: ["high-protein", "low-calorie", "weight-loss", "diabetic-friendly", "high-fiber", "light-food"]
  }],

  studentPreferences: [{
    type: String,
    enum: ["budget", "healthy", "heavy-meal", "regular-meal"]
  }],

  amount: { type: Number, required: false }, // Example: 2 idlis, 3 chapathis, etc.

  image: { type: String }, // Optional URL to food image

  location: { type: String }, // optional, cook location
}, { _id: false });   // Prevents creating nested _id for each day



// MAIN SCHEMA
const weeklyMenuSchema = new mongoose.Schema({
  cookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  // Each day uses the sub-schema
  Monday: { type: dayFoodSchema, default: {} },
  Tuesday: { type: dayFoodSchema, default: {} },
  Wednesday: { type: dayFoodSchema, default: {} },
  Thursday: { type: dayFoodSchema, default: {} },
  Friday: { type: dayFoodSchema, default: {} },
  Saturday: { type: dayFoodSchema, default: {} },
  Sunday: { type: dayFoodSchema, default: {} },

  monthlyPrice: {
    type: Number,
    required: true,
    default: 0
  }

}, { timestamps: true });

module.exports = mongoose.model('WeeklyMenu', weeklyMenuSchema);
