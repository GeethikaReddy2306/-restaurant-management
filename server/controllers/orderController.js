const Order = require('../models/Order');
const sendEmail = require('../config/email');
const { getIO } = require('../config/socket');

// @desc    Get all orders (admin + kitchen)
// @route   GET /api/orders
exports.getOrders = async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Place an order
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { tableId, reservationId, items, notes, guestName, guestEmail } = req.body;

    if (!tableId) {
      return res.status(400).json({ message: 'Table ID is required (e.g. T1, T3)' });
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      tableNumber: tableId.toUpperCase(),
      reservation: reservationId || undefined,
      user: req.user?.id,
      items,
      totalAmount,
      notes: notes || '',
      guestName: guestName || req.user?.name || 'Guest',
      guestEmail: guestEmail || req.user?.email || '',
    });

    // Emit new order to kitchen — include all fields kitchen needs
    getIO().emit('order:new', {
      _id: order._id,
      tableNumber: order.tableNumber,
      status: order.status,
      items: order.items,
      totalAmount: order.totalAmount,
      guestName: order.guestName,
      notes: order.notes,
      createdAt: order.createdAt,
    });

    // Send confirmation email (non-blocking)
    if (guestEmail || req.user?.email) {
      const emailTo = guestEmail || req.user.email;
      const itemsHtml = items
        .map((i) => `<tr><td style="padding:6px;border:1px solid #ddd;">${i.name}</td><td style="padding:6px;border:1px solid #ddd;">${i.quantity}</td><td style="padding:6px;border:1px solid #ddd;">₹${i.price}</td></tr>`)
        .join('');
      sendEmail({
        to: emailTo,
        subject: '🛒 Order Placed Successfully!',
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px;background:#fafafa;border-radius:8px;">
            <h2 style="color:#e67e22;">Order Received! 🍽️</h2>
            <p>Hi <strong>${guestName || 'Guest'}</strong>, your order has been placed for table <strong>${tableId.toUpperCase()}</strong>.</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0;">
              <thead><tr style="background:#e67e22;color:white;"><th style="padding:8px;">Item</th><th style="padding:8px;">Qty</th><th style="padding:8px;">Price</th></tr></thead>
              <tbody>${itemsHtml}</tbody>
            </table>
            <p><strong>Total: ₹${totalAmount.toFixed(2)}</strong></p>
            <p style="color:#888;">Thank you for dining with us!</p>
          </div>
        `,
      }).catch(() => {}); // swallow email errors
    }

    res.status(201).json(order);
  } catch (err) {
    console.error('createOrder error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update order status (kitchen/admin)
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Preparing', 'Ready', 'Served', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Use: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    getIO().emit('order:statusUpdated', {
      orderId: order._id,
      status: order.status,
      tableNumber: order.tableNumber,
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
