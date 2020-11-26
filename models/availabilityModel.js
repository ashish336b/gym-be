const mongoose = require("mongoose");

const availabilityModel = new mongoose.Schema(
  {
    date: { type: Date },
    address: { type: String },
    service: { type: String, ref: "service" },
    trainer: { type: String, ref: "trainer" },
    isDeleted: { type: Boolean, default: false },
  },
  {
    strict: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("availability", availabilityModel);
