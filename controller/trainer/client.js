const router = require("express").Router();
const requestModel = require("../../models/RequestModel");
const nutritionPlanModel = require("../../models/nutritionPlanModel");
const workoutPlanModel = require("../../models/workoutPlanModel");
const objectId = require("mongoose").mongo.ObjectId;
const commentModel = require("../../models/commentsModel");
/**
 * method : GET
 * url : /trainer/client/listRequest
 */
router.get("/listRequest", async (req, res, next) => {
  try {
    let getRequestList = await requestModel
      .find({
        isDeleted: false,
        trainerId: objectId(req.trainerData.user._id),
        isDeclined: false,
        isAccepted: false,
      })
      .populate("clientId", { name: 1, email: 1, address: 1 });
    res.json({ error: null, data: getRequestList });
  } catch (error) {
    console.log(error);
    res.json({ error: true, message: "Error look at console" });
  }
});
/**
 * method : GET
 * url : /trainer/client/listAcceptedRequest
 */
router.get("/listAcceptedRequest", async (req, res, next) => {
  try {
    let getRequest = await requestModel
      .find({
        isDeleted: false,
        trainerId: objectId(req.trainerData.user._id),
        isDeclined: false,
        isAccepted: true,
      })
      .populate("clientId", { name: 1, email: 1, address: 1 })
      .populate("comments")
      .populate("serviceId")
      .populate("nutrition.nutritionWeeklyPlans")
      .populate("workout.workoutPlans");
    res.json({ error: null, data: getRequest });
  } catch (error) {
    console.log(error);
    res.json({ error: true, message: "Error look at console" });
  }
});
/**
 * method : GET
 * url : /trainer/client/listDeclinedRequest
 */
router.get("/listDeclinedRequest", async (req, res, next) => {
  try {
    let getRequest = await requestModel
      .find({
        isDeleted: false,
        trainerId: objectId(req.trainerData.user._id),
        isDeclined: true,
        isAccepted: false,
      })
      .populate("clientId", { name: 1, email: 1, address: 1 })
      .populate("comments")
      .populate("serviceId")
      .populate("nutrition.nutritionWeeklyPlans")
      .populate("workout.workoutPlans");
    res.json({ error: null, data: getRequest });
  } catch (error) {
    console.log(error);
    res.json({ error: true, message: "Error look at console" });
  }
});
/**
 * method : PUT
 * url : /trainer/client/acceptRequest/:id
 */
router.put("/acceptRequest/:id", async (req, res, next) => {
  try {
    await requestModel.findByIdAndUpdate(req.params.id, {
      isAccepted: true,
      isDeclined: false,
    });
    res.json({ error: null, message: "accepted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ error: true, message: "Error Look at console" });
  }
});
/**
 * method : put
 * url : /trainer/client/declineRequest/:requestId
 * Desc : Decline Request
 */
router.put("/declineRequest/:requestId", async (req, res, next) => {
  try {
    await requestModel.findByIdAndUpdate(req.params.requestId, {
      isAccepted: false,
      isDeclined: true,
    });
    res.json({ error: null, message: "Declined successfully" });
  } catch (error) {
    console.log(error);
    res.json({ error: true, message: "Error Look at console" });
  }
});
/**
 * method : POST
 * url : /trainer/client/createNutritionPlan/:requestId
 * desc : trainer create day-1 day-2 meals for client
 */
router.post("/createNutritionPlan/:requestId", async (req, res, next) => {
  //check if requestId is paid or not
  let request = await requestModel.findById(req.params.requestId);
  if (!request.isPaid) {
    return res.json({
      error: true,
      message: "cannot add nutrition plan on unpaid request",
    });
  }
  req.body.request = req.params.requestId;
  let createNutritionPlan = await new nutritionPlanModel(req.body).save();
  try {
    request.nutrition.nutritionWeeklyPlans.push(createNutritionPlan._id);
    await request.save();
  } catch (error) {
    await nutritionPlanModel.findByIdAndRemove(createNutritionPlan._id);
    console.log(error);
  }
  res.json(createNutritionPlan);
});
/**
 * method : POST
 * url : /trainer/client/createWorkoutPlan/:requestId
 * desc : trainer create day-1 day-2 plan for client
 */
router.post("/createWorkoutPlan/:requestId", async (req, res, next) => {
  //check if requestId is paid or not
  let request = await requestModel.findById(req.params.requestId);
  if (!request.isPaid) {
    return res.json({
      error: true,
      message: "cannot add workout plan on unpaid request",
    });
  }
  req.body.request = req.params.requestId;
  let createWorkoutPlan = await new workoutPlanModel(req.body).save();
  try {
    request.workout.workoutPlans.push(createWorkoutPlan._id);
    await request.save();
  } catch (error) {
    await workoutPlanModel.findByIdAndRemove(createWorkoutPlan._id);
    console.log(error);
  }
  res.json(createWorkoutPlan);
});
/**
 * method : POST
 * url : /trainer/client/comment/:requestId
 * Desc : comment on requested services
 */
router.post("/comment/:requestId", async (req, res, next) => {
  req.body.request = req.params.requestId;
  req.body.name = `${req.trainerData.user.name.firstName} ${req.trainerData.user.name.lastName}`;
  let request = await requestModel.findById(req.params.requestId);
  if (!request.isPaid && !request.isAccepted) {
    return res.json({ error: true, message: "Cannot comment" });
  }
  let comment = await new commentModel(req.body).save();
  request.comments.push(comment._id);
  await request.save();
  res.json({ error: null, message: "commented successfully" });
});
module.exports = router;
