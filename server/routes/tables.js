const express = require('express');
const router = express.Router();
const { getTables, createTable, updateTable, deleteTable } = require('../controllers/tableController');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/role');

router.get('/', getTables);
router.post('/', authMiddleware, requireRole('admin'), createTable);
router.put('/:id', authMiddleware, requireRole('admin'), updateTable);
router.delete('/:id', authMiddleware, requireRole('admin'), deleteTable);

module.exports = router;


module.exports = router;
