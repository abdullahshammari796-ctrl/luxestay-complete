const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { protect, adminOnly } = require('../middleware/auth');

// @route  POST /api/bookings
// @desc   Create a new booking
// @access Private
router.post('/', protect, async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests, specialRequests, paymentMethod, guestInfo } = req.body;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    if (!room.available) return res.status(400).json({ success: false, message: 'Room is not available' });

    // Check for date conflicts
    const conflict = await Booking.findOne({
      room: roomId,
      status: { $nin: ['Cancelled'] },
      $or: [
        { checkIn: { $lt: new Date(checkOut), $gte: new Date(checkIn) } },
        { checkOut: { $gt: new Date(checkIn), $lte: new Date(checkOut) } },
        { checkIn: { $lte: new Date(checkIn) }, checkOut: { $gte: new Date(checkOut) } }
      ]
    });
    if (conflict) {
      return res.status(400).json({ success: false, message: 'Room is already booked for these dates' });
    }

    const nights = Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));
    const subtotal = room.price * nights;
    const taxes = Math.round(subtotal * 0.1);

    const booking = await Booking.create({
      user: req.user._id,
      room: roomId,
      checkIn,
      checkOut,
      guests,
      nights,
      pricePerNight: room.price,
      subtotal,
      taxes,
      totalAmount: subtotal + taxes,
      specialRequests,
      paymentMethod: paymentMethod || 'card',
      paymentStatus: 'paid', // simulation
      status: 'Confirmed',
      guestInfo
    });

    await booking.populate('room', 'name category images price');
    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @route  GET /api/bookings/my
// @desc   Get logged-in user's bookings
// @access Private
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room', 'name category images price bed size')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  GET /api/bookings/:id
// @desc   Get single booking
// @access Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('room user');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    // Only allow owner or admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  PUT /api/bookings/:id/cancel
// @desc   Cancel a booking
// @access Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (['Cancelled', 'Checked Out'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel a booking that is ${booking.status}` });
    }
    booking.status = 'Cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();
    res.json({ success: true, message: 'Booking cancelled successfully', booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  GET /api/bookings (admin – all bookings)
// @access Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('user', 'name email')
      .populate('room', 'name category price')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, count: bookings.length, total, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  PUT /api/bookings/:id/status (admin)
// @access Private/Admin
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    ).populate('user room');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
