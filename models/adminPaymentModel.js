const mongoose = require("mongoose");

const paymentModel = new mongoose.Schema(
  {
    paymentAmount: { type: String },
    clientAdminPayment: { type: String, ref: "payment" },
    isDeleted: { type: Boolean, default: false },
  },
  {
    strict: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("adminPaymentModel", paymentModel);
