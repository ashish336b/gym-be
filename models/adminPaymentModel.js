const mongoose = require("mongoose");

const paymentModel = new mongoose.Schema(
  {
    paymentAmount: { type: String },
    clientAdminPayment: { type: String, ref: "payment" },
    trainer: { type: mongoose.Types.ObjectId, ref: "trainer" },
    isDeleted: { type: Boolean, default: false },
  },
  {
    strict: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("adminPaymentModel", paymentModel);
