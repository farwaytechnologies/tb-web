const Job = require('../models/Job');

// GET /api/jobs - Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch jobs', error: err.message });
  }
};

// POST /api/jobs - Add a new job
exports.createJob = async (req, res) => {
  try {
    const { title, description, location, level } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newJob = new Job({ title, description, location, level });
    await newJob.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ message: 'Invalid job data', error: err.message });
  }
};

// GET /api/jobs/:id - Get single job
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch job', error: err.message });
  }
};

// DELETE /api/jobs/:id - Delete a job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete job', error: err.message });
  }
};
