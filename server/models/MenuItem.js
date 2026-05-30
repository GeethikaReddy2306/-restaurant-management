const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ['Starters', 'Main Course', 'Desserts', 'Beverages', 'Specials'],
      required: true,
    },
    imageUrl: { type: String, default: '' },
    available: { type: Boolean, default: true },
    isVeg: { type: Boolean, default: false },
    prepTime: { type: Number, default: 15 }, // minutes
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
