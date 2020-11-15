const mongoose = require("mongoose");

const trainerModel = new mongoose.Schema(
  {
    name: {
      firstName: { type: String, require: true },
      middleName: { type: String, default: "" },
      lastName: { type: String, default: "" },
    },
    email: { type: String },
    DOB: { type: Date },
    gender: { type: String, enum: ["Male", "Female"] },
    password: { type: String },
    address: { type: String },
    role: { type: String },
    isApproved: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    strict: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("trainer", trainerModel);
