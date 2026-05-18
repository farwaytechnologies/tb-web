const express = require('express');
const router = express.Router();
const { getSEReport } = require('../controllers/seReportController');

router.get('/:userId', getSEReport);

module.exports = router;
