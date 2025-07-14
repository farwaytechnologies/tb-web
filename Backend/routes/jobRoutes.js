const express = require('express');
const router = express.Router();
const {
  getAllJobs,
  createJob,
  deleteJob
} = require('../controllers/jobController');

router.get('/', getAllJobs);
router.post('/', createJob);
router.delete('/:id', deleteJob);

module.exports = router;
