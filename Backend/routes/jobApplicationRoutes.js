const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  submitApplication,
  getAllApplications,
  deleteApplication,
} = require('../controllers/jobApplicationController');

// Multer config for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/resumes');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Routes
router.post('/', upload.single('resume'), submitApplication);
router.get('/', getAllApplications);
router.delete('/:id', deleteApplication);

module.exports = router;
