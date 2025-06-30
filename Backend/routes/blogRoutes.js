const express = require('express');
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');

// Routes
router.post('/', createBlog);         // Create blog
router.get('/', getAllBlogs);         // Get all blogs
router.get('/:id', getBlogById);      // Get single blog
router.put('/:id', updateBlog);       // ✅ Update blog
router.delete('/:id', deleteBlog);    // Delete blog

module.exports = router;
