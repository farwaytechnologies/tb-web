const User = require('../models/user');
const { BorgCoinWallet, Withdrawal } = require('../models/BorgCoin');

// GET /api/se-report/:userId
exports.getSEReport = async (req, res) => {
  try {
    const uid = req.params.userId;

    const [se, allUsers, wallet, withdrawals] = await Promise.all([
      User.findById(uid).select('name email referralCode createdAt'),
      User.find({ referredBy: uid }).select('name email role createdAt').sort({ createdAt: -1 }),
      BorgCoinWallet.findOne({ tutorId: uid }),
      Withdrawal.find({ tutorId: uid }).sort({ requestedAt: -1 }),
    ]);

    if (!se) return res.status(404).json({ message: 'User not found.' });

    // Monthly breakdown — last 12 months
    const now = new Date();
    const monthly = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      const refs = allUsers.filter(u => {
        const cd = new Date(u.createdAt);
        return cd >= d && cd < next;
      });
      return {
        month: d.toLocaleString('default', { month: 'short', year: '2-digit' }),
        total: refs.length,
        students: refs.filter(u => u.role === 'student').length,
        tutors: refs.filter(u => u.role === 'tutor').length,
        borgCoinsEarned: refs.length * 25,
      };
    });

    // Role breakdown
    const roleBreakdown = {
      student: allUsers.filter(u => u.role === 'student').length,
      tutor: allUsers.filter(u => u.role === 'tutor').length,
    };

    // Withdrawal summary
    const withdrawalSummary = {
      total: withdrawals.length,
      approved: withdrawals.filter(w => w.status === 'approved').reduce((s, w) => s + w.borgCoins, 0),
      pending: withdrawals.filter(w => w.status === 'pending').reduce((s, w) => s + w.borgCoins, 0),
      rejected: withdrawals.filter(w => w.status === 'rejected').reduce((s, w) => s + w.borgCoins, 0),
    };

    res.json({
      se,
      referrals: allUsers,
      monthly,
      roleBreakdown,
      wallet: wallet || { borgCoins: 0, totalEarned: 0, totalWithdrawn: 0 },
      withdrawalSummary,
      withdrawals,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
