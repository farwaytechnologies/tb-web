const SecurityLog = require('../models/SecurityLog');

// GET /api/security/logs
exports.getLogs = async (req, res) => {
  try {
    const { limit = 100, event, severity, ip } = req.query;
    const filter = {};
    if (event)    filter.event    = event;
    if (severity) filter.severity = severity;
    if (ip)       filter.ip       = ip;

    const logs = await SecurityLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch logs' });
  }
};

// GET /api/security/stats
exports.getStats = async (req, res) => {
  try {
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const since7d  = new Date(Date.now() - 7  * 24 * 60 * 60 * 1000);

    const [
      total24h, blocked24h, critical24h,
      byEvent, bySeverity, byCountry,
      topIps, recentCritical,
      dailyTrend,
    ] = await Promise.all([
      SecurityLog.countDocuments({ createdAt: { $gte: since24h } }),
      SecurityLog.countDocuments({ createdAt: { $gte: since24h }, blocked: true }),
      SecurityLog.countDocuments({ createdAt: { $gte: since24h }, severity: 'critical' }),

      SecurityLog.aggregate([
        { $match: { createdAt: { $gte: since7d } } },
        { $group: { _id: '$event', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      SecurityLog.aggregate([
        { $match: { createdAt: { $gte: since7d } } },
        { $group: { _id: '$severity', count: { $sum: 1 } } },
      ]),

      SecurityLog.aggregate([
        { $match: { createdAt: { $gte: since7d }, country: { $ne: '' } } },
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      SecurityLog.aggregate([
        { $match: { createdAt: { $gte: since24h }, ip: { $ne: '' } } },
        { $group: { _id: '$ip', count: { $sum: 1 }, country: { $first: '$country' } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      SecurityLog.find({ severity: 'critical' })
        .sort({ createdAt: -1 })
        .limit(5),

      // Last 7 days daily counts
      SecurityLog.aggregate([
        { $match: { createdAt: { $gte: since7d } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
            blocked: { $sum: { $cond: ['$blocked', 1, 0] } },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.json({
      summary: { total24h, blocked24h, critical24h },
      byEvent,
      bySeverity,
      byCountry,
      topIps,
      recentCritical,
      dailyTrend,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};

// DELETE /api/security/logs  (clear old logs)
exports.clearLogs = async (req, res) => {
  try {
    const before = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const result = await SecurityLog.deleteMany({ createdAt: { $lt: before } });
    res.json({ message: `Cleared ${result.deletedCount} old logs.` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear logs' });
  }
};

// POST /api/security/test  (seed a test log — admin only)
exports.seedTestLog = async (req, res) => {
  try {
    await SecurityLog.create({
      event: 'FAILED_LOGIN',
      severity: 'medium',
      ip: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'test',
      path: '/api/auth/login',
      method: 'POST',
      email: 'test@example.com',
      details: 'Test log entry',
      country: 'IN',
      blocked: false,
    });
    res.json({ message: 'Test log created.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create test log' });
  }
};
