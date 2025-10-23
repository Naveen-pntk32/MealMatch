const mongoose = require('mongoose');

const weeklyMenuSchema = new mongoose.Schema({
  cookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cook', // Reference to Cook model
    required: true,
  },
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  dishName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('WeeklyMenu', weeklyMenuSchema);
