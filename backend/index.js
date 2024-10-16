const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const database = require("./config/database");
require("dotenv").config();
const app = express();
const router = require("./routers/route");
const branchRoutes = require("./routers/BranchRoutes");
const protect = require("./middleware/Authtoken");
const userRoutes = require("./routers/UserRoutes");
const acdemicRoutes = require("./routers/AcademicRoutes");
const classRoutes = require("./routers/ClassRoutes");
const sectionRoutes = require("./routers/SectionRoutes");
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/api", router);
app.use("/api/branch", protect.authMiddleware, branchRoutes);
app.use("/api/branch", protect.authMiddleware, userRoutes);
app.use("/api/academic", protect.authMiddleware, acdemicRoutes);
app.use("/api/classes", protect.authMiddleware, classRoutes);
app.use("/api/sections", protect.authMiddleware, sectionRoutes);
database().then(
  app.listen(process.env.PORT, () => {
    console.log("server is running");
  })
);
