const express = require("express");
const router = express.Router();

router.use("/admin", require("../controller/admin/auth"));

module.exports = router;
