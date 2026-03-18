const express = require('express');
const router = express.Router();
const {
  createEnrollment,
  getAllEnrollments,
  getUserEnrollments,
  getTutorEnrollments,
  updateEnrollmentStatus,
  deleteEnrollment,
  completeEnrollment,
  getUserCertificates
} = require('../controllers/enrollmentController');

// POST - Student enrolls
router.post('/', createEnrollment);

// GET - Admin views all
router.get('/', getAllEnrollments);

// GET - User's own enrollments
router.get('/user/:userId', getUserEnrollments);

// GET - Tutor's course enrollments
router.get('/tutor/:tutorName', getTutorEnrollments);

// PUT - Admin updates status
router.put('/:id/status', updateEnrollmentStatus);

// DELETE - Admin deletes enrollment
router.delete('/:id', deleteEnrollment);

// PATCH - Mark enrollment as completed (tutor/admin)
router.patch('/:id/complete', completeEnrollment);

// GET - User's certificates (completed enrollments)
router.get('/certificates/:userId', getUserCertificates);

module.exports = router;
