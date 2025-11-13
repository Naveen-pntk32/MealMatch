const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  cookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Changed from 'Cook' to 'User' since cooks are stored in User model
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
    default: 'PENDING',
  },
  planType: {
    type: String,
    enum: ['WEEKLY', 'MONTHLY'],
    default: 'WEEKLY',
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  transactions: [
    {
      transactionId: { type: String, required: true },
      date: { type: Date, default: Date.now },
    }
  ],
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
