const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    content: { type: String },
    image: { type: String },
    category: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('News', newsSchema);
