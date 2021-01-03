const router = require("express").Router();
const trainerModel = require("../../models/trainerModel");
const { verifyTrainerToken } = require("../../middleware/authGuard");
const Auth = require("../../helpers/Auth");
const config = require("../../config");
/**
 * method : POST
 * url : /trainer/register
 */
router.post("/register", async (req, res, next) => {
  let register = await new Auth(trainerModel).register(req);
  if (register) return res.json({ message: "success", error: false });
  return res.json({ message: "could not register", error: true });
});
/**
 * method : POST
 * url : /trainer/login
 */
router.post("/login", async (req, res, next) => {
  let token = await new Auth(trainerModel).login(
    {
      email: req.body.email,
      isDeleted: false,
      isApproved: true,
    },
    req
  );
  if (token) return res.json({ token: token, error: null });
  return res.status(403).json({
    error: true,
    message: "Password Or username doesn't Match",
  });
});
/**
 * method : get
 * url : /trainer/me
 */
router.get("/me", verifyTrainerToken, async (req, res, next) => {
  res.json(req.trainerData.user);
});
/**
 * method : POST
 * url : trainer/forgotPassword
 */
router.post("/forgotPassword", async (req, res, next) => {
  try {
    let forgotPassword = await new Auth(trainerModel).forgotPassword(
      {
        email: req.body.email,
        isDeleted: false,
        isApproved: true,
      },
      `${config.mailBaseUrl}/trainer/reset-password`,
      req
    );
    res.json(forgotPassword);
  } catch (error) {
    console.log(error);
    res.json({ error: true, message: "Error Look at console" });
  }
});
/**
 * method : GET
 * url : /trainer/forgotPassword/:id
 */
router.put("/forgotPassword/:id", async (req, res, next) => {
  try {
    let data = await new Auth(trainerModel).updatePassword(
      {
        token: req.params.id,
      },
      req
    );
    if (!data) {
      res.json({ error: true, message: "Cannot Update Mail" });
    }
    res.json(data);
  } catch (error) {
    res.json({ error: true, message: "error" });
    console.log(error);
  }
});
module.exports = router;
