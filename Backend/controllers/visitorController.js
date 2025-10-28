const Visitor = require("../models/Visitor");

// 📍 Add a new visitor
exports.addVisitor = async (req, res) => {
  try {
    let ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;

    if (ip.startsWith("::ffff:")) ip = ip.replace("::ffff:", "");

    // For localhost testing, use a public IP (localhost IPs can’t be geolocated)
    if (ip === "127.0.0.1" || ip === "::1") {
      ip = "8.8.8.8";
    }

    // ✅ Native fetch (Node 18+ has it built-in)
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();

    const visitorData = {
      ip,
      country: data.country_name || "Unknown",
      region: data.region || "Unknown",
      city: data.city || "Unknown",
    };

    const newVisitor = await Visitor.create(visitorData);

    res.status(201).json({
      success: true,
      message: "Visitor logged successfully",
      visitor: newVisitor,
    });
  } catch (error) {
    console.error("Visitor logging failed:", error.message);
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
