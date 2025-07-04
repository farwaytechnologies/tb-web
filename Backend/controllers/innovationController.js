const Innovation = require('../models/Innovation');

// GET all innovations
exports.getAllInnovations = async (req, res) => {
  try {
    const data = await Innovation.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch innovations' });
  }
};

// GET single innovation
exports.getInnovationById = async (req, res) => {
  try {
    const item = await Innovation.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching innovation' });
  }
};

// POST - Create new
exports.createInnovation = async (req, res) => {
  try {
    const newItem = new Innovation(req.body);
    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Error creating innovation' });
  }
};

// PUT - Update
exports.updateInnovation = async (req, res) => {
  try {
    const updated = await Innovation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Error updating innovation' });
  }
};

// DELETE - Remove
exports.deleteInnovation = async (req, res) => {
  try {
    await Innovation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Error deleting innovation' });
  }
};
