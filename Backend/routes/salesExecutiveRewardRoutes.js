const express = require('express');
const router = express.Router();
const {
  getReward,
  requestWithdrawal,
  getAllRewards,
  resolveWithdrawal,
} = require('../controllers/salesExecutiveRewardController');

// Admin
router.get('/admin/all', getAllRewards);
router.put('/admin/withdraw/:rewardId/:withdrawId', resolveWithdrawal);

// Sales executive
router.get('/:userId', getReward);
router.post('/:userId/withdraw', requestWithdrawal);

module.exports = router;
