const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date, // Better to use Date instead of String
    default: Date.now,
  },
  isRead: {
    type: Boolean,
    default: false, // Indicates the notification is unread by default
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
