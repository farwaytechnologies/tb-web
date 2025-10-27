const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    ip: { type: String, required: true },
    country: { type: String, default: "Unknown" },
    region: { type: String, default: "Unknown" },
    city: { type: String, default: "Unknown" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visitor", visitorSchema);
