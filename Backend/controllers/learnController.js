const Learn = require('../models/LearnModel');

// CREATE new language
exports.createLanguage = async (req, res) => {
  try {
    const { language, shortDescription, image, modules, createdBy } = req.body;

    const newLang = new Learn({ language, shortDescription, image, modules, createdBy: createdBy || null });
    await newLang.save();

    res.status(201).json(newLang);
  } catch (err) {
    console.error('Error creating language:', err);
    res.status(500).json({ message: 'Error creating language' });
  }
};

// GET all languages
exports.getAllLanguages = async (req, res) => {
  try {
    const languages = await Learn.find().sort({ createdAt: -1 });
    res.json(languages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching languages' });
  }
};

// GET single language by ID
exports.getLanguageById = async (req, res) => {
  try {
    const language = await Learn.findById(req.params.id);
    if (!language) return res.status(404).json({ message: 'Language not found' });
    res.json(language);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching language' });
  }
};

// UPDATE language
exports.updateLanguage = async (req, res) => {
  try {
    const updatedLanguage = await Learn.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedLanguage) return res.status(404).json({ message: 'Language not found' });
    res.json(updatedLanguage);
  } catch (err) {
    console.error('Error updating language:', err);
    res.status(500).json({ message: 'Error updating language' });
  }
};

// DELETE language
exports.deleteLanguage = async (req, res) => {
  try {
    await Learn.findByIdAndDelete(req.params.id);
    res.json({ message: 'Language deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting language' });
  }
};
