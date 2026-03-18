const Visitor = require("../models/Visitor");

// 🌍 Start a visitor session
exports.startSession = async (req, res) => {
  try {
    // Get IP address from headers or socket
    let ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      req.connection?.remoteAddress;

    // Clean up IP formats
    if (ip.startsWith("::ffff:")) ip = ip.replace("::ffff:", "");
    if (ip === "127.0.0.1" || ip === "::1") ip = "8.8.8.8"; // use Google DNS for localhost testing

    console.log("📡 New visitor IP:", ip);

    // Fetch geolocation data
    const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
    const geoData = await geoRes.json();

    // Create visitor record
    const visitor = await Visitor.create({
      ip,
      country: geoData.country || "Unknown Country",
      region: geoData.regionName || "Unknown Region",
      city: geoData.city || "Unknown City",
      lat: geoData.lat || null,
      lon: geoData.lon || null,
      pagesVisited: [],
      sessionStart: new Date(),
    });

    res.status(201).json({
      success: true,
      visitorId: visitor._id,
    });
  } catch (err) {
    console.error("❌ Error starting visitor session:", err.message);
    res.status(500).json({ success: false, message: "Failed to start session" });
  }
};

// 📄 Track each page visit
exports.trackPage = async (req, res) => {
  try {
    const { visitorId, page } = req.body;
    if (!visitorId || !page)
      return res.status(400).json({ message: "Missing visitorId or page" });

    await Visitor.findByIdAndUpdate(visitorId, {
      $addToSet: { pagesVisited: page },
    });

    res.status(200).json({ success: true, message: `Page ${page} tracked` });
  } catch (err) {
    console.error("❌ Error tracking page:", err.message);
    res.status(500).json({ success: false, message: "Failed to track page" });
  }
};

// ⏱️ End session and record duration
exports.endSession = async (req, res) => {
  try {
    const { visitorId } = req.body;
    if (!visitorId)
      return res.status(400).json({ success: false, message: "Missing visitorId" });

    const visitor = await Visitor.findById(visitorId);
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });

    visitor.sessionEnd = new Date();
    visitor.duration = Math.floor(
      (visitor.sessionEnd - visitor.sessionStart) / 1000
    ); // duration in seconds

    await visitor.save();

    res.status(200).json({ success: true, duration: visitor.duration });
  } catch (err) {
    console.error("❌ Error ending visitor session:", err.message);
    res.status(500).json({ success: false, message: "Failed to end session" });
  }
};

// 🧾 Get all visitors (for dashboard)
exports.getAllVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, visitors });
  } catch (error) {
    console.error("❌ Error fetching visitors:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch visitors" });
  }
};

// 🌎 Get visitor stats grouped by country
exports.getVisitorStats = async (req, res) => {
  try {
    const stats = await Visitor.aggregate([
      {
        $group: {
          _id: "$country",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({ success: true, stats });
  } catch (error) {
    console.error("❌ Error fetching visitor stats:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
};

// 📊 Rich analytics: daily trend, top pages, hourly, avg duration
exports.getAnalytics = async (req, res) => {
  try {
    const [
      dailyTrend,
      topPages,
      hourly,
      avgDuration,
      totalVisitors,
      uniqueCountries,
      recentVisitors,
    ] = await Promise.all([
      // Daily visitor count for last 14 days
      Visitor.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 14 * 86400000) } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      // Top pages visited
      Visitor.aggregate([
        { $unwind: '$pagesVisited' },
        { $group: { _id: '$pagesVisited', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      // Hourly distribution
      Visitor.aggregate([
        { $group: { _id: { $hour: '$createdAt' }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      // Average session duration
      Visitor.aggregate([
        { $match: { duration: { $gt: 0 } } },
        { $group: { _id: null, avg: { $avg: '$duration' }, max: { $max: '$duration' } } },
      ]),
      Visitor.countDocuments(),
      Visitor.distinct('country').then(c => c.length),
      Visitor.find().sort({ createdAt: -1 }).limit(5).select('ip country city createdAt pagesVisited duration'),
    ]);

    res.json({
      dailyTrend,
      topPages,
      hourly,
      avgDuration: avgDuration[0] || { avg: 0, max: 0 },
      totalVisitors,
      uniqueCountries,
      recentVisitors,
    });
  } catch (err) {
    console.error('Analytics error:', err.message);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};
