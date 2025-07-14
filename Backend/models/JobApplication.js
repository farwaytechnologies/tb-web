const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  jobId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  experience: { type: String, required: true },
  course: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
