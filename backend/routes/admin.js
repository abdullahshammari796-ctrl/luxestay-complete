const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const Room = require('../models/Room');
const Review = require('../models/Review');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// @route  GET /api/admin/stats
// @desc   Get dashboard overview statistics
// @access Private/Admin
router.get('/stats', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalBookings, monthlyBookings, lastMonthBookings,
      totalUsers, activeGuests,
      totalRooms, availableRooms,
      revenueData, lastMonthRevenue,
      avgRating
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Booking.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
      User.countDocuments({ role: 'user' }),
      Booking.countDocuments({ status: { $in: ['Confirmed', 'Checked In'] } }),
      Room.countDocuments(),
      Room.countDocuments({ available: true }),
      Booking.aggregate([
        { $match: { status: { $ne: 'Cancelled' }, createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Booking.aggregate([
        { $match: { status: { $ne: 'Cancelled' }, createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Review.aggregate([{ $group: { _id: null, avg: { $avg: '$rating' } } }])
    ]);

    const monthRevenue = revenueData[0]?.total || 0;
    const lastMonthRev = lastMonthRevenue[0]?.total || 0;
    const revenueDelta = lastMonthRev > 0 ? (((monthRevenue - lastMonthRev) / lastMonthRev) * 100).toFixed(1) : 0;
    const occupancy = totalRooms > 0 ? Math.round((availableRooms / totalRooms) * 100) : 0;

    res.json({
      success: true,
      stats: {
        totalBookings,
        monthlyBookings,
        bookingDelta: lastMonthBookings > 0 ? (((monthlyBookings - lastMonthBookings) / lastMonthBookings) * 100).toFixed(1) : 0,
        totalUsers,
        activeGuests,
        totalRooms,
        availableRooms,
        occupancyRate: occupancy,
        monthlyRevenue: monthRevenue,
        revenueDelta,
        avgRating: avgRating[0]?.avg?.toFixed(1) || '0.0'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  GET /api/admin/revenue
// @desc   Get monthly revenue for current year
// @access Private/Admin
router.get('/revenue', async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const data = await Booking.aggregate([
      { $match: { status: { $ne: 'Cancelled' }, createdAt: { $gte: new Date(`${year}-01-01`) } } },
      { $group: { _id: { $month: '$createdAt' }, revenue: { $sum: '$totalAmount' }, bookings: { $sum: 1 } } },
      { $sort: { '_id': 1 } }
    ]);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const result = months.map((name, i) => {
      const found = data.find(d => d._id === i + 1);
      return { month: name, revenue: found?.revenue || 0, bookings: found?.bookings || 0 };
    });
    res.json({ success: true, revenue: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  GET /api/admin/category-stats
// @desc   Bookings by room category
// @access Private/Admin
router.get('/category-stats', async (req, res) => {
  try {
    const data = await Booking.aggregate([
      { $lookup: { from: 'rooms', localField: 'room', foreignField: '_id', as: 'roomData' } },
      { $unwind: '$roomData' },
      { $group: { _id: '$roomData.category', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
      { $sort: { count: -1 } }
    ]);
    res.json({ success: true, categories: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
