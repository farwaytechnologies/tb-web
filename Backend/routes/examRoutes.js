const express = require('express');
const router = express.Router();
const c = require('../controllers/examController');

router.get('/',              c.getAllExams);       // public list
router.get('/manage',        c.getAllExamsFull);   // admin/tutor full list
router.get('/results/:userId', c.getUserResults);  // user results
router.get('/:id',           c.getExamById);       // single exam (no answers)
router.post('/',             c.createExam);
router.put('/:id',           c.updateExam);
router.delete('/:id',        c.deleteExam);
router.post('/:id/submit',   c.submitAttempt);

module.exports = router;
