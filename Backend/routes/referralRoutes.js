const express = require('express');
const router = express.Router();
const { getReferralInfo, getAllReferrals } = require('../controllers/referralController');

router.get('/admin/all', getAllReferrals);
router.get('/:userId', getReferralInfo);

module.exports = router;
