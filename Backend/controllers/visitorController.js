const Visitor = require("../models/Visitor");
const geoip = require("geoip-lite");

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseUserAgent(ua = "") {
  // Device
  let device = "Desktop";
  if (/tablet|ipad|playbook|silk/i.test(ua)) device = "Tablet";
  else if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) device = "Mobile";

  // Browser
  let browser = "Other";
  if (/edg\//i.test(ua)) browser = "Edge";
  else if (/opr\//i.test(ua)) browser = "Opera";
  else if (/chrome/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua)) browser = "Safari";
  else if (/firefox/i.test(ua)) browser = "Firefox";
  else if (/msie|trident/i.test(ua)) browser = "IE";

  // OS
  let os = "Other";
  if (/windows nt/i.test(ua)) os = "Windows";
  else if (/mac os x/i.test(ua)) os = "macOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/linux/i.test(ua)) os = "Linux";

  return { device, browser, os };
}

function parseReferrer(ref = "") {
  if (!ref || ref === "null") return "Direct";
  try {
    const host = new URL(ref).hostname.replace("www.", "");
    if (/google/.test(host)) return "Google";
    if (/facebook|fb\.com/.test(host)) return "Facebook";
    if (/twitter|t\.co/.test(host)) return "Twitter";
    if (/linkedin/.test(host)) return "LinkedIn";
    if (/youtube/.test(host)) return "YouTube";
    if (/instagram/.test(host)) return "Instagram";
    return host || "Direct";
  } catch { return "Direct"; }
}

// ── Session Start ─────────────────────────────────────────────────────────────

exports.startSession = async (req, res) => {
  try {
    let ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      req.connection?.remoteAddress;

    if (ip?.startsWith("::ffff:")) ip = ip.replace("::ffff:", "");
    // For localhost testing, use a real IP so geoip works
    const lookupIp = (ip === "127.0.0.1" || ip === "::1") ? "8.8.8.8" : ip;

    const ua = req.headers["user-agent"] || "";
    const { device, browser, os } = parseUserAgent(ua);
    const referrer = parseReferrer(req.body.referrer || req.headers["referer"] || "");

    // Check if returning visitor (same IP visited before)
    const existing = await Visitor.findOne({ ip });
    const isNew = !existing;

    // Use geoip-lite (offline, no external HTTP call)
    const geo = geoip.lookup(lookupIp) || {};

    const visitor = await Visitor.create({
      ip,
      country: geo.country || "Unknown",
      region: (geo.region) || "Unknown",
      city: geo.city || "Unknown",
      lat: geo.ll?.[0] || null,
      lon: geo.ll?.[1] || null,
      pagesVisited: [],
      sessionStart: new Date(),
      device, browser, os, referrer, isNew,
    });

    res.status(201).json({ success: true, visitorId: visitor._id });
  } catch (err) {
    console.error("❌ startSession:", err.message);
    res.status(500).json({ success: false, message: "Failed to start session" });
  }
};

// ── Track Page ────────────────────────────────────────────────────────────────

exports.trackPage = async (req, res) => {
  try {
    const { visitorId, page } = req.body;
    if (!visitorId || !page)
      return res.status(400).json({ message: "Missing visitorId or page" });

    await Visitor.findByIdAndUpdate(visitorId, { $addToSet: { pagesVisited: page } });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to track page" });
  }
};

// ── End Session ───────────────────────────────────────────────────────────────

exports.endSession = async (req, res) => {
  try {
    // sendBeacon may send body as text/plain — handle both
    let visitorId = req.body?.visitorId;
    if (!visitorId && req.body) {
      try {
        const parsed = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        visitorId = parsed.visitorId;
      } catch {}
    }
    if (!visitorId) return res.status(400).json({ success: false, message: "Missing visitorId" });

    const visitor = await Visitor.findById(visitorId);
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });

    visitor.sessionEnd = new Date();
    visitor.duration = Math.max(1, Math.floor((visitor.sessionEnd - visitor.sessionStart) / 1000));
    await visitor.save();

    res.status(200).json({ success: true, duration: visitor.duration });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to end session" });
  }
};

