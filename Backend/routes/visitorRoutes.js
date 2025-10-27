const express = require("express");
const router = express.Router();
const {
  addVisitor,
  getAllVisitors,
  getVisitorStats,
} = require("../controllers/visitorController");

// POST: log visitor
router.post("/add", addVisitor);

// GET: all visitors
router.get("/", getAllVisitors);

// GET: visitor stats by country
router.get("/stats", getVisitorStats);

module.exports = router;
