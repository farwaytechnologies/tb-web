const express = require('express');
const router = express.Router();
const {
  getAllNews,
  getNewsById,
  addNews,
  updateNews,
  deleteNews
} = require('../controllers/newsController');

// ✅ GET all news
router.get('/', getAllNews);

// ✅ GET a single news item by ID
router.get('/:id', getNewsById);

// ✅ POST new news
router.post('/', addNews);

// ✅ PUT update news by ID
router.put('/:id', updateNews);

// ✅ DELETE news by ID
router.delete('/:id', deleteNews);

module.exports = router;
