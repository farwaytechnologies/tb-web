const Visitor = require("../models/Visitor");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)); // ✅ ESM compatible import for node-fetch

// 📍 Add a new visitor
exports.addVisitor = async (req, res) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;

    // Get geolocation info using a free IP geolocation API
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();

    const visitorData = {
      ip,
      country: data.country_name || "Unknown",
      region: data.region || "Unknown",
      city: data.city || "Unknown",
    };

    const newVisitor = new Visitor(visitorData);
    await newVisitor.save();

    res.status(201).json({
      success: true,
      message: "Visitor logged successfully",
      visitor: newVisitor,
    });
  } catch (error) {
    console.error("Visitor logging failed:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📊 Get all visitors (for dashboard analytics)
exports.getAllVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, visitors });
  } catch (error) {
    console.error("Error fetching visitors:", error);
    res.status(500).json({ success: false, message: "Failed to fetch visitors" });
  }
};

// 🌍 Get country statistics
exports.getVisitorStats = async (req, res) => {
  try {
    const stats = await Visitor.aggregate([
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({ success: true, stats });
  } catch (error) {
    console.error("Error fetching visitor stats:", error);
    res.status(500).json({ success: false, message: "Failed to fetch visitor stats" });
  }
};
