const mongoose = require("mongoose");

const goalModel = new mongoose.Schema(
  {
    client: { type: mongoose.Types.ObjectId },
    title: { type: String },
    current: { type: String },
    desired: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    description: { type: String },
    isCompleted: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    strict: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("goals", goalModel);
