const Reservation = require('../models/Reservation');
const Table = require('../models/Table');
const sendEmail = require('../config/email');
const { getIO } = require('../config/socket');

// @desc    Get all reservations
// @route   GET /api/reservations
exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('user', 'name email')
      .populate('table', 'tableNumber capacity')
      .sort({ arrivalTime: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get user reservations
// @route   GET /api/reservations/mine
exports.getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id })
      .populate('table', 'tableNumber capacity')
      .sort({ arrivalTime: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create reservation
// @route   POST /api/reservations
exports.createReservation = async (req, res) => {
  try {
    const { tableId, arrivalTime, partySize, specialRequests, guestName, guestEmail, guestPhone } = req.body;

    const table = await Table.findById(tableId);
    if (!table) return res.status(404).json({ message: 'Table not found' });
    if (table.status !== 'Available') {
      return res.status(400).json({ message: 'Table is not available' });
    }

    const reservation = await Reservation.create({
      user: req.user.id,
      table: tableId,
      arrivalTime,
      partySize,
      specialRequests,
      guestName,
      guestEmail,
      guestPhone,
    });

    // Mark table as Reserved
    await Table.findByIdAndUpdate(tableId, { status: 'Reserved' });
    const updatedTable = await Table.findById(tableId);
    getIO().emit('table:statusUpdated', updatedTable);

    // Send confirmation email
    await sendEmail({
      to: guestEmail,
      subject: '🍽️ Reservation Confirmed!',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px;background:#fafafa;border-radius:8px;">
          <h2 style="color:#e67e22;">Reservation Confirmed ✅</h2>
          <p>Hi <strong>${guestName}</strong>, your table has been successfully reserved!</p>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px;border:1px solid #ddd;"><strong>Table</strong></td><td style="padding:8px;border:1px solid #ddd;">Table ${table.tableNumber}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;"><strong>Arrival Time</strong></td><td style="padding:8px;border:1px solid #ddd;">${new Date(arrivalTime).toLocaleString()}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;"><strong>Party Size</strong></td><td style="padding:8px;border:1px solid #ddd;">${partySize} guests</td></tr>
          </table>
          <p style="margin-top:16px;color:#888;">We look forward to seeing you! If you need to cancel, please contact us.</p>
        </div>
      `,
    });

    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update reservation status
// @route   PUT /api/reservations/:id
exports.updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
