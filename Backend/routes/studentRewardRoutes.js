const express = require('express');
const router = express.Router();
const { getStudentReward } = require('../controllers/studentRewardController');

router.get('/:userId', getStudentReward);

module.exports = router;
