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
 * Desc : Login client
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
    message: "Password or Username doesn't Match",
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
/**
 * method : POST
 * url : /client/forgotPassword
 */
router.post("/forgotPassword", async (req, res, next) => {
  try {
    let forgotPassword = await new Auth(clientModel).forgotPassword({
      email: req.body.email,
      isDeleted: false,
    });
    res.json(forgotPassword);
  } catch (error) {
    console.log(error);
    res.json({ error: true, message: "Error Look at console" });
  }
});
/**
 * method : GET
 * url : client/forgotPassword/:id
 */
router.put("/forgotPassword/:id", async (req, res, next) => {
  try {
    let data = await new Auth(clientModel).updatePassword(
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
