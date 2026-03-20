const mongoose = require('mongoose');

const learningProgressSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User',       required: true },
  courseId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Course',     required: true },
  enrollmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment', required: true },

  // Each completed lesson stored as "moduleIndex-videoIndex"
  completedLessons: [{ type: String }],

  // Total lessons in course (cached on first update)
  totalLessons: { type: Number, default: 0 },

  // 0–100
  progressPercent: { type: Number, default: 0 },

  lastAccessedAt: { type: Date, default: Date.now },
  startedAt:      { type: Date, default: Date.now },
  completedAt:    { type: Date, default: null },
}, { timestamps: true });

learningProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('LearningProgress', learningProgressSchema);
