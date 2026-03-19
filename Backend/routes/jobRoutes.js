const express = require('express');
const router = express.Router();
const {
  getAllJobs,
  getJobById,
  createJob,
  deleteJob
} = require('../controllers/jobController');

router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.post('/', createJob);
router.delete('/:id', deleteJob);

module.exports = router;
