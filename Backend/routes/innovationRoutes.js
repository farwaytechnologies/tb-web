const express = require('express');
const router = express.Router();
const {
  createInnovation,
  getAllInnovations,
  getInnovationById,
  updateInnovation,
  deleteInnovation
} = require('../controllers/innovationController');

// MAKE SURE these handlers are functions
router.post('/', createInnovation);
router.get('/', getAllInnovations);
router.get('/:id', getInnovationById);
router.put('/:id', updateInnovation);
router.delete('/:id', deleteInnovation);

module.exports = router;
