const router = require("express").Router();
const RequestModel = require("../../models/RequestModel");
const serviceModel = require("../../models/serviceModel");
const trainerModel = require("../../models/trainerModel");
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
 * url : /client/trainer/:id/requestService
 * DESC : request services
 */
router.post("/:id/requestServices/:serviceId", async (req, res, next) => {
  req.body.clientId = req.clientData.user._id;
  req.body.trainerId = req.params.id;
  req.body.serviceId = req.params.serviceId;
  try {
    await new RequestModel(req.body).save();
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
    let getRequestList = await RequestModel.find({
      isDeleted: false,
      clientId: objectId(req.clientData.user._id),
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
    let acceptedRequest = await RequestModel.find({
      isDeleted: false,
      clientId: objectId(req.clientData.user._id),
      isAccepted: true,
    });
    res.json({ error: null, data: acceptedRequest });
  } catch (error) {
    console.log(error);
    res.json({ error: null, message: "Error look at console" });
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
module.exports = router;
