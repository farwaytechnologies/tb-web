const mongoose = require('mongoose');

const securityLogSchema = new mongoose.Schema({
  event:      { type: String, required: true }, // FAILED_LOGIN, RATE_LIMITED, BLOCKED, SUSPICIOUS_INPUT, etc.
  severity:   { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  ip:         { type: String, default: '' },
  userAgent:  { type: String, default: '' },
  path:       { type: String, default: '' },
  method:     { type: String, default: '' },
  userId:     { type: String, default: '' },
  email:      { type: String, default: '' },
  details:    { type: String, default: '' },
  country:    { type: String, default: '' },
  blocked:    { type: Boolean, default: false },
}, { timestamps: true });

// Index for fast queries
securityLogSchema.index({ createdAt: -1 });
securityLogSchema.index({ ip: 1 });
securityLogSchema.index({ event: 1 });

module.exports = mongoose.model('SecurityLog', securityLogSchema);
