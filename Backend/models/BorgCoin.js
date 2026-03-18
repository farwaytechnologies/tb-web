const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  borgCoins: { type: Number, required: true },
  pointsSpent: { type: Number, required: true },
  amountUSD: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['bank', 'paypal', 'mobile'], required: true },
  paymentDetails: { type: String, required: true }, // account/email/number
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminNote: { type: String, default: '' },
  requestedAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
});

const borgCoinSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  borgCoins: { type: Number, default: 0 },          // available balance
  totalEarned: { type: Number, default: 0 },         // lifetime earned
  totalWithdrawn: { type: Number, default: 0 },      // lifetime withdrawn
  lastSynced: { type: Date, default: Date.now }
});

const settingsSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  value: { type: mongoose.Schema.Types.Mixed }
});

module.exports = {
  BorgCoinWallet: mongoose.model('BorgCoinWallet', borgCoinSchema),
  Withdrawal: mongoose.model('Withdrawal', withdrawalSchema),
  BorgCoinSettings: mongoose.model('BorgCoinSettings', settingsSchema)
};
