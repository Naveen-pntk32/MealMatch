const mongoose = require('mongoose');

const weeklyMenuSchema = new mongoose.Schema({
  cookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // changed to 'User' since your cook is stored in the User model
    required: true,
    unique: true
  },
  Monday: { type: String },
  Tuesday: { type: String },
  Wednesday: { type: String },
  Thursday: { type: String },
  Friday: { type: String },
  Saturday: { type: String },
  Sunday: { type: String },

  // new field for monthly subscription price
  monthlyPrice: {
    type: Number,
    required: true,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('WeeklyMenu', weeklyMenuSchema);
