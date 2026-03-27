const { BorgCoinWallet, Withdrawal } = require('../models/BorgCoin');

const BORGCOINS_PER_REFERRAL = 25;

// Award BorgCoins when a referral signs up (called from authController register)
exports.awardReferralPoints = async (referrerId, refereeName) => {
  try {
    let wallet = await BorgCoinWallet.findOne({ tutorId: referrerId });
    if (!wallet) {
      wallet = new BorgCoinWallet({ tutorId: referrerId, borgCoins: 0, totalEarned: 0, totalWithdrawn: 0 });
    }
    wallet.borgCoins += BORGCOINS_PER_REFERRAL;
    wallet.totalEarned += BORGCOINS_PER_REFERRAL;
    wallet.lastSynced = new Date();
    await wallet.save();
  } catch (err) {
    console.error('Award SE BorgCoins error:', err);
  }
};

// GET /api/se-rewards/:userId
exports.getReward = async (req, res) => {
  try {
    const uid = req.params.userId;
    let wallet = await BorgCoinWallet.findOne({ tutorId: uid });
    if (!wallet) wallet = { tutorId: uid, borgCoins: 0, totalEarned: 0, totalWithdrawn: 0, withdrawals: [] };

    const withdrawals = await Withdrawal.find({ tutorId: uid }).sort({ requestedAt: -1 });
    const pendingLocked = withdrawals.filter(w => w.status === 'pending').reduce((s, w) => s + w.borgCoins, 0);
    const available = (wallet.borgCoins ?? 0);

    res.json({ wallet, withdrawals, available, pendingLocked });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/se-rewards/:userId/withdraw
exports.requestWithdrawal = async (req, res) => {
  try {
    const uid = req.params.userId;
    const { borgCoins, upiId, bankDetails } = req.body;
    if (!borgCoins || borgCoins < 1) return res.status(400).json({ message: 'Invalid amount.' });
    if (!upiId && !bankDetails) return res.status(400).json({ message: 'Provide UPI ID or bank details.' });

    const wallet = await BorgCoinWallet.findOne({ tutorId: uid });
    if (!wallet || wallet.borgCoins < borgCoins)
      return res.status(400).json({ message: `Insufficient BorgCoins. Available: ${wallet?.borgCoins ?? 0}` });

    // Deduct immediately (hold)
    await BorgCoinWallet.findOneAndUpdate(
      { tutorId: uid },
      { $inc: { borgCoins: -borgCoins, totalWithdrawn: borgCoins }, $set: { lastSynced: new Date() } }
    );

    const paymentDetails = upiId || bankDetails;
    const paymentMethod = upiId ? 'mobile' : 'bank';

    // Use BorgCoinSettings for USD rate if available
    const { BorgCoinSettings } = require('../models/BorgCoin');
    const usdSetting = await BorgCoinSettings.findOne({ key: 'usdPerCoin' });
    const usdRate = usdSetting?.value ?? 0.5;

    const withdrawal = await Withdrawal.create({
      tutorId: uid,
      borgCoins,
      pointsSpent: borgCoins,
      amountUSD: parseFloat((borgCoins * usdRate).toFixed(2)),
      paymentMethod,
      paymentDetails,
    });

    res.json({ message: 'Withdrawal request submitted.', withdrawal });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/se-rewards/admin/all  — all SE wallets with pending withdrawals
exports.getAllRewards = async (req, res) => {
  try {
    // Get all sales_executive users
    const User = require('../models/user');
    const seUsers = await User.find({ role: 'sales_executive' }).select('_id name email referralCode');
    const seIds = seUsers.map(u => u._id);

    const [wallets, withdrawals] = await Promise.all([
      BorgCoinWallet.find({ tutorId: { $in: seIds } }),
      Withdrawal.find({ tutorId: { $in: seIds } }).sort({ requestedAt: -1 }),
    ]);

    const walletMap = Object.fromEntries(wallets.map(w => [String(w.tutorId), w]));
    const withdrawalMap = {};
    withdrawals.forEach(w => {
      const key = String(w.tutorId);
      if (!withdrawalMap[key]) withdrawalMap[key] = [];
      withdrawalMap[key].push(w);
    });

    const result = seUsers.map(u => ({
      userId: u,
      wallet: walletMap[String(u._id)] || { borgCoins: 0, totalEarned: 0, totalWithdrawn: 0 },
      withdrawals: withdrawalMap[String(u._id)] || [],
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/se-rewards/admin/withdraw/:withdrawId
exports.resolveWithdrawal = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    if (!['approved', 'rejected'].includes(status))
      return res.status(400).json({ message: 'Invalid status.' });

    const w = await Withdrawal.findById(req.params.withdrawId);
    if (!w) return res.status(404).json({ message: 'Withdrawal not found.' });
    if (w.status !== 'pending') return res.status(400).json({ message: 'Already resolved.' });

    // If rejected, refund coins
    if (status === 'rejected') {
      await BorgCoinWallet.findOneAndUpdate(
        { tutorId: w.tutorId },
        { $inc: { borgCoins: w.borgCoins, totalWithdrawn: -w.borgCoins } }
      );
    }

    w.status = status;
    w.adminNote = adminNote || '';
    w.resolvedAt = new Date();
    await w.save();

    res.json({ message: `Withdrawal ${status}.` });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
