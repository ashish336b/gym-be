const router = require("express").Router();
const trainerModel = require("../../models/trainerModel");
const { verifyTrainerToken } = require("../../middleware/authGuard");
const Auth = require("../../helpers/Auth");
/**
 * method : POST
 * url : /admin/register
 */
router.post("/register", async (req, res, next) => {
  let register = await new Auth(trainerModel).register(req);
  if (register) return res.json({ message: "success", error: false });
  return res.json({ message: "could not register", error: true });
});
/**
 * method : POST
 * url : /admin/login
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
 * url : /me
 */
router.get("/me", verifyTrainerToken, async (req, res, next) => {
  res.json(req.trainerData.user);
});
module.exports = router;
