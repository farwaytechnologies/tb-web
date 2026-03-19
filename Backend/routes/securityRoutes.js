const express = require('express');
const router = express.Router();
const { getLogs, getStats, clearLogs, seedTestLog } = require('../controllers/securityController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

router.get('/stats',  authenticateAdmin, getStats);
router.get('/logs',   authenticateAdmin, getLogs);
router.delete('/logs', authenticateAdmin, clearLogs);
router.post('/test',  authenticateAdmin, seedTestLog);

module.exports = router;
