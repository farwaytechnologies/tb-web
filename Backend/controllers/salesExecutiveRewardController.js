const SalesExecutiveReward = require('../models/SalesExecutiveReward');

const BORGCOINS_PER_REFERRAL = 25;

// Award BorgCoins when a referral signs up (called from authController register)
exports.awardReferralPoints = async (referrerId, refereeName) => {
  try {
    let reward = await SalesExecutiveReward.findOne({ userId: referrerId });
    if (!reward) reward = new SalesExecutiveReward({ userId: referrerId });
    reward.borgCoins += BORGCOINS_PER_REFERRAL;
    reward.history.push({ borgCoins: BORGCOINS_PER_REFERRAL, reason: `Referral: ${refereeName} joined` });
    await reward.save();
  } catch (err) {
    console.error('Award SE BorgCoins error:', err);
  }
};

// GET /api/se-rewards/:userId
exports.getReward = async (req, res) => {
  try {
    let reward = await SalesExecutiveReward.findOne({ userId: req.params.userId });
    if (!reward) reward = new SalesExecutiveReward({ userId: req.params.userId });
    const pendingLocked = reward.withdrawals
      .filter(w => w.status === 'pending')
      .reduce((s, w) => s + w.borgCoins, 0);
    const available = reward.borgCoins - reward.borgCoinsWithdrawn - pendingLocked;
    res.json({ ...reward.toObject(), available });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/se-rewards/:userId/withdraw
exports.requestWithdrawal = async (req, res) => {
  try {
    const { borgCoins, upiId, bankDetails } = req.body;
    if (!borgCoins || borgCoins < 1) return res.status(400).json({ message: 'Invalid amount.' });
    if (!upiId && !bankDetails) return res.status(400).json({ message: 'Provide UPI ID or bank details.' });

    let reward = await SalesExecutiveReward.findOne({ userId: req.params.userId });
    if (!reward) reward = new SalesExecutiveReward({ userId: req.params.userId });

    const pendingLocked = reward.withdrawals
      .filter(w => w.status === 'pending')
      .reduce((s, w) => s + w.borgCoins, 0);
    const available = reward.borgCoins - reward.borgCoinsWithdrawn - pendingLocked;
    if (borgCoins > available) return res.status(400).json({ message: `Insufficient BorgCoins. Available: ${available}` });

    reward.withdrawals.push({ borgCoins, upiId: upiId || '', bankDetails: bankDetails || '' });
    await reward.save();
    res.json({ message: 'Withdrawal request submitted.', available: available - borgCoins });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/se-rewards/admin/all
exports.getAllRewards = async (req, res) => {
  try {
    const rewards = await SalesExecutiveReward.find().populate('userId', 'name email referralCode');
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/se-rewards/admin/withdraw/:rewardId/:withdrawId
exports.resolveWithdrawal = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    if (!['approved', 'rejected'].includes(status))
      return res.status(400).json({ message: 'Invalid status.' });

    const reward = await SalesExecutiveReward.findById(req.params.rewardId);
    if (!reward) return res.status(404).json({ message: 'Reward not found.' });

    const w = reward.withdrawals.id(req.params.withdrawId);
    if (!w) return res.status(404).json({ message: 'Withdrawal not found.' });
    if (w.status !== 'pending') return res.status(400).json({ message: 'Already resolved.' });

    w.status = status;
    w.adminNote = adminNote || '';
    w.resolvedAt = new Date();
    if (status === 'approved') reward.borgCoinsWithdrawn += w.borgCoins;
    await reward.save();
    res.json({ message: `Withdrawal ${status}.` });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
