const mongoose = require('mongoose');

const studentRewardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  points: { type: Number, default: 0 },
  history: [
    {
      points: { type: Number },
      reason: { type: String },
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null },
      date: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('StudentReward', studentRewardSchema);
