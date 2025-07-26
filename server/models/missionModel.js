const mongoose = require("mongoose");

const missionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a mission name"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    drone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drone",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "draft",
        "scheduled",
        "in-progress",
        "completed",
        "cancelled",
        "aborted",
      ],
      default: "draft",
    },
    surveyArea: {
      type: {
        type: String,
        enum: ["Polygon"],
        required: true,
      },
      coordinates: {
        type: [[[Number]]], // GeoJSON Polygon coordinates format
        required: true,
      },
    },
    flightParameters: {
      altitude: {
        type: Number,
        required: true,
        min: 10,
        max: 500,
      },
      speed: {
        type: Number,
        required: true,
        min: 1,
        max: 20,
      },
      flightPattern: {
        type: String,
        enum: ["grid", "perimeter", "crosshatch"],
        default: "grid",
      },
      overlap: {
        type: Number,
        min: 0,
        max: 90,
        default: 70,
      },
    },
    schedule: {
      type: {
        type: String,
        enum: ["oneTime", "recurring"],
        default: "oneTime",
      },
      dateTime: {
        type: Date,
        required: true,
      },
      recurrence: {
        frequency: {
          type: String,
          enum: ["daily", "weekly", "monthly"],
        },
        interval: {
          type: Number,
          min: 1,
          max: 30,
        },
        endDate: {
          type: Date,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

missionSchema.index({ surveyArea: "2dsphere" });

module.exports = mongoose.model("Mission", missionSchema);
