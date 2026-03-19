const Notification = require('../models/Notification');
const User = require('../models/user');

// GET all notifications (with readBy count)
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ date: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: err });
  }
};

// GET notification read stats (admin) — returns each notification with readers list
exports.getReadStats = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ date: -1 })
      .populate('readBy', 'name email role');
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch read stats', error: err });
  }
};

// POST create notification
exports.createNotification = async (req, res) => {
  try {
    const { title, message } = req.body;
    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required.' });
    }
    const newNotification = new Notification({ title, message });
    await newNotification.save();
    res.status(201).json({ message: 'Notification created successfully', notification: newNotification });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create notification', error: err });
  }
};

// DELETE notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete notification', error: err });
  }
};

// PUT mark all as read for a user
exports.markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId is required.' });
    await Notification.updateMany(
      { readBy: { $ne: userId } },
      { $addToSet: { readBy: userId } }
    );
    res.status(200).json({ message: 'All notifications marked as read.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark notifications as read', error: err });
  }
};

// PATCH mark one as read for a user
exports.markOneAsRead = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId is required.' });
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { readBy: userId } },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark notification as read', error: err });
  }
};
