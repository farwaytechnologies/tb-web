const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/', contactController.submitMessage); // Public
router.get('/', contactController.getAllMessages); // Public
router.delete('/delete-all', contactController.deleteAllMessages); // Public

module.exports = router;
