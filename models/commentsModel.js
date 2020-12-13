const mongoose = require("mongoose");

const adminModel = new mongoose.Schema(
  {
    requestId: { type: String },
    name: { type: String },
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  {
    strict: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("admin", adminModel);
