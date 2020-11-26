const express = require("express");
const router = express.Router();
const {
  verifyTrainerToken,
  verifyAdminToken,
} = require("../middleware/authGuard");
router.use("/admin", require("../controller/admin/auth"));
router.use(
  "/admin/client",
  verifyAdminToken,
  require("../controller/admin/client")
);
router.use("/client", require("../controller/client/auth"));
router.use("/trainer", require("../controller/trainer/auth"));
router.use(
  "/admin/trainer",
  verifyAdminToken,
  require("../controller/admin/trainer")
);
router.use(
  "/trainer/services",
  verifyTrainerToken,
  require("../controller/trainer/services")
);
module.exports = router;
