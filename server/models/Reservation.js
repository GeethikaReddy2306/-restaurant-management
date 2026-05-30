const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
    arrivalTime: { type: Date, required: true },
    partySize: { type: Number, required: true, min: 1 },
    specialRequests: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Confirmed', 'Cancelled', 'Completed', 'No-Show'],
      default: 'Confirmed',
    },
    guestName: { type: String, required: true },
    guestEmail: { type: String, required: true },
    guestPhone: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reservation', reservationSchema);
