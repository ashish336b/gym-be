const mongoose = require("mongoose");

const requestModel = new mongoose.Schema(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, required: true },
    trainerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, required: true },
    requestType: { type: String, required: true },
    nutrition: {
      sessionType: {
        type: String,
        enum: [
          "gain_weight",
          "lose_weight",
          "lose_fat",
          "muscle_gain",
          "other",
        ],
      },
      currentWeight: { type: String },
      targetWeight: { type: String },
      description: { type: String },
    },
    comments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "comments", default: [] },
    ],
    isAccepted: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    isPaid: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    strict: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("request", requestModel);
