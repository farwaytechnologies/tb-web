const express = require('express');
const router = express.Router();
const {
  createEnrollment,
  getAllEnrollments,
  updateEnrollmentStatus,
  deleteEnrollment
} = require('../controllers/enrollmentController');

// POST - Student enrolls
router.post('/', createEnrollment);

// GET - Admin views all
router.get('/', getAllEnrollments);

// PUT - Admin updates status
router.put('/:id/status', updateEnrollmentStatus);

// DELETE - Admin deletes enrollment
router.delete('/:id', deleteEnrollment);

module.exports = router;
