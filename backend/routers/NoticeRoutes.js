const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const NoticeController = require("../controller/noticeController");

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

// Create upload middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Routes
router.post("/add-notice", upload.array("files", 10), NoticeController.addNotice);
router.get("/get-notices", NoticeController.getNotices);
router.get("/get-notice/:noticeId", NoticeController.getNoticeById);
router.put("/update-notice/:noticeId", upload.array("files", 10), NoticeController.updateNotice);
router.delete("/delete-notice/:noticeId", NoticeController.deleteNotice);
router.delete("/delete-file/:noticeId/:fileId", NoticeController.deleteFile);
router.get("/branch/get-notice/:branchId", NoticeController.getNoticeByBranchId);

module.exports = router;