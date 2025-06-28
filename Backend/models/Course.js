const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  detailedDescription: String,
  image: String,
  video: String,
  price: Number,
  duration: String,
  level: String,
  instructor: String,

  // Array of strings for module names
  modules: [String],

  // Array of objects for video modules
  modulesVideos: [
    {
      title: String,
      video: String,
      description: String
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);
