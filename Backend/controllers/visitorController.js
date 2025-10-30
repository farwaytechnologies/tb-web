const Visitor = require("../models/Visitor");

// 📍 Add a new visitor
exports.addVisitor = async (req, res) => {
  try {
    let ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      req.connection?.remoteAddress;

    if (ip.startsWith("::ffff:")) ip = ip.replace("::ffff:", "");

    if (ip === "127.0.0.1" || ip === "::1") {
      ip = "8.8.8.8";
    }

    console.log("📡 Tracking visitor IP:", ip);

    const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
    const geoData = await geoRes.json();

    const visitorData = {
      ip,
      country: geoData.country || "Unknown Country",
      region: geoData.regionName || "Unknown Region",
      city: geoData.city || "Unknown City",
    };

    const newVisitor = await Visitor.create(visitorData);

    res.status(201).json({
      success: true,
      message: "Visitor logged successfully",
      visitor: newVisitor,
    });
  } catch (error) {
    console.error("❌ Visitor logging failed:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📊 Get all visitors
exports.getAllVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, visitors });
  } catch (error) {
    console.error("Error fetching visitors:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch visitors" });
  }
};

// 🌍 Get stats grouped by country
exports.getVisitorStats = async (req, res) => {
  try {
    const stats = await Visitor.aggregate([
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.status(200).json({ success: true, stats });
  } catch (error) {
    console.error("Error fetching visitor stats:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch visitor stats" });
  }
};
