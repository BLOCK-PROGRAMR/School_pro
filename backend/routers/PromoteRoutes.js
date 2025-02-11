const express = require("express");
const router = express.Router();

const {promoteStudent } = require("../controller/Promotecontroller");

router.post("/upgrade", promoteStudent);
module.exports = router;
