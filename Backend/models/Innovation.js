const mongoose = require('mongoose');

const innovationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  image: { type: String },
  images: [String],
  link: { type: String },
  tags: [String],
  description: { type: String },
  contentSections: [
    {
      heading: String,
      text: String,
      bullets: [String],
      tips: [String]
    }
  ],
  author: { type: String, default: 'Admin' },
  published: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Innovation', innovationSchema);
