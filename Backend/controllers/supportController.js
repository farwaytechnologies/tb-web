const SupportCategory = require('../models/SupportCategory');

exports.getCategories = async (req, res) => {
  try {
    const categories = await SupportCategory.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { title, description, subcategories, icon } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const category = new SupportCategory({ title, description, subcategories, icon });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { title, description, subcategories, icon } = req.body;
    const category = await SupportCategory.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, subcategories, icon } },
      { new: true }
    );
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await SupportCategory.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