// ── Get All Visitors ──────────────────────────────────────────────────────────

exports.getAllVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, visitors });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch visitors" });
  }
};

// ── Country Stats ─────────────────────────────────────────────────────────────

exports.getVisitorStats = async (req, res) => {
  try {
    const stats = await Visitor.aggregate([
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.status(200).json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
};

// ── Rich Analytics ────────────────────────────────────────────────────────────

exports.getAnalytics = async (req, res) => {
  try {
    const [
      dailyTrend, topPages, hourly, avgDurationArr,
      totalVisitors, uniqueCountries, recentVisitors,
      deviceBreakdown, browserBreakdown, osBreakdown,
      referrerBreakdown, newVsReturning, bounceData, todayVisitors,
    ] = await Promise.all([
      // Daily last 30 days
      Visitor.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 86400000) } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      // Top pages
      Visitor.aggregate([
        { $unwind: "$pagesVisited" },
        { $group: { _id: "$pagesVisited", count: { $sum: 1 } } },
        { $sort: { count: -1 } }, { $limit: 10 },
      ]),
      // Hourly
      Visitor.aggregate([
        { $group: { _id: { $hour: "$createdAt" }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      // Avg duration — only sessions with a recorded duration (endSession fired)
      Visitor.aggregate([
        { $match: { duration: { $gt: 0 } } },
        { $group: { _id: null, avg: { $avg: "$duration" }, max: { $max: "$duration" } } },
      ]),
      Visitor.distinct("ip").then(ips => ips.length),
      Visitor.distinct("country").then(c => c.length),
      Visitor.find().sort({ createdAt: -1 }).limit(10)
        .select("ip country city createdAt pagesVisited duration device browser"),
      // Device breakdown
      Visitor.aggregate([
        { $group: { _id: "$device", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      // Browser breakdown
      Visitor.aggregate([
        { $group: { _id: "$browser", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      // OS breakdown
      Visitor.aggregate([
        { $group: { _id: "$os", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      // Referrer breakdown
      Visitor.aggregate([
        { $group: { _id: "$referrer", count: { $sum: 1 } } },
        { $sort: { count: -1 } }, { $limit: 8 },
      ]),
      // New vs returning
      Visitor.aggregate([
        { $group: { _id: "$isNew", count: { $sum: 1 } } },
      ]),
      // Bounce rate (visited only 1 page) — guard against null pagesVisited
      Visitor.aggregate([
        {
          $project: {
            bounced: {
              $lte: [
                { $size: { $ifNull: ["$pagesVisited", []] } },
                1
              ]
            }
          }
        },
        { $group: { _id: "$bounced", count: { $sum: 1 } } },
      ]),
      // Today's visitor count
      Visitor.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt:  new Date(new Date().setHours(23, 59, 59, 999)),
        }
      }),
    ]);

    // Compute bounce rate
    const totalB = bounceData.reduce((s, d) => s + d.count, 0);
    const bouncedCount = bounceData.find(d => d._id === true)?.count || 0;
    const bounceRate = totalB ? Math.round((bouncedCount / totalB) * 100) : 0;

    // New vs returning counts
    const newCount = newVsReturning.find(d => d._id === true)?.count || 0;
    const returningCount = newVsReturning.find(d => d._id === false)?.count || 0;

    res.json({
      dailyTrend, topPages, hourly,
      avgDuration: avgDurationArr[0] || { avg: 0, max: 0 },
      totalVisitors, uniqueCountries, recentVisitors,
      deviceBreakdown, browserBreakdown, osBreakdown,
      referrerBreakdown, bounceRate,
      newVisitors: newCount, returningVisitors: returningCount,
      todayVisitors,
    });
  } catch (err) {
    console.error("Analytics error:", err.message, err.stack);
    res.status(500).json({ message: "Failed to fetch analytics", error: err.message });
  }
};
