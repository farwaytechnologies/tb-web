const { BorgCoinWallet, Withdrawal, BorgCoinSettings } = require('../models/BorgCoin');
const TutorReward = require('../models/TutorReward');

const DEFAULT_RATE = 10;      // points per 1 BorgCoin
const DEFAULT_USD_RATE = 0.5; // 1 BorgCoin = $0.50
const MIN_WITHDRAWAL = 10;    // minimum BorgCoins to withdraw

async function getSettings() {
  const [rate, usdRate, minW] = await Promise.all([
    BorgCoinSettings.findOne({ key: 'pointsPerCoin' }),
    BorgCoinSettings.findOne({ key: 'usdPerCoin' }),
    BorgCoinSettings.findOne({ key: 'minWithdrawal' })
  ]);
  return {
    pointsPerCoin: rate?.value ?? DEFAULT_RATE,
    usdPerCoin: usdRate?.value ?? DEFAULT_USD_RATE,
    minWithdrawal: minW?.value ?? MIN_WITHDRAWAL
  };
}

// GET /api/borgcoins/wallet/:tutorId
// Returns wallet + settings so tutor knows conversion rate
exports.getWallet = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const settings = await getSettings();

    // Get current reward points
    const reward = await TutorReward.findOne({ tutorId });
    const totalPoints = (reward?.points || 0) + (reward?.bonusPoints || 0);

    // Sync wallet: available coins = floor(totalPoints / rate) - totalWithdrawn
    let wallet = await BorgCoinWallet.findOne({ tutorId });
    const earnedCoins = Math.floor(totalPoints / settings.pointsPerCoin);

    if (!wallet) {
      wallet = await BorgCoinWallet.create({
        tutorId,
        borgCoins: earnedCoins,
        totalEarned: earnedCoins,
        totalWithdrawn: 0,
        lastSynced: new Date()
      });
    } else {
      const available = Math.max(0, earnedCoins - wallet.totalWithdrawn);
      wallet = await BorgCoinWallet.findOneAndUpdate(
        { tutorId },
        { borgCoins: available, totalEarned: earnedCoins, lastSynced: new Date() },
        { new: true }
      );
    }

    const withdrawals = await Withdrawal.find({ tutorId }).sort({ requestedAt: -1 });

    res.json({ wallet, settings, totalPoints, withdrawals });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/borgcoins/withdraw
// Body: { tutorId, borgCoins, paymentMethod, paymentDetails }
exports.requestWithdrawal = async (req, res) => {
  try {
    const { tutorId, borgCoins, paymentMethod, paymentDetails } = req.body;
    if (!tutorId || !borgCoins || !paymentMethod || !paymentDetails) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const settings = await getSettings();

    if (borgCoins < settings.minWithdrawal) {
      return res.status(400).json({ message: `Minimum withdrawal is ${settings.minWithdrawal} BorgCoins.` });
    }

    const wallet = await BorgCoinWallet.findOne({ tutorId });
    if (!wallet || wallet.borgCoins < borgCoins) {
      return res.status(400).json({ message: 'Insufficient BorgCoin balance.' });
    }

    const amountUSD = parseFloat((borgCoins * settings.usdPerCoin).toFixed(2));
    const pointsSpent = borgCoins * settings.pointsPerCoin;

    // Deduct from wallet immediately (hold)
    await BorgCoinWallet.findOneAndUpdate(
      { tutorId },
      { $inc: { borgCoins: -borgCoins, totalWithdrawn: borgCoins } }
    );

    const withdrawal = await Withdrawal.create({
      tutorId, borgCoins, pointsSpent, amountUSD, paymentMethod, paymentDetails
    });

    res.status(201).json({ message: 'Withdrawal request submitted.', withdrawal });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/borgcoins/admin/withdrawals
// All withdrawal requests for admin
exports.getAllWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find()
      .sort({ requestedAt: -1 })
      .populate('tutorId', 'name email profilePic');
    res.json(withdrawals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/borgcoins/admin/withdrawal/:id
// Body: { status: 'approved'|'rejected', adminNote }
exports.resolveWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote = '' } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const withdrawal = await Withdrawal.findById(id);
    if (!withdrawal) return res.status(404).json({ message: 'Withdrawal not found.' });
    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ message: 'Already resolved.' });
    }

    // If rejected, refund the coins
    if (status === 'rejected') {
      await BorgCoinWallet.findOneAndUpdate(
        { tutorId: withdrawal.tutorId },
        { $inc: { borgCoins: withdrawal.borgCoins, totalWithdrawn: -withdrawal.borgCoins } }
      );
    }

    const updated = await Withdrawal.findByIdAndUpdate(
      id,
      { status, adminNote, resolvedAt: new Date() },
      { new: true }
    ).populate('tutorId', 'name email');

    res.json({ message: `Withdrawal ${status}.`, withdrawal: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/borgcoins/admin/settings
exports.getAdminSettings = async (req, res) => {
  try {
    const settings = await getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/borgcoins/admin/settings
// Body: { pointsPerCoin, usdPerCoin, minWithdrawal }
exports.updateSettings = async (req, res) => {
  try {
    const { pointsPerCoin, usdPerCoin, minWithdrawal } = req.body;
    const ops = [];
    if (pointsPerCoin) ops.push(BorgCoinSettings.findOneAndUpdate({ key: 'pointsPerCoin' }, { value: pointsPerCoin }, { upsert: true }));
    if (usdPerCoin) ops.push(BorgCoinSettings.findOneAndUpdate({ key: 'usdPerCoin' }, { value: usdPerCoin }, { upsert: true }));
    if (minWithdrawal) ops.push(BorgCoinSettings.findOneAndUpdate({ key: 'minWithdrawal' }, { value: minWithdrawal }, { upsert: true }));
    await Promise.all(ops);
    res.json({ message: 'Settings updated.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
