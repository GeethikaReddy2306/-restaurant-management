const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    // tableNumber as a plain string (e.g. "T1", "T3") — no longer ObjectId
    tableNumber: { type: String, required: true },
    // Keep reservation link optional
    reservation: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [orderItemSchema],
    status: {
      type: String,
      enum: ['Pending', 'Preparing', 'Ready', 'Served', 'Cancelled'],
      default: 'Pending',
    },
    totalAmount: { type: Number, required: true },
    notes: { type: String, default: '' },
    guestName: { type: String, default: 'Guest' },
    guestEmail: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
