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

// DELETE /api/contact/delete-all - Delete all messages (Admin)
exports.deleteAllMessages = async (req, res) => {
  try {
    await ContactMessage.deleteMany({});
    res.status(200).json({ message: 'All messages deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete messages.', error });
  }
};
