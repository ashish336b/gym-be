const verifyToken = require("../helpers/verifyToken");

module.exports = {
  verifyAdminToken: async (req, res, next) => {
    let data = await verifyToken(req.headers.authorization);
    if (!data) {
      return res.status(200).json({ error: true, message: "unauthorized" });
    }
    if (data.user.role == "admin") {
      req.adminData = data;
      return next();
    }
    return res.status(200).json({ error: true, message: "unauthorized" });
  },
  verifyTrainerToken: async (req, res, next) => {
    let data = await verifyToken(req.headers.authorization);
    if (!data) {
      return res.status(200).json({ error: true, message: "unauthorized" });
    }
    if (data.user.role == "trainer") {
      req.trainerData = data;
      return next();
    }
    return res.status(200).json({ error: true, message: "unauthorized" });
  },
  verifyClientToken: async (req, res, next) => {
    let data = await verifyToken(req.headers.authorization);
    if (!data) {
      return res.status(200).json({ error: true, message: "unauthorized" });
    }
    if (data.user.role == "client") {
      req.clientData = data;
      return next();
    }
    return res.status(200).json({ error: true, message: "unauthorized" });
  },
};
