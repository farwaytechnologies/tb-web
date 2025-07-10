const mongoose = require('mongoose');

const HomeContentSchema = new mongoose.Schema({
  heroTitle: String,
  heroSubtitle: String,
  features: [
    {
      title: String,
      description: String,
    }
  ],
  ctaText: String,
  ctaButtonText: String,
  ctaLink: String
});

module.exports = mongoose.model('HomeContent', HomeContentSchema);
