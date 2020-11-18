const serviceModel = require("../../models/serviceModel");
const router = require("express").Router();
/**
 * method : GET
 * url : /trainer/services
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
 */
router.put("/:id", async (req, res, next) => {
  res.json("edit");
});
module.exports = router;
