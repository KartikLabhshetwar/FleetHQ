const Mission = require("../models/missionModel");
const User = require("../models/userModel");
const Drone = require("../models/droneModel");

const createMission = async (req, res) => {
  try {
    const { name, description, surveyArea, flightParameters, schedule, drone } =
      req.body;

    if (!drone) {
      return res
        .status(400)
        .json({ message: "A drone must be assigned to the mission" });
    }

    const droneExists = await Drone.findById(drone);
    if (!droneExists) {
      return res.status(404).json({ message: "Selected drone not found" });
    }

    if (droneExists.status !== "available") {
      return res
        .status(400)
        .json({ message: "Selected drone is not available" });
    }

    const missionDateTime = new Date(schedule.dateTime);
    const overlappingMissions = await Mission.find({
      drone: drone,
      "schedule.dateTime": { $eq: missionDateTime },
      status: { $in: ["scheduled", "in-progress"] },
    });

    if (overlappingMissions.length > 0) {
      return res.status(400).json({
        message:
          "The selected drone is already assigned to another mission at this time",
      });
    }

    const mission = await Mission.create({
      name,
      description,
      user: req.user.id,
      drone,
      surveyArea,
      flightParameters,
      schedule,
      status: "scheduled",
    });

    res.status(201).json(mission);
  } catch (error) {
    console.error("Error creating mission:", error);
    res.status(500).json({ message: error.message });
  }
};


const getMissions = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { user: req.user.id };

    const missions = await Mission.find(filter)
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("drone", "name model serialNumber");

    res.status(200).json(missions);
  } catch (error) {
    console.error("Error fetching missions:", error);
    res.status(500).json({ message: error.message });
  }
};

const getMissionById = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id)
      .populate("user", "name email")
      .populate("drone", "name model serialNumber");

    if (!mission) {
      return res.status(404).json({ message: "Mission not found" });
    }

    if (
      mission.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this mission" });
    }

    res.status(200).json(mission);
  } catch (error) {
    console.error("Error fetching mission:", error);
    res.status(500).json({ message: error.message });
  }
};

const updateMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({ message: "Mission not found" });
    }

    if (mission.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this mission" });
    }


    if (mission.status === "completed" && !req.body.status) {
      return res
        .status(400)
        .json({
          message: `Cannot update mission with status: ${mission.status}`,
        });
    }

    if (
      mission.status === "in-progress" &&
      !["completed", "aborted"].includes(req.body.status)
    ) {

      if (Object.keys(req.body).length > 1 || !req.body.status) {
        return res
          .status(400)
          .json({
            message:
              "Cannot update mission details while in progress. Only status changes are allowed.",
          });
      }
    }


    if (req.body.drone && req.body.drone !== mission.drone.toString()) {
      const newDrone = await Drone.findById(req.body.drone);
      if (!newDrone) {
        return res.status(404).json({ message: "Selected drone not found" });
      }

      if (newDrone.status !== "available") {
        return res
          .status(400)
          .json({ message: "Selected drone is not available" });
      }

      const missionDateTime = req.body.schedule?.dateTime
        ? new Date(req.body.schedule.dateTime)
        : mission.schedule.dateTime;

      const overlappingMissions = await Mission.find({
        drone: req.body.drone,
        _id: { $ne: req.params.id },
        "schedule.dateTime": { $eq: missionDateTime },
        status: { $in: ["scheduled", "in-progress"] },
      });

      if (overlappingMissions.length > 0) {
        return res.status(400).json({
          message:
            "The selected drone is already assigned to another mission at this time",
        });
      }
    }


    if (req.body.status === "in-progress" && mission.status !== "in-progress") {
      await Drone.findByIdAndUpdate(mission.drone, { status: "in-mission" });
    }

    if (
      mission.status === "in-progress" &&
      ["completed", "aborted"].includes(req.body.status)
    ) {
      await Drone.findByIdAndUpdate(mission.drone, { status: "available" });
    }

    const updatedMission = await Mission.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("drone", "name model serialNumber");

    res.status(200).json(updatedMission);
  } catch (error) {
    console.error("Error updating mission:", error);
    res.status(500).json({ message: error.message });
  }
};

const deleteMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({ message: "Mission not found" });
    }

    if (mission.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this mission" });
    }

    if (mission.status === "in-progress") {
      return res
        .status(400)
        .json({ message: "Cannot delete a mission that is in progress" });
    }

    await mission.deleteOne();

    res.status(200).json({ id: req.params.id, message: "Mission removed" });
  } catch (error) {
    console.error("Error deleting mission:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMission,
  getMissions,
  getMissionById,
  updateMission,
  deleteMission,
};
