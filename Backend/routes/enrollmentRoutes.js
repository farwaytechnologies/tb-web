const express = require('express');
const router = express.Router();
const {
  createEnrollment,
  getAllEnrollments
} = require('../controllers/enrollmentController');

// Create enrollment (Student use)
router.post('/', createEnrollment);

// Get all enrollments (Admin use)
router.get('/', getAllEnrollments);

module.exports = router;
