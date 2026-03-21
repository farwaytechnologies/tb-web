const mongoose = require('mongoose');

// Each module (lesson) inside a language
const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  content: { type: String, default: '' },
  codeExample: { type: String, default: '' },
  image: { type: String, default: '' }
});

// Main language schema
const learnSchema = new mongoose.Schema({
  language: { type: String, required: true },
  shortDescription: { type: String, default: '' },
  image: { type: String, default: '' },
  modules: [moduleSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Learn', learnSchema);
