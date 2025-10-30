// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Mongoose v6+ no longer needs useNewUrlParser/useUnifiedTopology options
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error(error && error.stack ? error.stack : error);
    // Don't exit the process automatically during development so dev server can continue
    // If you want to stop the app when DB is unavailable, uncomment the next line:
    // process.exit(1);
  }
};

module.exports = connectDB;
