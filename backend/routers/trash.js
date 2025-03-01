const express = require("express");
const router = express.Router();
const TrashController = require("../controller/TrashController");

// Move student to trash
router.post("/move-to-trash/:sid", TrashController.moveToTrash);

// Get all trashed students
router.get("/get-trashed-students", TrashController.getTrashedStudents);

// Restore student from trash
router.post("/restore-student/:sid", TrashController.restoreFromTrash);

// Permanently delete student from trash
router.delete("/delete-permanently/:sid", TrashController.permanentlyDeleteStudent);

module.exports = router;