const router = require("express").Router();
const clientModel = require("../../models/clientModel");
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
 * url : /admin/client/:id
 * Desc : get specific client by id
 */
router.get("/:id", async (req, res, next) => {
  res.json(await clientModel.findById(req.params.id));
});
/**
 * method : DELETE
 * url : /admin/client/:id
 */
router.delete("/:id", async (req, res, next) => {
  try {
    await clientModel.findByIdAndUpdate(req.params.id, { isDeleted: false });
    res.json({ error: null, message: "successfully deleted" });
  } catch (error) {
    console.log(error);
    res.json({ error: true, message: "error occured please look at console" });
  }
});
module.exports = router;
