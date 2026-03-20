const StudentReward = require('../models/StudentReward');

const BADGES = [
  { name: '🌱 Beginner',     minPoints: 0   },
  { name: '📚 Learner',      minPoints: 50  },
  { name: '⭐ Scholar',      minPoints: 150 },
  { name: '🔥 Achiever',     minPoints: 300 },
  { name: '🏆 Champion',     minPoints: 500 },
];

function getCurrentBadge(points) {
  return [...BADGES].reverse().find(b => points >= b.minPoints) || BADGES[0];
}

// GET /api/student-rewards/:userId
exports.getStudentReward = async (req, res) => {
  try {
    let reward = await StudentReward.findOne({ userId: req.params.userId })
      .populate('history.courseId', 'title');

    if (!reward) {
      reward = { userId: req.params.userId, points: 0, history: [] };
    }

    const points = reward.points || 0;
    const badge = getCurrentBadge(points);
    const nextBadge = BADGES.find(b => b.minPoints > points) || null;

    res.json({ ...reward.toObject?.() ?? reward, badge, nextBadge, allBadges: BADGES });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
