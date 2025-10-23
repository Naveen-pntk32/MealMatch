const express = require('express');
const router = express.Router();
const Subscription = require('../../models/subscriptions');

// Add new subscription
router.post('/subscribe', async (req, res) => {
  try {
    const { cookId, studentId, planType, startDate, endDate, transactions } = req.body;

    const newSubscription = new Subscription({
      cookId,
      studentId,
      planType,
      startDate,
      endDate,
      transactions, // array of { transactionId, date }
    });

    const savedSubscription = await newSubscription.save();
    res.status(201).json({ success: true, subscription: savedSubscription });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ success: false, message: 'Failed to create subscription', error: error.message });
  }
});

module.exports = router;
