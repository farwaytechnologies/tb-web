const express = require('express');
const router = express.Router();
const {
  saveTutorRewards,
  getLeaderboard,
  getAllTutorRewards,
  adjustBonusPoints,
  resetTutorReward
} = require('../controllers/tutorRewardController');

// Tutor routes
router.post('/tutor/:tutorId', saveTutorRewards);
router.get('/leaderboard', getLeaderboard);

// Admin routes
router.get('/admin/all', getAllTutorRewards);
router.post('/admin/bonus/:tutorId', adjustBonusPoints);
router.delete('/admin/reset/:tutorId', resetTutorReward);

module.exports = router;
