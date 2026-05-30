const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema(
  {
    tableNumber: { type: Number, required: true, unique: true },
    capacity: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ['Available', 'Reserved', 'Occupied', 'Cleaning'],
      default: 'Available',
    },
    location: { type: String, default: 'Main Floor' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Table', tableSchema);
