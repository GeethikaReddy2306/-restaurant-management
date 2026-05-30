const express = require('express');
const router = express.Router();
const {
  getAdvertisements,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
} = require('../controllers/advertisementController');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/role');

router.get('/', getAdvertisements);
router.post('/', authMiddleware, requireRole('admin'), createAdvertisement);
router.put('/:id', authMiddleware, requireRole('admin'), updateAdvertisement);
router.delete('/:id', authMiddleware, requireRole('admin'), deleteAdvertisement);

module.exports = router;


module.exports = router;
