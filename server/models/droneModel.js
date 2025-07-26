const mongoose = require("mongoose");

const droneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a drone name"],
      trim: true,
    },
    serialNumber: {
      type: String,
      required: [true, "Please add a serial number"],
      unique: true,
      trim: true,
    },
    model: {
      type: String,
      required: [true, "Please add a drone model"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["available", "in-mission", "maintenance", "offline"],
      default: "available",
    },
    batteryLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
    maxFlightTime: {
      type: Number, // in minutes
      required: true,
      min: 5,
      max: 180,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      latitude: {
        type: Number,
        default: 0,
      },
      longitude: {
        type: Number,
        default: 0,
      },
      altitude: {
        type: Number,
        default: 0,
      },
      locationName: {
        type: String,
        default: "",
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },
    healthStatus: {
      type: String,
      enum: ["excellent", "good", "fair", "needs-attention", "critical"],
      default: "excellent",
    },
    lastMaintenance: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Drone", droneSchema);
