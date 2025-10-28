const mongoose = require('mongoose');

const weeklyMenuSchema = new mongoose.Schema({
  cookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // changed to 'User' since your cook is stored in the User model
    required: true,
    unique: true
  },
  Monday: { 
    dish: { type: String },
    description: { type: String }
  },
  Tuesday: { 
    dish: { type: String },
    description: { type: String }
  },
  Wednesday: { 
    dish: { type: String },
    description: { type: String }
  },
  Thursday: { 
    dish: { type: String },
    description: { type: String }
  },
  Friday: { 
    dish: { type: String },
    description: { type: String }
  },
  Saturday: { 
    dish: { type: String },
    description: { type: String }
  },
  Sunday: { 
    dish: { type: String },
    description: { type: String }
  },

  // new field for monthly subscription price
  monthlyPrice: {
    type: Number,
    required: true,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('WeeklyMenu', weeklyMenuSchema);
