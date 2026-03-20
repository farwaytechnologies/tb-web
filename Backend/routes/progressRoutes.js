const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/learningProgressController');

router.get('/:userId', ctrl.getUserProgress);
router.get('/:userId/:courseId', ctrl.getCourseProgress);
router.post('/mark', ctrl.markLesson);
router.post('/unmark', ctrl.unmarkLesson);

module.exports = router;
