const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Room name is required'], trim: true },
  category: { type: String, required: true, enum: ['Classic', 'Superior', 'Suite', 'Presidential', 'Family', 'Honeymoon'] },
  description: { type: String, required: [true, 'Description is required'] },
  price: { type: Number, required: [true, 'Price per night is required'], min: 0 },
  originalPrice: { type: Number },
  size: { type: String },
  capacity: { type: Number, required: true, min: 1, max: 10 },
  bed: { type: String },
  view: { type: String },
  floor: { type: String },
  amenities: [{ type: String }],
  images: [{ type: String }],
  badge: { type: String },
  available: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  numReviews: { type: Number, default: 0 }
}, { timestamps: true });

// Virtual to get image (first in array)
RoomSchema.virtual('image').get(function() {
  return this.images && this.images[0] ? this.images[0] : '';
});

RoomSchema.set('toJSON', { virtuals: true });
RoomSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Room', RoomSchema);
