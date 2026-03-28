const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protect, adminOnly } = require('../middleware/auth');

// @route  GET /api/reviews/room/:roomId
// @desc   Get all reviews for a room
// @access Public
router.get('/room/:roomId', async (req, res) => {
  try {
    const reviews = await Review.find({ room: req.params.roomId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  GET /api/reviews
// @desc   Get all reviews (admin)
// @access Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('room', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  POST /api/reviews
// @desc   Create a review
// @access Private
router.post('/', protect, async (req, res) => {
  try {
    const { roomId, rating, text, title, bookingId } = req.body;
    const existing = await Review.findOne({ user: req.user._id, room: roomId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this room' });
    }
    const review = await Review.create({
      user: req.user._id,
      room: roomId,
      booking: bookingId,
      rating,
      text,
      title
    });
    await review.populate('user', 'name');
    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @route  DELETE /api/reviews/:id
// @desc   Delete a review
// @access Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
