const adminPaymentModel = require("../../models/adminPaymentModel");

const router = require("express").Router();
router.get("/", async (req, res, next) => {
  let paymentList = await adminPaymentModel
    .find({
      trainer: req.trainerData.user._id,
    })
    .populate({
      path: "clientAdminPayment",
    });
  res.json({ error: null, paymentList });
});
module.exports = router;
