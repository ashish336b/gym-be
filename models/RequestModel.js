const mongoose = require("mongoose");
/**
 * clientId,trainerId,serviceId,
 * nutrition.nutritionPlan,
 * workout.workoutPlan,comment
 */
const requestModel = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "client",
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "trainer",
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "service",
      required: true,
    },
    requestType: { type: String, required: true },
    requestTitle: { type: String },
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
      nutritionWeeklyPlans: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "nutritionPlan",
          default: [],
        },
      ],
    },
    workout: {
      sessionType: {
        type: String,
        enum: ["weights", "hiit", "cardio", "sport"],
      },
      bodyTargetArea: {
        type: String,
        enum: ["abs", "total_body", "arms", "legs"],
      },
      description: { type: String },
      workoutPlans: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "workoutPlan",
          default: [],
        },
      ],
    },
    comments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "comment", default: [] },
    ],
    isAccepted: { type: Boolean, default: false },
    isDeclined: { type: Boolean, default: false },
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
