const mongoose = require('mongoose');

const supportCategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    subcategories: [{ type: String }],
    icon: { type: String, default: '💬' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SupportCategory', supportCategorySchema);
