const CommunityPost    = require('../models/CommunityPost');
const CommunityComment = require('../models/CommunityComment');

// ── POSTS ─────────────────────────────────────────────────────────────────────

// GET /api/community/posts?category=&search=&page=&limit=
exports.getPosts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 15 } = req.query;
    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (search) filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { body:  { $regex: search, $options: 'i' } },
      { tags:  { $regex: search, $options: 'i' } },
    ];

    const [posts, total] = await Promise.all([
      CommunityPost.find(filter)
        .populate('author', 'name profilePic role')
        .sort({ isPinned: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      CommunityPost.countDocuments(filter),
    ]);

    // Attach comment count
    const Comment = require('../models/CommunityComment');
    const ids = posts.map(p => p._id);
    const counts = await Comment.aggregate([
      { $match: { post: { $in: ids } } },
      { $group: { _id: '$post', count: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(counts.map(c => [c._id.toString(), c.count]));

    const result = posts.map(p => ({
      ...p.toObject(),
      commentCount: countMap[p._id.toString()] || 0,
    }));

    res.json({ posts: result, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};

// GET /api/community/posts/:id
exports.getPost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id)
      .populate('author', 'name profilePic role bio');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch {
    res.status(500).json({ message: 'Failed to fetch post' });
  }
};

// POST /api/community/posts
exports.createPost = async (req, res) => {
  try {
    const { title, body, category, tags } = req.body;
    const post = await CommunityPost.create({
      author: req.user._id,
      title, body, category,
      tags: (tags || []).slice(0, 5),
    });
    await post.populate('author', 'name profilePic role');
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to create post' });
  }
};

// PUT /api/community/posts/:id
exports.updatePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not allowed' });

    const { title, body, category, tags } = req.body;
    Object.assign(post, { title, body, category, tags: (tags || []).slice(0, 5) });
    await post.save();
    res.json(post);
  } catch {
    res.status(500).json({ message: 'Failed to update post' });
  }
};

// DELETE /api/community/posts/:id
exports.deletePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not allowed' });

    await CommunityPost.findByIdAndDelete(req.params.id);
    await CommunityComment.deleteMany({ post: req.params.id });
    res.json({ message: 'Post deleted' });
  } catch {
    res.status(500).json({ message: 'Failed to delete post' });
  }
};

// POST /api/community/posts/:id/like
exports.toggleLikePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const uid = req.user._id.toString();
    const idx = post.likes.findIndex(l => l.toString() === uid);
    if (idx === -1) post.likes.push(req.user._id);
    else post.likes.splice(idx, 1);
    await post.save();
    res.json({ likes: post.likes.length, liked: idx === -1 });
  } catch {
    res.status(500).json({ message: 'Failed to toggle like' });
  }
};

// ── COMMENTS ──────────────────────────────────────────────────────────────────

// GET /api/community/posts/:id/comments
exports.getComments = async (req, res) => {
  try {
    const comments = await CommunityComment.find({ post: req.params.id, parent: null })
      .populate('author', 'name profilePic role')
      .sort({ createdAt: 1 });

    const replies = await CommunityComment.find({ post: req.params.id, parent: { $ne: null } })
      .populate('author', 'name profilePic role')
      .sort({ createdAt: 1 });

    const replyMap = {};
    replies.forEach(r => {
      const key = r.parent.toString();
      if (!replyMap[key]) replyMap[key] = [];
      replyMap[key].push(r);
    });

    const result = comments.map(c => ({
      ...c.toObject(),
      replies: replyMap[c._id.toString()] || [],
    }));

    res.json(result);
  } catch {
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

// POST /api/community/posts/:id/comments
exports.addComment = async (req, res) => {
  try {
    const { body, parent } = req.body;
    const comment = await CommunityComment.create({
      post:   req.params.id,
      author: req.user._id,
      body,
      parent: parent || null,
    });
    await comment.populate('author', 'name profilePic role');
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to add comment' });
  }
};

// DELETE /api/community/comments/:id
exports.deleteComment = async (req, res) => {
  try {
    const comment = await CommunityComment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not allowed' });
    await CommunityComment.findByIdAndDelete(req.params.id);
    await CommunityComment.deleteMany({ parent: req.params.id });
    res.json({ message: 'Comment deleted' });
  } catch {
    res.status(500).json({ message: 'Failed to delete comment' });
  }
};

// POST /api/community/comments/:id/like
exports.toggleLikeComment = async (req, res) => {
  try {
    const comment = await CommunityComment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    const uid = req.user._id.toString();
    const idx = comment.likes.findIndex(l => l.toString() === uid);
    if (idx === -1) comment.likes.push(req.user._id);
    else comment.likes.splice(idx, 1);
    await comment.save();
    res.json({ likes: comment.likes.length, liked: idx === -1 });
  } catch {
    res.status(500).json({ message: 'Failed to toggle like' });
  }
};

// GET /api/community/stats
exports.getCommunityStats = async (req, res) => {
  try {
    const [posts, comments] = await Promise.all([
      CommunityPost.countDocuments(),
      CommunityComment.countDocuments(),
    ]);
    res.json({ posts, comments });
  } catch {
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};
