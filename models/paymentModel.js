const mongoose = require("mongoose");

const paymentModel = new mongoose.Schema(
  {
    paymentAmount: { type: String },
    request: { type: String, ref: "request" },
    isDeleted: { type: Boolean, default: false },
  },
  {
    strict: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("payment", paymentModel);
