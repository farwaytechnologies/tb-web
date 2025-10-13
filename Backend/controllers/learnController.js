const LearnTopic = require("../models/LearnTopic");

// GET all topics
exports.getAllTopics = async (req, res) => {
  try {
    const topics = await LearnTopic.find().sort({ createdAt: -1 });
    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch topics" });
  }
};

// GET topic by ID
exports.getTopicById = async (req, res) => {
  try {
    const topic = await LearnTopic.findById(req.params.id);
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    res.status(200).json(topic);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch topic" });
  }
};

// CREATE topic
exports.createTopic = async (req, res) => {
  try {
    const { title, description, detailedContent, link } = req.body;
    const image = req.file ? req.file.filename : null;

    const newTopic = new LearnTopic({ title, description, detailedContent, link, image });
    await newTopic.save();
    res.status(201).json(newTopic);
  } catch (error) {
    res.status(500).json({ message: "Failed to create topic" });
  }
};

// UPDATE topic
exports.updateTopic = async (req, res) => {
  try {
    const { title, description, detailedContent, link } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const updatedTopic = await LearnTopic.findByIdAndUpdate(
      req.params.id,
      { title, description, detailedContent, link, ...(image && { image }) },
      { new: true }
    );

    if (!updatedTopic) return res.status(404).json({ message: "Topic not found" });
    res.status(200).json(updatedTopic);
  } catch (error) {
    res.status(500).json({ message: "Failed to update topic" });
  }
};

// DELETE topic
exports.deleteTopic = async (req, res) => {
  try {
    const deletedTopic = await LearnTopic.findByIdAndDelete(req.params.id);
    if (!deletedTopic) return res.status(404).json({ message: "Topic not found" });
    res.status(200).json({ message: "Topic deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete topic" });
  }
};
