const AboutContent = require('../models/AboutContent');
const User = require('../models/user');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

exports.getAboutContent = async (req, res) => {
  try {
    const about = await AboutContent.findOne().sort({ updatedAt: -1 });
    if (!about) return res.status(404).json({ message: 'No about content found' });
    res.json(about);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateAboutContent = async (req, res) => {
  try {
    const { title, description } = req.body;
    const updated = await AboutContent.findOneAndUpdate({}, { title, description }, {
      new: true,
      upsert: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/about/stats — public, no auth needed
exports.getAboutStats = async (req, res) => {
  try {
    const [totalStudents, totalTutors, totalCourses, totalEnrollments] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'tutor' }),
      Course.countDocuments(),
      Enrollment.countDocuments(),
    ]);
    res.json({ totalStudents, totalTutors, totalCourses, totalEnrollments });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};
