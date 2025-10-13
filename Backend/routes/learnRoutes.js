const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  getAllTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic
} = require("../controllers/learnController");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/learn"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// CRUD routes
router.get("/", getAllTopics);
router.get("/:id", getTopicById);
router.post("/", upload.single("image"), createTopic);
router.put("/:id", upload.single("image"), updateTopic);
router.delete("/:id", deleteTopic);

module.exports = router;
