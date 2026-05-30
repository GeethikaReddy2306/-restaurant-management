const express = require('express');
const router = express.Router();
const { getMenu, createMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/role');

router.get('/', getMenu);
router.post('/', authMiddleware, requireRole('admin'), createMenuItem);
router.put('/:id', authMiddleware, requireRole('admin'), updateMenuItem);
router.delete('/:id', authMiddleware, requireRole('admin'), deleteMenuItem);

module.exports = router;


module.exports = router;
