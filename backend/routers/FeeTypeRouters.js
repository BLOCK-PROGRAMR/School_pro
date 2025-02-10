const express = require("express");
const {
  addFeeType,
  getAllFeeTypes,
  updateFeeType,
  deleteFeeType,
  addFeeToSection,
  updateFeeInSection,
  removeFeeFromSection,
} = require("../controller/FeeTypeController");

const router = express.Router();
router.post("/add", addFeeType);
router.get("/allfeetype/:acyearid", getAllFeeTypes);
router.put("/update/:feeTypeId", updateFeeType);
router.delete("/delete/:feeTypeId", deleteFeeType);
router.post("/fees-section/:sectionId", addFeeToSection);
router.post("/fees-section/update/:sectionId", updateFeeInSection);

router.delete("/fees-section/:sectionId/del/:feeId", removeFeeFromSection);
module.exports = router;
