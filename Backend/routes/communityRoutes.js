const express = require('express');
const router  = express.Router();
const c = require('../controllers/communityController');
const { authenticateUser } = require('../middleware/authMiddleware');

// Public
router.get('/stats',              c.getCommunityStats);
router.get('/posts',              c.getPosts);
router.get('/posts/:id',          c.getPost);
router.get('/posts/:id/comments', c.getComments);

// Auth required
router.post  ('/posts',                  authenticateUser, c.createPost);
router.put   ('/posts/:id',              authenticateUser, c.updatePost);
router.delete('/posts/:id',              authenticateUser, c.deletePost);
router.post  ('/posts/:id/like',         authenticateUser, c.toggleLikePost);
router.post  ('/posts/:id/comments',     authenticateUser, c.addComment);
router.delete('/comments/:id',           authenticateUser, c.deleteComment);
router.post  ('/comments/:id/like',      authenticateUser, c.toggleLikeComment);

module.exports = router;
