const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  detailedDescription: String,
  image: String,
  video: String,
  price: Number,
  duration: String,
  level: String,
  instructor: String,

  modules: [
    {
      name: { type: String, required: true },

      videos: [
        {
          title: { type: String, required: true },
          video: { type: String, required: true },
          description: String
        }
      ],

      // ✅ Similar structure for learning content
      learningContent: [
        {
          heading: { type: String },
          paragraph: { type: String },
          image: { type: String }
        }
      ]
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);
