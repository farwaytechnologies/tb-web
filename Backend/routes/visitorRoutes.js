const express = require("express");
const router = express.Router();
const {
  addVisitor,
  getAllVisitors,
  getVisitorStats,
} = require("../controllers/visitorController");

router.post("/add", addVisitor);
router.get("/", getAllVisitors);
router.get("/stats", getVisitorStats);

module.exports = router;
