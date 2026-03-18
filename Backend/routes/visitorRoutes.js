const express = require("express");
const router = express.Router();
const {
  startSession,
  trackPage,
  endSession,
  getAllVisitors,
  getVisitorStats,
  getAnalytics,
} = require("../controllers/visitorController");

// Session tracking routes
router.post("/start-session", startSession);
router.post("/track-page", trackPage);
router.post("/end-session", endSession);

// Visitor analytics
router.get("/", getAllVisitors);
router.get("/stats", getVisitorStats);
router.get("/analytics", getAnalytics);

module.exports = router;
