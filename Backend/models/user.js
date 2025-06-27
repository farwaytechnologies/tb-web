const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'tutor', 'admin'], default: 'student' },
  title: { type: String, default: '' },
  firstName: { type: String, default: '' },
  middleName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  gender: { type: String, default: '' },
  profilePic: { type: String, default: '' },
  language: { type: String, default: 'en' },
  theme: { type: String, default: 'light' },
  showProfile: { type: Boolean, default: true },
  emailNotifications: { type: Boolean, default: true }
});

module.exports = mongoose.model('User', userSchema);
