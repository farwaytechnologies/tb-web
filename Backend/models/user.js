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
  phone: { type: String, default: '' },
  bio: { type: String, default: '' },
  website: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  twitter: { type: String, default: '' },
  profilePic: { type: String, default: '' },
  language: { type: String, default: 'en' },
  theme: { type: String, default: 'light' },
  showProfile: { type: Boolean, default: true },
  emailNotifications: { type: Boolean, default: true },
  bankDetails: {
    accountHolderName: { type: String, default: '' },
    accountNumber:     { type: String, default: '' },
    ifscCode:          { type: String, default: '' },
    bankName:          { type: String, default: '' },
    branchName:        { type: String, default: '' },
    upiId:             { type: String, default: '' },
    accountType:       { type: String, default: '' },
  },
  referralCode: { type: String, unique: true, sparse: true },
  referredBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
