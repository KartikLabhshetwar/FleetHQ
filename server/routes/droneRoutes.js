const express = require("express");
const router = express.Router();
const {
  createDrone,
  getDrones,
  getAvailableDrones,
  getDroneById,
  updateDrone,
  deleteDrone,
} = require("../controllers/droneController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/").get(getDrones).post(createDrone);

router.route("/available").get(getAvailableDrones);

router.route("/:id").get(getDroneById).put(updateDrone).delete(deleteDrone);

module.exports = router;
