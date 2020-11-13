const express = require("express");
const router = express.Router();

router.use("/admin", require("../controller/admin/auth"));
router.use("/client", require("../controller/client/auth"));
router.use("/trainer", require("../controller/trainer/auth"));

module.exports = router;
