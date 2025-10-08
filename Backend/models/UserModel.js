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
  mobile :{
    type : Number,
    required : true
  }
,
  role: {
    type: String,
    enum: ['STUDENT', 'COOK'],
    default: 'STUDENT',
  },

  foodPreference: {
    type: String,
    enum: ['VEG', 'NONVEG'],
  },

 location: {
  name: {
    type: String,
    required: true,
  },
  coordinates: {
    lat: {
      type: Number,
      required: true,
    },
    lon: {
      type: Number,
      required: true,
    }
  }
},


  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Export the model
module.exports = mongoose.model('User', userSchema);
