const mongoose = require("mongoose");

const LearnTopicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  detailedContent: { type: String },
  image: { type: String },
  link: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("LearnTopic", LearnTopicSchema);
