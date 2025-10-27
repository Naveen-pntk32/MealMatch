const express = require('express');
const router = express.Router();
const Subscription = require('../../models/subscriptions');

// Add new subscription
router.post('/', async (req, res) => {
  try {
    const { cookId, studentId, planType, startDate, endDate, transactions } = req.body;

    const newSubscription = new Subscription({
      cookId,
      studentId,
      planType,
      startDate,
      endDate,
      transactions, 
    });

    const savedSubscription = await newSubscription.save();
    res.status(201).json({ success: true, subscription: savedSubscription });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ success: false, message: 'Failed to create subscription', error: error.message });
  }
});

// GET /api/subscriptions/cook/:cookId
router.get('/cook/:cookId', async (req, res) => {
  try {
    const { cookId } = req.params;

    const subscriptions = await Subscription.find({ cookId })
      .populate('studentId', 'name email mobile'); // optional: get student info

    res.status(200).json({ success: true, subscriptions });
  } catch (error) {
    console.error('Error fetching subscriptions by cookId:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});


// GET /api/subscriptions/student/:studentId
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;

   const subscription = await Subscription.findOne({ studentId }); // optional: get cook info

    res.status(200).json({ success: true, subscription });
  } catch (error) {
    console.error('Error fetching subscriptions by studentId:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/check/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find subscription by ID
    const dbrescheck = await Subscription.findOne({ studentId: id });

    if (!dbrescheck) {
      // No subscription found
      return res.status(200).json({ check: false });
    }

    // Subscription exists
    return res.status(200).json({ check: true });
  } catch (error) {
    res.status(500).json({ check: false, message: error.message });
  }
});

module.exports = router;
