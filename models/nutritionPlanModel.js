const mongoose = require("mongoose");

const nutritionPlanModel = new mongoose.Schema(
  {
    request: { type: String, ref: "request" },
    title: { type: String }, //eg Day-1
    meals: [{ id: mongoose.Types.ObjectId }],
    isDeleted: { type: Boolean, default: false },
  },
  {
    strict: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("nutritionPlan", nutritionPlanModel);
