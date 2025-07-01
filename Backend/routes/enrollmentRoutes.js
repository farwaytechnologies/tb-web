const express = require('express');
const router = express.Router();
const {
  createEnrollment,
  getAllEnrollments,
  updateEnrollmentStatus
} = require('../controllers/enrollmentController');

// Student: Enroll in course
router.post('/', createEnrollment);

// Admin: Get all enrollments
router.get('/', getAllEnrollments);

// Admin: Update status (accept/reject)
router.put('/:id/status', updateEnrollmentStatus);

module.exports = router;
