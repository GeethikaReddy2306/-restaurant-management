const express = require('express');
const router = express.Router();
const { getOrders, createOrder, updateOrderStatus } = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/role');

router.get('/', authMiddleware, requireRole('admin', 'kitchen'), getOrders);
router.post('/', authMiddleware, requireRole('customer', 'admin'), createOrder);
router.put('/:id/status', authMiddleware, requireRole('admin', 'kitchen'), updateOrderStatus);

module.exports = router;


module.exports = router;
