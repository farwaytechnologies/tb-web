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
  getUserCertificates,
  verifyCertificate
} = require('../controllers/enrollmentController');

// Specific static routes FIRST (before wildcard /:id routes)
router.get('/certificates/:userId', getUserCertificates);
router.get('/verify/:certId', verifyCertificate);
router.get('/user/:userId', getUserEnrollments);
router.get('/tutor/:tutorName', getTutorEnrollments);

// POST - Student enrolls
router.post('/', createEnrollment);

// GET - Admin views all
router.get('/', getAllEnrollments);

// Wildcard /:id routes LAST
router.put('/:id/status', updateEnrollmentStatus);
router.patch('/:id/complete', completeEnrollment);
router.delete('/:id', deleteEnrollment);

module.exports = router;
