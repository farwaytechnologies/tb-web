const rateLimit = require('express-rate-limit');
const geoip = require('geoip-lite');
const SecurityLog = require('../models/SecurityLog');

function sanitizeValue(val) {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    const clean = {};
    for (const key of Object.keys(val)) {
      if (!key.startsWith('$')) clean[key] = sanitizeValue(val[key]);
    }
    return clean;
  }
  if (Array.isArray(val)) return val.map(sanitizeValue);
  return val;
}

function mongoSanitizeMiddleware(req, res, next) {
  if (req.body) req.body = sanitizeValue(req.body);
  if (req.params) req.params = sanitizeValue(req.params);
  next();
}

function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function xssClean(val) {
  if (typeof val === 'string') return escapeHtml(val);
  if (Array.isArray(val)) return val.map(xssClean);
  if (val && typeof val === 'object') {
    const clean = {};
    for (const key of Object.keys(val)) clean[key] = xssClean(val[key]);
    return clean;
  }
  return val;
}

function xssMiddleware(req, res, next) {
  if (req.body) req.body = xssClean(req.body);
  if (req.params) req.params = xssClean(req.params);
  next();
}

function hppMiddleware(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    for (const key of Object.keys(req.body)) {
      if (Array.isArray(req.body[key])) {
        req.body[key] = req.body[key][req.body[key].length - 1];
      }
    }
  }
  next();
}

const logEvent = async (req, event, severity = 'medium', extra = {}) => {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || '';
    const geo = geoip.lookup(ip);
    await SecurityLog.create({
      event, severity, ip,
      userAgent: req.headers['user-agent'] || '',
      path: req.originalUrl || req.path || '',
      method: req.method || '',
      country: geo?.country || '',
      ...extra,
    });
  } catch (_) {}
};

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 10,
  standardHeaders: true, legacyHeaders: false,
  handler: async (req, res) => {
    await logEvent(req, 'RATE_LIMITED_AUTH', 'high', {
      email: req.body?.email || '', blocked: true, details: 'Too many auth attempts',
    });
    res.status(429).json({ message: 'Too many attempts. Please try again in 15 minutes.' });
  },
});

const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, max: 200,
  standardHeaders: true, legacyHeaders: false,
  handler: async (req, res) => {
    await logEvent(req, 'RATE_LIMITED_API', 'medium', {
      blocked: true, details: 'API rate limit exceeded',
    });
    res.status(429).json({ message: 'Too many requests. Please slow down.' });
  },
});

const adminLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, max: 50,
  standardHeaders: true, legacyHeaders: false,
  handler: async (req, res) => {
    await logEvent(req, 'RATE_LIMITED_ADMIN', 'high', {
      blocked: true, details: 'Admin route rate limit exceeded',
    });
    res.status(429).json({ message: 'Too many admin requests.' });
  },
});

const SUSPICIOUS_PATTERNS = [
  /(\bselect\b|\binsert\b|\bupdate\b|\bdelete\b|\bdrop\b|\bunion\b)/i,
  /<script[\s\S]*?>[\s\S]*?<\/script>/i,
  /\.\.\//,
  /(\$where|\$gt|\$lt|\$ne|\$in|\$nin|\$regex)/,
  /(eval\(|exec\(|system\(|passthru\()/i,
];

const suspiciousInputDetector = async (req, res, next) => {
  const combined = JSON.stringify(req.body || {}) + JSON.stringify(req.query || {});
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(combined)) {
      await logEvent(req, 'SUSPICIOUS_INPUT', 'critical', {
        blocked: true,
        details: `Pattern matched: ${pattern.toString().slice(0, 60)}`,
      });
      return res.status(400).json({ message: 'Invalid request.' });
    }
  }
  next();
};

const logFailedLogin = async (req, email = '') => {
  await logEvent(req, 'FAILED_LOGIN', 'medium', { email, details: 'Invalid credentials' });
};

const sanitizeInputs = [mongoSanitizeMiddleware, xssMiddleware, hppMiddleware];

module.exports = {
  authLimiter, apiLimiter, adminLimiter,
  suspiciousInputDetector, sanitizeInputs,
  logFailedLogin, logEvent,
};
