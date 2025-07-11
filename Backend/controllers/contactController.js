const ContactMessage = require('../models/ContactMessage');

// POST /api/contact - Submit contact message (Public)
exports.submitMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newMessage = new ContactMessage({ name, email, phone, message });
    await newMessage.save();

    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message.', error });
  }
};

// GET /api/contact - View all messages (Admin)
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages.', error });
  }
};

/// DELETE /api/contact/:id - Delete a single message by ID
exports.deleteSingleMessage = async (req, res) => {
  try {
    const deleted = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Message not found.' });
    }
    res.status(200).json({ message: 'Message deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete message.', error });
  }
};
