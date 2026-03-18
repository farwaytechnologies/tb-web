const express = require('express');
const router = express.Router();
const {
  getWallet,
  transferPointsToCoins,
  requestWithdrawal,
  getAllWithdrawals,
  resolveWithdrawal,
  getAdminSettings,
  updateSettings
} = require('../controllers/borgCoinController');

// Tutor
router.get('/wallet/:tutorId', getWallet);
router.post('/transfer', transferPointsToCoins);
router.post('/withdraw', requestWithdrawal);

// Admin
router.get('/admin/withdrawals', getAllWithdrawals);
router.patch('/admin/withdrawal/:id', resolveWithdrawal);
router.get('/admin/settings', getAdminSettings);
router.put('/admin/settings', updateSettings);

module.exports = router;
