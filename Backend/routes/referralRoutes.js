const express = require('express');
const router = express.Router();
const { getReferralInfo } = require('../controllers/referralController');

router.get('/:userId', getReferralInfo);

module.exports = router;
