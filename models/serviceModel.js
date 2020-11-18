const mongoose = require("mongoose");

const serviceModel = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: String },
    description: { type: String },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "trainer" },
    isDeleted: { type: Boolean, default: false },
  },
  {
    strict: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("service", serviceModel);
