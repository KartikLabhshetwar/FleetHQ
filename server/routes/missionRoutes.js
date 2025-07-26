const express = require("express");
const router = express.Router();
const {
    createMission,
    getMissions,
    getMissionById,
    updateMission,
    deleteMission,
} = require("../controllers/missionController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/").get(getMissions).post(createMission);

router
    .route("/:id")
    .get(getMissionById)
    .put(updateMission)
    .delete(deleteMission);

module.exports = router;
