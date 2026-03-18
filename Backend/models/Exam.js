const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true }, // index of correct option
});

const attemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: String,
  answers: [Number], // selected option index per question
  score: Number,
  total: Number,
  submittedAt: { type: Date, default: Date.now },
});

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null },
  courseName: { type: String, default: '' },
  duration: { type: Number, default: 30 }, // minutes
  passMark: { type: Number, default: 50 },  // percentage
  questions: [questionSchema],
  attempts: [attemptSchema],
  createdBy: { type: String, default: '' },
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
