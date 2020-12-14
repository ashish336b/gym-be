const mongoose = require("mongoose");

const commentsModel = new mongoose.Schema(
  {
    request: { type: mongoose.Types.ObjectId, ref: "request" },
    name: { type: String },
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  {
    strict: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("comment", commentsModel);
