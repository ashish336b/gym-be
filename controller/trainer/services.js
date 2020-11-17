const router = require("express").Router();
/**
 * method : GET
 * url : /trainer/services
 */
router.get("/", async (req, res, next) => {
  res.json("paginated services");
});
/**
 * method : POST
 * url : /trainer/services
 */
router.post("/", async (req, res, next) => {
  res.json("create services");
});
module.exports = router;
