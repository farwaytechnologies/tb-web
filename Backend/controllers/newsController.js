const News = require('../models/News');

// ✅ Get all news
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news', error });
  }
};

// ✅ Add a new news item
exports.addNews = async (req, res) => {
  try {
    const { title, date, content, category, image } = req.body;
    const newNews = new News({ title, date, content, category, image });
    await newNews.save();
    res.status(201).json({ message: 'News added successfully', news: newNews });
  } catch (error) {
    res.status(500).json({ message: 'Error adding news', error });
  }
};

// ✅ Edit news
exports.updateNews = async (req, res) => {
  try {
    const updated = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'News not found' });
    res.status(200).json({ message: 'News updated successfully', news: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating news', error });
  }
};

// ✅ Delete news
exports.deleteNews = async (req, res) => {
  try {
    const deleted = await News.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'News not found' });
    res.status(200).json({ message: 'News deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting news', error });
  }
};
