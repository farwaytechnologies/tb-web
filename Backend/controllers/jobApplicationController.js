const JobApplication = require('../models/JobApplication');
const path = require('path');
const fs = require('fs');

// Submit job application
exports.submitApplication = async (req, res) => {
  try {
    const { jobId, name, email, experience, course } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required.' });
    }

    const resumeUrl = `/uploads/resumes/${req.file.filename}`;

    const newApplication = new JobApplication({
      jobId,
      name,
      email,
      experience,
      course,
      resumeUrl,
    });

    await newApplication.save();
    res.status(201).json({ message: 'Application submitted successfully.' });
  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({ message: 'Failed to submit application.' });
  }
};

// Get all applications (admin)
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications.' });
  }
};

// Delete application (admin)
exports.deleteApplication = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found.' });

    const filePath = path.join(__dirname, `../${application.resumeUrl}`);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await JobApplication.findByIdAndDelete(req.params.id);
    res.json({ message: 'Application deleted.' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Error deleting application.' });
  }
};
