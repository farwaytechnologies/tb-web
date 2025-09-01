import mongoose from "mongoose";

const supportCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: false },
  },
  { timestamps: true }
);

const SupportCategory = mongoose.model("SupportCategory", supportCategorySchema);

export default SupportCategory;
