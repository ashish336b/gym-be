const router = require("express").Router();
const trainerModel = require("../../models/trainerModel");
const { verifyAdminToken } = require("../../middleware/authGuard");
const paginate = require("../../helpers/paginate");
/**
 * method : GET
 * url : /admin/trainer
 */
router.get("/", verifyAdminToken, async (req, res, next) => {
  let paginatedData = await paginate(
    trainerModel,
    {
      searchableField: [
        "name.firstName",
        "name.lastName",
        "name.middleName",
        "email",
      ],
      filterBy: { isDeleted: false },
    },
    req
  );
  res.json(paginatedData);
});
/**
 * method : GET
 * url : /admin/trainer/:id
 */
router.get("/:id", async (req, res, next) => {
  try {
    let oneTrainer = await trainerModel.findById(req.params.id);
    if (oneTrainer.isDeleted)
      return res.json({ message: "cannot get trainer Data" });
    res.json(oneTrainer);
  } catch (error) {
    console.log(error);
    res.json({ message: "cannot get trainer Data" });
  }
});
/**
 * method : GET
 * url : /admin/trainer/:id/approve
 */
router.post("/:id/approve", async (req, res, next) => {
  try {
    await trainerModel.findByIdAndUpdate(req.params.id, { isApproved: true });
    res.json({ message: "successfully approved" });
  } catch (error) {
    console.log(error);
    res.json({ message: "cannot update admin" });
  }
});
/**
 * method : DELETE
 * url : /admin/trainer/:id
 */
router.delete("/:id", async (req, res, next) => {
  try {
    await trainerModel.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ message: "deleted Successfully", error: null });
  } catch (error) {
    console.log(error);
    res.json({ message: "cannot delete", error: true });
  }
});
module.exports = router;
