const Notification = require('../models/Notification');

// GET all notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ date: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: err });
  }
};

// POST a new notification
exports.createNotification = async (req, res) => {
  try {
    const { title, message, date, isRead = false } = req.body;

    if (!title || !message || !date) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newNotification = new Notification({ title, message, date, isRead });
    await newNotification.save();

    res.status(201).json({ message: 'Notification created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create notification', error: err });
  }
};

// DELETE a notification by ID
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete notification', error: err });
  }
};

// PUT - Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { $set: { isRead: true } });
    res.status(200).json({ message: 'All notifications marked as read.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark notifications as read', error: err });
  }
};
