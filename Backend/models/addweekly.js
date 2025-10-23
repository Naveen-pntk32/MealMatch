const mongoose = require('mongoose');

const weeklyMenuSchema = new mongoose.Schema({
  cookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cook',
    required: true,
    unique: true // ensures one doc per cook
  },
  Monday: { type: String },
  Tuesday: { type: String },
  Wednesday: { type: String },
  Thursday: { type: String },
  Friday: { type: String },
  Saturday: { type: String },
  Sunday: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('WeeklyMenu', weeklyMenuSchema);
