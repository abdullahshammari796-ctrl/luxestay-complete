const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const { protect, adminOnly } = require('../middleware/auth');

// @route  GET /api/rooms
// @desc   Get all rooms with filtering, sorting, pagination
// @access Public
router.get('/', async (req, res) => {
  try {
    const { category, available, minPrice, maxPrice, capacity, sort, page = 1, limit = 20 } = req.query;
    const query = {};
    if (category) query.category = category;
    if (available !== undefined) query.available = available === 'true';
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (capacity) query.capacity = { $gte: Number(capacity) };

    let sortObj = {};
    if (sort === 'price_asc') sortObj = { price: 1 };
    else if (sort === 'price_desc') sortObj = { price: -1 };
    else if (sort === 'rating') sortObj = { rating: -1 };
    else if (sort === 'reviews') sortObj = { numReviews: -1 };
    else sortObj = { featured: -1, createdAt: -1 };

    const total = await Room.countDocuments(query);
    const rooms = await Room.find(query)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      count: rooms.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      rooms
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  GET /api/rooms/featured
// @desc   Get featured rooms
// @access Public
router.get('/featured', async (req, res) => {
  try {
    const rooms = await Room.find({ featured: true }).limit(6);
    res.json({ success: true, rooms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  GET /api/rooms/:id
// @desc   Get single room by ID
// @access Public
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    res.json({ success: true, room });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  GET /api/rooms/:id/availability
// @desc   Check room availability for dates
// @access Public
router.get('/:id/availability', async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;
    if (!checkIn || !checkOut) {
      return res.status(400).json({ success: false, message: 'checkIn and checkOut dates required' });
    }
    const Booking = require('../models/Booking');
    const conflict = await Booking.findOne({
      room: req.params.id,
      status: { $nin: ['Cancelled'] },
      $or: [
        { checkIn: { $lt: new Date(checkOut), $gte: new Date(checkIn) } },
        { checkOut: { $gt: new Date(checkIn), $lte: new Date(checkOut) } },
        { checkIn: { $lte: new Date(checkIn) }, checkOut: { $gte: new Date(checkOut) } }
      ]
    });
    res.json({ success: true, available: !conflict });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  POST /api/rooms
// @desc   Create a new room (Admin only)
// @access Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({ success: true, room });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @route  PUT /api/rooms/:id
// @desc   Update a room (Admin only)
// @access Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    res.json({ success: true, room });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @route  DELETE /api/rooms/:id
// @desc   Delete a room (Admin only)
// @access Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
