const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');

router.get('/', supportController.getCategories);
router.post('/', supportController.createCategory);
router.put('/:id', supportController.updateCategory);
router.delete('/:id', supportController.deleteCategory);

module.exports = router;
