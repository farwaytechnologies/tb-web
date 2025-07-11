const AboutContent = require('../models/AboutContent');

exports.getAboutContent = async (req, res) => {
  try {
    const about = await AboutContent.findOne().sort({ updatedAt: -1 });
    if (!about) return res.status(404).json({ message: 'No about content found' });
    res.json(about);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateAboutContent = async (req, res) => {
  try {
    const { title, description } = req.body;
    const updateData = { title, description };

    const updated = await AboutContent.findOneAndUpdate({}, updateData, {
      new: true,
      upsert: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
