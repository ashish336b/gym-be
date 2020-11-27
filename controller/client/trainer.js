const router = require("express").Router();
const serviceModel = require("../../models/serviceModel");
const trainerModel = require("../../models/trainerModel");
/**
 * method : GET
 * url : /client/trainer
 * Desc : fetch all trainer data
 */
router.get("/", async (req, res, next) => {
  res.json(await trainerModel.find({ isDeleted: false }));
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
