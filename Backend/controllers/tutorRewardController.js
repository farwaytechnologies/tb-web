const TutorReward = require('../models/TutorReward');

// Points config
const POINTS = {
  perCourse: 50,
  perBlog: 20,
  perEnrollment: 10,
  perLearnContent: 15
};

// Badge thresholds (ordered ascending)
const BADGES = [
  { name: '🌱 Newcomer', minPoints: 0 },
  { name: '⭐ Rising Star', minPoints: 100 },
  { name: '🔥 Active Tutor', minPoints: 300 },
  { name: '🏆 Top Educator', minPoints: 600 },
  { name: '💎 Elite Mentor', minPoints: 1000 }
];

function computeBadges(points) {
  return BADGES.filter(b => points >= b.minPoints).map(b => b.name);
}

/**
 * POST /api/rewards/tutor/:tutorId
 * Body: { courses, blogs, enrollments, learnContent }
 * Computes points & badges, upserts reward record, returns full data.
 */
exports.saveTutorRewards = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const { courses = 0, blogs = 0, enrollments = 0, learnContent = 0 } = req.body;

    const breakdown = { courses, blogs, enrollments, learnContent };

    const points =
      courses * POINTS.perCourse +
      blogs * POINTS.perBlog +
      enrollments * POINTS.perEnrollment +
      learnContent * POINTS.perLearnContent;

    const badges = computeBadges(points);

    const reward = await TutorReward.findOneAndUpdate(
      { tutorId },
      { points, badges, breakdown, lastUpdated: new Date() },
      { upsert: true, new: true }
    );

    res.json({ ...reward.toObject(), pointsConfig: POINTS, allBadges: BADGES });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/rewards/leaderboard — top tutors by points
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await TutorReward.find()
      .sort({ points: -1 })
      .limit(10)
      .populate('tutorId', 'name profilePic');
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
