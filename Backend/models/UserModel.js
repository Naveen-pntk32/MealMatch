const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  mobile: {
    type: Number,
    required: true,
  },

  role: {
    type: String,
    enum: ['STUDENT', 'COOK'],
    default: 'STUDENT',
  },

  status: {
    type: String,
    enum: ['PENDING', 'VERIFIED', 'REJECTED'],
    default: 'PENDING', // Default for new cooks
  },

  foodPreference: {
    type: String,
    enum: ['VEG', 'NONVEG'],
  },

  profileImage: {
    type: String,
  },

  aadharNumber: {
    type: String,
  },

  aadharDocument: {
    type: String,
  },

  location: {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true, // optional if not always available
    },
    coordinates: {
      lat: {
        type: Number,
        required: true,
      },
      lon: {
        type: Number,
        required: true,
      },
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
