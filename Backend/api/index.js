const express = require('express');
const router = express.Router();

// ✅ Add visitors route
router.use('/visitors', require('../routes/visitorRoutes'));

// Other routes
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
router.use('/applications', require('../routes/jobApplicationRoutes'));
router.use('/news', require('../routes/newsRoutes'));
router.use('/learn', require('../routes/learnRoutes'));
router.use('/rewards', require('../routes/tutorRewardRoutes'));
router.use('/borgcoins', require('../routes/borgCoinRoutes'));
router.use('/invoices', require('../routes/invoiceRoutes'));
router.use('/payment', require('../routes/paymentRoutes'));
router.use('/exams', require('../routes/examRoutes'));
router.use('/support', require('../routes/supportRoutes'));
router.use('/security', require('../routes/securityRoutes'));
router.use('/community', require('../routes/communityRoutes'));
router.use('/progress', require('../routes/progressRoutes'));

module.exports = router;
