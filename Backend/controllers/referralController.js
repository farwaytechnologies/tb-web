const User = require('../models/user');
const StudentReward = require('../models/StudentReward');
const TutorReward = require('../models/TutorReward');

// GET /api/referral/:userId
exports.getReferralInfo = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('referralCode role name');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const referred = await User.find({ referredBy: user._id }).select('name email role createdAt');

    let pointsFromReferrals = 0;
    if (user.role === 'student') {
      const reward = await StudentReward.findOne({ userId: user._id });
      if (reward) {
        pointsFromReferrals = reward.history
          .filter(h => h.reason?.startsWith('Referral:'))
          .reduce((sum, h) => sum + h.points, 0);
      }
    } else if (user.role === 'tutor') {
      const reward = await TutorReward.findOne({ tutorId: user._id });
      if (reward) {
        pointsFromReferrals = reward.bonusHistory
          .filter(h => h.reason?.startsWith('Referral:'))
          .reduce((sum, h) => sum + h.bonus, 0);
      }
    }

    res.json({
      referralCode: user.referralCode || '',
      referralCount: referred.length,
      pointsFromReferrals,
      referredUsers: referred,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
