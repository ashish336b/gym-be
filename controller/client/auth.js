const router = require("express").Router();
const clientModel = require("../../models/clientModel");
const { verifyClientToken } = require("../../middleware/authGuard");
const Auth = require("../../helpers/Auth");
/**
 * method : POST
 * url : /client/register
 * Desc : Register Client
 */
router.post("/register", async (req, res, next) => {
  let register = await new Auth(clientModel).register(req);
  if (register) return res.json({ message: "success", error: false });
  return res.json({ message: "could not register", error: true });
});
/**
 * method : POST
 * url : /client/login
 * Desc : Login cleint
 */
router.post("/login", async (req, res, next) => {
  let token = await new Auth(clientModel).login(
    {
      email: req.body.email,
      isDeleted: false,
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
 * method : GET
 * url : /client/me
 * Desc : Get loggedIn client data
 */
router.get("/me", verifyClientToken, async (req, res, next) => {
  res.json(req.clientData.user);
});
module.exports = router;
