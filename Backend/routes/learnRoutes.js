const express = require('express');
const router = express.Router();
const {
  createLanguage,
  getAllLanguages,
  getLanguageById,
  updateLanguage,
  deleteLanguage
} = require('../controllers/learnController');

// Routes
router.post('/', createLanguage);     // Add new language
router.get('/', getAllLanguages);     // Get all languages
router.get('/:id', getLanguageById);  // Get single language details
router.put('/:id', updateLanguage);   // Edit language
router.delete('/:id', deleteLanguage); // Delete language

module.exports = router;
