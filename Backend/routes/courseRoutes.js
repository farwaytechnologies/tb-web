const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// POST - Create a course
router.post('/', courseController.createCourse);

// GET - Fetch all courses
router.get('/', courseController.getAllCourses);

// GET - Fetch a single course
router.get('/:id', courseController.getCourseById);

// PUT - ✅ Update a course
router.put('/:id', courseController.updateCourse); // <-- Add this line

// DELETE - Delete a course
router.delete('/:id', courseController.deleteCourse);

module.exports = router;
