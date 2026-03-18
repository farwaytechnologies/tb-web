const Exam = require('../models/Exam');

// GET all exams (public list, no answers)
exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find({ active: true })
      .select('-questions.correctIndex -attempts')
      .sort({ createdAt: -1 });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exams' });
  }
};

// GET single exam for taking (no correct answers exposed)
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).select('-questions.correctIndex -attempts');
    if (!exam) return res.status(404).json({ error: 'Exam not found' });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exam' });
  }
};

// GET all exams with answers (admin/tutor)
exports.getAllExamsFull = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ createdAt: -1 });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exams' });
  }
};

// POST create exam
exports.createExam = async (req, res) => {
  try {
    const exam = new Exam(req.body);
    await exam.save();
    res.status(201).json(exam);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create exam' });
  }
};

// PUT update exam
exports.updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!exam) return res.status(404).json({ error: 'Exam not found' });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update exam' });
  }
};

// DELETE exam
exports.deleteExam = async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    res.json({ message: 'Exam deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete exam' });
  }
};

// POST submit attempt
exports.submitAttempt = async (req, res) => {
  try {
    const { userId, userName, answers } = req.body;
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    // Check already attempted
    const already = exam.attempts.find(a => a.userId?.toString() === userId);
    if (already) {
      return res.status(400).json({ error: 'You have already attempted this exam.' });
    }

    // Grade
    let score = 0;
    exam.questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) score++;
    });

    const total = exam.questions.length;
    const percent = total > 0 ? Math.round((score / total) * 100) : 0;
    const passed = percent >= exam.passMark;

    exam.attempts.push({ userId, userName, answers, score, total, submittedAt: new Date() });
    await exam.save();

    res.json({ score, total, percent, passed, passMark: exam.passMark });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit exam' });
  }
};

// GET results for a user
exports.getUserResults = async (req, res) => {
  try {
    const exams = await Exam.find({ 'attempts.userId': req.params.userId })
      .select('title courseName duration passMark attempts');
    const results = exams.map(e => {
      const attempt = e.attempts.find(a => a.userId?.toString() === req.params.userId);
      return {
        examId: e._id,
        title: e.title,
        courseName: e.courseName,
        score: attempt?.score,
        total: attempt?.total,
        percent: attempt?.total ? Math.round((attempt.score / attempt.total) * 100) : 0,
        passed: attempt?.total ? Math.round((attempt.score / attempt.total) * 100) >= e.passMark : false,
        passMark: e.passMark,
        submittedAt: attempt?.submittedAt,
      };
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch results' });
  }
};
