const HomeContent = require('../models/HomeContent');

// GET: Fetch home page content
const getHomeContent = async (req, res) => {
  try {
    const content = await HomeContent.findOne();
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch content' });
  }
};

// POST: Update or create home page content
const updateHomeContent = async (req, res) => {
  try {
    const { heroTitle, heroSubtitle, features, ctaText, ctaButtonText, ctaLink } = req.body;

    let content = await HomeContent.findOne();

    if (content) {
      // Update existing
      content.heroTitle = heroTitle;
      content.heroSubtitle = heroSubtitle;
      content.features = features;
      content.ctaText = ctaText;
      content.ctaButtonText = ctaButtonText;
      content.ctaLink = ctaLink;
    } else {
      // Create new
      content = new HomeContent({
        heroTitle,
        heroSubtitle,
        features,
        ctaText,
        ctaButtonText,
        ctaLink
      });
    }

    await content.save();
    res.json({ message: 'Home content updated', content });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update content' });
  }
};

// DELETE: Delete home page content
const deleteHomeContent = async (req, res) => {
  try {
    const content = await HomeContent.findOne();
    if (!content) {
      return res.status(404).json({ message: 'No home content found to delete' });
    }

    await HomeContent.deleteOne({ _id: content._id });
    res.json({ message: 'Home content deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete home content' });
  }
};

module.exports = {
  getHomeContent,
  updateHomeContent,
  deleteHomeContent
};
