const Table = require('../models/Table');
const { getIO } = require('../config/socket');

// @desc    Get all tables
// @route   GET /api/tables
exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    res.json(tables);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create a table
// @route   POST /api/tables
exports.createTable = async (req, res) => {
  try {
    const { tableNumber, capacity, location } = req.body;
    const exists = await Table.findOne({ tableNumber });
    if (exists) return res.status(400).json({ message: 'Table number already exists' });
    const table = await Table.create({ tableNumber, capacity, location });
    getIO().emit('table:statusUpdated', table);
    res.status(201).json(table);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update table
// @route   PUT /api/tables/:id
exports.updateTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!table) return res.status(404).json({ message: 'Table not found' });
    getIO().emit('table:statusUpdated', table);
    res.json(table);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete table
// @route   DELETE /api/tables/:id
exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) return res.status(404).json({ message: 'Table not found' });
    getIO().emit('table:deleted', req.params.id);
    res.json({ message: 'Table deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
