const Enrollment = require('../models/Enrollment');

// Create a new enrollment (free courses only — no invoice)
exports.createEnrollment = async (req, res) => {
  try {
    const { userId, courseId, fullName, email, phone, message } = req.body;

    if (!userId || !courseId || !fullName || !email || !phone) {
      return res.status(400).json({ error: 'All required fields must be filled.' });
    }

    const newEnrollment = new Enrollment({ userId, courseId, fullName, email, phone, message });
    const savedEnrollment = await newEnrollment.save();
    return res.status(201).json({ enrollment: savedEnrollment });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'You have already enrolled in this course.' });
    }
    console.error('Enrollment error:', err);
    res.status(500).json({ error: 'Server error while enrolling.' });
  }
};

// Get all enrollments (Admin)
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

// Update enrollment status (Accept/Reject)
exports.updateEnrollmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const updated = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ error: 'Failed to update enrollment status' });
  }
};

// Get enrollments for a specific user
exports.getUserEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.params.userId })
      .populate('courseId', 'title image instructor level duration price')
      .sort({ enrolledAt: -1 });
    res.status(200).json(enrollments);
  } catch (err) {
    console.error('Fetch user enrollments error:', err);
    res.status(500).json({ error: 'Failed to fetch user enrollments.' });
  }
};

// Get enrollments for courses belonging to a tutor
exports.getTutorEnrollments = async (req, res) => {
  try {
    const Course = require('../models/Course');
    const courses = await Course.find({ instructor: req.params.tutorName }, '_id title');
    const courseIds = courses.map(c => c._id);
    const enrollments = await Enrollment.find({ courseId: { $in: courseIds } })
      .populate('userId', 'name email profilePic')
      .populate('courseId', 'title')
      .sort({ enrolledAt: -1 });
    res.status(200).json(enrollments);
  } catch (err) {
    console.error('Fetch tutor enrollments error:', err);
    res.status(500).json({ error: 'Failed to fetch tutor enrollments.' });
  }
};

// Delete an enrollment (optional)
exports.deleteEnrollment = async (req, res) => {
  try {
    const deleted = await Enrollment.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    res.json({ message: 'Enrollment deleted successfully' });
  } catch (err) {
    console.error('Delete enrollment error:', err);
    res.status(500).json({ error: 'Failed to delete enrollment' });
  }
};

// Mark enrollment as completed and generate certificate ID
exports.completeEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate('courseId', 'title instructor');
    if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });
    if (enrollment.completed) return res.status(400).json({ error: 'Already completed' });

    const certId = 'CERT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    enrollment.completed = true;
    enrollment.completedAt = new Date();
    enrollment.certificateId = certId;
    await enrollment.save();

    res.json({ message: 'Marked as completed', enrollment });
  } catch (err) {
    console.error('Complete enrollment error:', err);
    res.status(500).json({ error: 'Failed to complete enrollment' });
  }
};

// Get all completed enrollments (certificates) for a user
exports.getUserCertificates = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.params.userId, completed: true })
      .populate('courseId', 'title instructor image level duration')
      .sort({ completedAt: -1 });
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
};
