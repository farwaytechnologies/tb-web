const express = require('express');
const router = express.Router();
const { saveTutorRewards, getLeaderboard } = require('../controllers/tutorRewardController');

router.post('/tutor/:tutorId', saveTutorRewards);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
