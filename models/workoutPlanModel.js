const mongoose = require("mongoose");

const workoutPlanModel = new mongoose.Schema(
  {
    request: { type: String, ref: "request" },
    title: { type: String }, //eg Day-1
    activity: [{ id: mongoose.Types.ObjectId }],
    isDeleted: { type: Boolean, default: false },
  },
  {
    strict: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("workoutPlan", workoutPlanModel);
