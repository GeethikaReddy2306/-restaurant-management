const express = require('express');
const router = express.Router();
const {
  getReservations,
  getMyReservations,
  createReservation,
  updateReservation,
} = require('../controllers/reservationController');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/role');

router.get('/', authMiddleware, requireRole('admin'), getReservations);
router.get('/mine', authMiddleware, getMyReservations);
router.post('/', authMiddleware, requireRole('customer', 'admin'), createReservation);
router.put('/:id', authMiddleware, requireRole('admin'), updateReservation);

module.exports = router;

