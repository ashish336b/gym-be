const goalsModel = require("../../models/goalsModel");

const router = require("express").Router();
/**
 * method : POST
 * url : /client/goals
 */
router.post("/", async (req, res, next) => {
  try {
    req.body.client = req.clientData.user._id;
    await new goalsModel(req.body).save();
    res.json({ error: null, message: "success" });
  } catch (error) {
    console.log(error);
    res.json({ error: true, message: "Error" });
  }
});
/**
 * method : PUT
 * url : /client/goals/:id
 */
router.put("/:id", async (req, res, next) => {
  try {
    await goalsModel.findByIdAndUpdate(req.params.id, req.body);
    res.json({ error: null, message: "success" });
  } catch (error) {}
});
/**
 * method : GET
 * url : /client/goals
 */
router.get("/", async (req, res, next) => {
  try {
    let obj = require("mongoose").Types.ObjectId;
    let data = await goalsModel.find({
      isDeleted: false,
      client: obj(req.clientData.user._id),
    });
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
