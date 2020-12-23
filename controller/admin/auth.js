const router = require("express").Router();
const adminModel = require("../../models/adminModel");
const { verifyAdminToken } = require("../../middleware/authGuard");
const Auth = require("../../helpers/Auth");
/**
 * method : POST
 * url : /admin/register
 * Desc : Register admin
 */
router.post("/register", async (req, res, next) => {
  let register = await new Auth(adminModel).register(req);
  if (register) return res.json({ message: "success", error: false });
  return res.json({ message: "could not register", error: true });
});
/**
 * method : POST
 * url : /admin/login
 * Desc : login admin
 */
router.post("/login", async (req, res, next) => {
  let token = await new Auth(adminModel).login(
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
 * method : get
 * url : /admin/me
 * Desc: get logged in admin data
 */
router.get("/me", verifyAdminToken, async (req, res, next) => {
  res.json(req.adminData.user);
});
/**
 * method : POST
 * url : admin/forgotPassword
 */
router.post("/forgotPassword", async (req, res, next) => {
  try {
    let forgotPassword = await new Auth(adminModel).forgotPassword({
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
 * url : admin/forgotPassword/:id
 */
router.put("/forgotPassword/:id", async (req, res, next) => {
  try {
    let data = await new Auth(adminModel).updatePassword(
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
