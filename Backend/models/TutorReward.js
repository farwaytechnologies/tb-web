const mongoose = require('mongoose');

const tutorRewardSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  points: { type: Number, default: 0 },
  bonusPoints: { type: Number, default: 0 },
  badges: [{ type: String }],
  breakdown: {
    courses: { type: Number, default: 0 },
    blogs: { type: Number, default: 0 },
    enrollments: { type: Number, default: 0 },
    learnContent: { type: Number, default: 0 }
  },
  bonusHistory: [
    {
      bonus: { type: Number },
      reason: { type: String, default: '' },
      date: { type: Date, default: Date.now }
    }
  ],
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TutorReward', tutorRewardSchema);
