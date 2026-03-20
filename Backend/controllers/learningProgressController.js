const LearningProgress = require('../models/LearningProgress');
const Enrollment = require('../models/Enrollment');

// GET /api/progress/:userId
exports.getUserProgress = async (req, res) => {
  try {
    const progress = await LearningProgress.find({ userId: req.params.userId })
      .populate('courseId', 'title image modules instructor level');
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/progress/:userId/:courseId
exports.getCourseProgress = async (req, res) => {
  try {
    const progress = await LearningProgress.findOne({
      userId: req.params.userId,
      courseId: req.params.courseId,
    });
    res.json(progress || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/progress/mark
exports.markLesson = async (req, res) => {
  try {
    const { userId, courseId, enrollmentId, lessonKey, totalLessons } = req.body;
    if (!userId || !courseId || !enrollmentId || !lessonKey) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let progress = await LearningProgress.findOne({ userId, courseId });

    if (!progress) {
      progress = new LearningProgress({ userId, courseId, enrollmentId, completedLessons: [], totalLessons: totalLessons || 0 });
    }

    if (!progress.completedLessons.includes(lessonKey)) {
      progress.completedLessons.push(lessonKey);
    }

    if (totalLessons) progress.totalLessons = totalLessons;

    const total = progress.totalLessons || 1;
    progress.progressPercent = Math.round((progress.completedLessons.length / total) * 100);
    progress.lastAccessedAt = new Date();

    if (progress.progressPercent >= 100 && !progress.completedAt) {
      progress.completedAt = new Date();
      await Enrollment.findByIdAndUpdate(enrollmentId, {
        $set: { completed: true, completedAt: new Date() }
      });
    }

    await progress.save();
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/progress/unmark
exports.unmarkLesson = async (req, res) => {
  try {
    const { userId, courseId, lessonKey, totalLessons } = req.body;
    const progress = await LearningProgress.findOne({ userId, courseId });
    if (!progress) return res.json({});

    progress.completedLessons = progress.completedLessons.filter(k => k !== lessonKey);
    if (totalLessons) progress.totalLessons = totalLessons;
    const total = progress.totalLessons || 1;
    progress.progressPercent = Math.round((progress.completedLessons.length / total) * 100);
    if (progress.progressPercent < 100) progress.completedAt = null;
    progress.lastAccessedAt = new Date();

    await progress.save();
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
