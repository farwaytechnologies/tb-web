const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    ip: { type: String, required: true },
    country: { type: String, default: "Unknown" },
    region: { type: String, default: "Unknown" },
    city: { type: String, default: "Unknown" },
    lat: { type: Number },
    lon: { type: Number },
    pagesVisited: [{ type: String }],
    sessionStart: { type: Date },
    sessionEnd: { type: Date },
    duration: { type: Number, default: 0 }, // in seconds
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visitor", visitorSchema);
