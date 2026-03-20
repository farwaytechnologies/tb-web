const User = require('../models/user');
const StudentReward = require('../models/StudentReward');
const TutorReward = require('../models/TutorReward');
const crypto = require('crypto');

function generateReferralCode() {
  return 'TB-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

// GET /api/referral/:userId
exports.getReferralInfo = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('referralCode role name');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Backfill code if missing
    if (!user.referralCode) {
      let code;
      do { code = generateReferralCode(); } while (await User.findOne({ referralCode: code }));
      user.referralCode = code;
      await user.save();
    }

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
      referralCode: user.referralCode,
      referralCount: referred.length,
      pointsFromReferrals,
      referredUsers: referred,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/referral/admin/all  — all users with referral stats
exports.getAllReferrals = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['student', 'tutor'] } })
      .select('name email role referralCode referredBy createdAt profilePic');

    // Backfill missing codes
    for (const u of users) {
      if (!u.referralCode) {
        let code;
        do { code = generateReferralCode(); } while (await User.findOne({ referralCode: code }));
        u.referralCode = code;
        await u.save();
      }
    }

    // Build referral count map
    const countMap = {};
    for (const u of users) {
      if (u.referredBy) {
        const key = String(u.referredBy);
        countMap[key] = (countMap[key] || 0) + 1;
      }
    }

    const result = users.map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      profilePic: u.profilePic || '',
      referralCode: u.referralCode,
      referralCount: countMap[String(u._id)] || 0,
      referredBy: u.referredBy || null,
      joinedAt: u.createdAt,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
