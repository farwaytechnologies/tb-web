const mongoose = require('mongoose');

const communityCommentSchema = new mongoose.Schema({
  post:   { type: mongoose.Schema.Types.ObjectId, ref: 'CommunityPost', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  body:   { type: String, required: true, trim: true, maxlength: 2000 },
  likes:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'CommunityComment', default: null },
}, { timestamps: true });

communityCommentSchema.index({ post: 1, createdAt: 1 });

module.exports = mongoose.model('CommunityComment', communityCommentSchema);
