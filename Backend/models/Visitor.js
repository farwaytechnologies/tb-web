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
    device: { type: String, default: "Desktop" },   // Desktop | Mobile | Tablet
    browser: { type: String, default: "Unknown" },
    os: { type: String, default: "Unknown" },
    referrer: { type: String, default: "Direct" },
    isNew: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visitor", visitorSchema);
