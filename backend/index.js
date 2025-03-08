const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const database = require("./config/database");
require("dotenv").config();
const app = express();

// Import all routes
const router = require("./routers/route");
const branchRoutes = require("./routers/BranchRoutes");
const protect = require("./middleware/Authtoken");
const userRoutes = require("./routers/UserRoutes");
const acdemicRoutes = require("./routers/AcademicRoutes");
const classRoutes = require("./routers/ClassRoutes");
const sectionRoutes = require("./routers/SectionRoutes");
const feeRoutes = require("./routers/FeeTypeRouters");
const townroutes = require("./routers/TownRoutes");
const busroutes = require("./routers/BusRoutes");
const studentRoutes = require("./routers/studentRoutes");
const examRoutes = require("./routers/ExamRoutes");
const marksRoutes = require("./routers/MarksRoutes");
const syllabusRoutes = require("./routers/SyllabusRoutes.js");
const teacherRoutes = require("./routers/TeacherRoutes");
const teacherAssignRoutes = require("./routers/TeacherAssignRoutes.js");
const workingdays = require("./routers/WorkingDaysRoutes.js");
const attendanceRoutes = require("./routers/AttendanceRoutes.js");
const homeworkroutes = require("./routers/HomeWorkRoutes.js");
const receiptRoutes = require("./routers/RecieptsRoutes.js");
const ledgerRoutes = require("./routers/ledgerRoutes");
const enquiryRoutes = require("./routers/enquiryRoutes");
const voucherRoutes = require("./routers/voucherRoutes");
const bookRoutes = require("./routers/bookRoutes");
const accountRoutes = require("./routers/AccountRoutes");
const PromoteRoutes = require("./routers/PromoteRoutes.js");
const BankRoutes = require("./routers/BankRoutes.js");
const DeleteRoutes = require("./routers/DeleteRoutes.js");
const NoticeRoutes = require("./routers/NoticeRoutes.js");
const trashRoutes = require('./routers/trash.js');
const galleryRoutes = require("./routers/galleryRoutes.js");
const linkRoutes = require("./routers/linkRoutes.js");

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api", router);
app.use("/api/branch", protect.authMiddleware, branchRoutes);
app.use("/api/branch", protect.authMiddleware, userRoutes);
app.use("/api/academic", protect.authMiddleware, acdemicRoutes);
app.use("/api/classes", protect.authMiddleware, classRoutes);
app.use("/api/sections", protect.authMiddleware, sectionRoutes);
app.use("/api/Fee-types", protect.authMiddleware, feeRoutes);
app.use("/api/towns", protect.authMiddleware, townroutes);
app.use("/api/buses", protect.authMiddleware, busroutes);
app.use("/api/students", protect.authMiddleware, studentRoutes);
app.use("/api/exams", protect.authMiddleware, examRoutes);
app.use("/api/marks", protect.authMiddleware, marksRoutes);
app.use("/api/syllabus", protect.authMiddleware, syllabusRoutes);
app.use("/api/teachers", protect.authMiddleware, teacherRoutes);
app.use("/api/teachersassingn", protect.authMiddleware, teacherAssignRoutes);
app.use("/api/workingdays", protect.authMiddleware, workingdays);
app.use("/api/attendance", protect.authMiddleware, attendanceRoutes);
app.use("/api/homework", protect.authMiddleware, homeworkroutes);
app.use("/api/ledger", protect.authMiddleware, ledgerRoutes);
app.use("/api/receipts", protect.authMiddleware, receiptRoutes);
app.use("/api/enquiry", protect.authMiddleware, enquiryRoutes);
app.use("/api/vouchers", protect.authMiddleware, voucherRoutes);
app.use("/api/books", protect.authMiddleware, bookRoutes);
app.use("/api/accounts", protect.authMiddleware, accountRoutes);
app.use("/api/promote", protect.authMiddleware, PromoteRoutes);
app.use("/api/bank", protect.authMiddleware, BankRoutes);
app.use("/api/academic", protect.authMiddleware, DeleteRoutes);
app.use("/api/notices", protect.authMiddleware, NoticeRoutes);
app.use("/api/trash", protect.authMiddleware, trashRoutes);
app.use("/api/gallery", protect.authMiddleware, galleryRoutes);
app.use("/api/links", protect.authMiddleware, linkRoutes);

// Start server
database().then(
  app.listen(process.env.PORT, () => {
    console.log("server is running");
  })
);