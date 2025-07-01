const Enrollment = require('../models/Enrollment');

// Create a new enrollment
exports.createEnrollment = async (req, res) => {
  try {
    const { userId, courseId, fullName, email, phone, message } = req.body;

    if (!userId || !courseId || !fullName || !email || !phone) {
      return res.status(400).json({ error: 'All required fields must be filled.' });
    }

    const newEnrollment = new Enrollment({
      userId,
      courseId,
      fullName,
      email,
      phone,
      message
    });

    const savedEnrollment = await newEnrollment.save();
    res.status(201).json(savedEnrollment);
  } catch (err) {
    console.error('Enrollment error:', err);
    res.status(500).json({ error: 'Server error while enrolling.' });
  }
};

// Get all enrollments (Admin use)
exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('userId', 'name email')
      .populate('courseId', 'title')
      .sort({ enrolledAt: -1 });

    res.status(200).json(enrollments);
  } catch (err) {
    console.error('Fetch enrollments error:', err);
    res.status(500).json({ error: 'Failed to fetch enrollments.' });
  }
};
