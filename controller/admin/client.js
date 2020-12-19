const router = require("express").Router();
const clientModel = require("../../models/clientModel");
const paymentModel = require("../../models/paymentModel");
const objectId = require("mongoose").Types.ObjectId;
/**
 * method : GET
 * url : /admin/client
 * Desc : get client list
 */
router.get("/", async (req, res, next) => {
  let clientData = await clientModel.find({ isDeleted: false });
  res.json(clientData);
});
/**
 * method : GET
 * url : /admin/client/paymentList
 * Desc : list of all payment done for services
 */
router.get("/paymentList", async (req, res, next) => {
  let paymentList = await paymentModel.find({ isDeleted: false }).populate({
    path: "request",
    populate: {
      path: "clientId trainerId",
      select: { name: 1, role: 1 },
    },
  });
  res.json({ error: null, data: paymentList });
});
/**
 * method : GET
 * url : /admin/client/paymentList/:trainerId
 * Desc : list of all payment paid for specific trainer
 */
router.get("/paymentList/:trainerId", async (req, res, next) => {
  let paymentList = await paymentModel
    .find({
      isDeleted: false,
    })
    .populate({
      path: "request",
      populate: {
        path: "clientId trainerId",
        select: { name: 1, role: 1 },
      },
    });
  paymentList = paymentList.filter((el) => {
    return el.request.trainerId._id.toString() === req.params.trainerId;
  });
  res.json(paymentList);
});
/**
 * method : GET
 * url : /admin/client/:id
 * Desc : get specific client by id
 */
router.get("/:id", async (req, res, next) => {
  res.json(await clientModel.findById(req.params.id));
});
/**
 * method : DELETE
 * url : /admin/client/:id
 * Desc : delete client
 */
router.delete("/:id", async (req, res, next) => {
  try {
    await clientModel.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ error: null, message: "successfully deleted" });
  } catch (error) {
    console.log(error);
    res.json({ error: true, message: "error occured please look at console" });
  }
});
module.exports = router;
