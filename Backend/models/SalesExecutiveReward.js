const mongoose = require('mongoose');

const withdrawSchema = new mongoose.Schema({
  borgCoins: { type: Number, required: true },
  upiId: { type: String, default: '' },
  bankDetails: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminNote: { type: String, default: '' },
  requestedAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date },
});

const salesExecutiveRewardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  borgCoins: { type: Number, default: 0 },           // total earned
  borgCoinsWithdrawn: { type: Number, default: 0 },  // total approved withdrawals
  history: [
    {
      borgCoins: { type: Number },
      reason: { type: String },
      date: { type: Date, default: Date.now },
    }
  ],
  withdrawals: [withdrawSchema],
}, { timestamps: true });

module.exports = mongoose.model('SalesExecutiveReward', salesExecutiveRewardSchema);
