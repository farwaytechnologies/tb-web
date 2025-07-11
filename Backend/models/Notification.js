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
    type: String, // or type: Date
    required: true,
  },
});

module.exports = mongoose.model('Notification', notificationSchema);
