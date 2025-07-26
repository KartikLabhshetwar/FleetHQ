const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();


const authRoutes = require("./routes/authRoutes");
const missionRoutes = require("./routes/missionRoutes");
const droneRoutes = require("./routes/droneRoutes"); 

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", authRoutes);
app.use("/api/missions", missionRoutes);
app.use("/api/drones", droneRoutes); 


app.get("/", (req, res) => {
  res.json({ message: "fleetHq API is running" });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Server error", error: err.message });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
