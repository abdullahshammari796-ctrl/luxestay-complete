const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  checkIn: { type: Date, required: [true, 'Check-in date is required'] },
  checkOut: { type: Date, required: [true, 'Check-out date is required'] },
  guests: { type: Number, required: true, min: 1 },
  nights: { type: Number },
  pricePerNight: { type: Number, required: true },
  subtotal: { type: Number },
  taxes: { type: Number },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Checked In', 'Checked Out', 'Cancelled'], default: 'Pending' },
  paymentMethod: { type: String, enum: ['card', 'paypal', 'bank'], default: 'card' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  specialRequests: { type: String },
  referenceNumber: { type: String, unique: true },
  guestInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String
  }
}, { timestamps: true });

// Auto-generate reference number and calculate nights/totals before save
BookingSchema.pre('save', function(next) {
  if (!this.referenceNumber) {
    this.referenceNumber = 'LX' + Math.random().toString(36).substr(2, 8).toUpperCase();
  }
  if (this.checkIn && this.checkOut) {
    this.nights = Math.max(1, Math.round((this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24)));
  }
  this.subtotal = this.pricePerNight * (this.nights || 1);
  this.taxes = Math.round(this.subtotal * 0.1);
  this.totalAmount = this.subtotal + this.taxes;
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);
