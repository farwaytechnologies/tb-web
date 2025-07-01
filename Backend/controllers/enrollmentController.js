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
