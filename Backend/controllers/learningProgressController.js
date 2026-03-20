const LearningProgress = require('../models/LearningProgress');
const Enrollment = require('../models/Enrollment');
const StudentReward = require('../models/StudentReward');

const LESSON_POINTS = 10;      // points per lesson marked complete
const COMPLETION_POINTS = 100; // bonus when course hits 100%

async function awardPoints(userId, points, reason, courseId) {
  try {
    let reward = await StudentReward.findOne({ userId });
    if (!reward) {
      reward = new StudentReward({ userId, points: 0, history: [] });
    }
    reward.points += points;
    reward.history.push({ points, reason, courseId: courseId || null, date: new Date() });
    await reward.save();
  } catch (err) {
    console.error('awardPoints error:', err);
  }
}

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
      progress = new LearningProgress({
        userId, courseId, enrollmentId,
        completedLessons: [], totalLessons: totalLessons || 0
      });
    }

    const alreadyDone = progress.completedLessons.includes(lessonKey);

    if (!alreadyDone) {
      progress.completedLessons.push(lessonKey);
      // Award lesson points only for new completions
      await awardPoints(userId, LESSON_POINTS, `Lesson completed`, courseId);
    }

    if (totalLessons) progress.totalLessons = totalLessons;
    const total = progress.totalLessons || 1;
    progress.progressPercent = Math.round((progress.completedLessons.length / total) * 100);
    progress.lastAccessedAt = new Date();

    // Award course completion bonus once
    if (progress.progressPercent >= 100 && !progress.completedAt) {
      progress.completedAt = new Date();
      await Enrollment.findByIdAndUpdate(enrollmentId, {
        $set: { completed: true, completedAt: new Date() }
      });
      await awardPoints(userId, COMPLETION_POINTS, 'Course completed', courseId);
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

    const wasDone = progress.completedLessons.includes(lessonKey);
    progress.completedLessons = progress.completedLessons.filter(k => k !== lessonKey);

    if (totalLessons) progress.totalLessons = totalLessons;
    const total = progress.totalLessons || 1;
    progress.progressPercent = Math.round((progress.completedLessons.length / total) * 100);
    if (progress.progressPercent < 100) progress.completedAt = null;
    progress.lastAccessedAt = new Date();

    // Deduct lesson points if it was previously marked done
    if (wasDone) {
      try {
        let reward = await StudentReward.findOne({ userId });
        if (reward && reward.points >= LESSON_POINTS) {
          reward.points -= LESSON_POINTS;
          reward.history.push({
            points: -LESSON_POINTS,
            reason: 'Lesson unmarked',
            courseId: courseId || null,
            date: new Date()
          });
          await reward.save();
        }
      } catch (err) {
        console.error('Deduct points error:', err);
      }
    }

    await progress.save();
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
