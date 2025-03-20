const express = require("express");
const router = express.Router();
const StudentControllers = require("../controller/StudentController");

router.post("/add-student", StudentControllers.addStudent);
router.post("/get-student/:sectionId", StudentControllers.getStudentsBySection);
router.get("/get-student/:sid", StudentControllers.getStudentById);
router.get("/get-studentById/:idNo", StudentControllers.getStudentByIdNo);
router.put("/edit-student/:sid", StudentControllers.updateStudent);
router.delete("/delete-student/:sid", StudentControllers.deleteStudent);
router.put("/pay-fee/:sid", StudentControllers.updateFeeDetails);
router.get("/get-students/branch/:branchId", StudentControllers.getStudentIdByBranch);

module.exports = router;