const mongoose = require("mongoose");

const messageModel = new mongoose.Schema(
  {
    sender: { type: mongoose.Types.ObjectId, ref: "client" },
    receiver: { type: mongoose.Types.ObjectId, ref: "trainer" },
    message: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  {
    strict: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("message", messageModel);
