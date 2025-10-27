const express = require('express');
const router = express.Router();

// Existing routes
router.use('/auth', require('../routes/auth'));
router.use('/courses', require('../routes/courseRoutes'));
router.use('/blogs', require('../routes/blogRoutes'));
router.use('/enrollments', require('../routes/enrollmentRoutes'));
router.use('/innovations', require('../routes/innovationRoutes'));
router.use('/home', require('../routes/homeContentRoutes'));
router.use('/contact', require('../routes/contactRoutes'));
router.use('/notifications', require('../routes/notificationRoutes'));
router.use('/about', require('../routes/aboutRoutes'));
router.use('/jobs', require('../routes/jobRoutes'));
router.use('/applications', require('../routes/jobApplicationRoutes')); // ✅ Job Applications
router.use('/news', require('../routes/newsRoutes')); // ✅ News
router.use('/learn', require('../routes/learnRoutes'));

// ✅ Add this line for visitor analytics
router.use('/visitors', require('../routes/visitorRoutes'));

module.exports = router;
