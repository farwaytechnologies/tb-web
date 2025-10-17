const News = require('../models/News');

// ✅ Get all news
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Error fetching news', error });
  }
};

// ✅ Get a single news item by ID
exports.getNewsById = async (req, res) => {
  try {
    const newsItem = await News.findById(req.params.id);
    if (!newsItem) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.status(200).json(newsItem);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Error fetching news', error });
  }
};

// ✅ Add a new news item
exports.addNews = async (req, res) => {
  try {
    const { title, date, content, category, image } = req.body;

    // Optional: Basic validation
    if (!title || !date) {
      return res.status(400).json({ message: 'Title and date are required' });
    }

    const newNews = new News({ title, date, content, category, image });
    await newNews.save();

    res.status(201).json({ message: 'News added successfully', news: newNews });
  } catch (error) {
    console.error('Error adding news:', error);
    res.status(500).json({ message: 'Error adding news', error });
  }
};

// ✅ Update a news item by ID
exports.updateNews = async (req, res) => {
  try {
    const updatedNews = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedNews) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.status(200).json({ message: 'News updated successfully', news: updatedNews });
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ message: 'Error updating news', error });
  }
};

// ✅ Delete a news item by ID
exports.deleteNews = async (req, res) => {
  try {
    const deletedNews = await News.findByIdAndDelete(req.params.id);

    if (!deletedNews) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.status(200).json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ message: 'Error deleting news', error });
  }
};
