const router = require("express").Router();
const trainerModel = require("../../models/trainerModel");
const bcrypt = require("bcryptjs");
const { verifyTrainerToken } = require("../../middleware/authGuard");
/**
 * method : POST
 * url : /admin/register
 */
router.post("/register", async (req, res, next) => {
  try {
    req.body.password = bcrypt.hashSync(
      req.body.password,
      bcrypt.genSaltSync(10)
    );
    await new trainerModel(req.body).save();
    res.json({ message: "success", error: false });
  } catch (error) {
    console.log(error);
    res.json({ message: "could not register", error: true });
  }
});
/**
 * method : POST
 * url : /admin/login
 */
router.post("/login", async (req, res, next) => {
  const jwt = require("jsonwebtoken");
  const user = await trainerModel.findOne({
    email: req.body.email,
    isDeleted: false,
  });
  if (!user) {
    return res.status(403).json({
      error: true,
      message: "Password Or username doesn't Match",
    });
  }
  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(403).json({
      error: true,
      message: "Password Or username doesn't Match",
    });
  }
  user.password = null;
  var token = await jwt.sign({ user: user }, "12helloworld12", {
    expiresIn: "12h",
  });
  res.json({ token: token, error: null });
});
/**
 * method : get
 * url : /me
 */
router.get("/me", verifyTrainerToken, async (req, res, next) => {
  res.json(req.trainerData.user);
});
module.exports = router;
