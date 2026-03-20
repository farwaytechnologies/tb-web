const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  author:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:    { type: String, required: true, trim: true, maxlength: 200 },
  body:     { type: String, required: true, trim: true, maxlength: 5000 },
  category: { type: String, enum: ['general', 'question', 'showcase', 'resource', 'announcement'], default: 'general' },
  tags:     [{ type: String, trim: true, maxlength: 30 }],
  likes:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isPinned: { type: Boolean, default: false },
}, { timestamps: true });

communityPostSchema.index({ createdAt: -1 });
communityPostSchema.index({ category: 1 });

module.exports = mongoose.model('CommunityPost', communityPostSchema);
