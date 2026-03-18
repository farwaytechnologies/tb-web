const express = require('express');
const router = express.Router();
const {
  saveTutorRewards,
  getLeaderboard,
  getAllTutorRewards,
  adjustBonusPoints,
  resetTutorReward
} = require('../controllers/tutorRewardController');

// Static routes FIRST — before any :param routes
router.get('/leaderboard', getLeaderboard);
router.get('/admin/all', getAllTutorRewards);
router.post('/admin/bonus/:tutorId', adjustBonusPoints);
router.delete('/admin/reset/:tutorId', resetTutorReward);

// Param route LAST
router.post('/tutor/:tutorId', saveTutorRewards);

module.exports = router;
