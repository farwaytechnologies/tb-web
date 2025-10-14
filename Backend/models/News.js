const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  content: { type: String },
  category: { type: String, enum: ['latest', 'press', 'featured'], required: true },
  image: { type: String }, // optional image URL
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);
