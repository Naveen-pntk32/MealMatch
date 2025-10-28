const express = require('express');
const router = express.Router();
const User = require('../../models/UserModel');
const auth = require('../middleware/middleware');

router.put('/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Ensure user can only update their own profile
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    // Find and update the user
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password'); // Exclude password from response

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
});

module.exports = router;