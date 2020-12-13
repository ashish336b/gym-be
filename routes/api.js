const express = require("express");
const router = express.Router();
const {
  verifyTrainerToken,
  verifyAdminToken,
  verifyClientToken,
} = require("../middleware/authGuard");
/**
 * admin Routes
 */
router.use("/admin", require("../controller/admin/auth"));
router.use(
  "/admin/client",
  verifyAdminToken,
  require("../controller/admin/client")
);
router.use(
  "/admin/trainer",
  verifyAdminToken,
  require("../controller/admin/trainer")
);
/**
 * Client Routes
 */
router.use("/client", require("../controller/client/auth"));
router.use(
  "/client/trainer",
  verifyClientToken,
  require("../controller/client/trainer")
);
/**
 * Trainer Routes
 */
router.use("/trainer", require("../controller/trainer/auth"));
router.use(
  "/trainer/services",
  verifyTrainerToken,
  require("../controller/trainer/services")
);
router.use(
  "/trainer/client",
  verifyTrainerToken,
  require("../controller/trainer/client")
);
module.exports = router;
