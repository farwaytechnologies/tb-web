const express = require('express');
const router = express.Router();
const {
  getAllNews,
  addNews,
  updateNews,
  deleteNews
} = require('../controllers/newsController');

// GET all news
router.get('/', getAllNews);

// POST new news
router.post('/', addNews);

// PUT update news
router.put('/:id', updateNews);

// DELETE news
router.delete('/:id', deleteNews);

module.exports = router;
