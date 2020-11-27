const router = require("express").Router();
const serviceModel = require("../../models/serviceModel");
const availabilityModel = require("../../models/availabilityModel");
/**
 * method : GET
 * url : /trainer/services
 * Desc : get all services by logged in trainer
 */
router.get("/", async (req, res, next) => {
  let data = await serviceModel
    .find({
      isDeleted: false,
      addedBy: req.trainerData.user._id,
    })
    .populate("addedBy");
  res.json(data);
});
/**
 * method : POST
 * url : /trainer/services
 * Desc : create services
 */
router.post("/", async (req, res, next) => {
  req.body.addedBy = req.trainerData.user._id;
  try {
    await new serviceModel(req.body).save();
    res.json({ message: "service created", error: false });
  } catch (error) {
    console.log(error);
    res.json({ error: true, message: "error check console" });
  }
});
/**
 * method : PUT
 * url : /trainer/services/:id
 * Desc : edit trainer data
 */
router.put("/:id", async (req, res, next) => {
  try {
    await serviceModel.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "edited Successfully", error: null });
  } catch (error) {
    console.log(error);
    res.json({ message: "error occured, Look at console", error: true });
  }
});
/**
 * method : GET
 * url : /trainer/{id}/services/availability
 * Desc : get availability date for 1 to 1 session
 */
router.get("/availability", async (req, res, next) => {
  res.json(
    await availabilityModel
      .find({ isDeleted: false, trainer: req.trainerData.user._id })
      .populate(["service", "trainer"])
  );
});
/**
 * method : POST
 * url : /trainer/services/availability
 * Desc : create availability for one to one session
 */
router.post("/availability", async (req, res, next) => {
  req.body.trainer = req.trainerData.user._id;
  req.body.fromDate = new Date(
    req.body.fromDate.year,
    req.body.fromDate.month,
    req.body.fromDate.day,
    req.body.fromDate.hour,
    req.body.fromDate.minute,
    req.body.fromDate.second,
    0
  );
  req.body.toDate = new Date(
    req.body.toDate.year,
    req.body.toDate.month,
    req.body.toDate.day,
    req.body.toDate.hour,
    req.body.toDate.minute,
    req.body.toDate.second,
    0
  );
  try {
    await new availabilityModel(req.body).save();
    res.json({ message: "availability added successfully", error: null });
  } catch (error) {
    console.log(error);
    res.json({ error: true, message: "Error occured please look at console" });
  }
});
module.exports = router;
