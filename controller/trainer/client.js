const router = require("express").Router();
const RequestModel = require("../../models/RequestModel");
const objectId = require("mongoose").mongo.ObjectId;
/**
 * method : GET
 * url : /trainer/client/listRequest
 */
router.get("/listRequest", async (req, res, next) => {
  try {
    let getRequestList = await RequestModel.find({
      isDeleted: false,
      trainerId: objectId(req.trainerData.user._id),
    }).populate("clientId", { name: 1, email: 1, address: 1 });
    res.json({ error: null, data: getRequestList });
  } catch (error) {
    console.log(error);
    res.json({ error: true, message: "Error look at console" });
  }
});
/**
 * method : PUT
 * url : /trainer/client/acceptRequest
 */
router.put("/acceptRequest/:id", async (req, res, next) => {
  try {
    let getRequest = await RequestModel.findByIdAndUpdate(req.params.id, {
      isAccepted: true,
    });
    res.json({ error: null, message: "accepted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ error: true, message: "Error Look at console" });
  }
});
module.exports = router;
