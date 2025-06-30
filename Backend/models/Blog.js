const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  content: { type: String, required: true },
  author: { type: String, default: 'Admin' },
  image: { type: String, default: '' },
  images: [{ type: String }],
  category: { type: String, default: 'General' },
  tags: [{ type: String }],
  detailedSections: [
    {
      heading: String,
      text: String,
      list: [String],
      tips: [String]
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Blog', blogSchema);
