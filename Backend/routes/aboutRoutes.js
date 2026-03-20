const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');

// Routes (no image upload)
router.get('/', aboutController.getAboutContent);
router.get('/stats', aboutController.getAboutStats);
router.put('/', aboutController.updateAboutContent);

module.exports = router;
