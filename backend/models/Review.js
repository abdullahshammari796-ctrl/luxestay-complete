const mongoose = require('mongoose');
const Room = require('./Room');

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  rating: { type: Number, required: [true, 'Rating is required'], min: 1, max: 5 },
  text: { type: String, required: [true, 'Review text is required'], maxlength: 1000 },
  title: { type: String, maxlength: 200 }
}, { timestamps: true });

// One review per user per room
ReviewSchema.index({ user: 1, room: 1 }, { unique: true });

// Update room average rating after each review
ReviewSchema.statics.updateRoomRating = async function(roomId) {
  const stats = await this.aggregate([
    { $match: { room: roomId } },
    { $group: { _id: '$room', avgRating: { $avg: '$rating' }, numReviews: { $sum: 1 } } }
  ]);
  if (stats.length > 0) {
    await Room.findByIdAndUpdate(roomId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      numReviews: stats[0].numReviews
    });
  } else {
    await Room.findByIdAndUpdate(roomId, { rating: 0, numReviews: 0 });
  }
};

ReviewSchema.post('save', async function() {
  await this.constructor.updateRoomRating(this.room);
});

ReviewSchema.post('deleteOne', { document: true }, async function() {
  await this.constructor.updateRoomRating(this.room);
});

module.exports = mongoose.model('Review', ReviewSchema);
