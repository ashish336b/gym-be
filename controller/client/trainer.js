const router = require("express").Router();
const requestModel = require("../../models/RequestModel");
const serviceModel = require("../../models/serviceModel");
const trainerModel = require("../../models/trainerModel");
const commentModel = require("../../models/commentsModel");
const objectId = require("mongoose").mongo.ObjectId;
/**
 * method : GET
 * url : /client/trainer
 * Desc : fetch all trainer data
 */
router.get("/", async (req, res, next) => {
  res.json(await trainerModel.find({ isDeleted: false }));
});
/**
 * method : POST
 * url : /client/trainer/comment/:requestId
 * Description : comment on requested service by client
 */
router.post("/comment/:requestId", async (req, res, next) => {
  req.body.request = req.params.requestId;
  req.body.name = `${req.clientData.user.name.firstName} ${req.clientData.user.name.lastName}`;
  let request = await requestModel.findById(req.params.requestId);
  if (!request.isPaid && !request.isAccepted) {
    return res.json({ error: true, message: "Cannot comment" });
  }
  let comment = await new commentModel(req.body).save();
  request.comments.push(comment._id);
  await request.save();
  res.json({ error: null, message: "commented successfully" });
});
/**
 * method : POST
 * url : /client/trainer/:id/requestService
 * DESC : request services
 */
router.post("/:id/requestServices/:serviceId", async (req, res, next) => {
  req.body.clientId = req.clientData.user._id;
  req.body.trainerId = req.params.id;
  req.body.serviceId = req.params.serviceId;
  try {
    await new requestModel(req.body).save();
    res.json({ error: null, message: "Request for service sent successfully" });
  } catch (error) {
    console.log(error);
    res.json({ error: true, message: "look at console" });
  }
});
/**
 * method : GET
 * url : /client/trainer/listRequest
 * Desc : list all requested services to trainer
 */
router.get("/listRequest", async (req, res, next) => {
  try {
    let getRequestList = await requestModel.find({
      isDeleted: false,
      clientId: objectId(req.clientData.user._id),
      isAccepted: false,
      isDeclined: false,
    });
    res.json({ error: null, data: getRequestList });
  } catch (error) {
    console.log(error);
    res.json({ error: true, message: "Error look at console" });
  }
});
/**
 * method : GET
 * url : /client/trainer/listAcceptedRequest
 * Desc :list all accepted request sent to trainer
 */
router.get("/listAcceptedRequest", async (req, res, next) => {
  try {
    let acceptedRequest = await requestModel
      .find({
        isDeleted: false,
        clientId: objectId(req.clientData.user._id),
        isAccepted: true,
      })
      .populate("nutrition.nutritionWeeklyPlans")
      .populate("serviceId")
      .populate("workout.workoutPlans")
      .populate("trainerId", { name: 1, email: 1, address: 1 })
      .populate("comments");
    res.json({ error: null, data: acceptedRequest });
  } catch (error) {
    console.log(error);
    res.json({ error: null, message: "Error look at console" });
  }
});
/**
 * method : GET
 * url : /client/trainer/listAcceptedRequest/:requestId
 * Desc : Get accepted request by id
 */
router.get("/listAcceptedRequest/:requestId", async (req, res, next) => {
  try {
    let acceptedRequestDetails = await requestModel
      .findOne({
        isDeleted: false,
        clientId: objectId(req.clientData.user._id),
        _id: objectId(req.params.requestId),
        isAccepted: true,
      })
      .populate("nutrition.nutritionWeeklyPlans")
      .populate("workout.workoutPlans")
      .populate("serviceId")
      .populate("trainerId", { name: 1, email: 1, address: 1 })
      .populate("comments");
    res.json({ error: null, data: acceptedRequestDetails });
  } catch (error) {
    console.log(error);
    res.json({ error: true, message: "Error Look at console" });
  }
});
/**
 * method : GET
 * url : /client/trainer/:id
 * Desc : fetch trainer details and his/her services
 */
router.get("/:id", async (req, res, next) => {
  let trainer = await trainerModel.findById(req.params.id);
  let services = await serviceModel.find({
    isDeleted: false,
    addedBy: req.params.id,
  });

  res.json({
    trainer,
    services,
  });
});
/**
 * method : PUT
 * url : /client/trainer/markAsComplete/:requestId
 * Desc : mark as complete from client
 */
router.put("/markAsComplete/:requestId", async (req, res, next) => {
  try {
    let request = await requestModel.findById(req.params.requestId);
    if (request.isAccepted && request.isPaid) {
      request.isCompleted = true;
      await request.save();
      res.json({ error: null, message: "Mark as completed" });
    } else {
      res.json({ error: true, message: "cannot mark as completed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ error: true, message: "Error Look at console" });
  }
});
module.exports = router;
