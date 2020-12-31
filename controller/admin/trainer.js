const router = require("express").Router();
const trainerModel = require("../../models/trainerModel");
const paginate = require("../../helpers/paginate");
const adminPaymentModel = require("../../models/adminPaymentModel");
const paymentModel = require("../../models/paymentModel");
/**
 * method : GET
 * url : /admin/trainer
 * Desc : list all trainer
 */
router.get("/", async (req, res, next) => {
  let paginatedData = await paginate(
    trainerModel,
    {
      searchableField: [
        "name.firstName",
        "name.lastName",
        "name.middleName",
        "email",
      ],
      filterBy: { isDeleted: false },
    },
    req
  );
  res.json(paginatedData);
});
/**
 * method : GET
 * url : /admin/trainer/:id
 * Desc : get specific trainer by id
 */
router.get("/:id", async (req, res, next) => {
  try {
    let oneTrainer = await trainerModel.findById(req.params.id);
    if (oneTrainer.isDeleted)
      return res.json({ message: "cannot get trainer Data" });
    res.json(oneTrainer);
  } catch (error) {
    console.log(error);
    res.json({ message: "cannot get trainer Data" });
  }
});
/**
 * method : GET
 * url : /admin/trainer/:id/approve
 * Desc : Approve sign up request send by trainer
 */
router.post("/:id/approve", async (req, res, next) => {
  try {
    await trainerModel.findByIdAndUpdate(req.params.id, { isApproved: true });
    res.json({ message: "successfully approved" });
  } catch (error) {
    console.log(error);
    res.json({ message: "cannot update admin" });
  }
});
/**
 * method : DELETE
 * url : /admin/trainer/:id
 * Desc : Delete trainer
 */
router.delete("/:id", async (req, res, next) => {
  try {
    await trainerModel.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ message: "deleted Successfully", error: null });
  } catch (error) {
    console.log(error);
    res.json({ message: "cannot delete", error: true });
  }
});
/**
 * method : POST
 * url : /admin/trainer/payment/:id
 */
router.post("/payment/:paymentId/:trainerId", async (req, res, next) => {
  try {
    let payment = await paymentModel.findById(req.params.paymentId);
    let amount = parseInt(payment.paymentAmount);
    amount = amount - 0.1 * amount;
    await new adminPaymentModel({
      paymentAmount: amount,
      clientAdminPayment: req.params.paymentId,
      trainer: req.params.trainerId,
    }).save();
    payment.isReceivedByTrainer = true;
    await payment.save();
    res.json({ error: null, message: "payment to trainer successfully" });
  } catch (error) {
    console.log(error);
    res.json({ error: true, message: "Error" });
  }
});
module.exports = router;
