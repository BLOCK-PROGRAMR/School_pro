import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";

// Main App Components
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Aboutus from "./pages/Aboutus.jsx";
import Contactus from "./pages/Contactus.jsx";
import AdmissionEnquiry from "./pages/AdmissionEnquiry.jsx";
import Feesubmission from "./pages/Feesubmission.jsx";
import Login from "./pages/Login.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

// Admin Components
import Adminlayout from "./pages/Mainadminlayout.jsx";
import Dashboard from "./components/Mainadmin/Dahboard.jsx";
import CreateBranch from "./components/Mainadmin/Branches/CreateBranch.jsx";
import ViewBranches from "./components/Mainadmin/Branches/ViewBranches.jsx";
import ViewBadmin from "./components/Mainadmin/BranchAdmin/ViewBadmin.jsx";

// Branch Admin Components
import BranchAdminlayout from "./pages/BranchAdminLayout.jsx";
import Bdashboard from "./components/BranchAdmin/Dashboard.jsx";
import Add from "./components/BranchAdmin/AcademicYears/Add.jsx";
import ViewAcademicYears from "./components/BranchAdmin/AcademicYears/view-all.jsx";
import AddClass from "./components/BranchAdmin/Classes/AddClass.jsx";
import AddAcademicYear from "./components/BranchAdmin/AcademicYears/Add.jsx";
import Addsection from "./components/BranchAdmin/Sections/Addsection.jsx";
import ViewSections from "./components/BranchAdmin/Sections/Viewsec.jsx";
import AddFeeType from "./components/BranchAdmin/FeeTypes/AddFeeTypes.jsx";
import AddTown from "./components/BranchAdmin/Transport/AddTown.jsx";
import AddBus from "./components/BranchAdmin/Transport/AddBus.jsx";
import AddStudents from "./components/BranchAdmin/Students/AddStudents.jsx";
import StudentsReports from "./components/BranchAdmin/Students/StudentsReports.jsx";
import FeeReport from "./components/BranchAdmin/Students/FeeReport.jsx";
import StudentEdit from "./components/BranchAdmin/Students/StudentEdit.jsx";
import CreateTimeTable from "./components/BranchAdmin/Exams/CreateTimeTable.jsx";
import ViewTimeTable from "./components/BranchAdmin/Exams/ViewTimeTable.jsx";
import FetchReceipts from "./components/BranchAdmin/Students/Fee-Reciepts.jsx";
import EnterMarks from "./components/BranchAdmin/Marks/EnterMarks.jsx";
import ViewMarks from "./components/BranchAdmin/Marks/ViewMarks.jsx";
import CreateSyllabus from "./components/BranchAdmin/Syllabus/CreateSyllabus.jsx";
import ViewSyllabus from "./components/BranchAdmin/Syllabus/ViewSyllabus.jsx";
import UpdateMarks from "./components/BranchAdmin/Marks/UpdateMarks.jsx";
import CreateHallTicket from "./components/BranchAdmin/Marks/CreateHallTicket.jsx";
import AddEnquiry from "./components/BranchAdmin/Enquiry/AddEnquiry.jsx";
import ViewEnquiry from "./components/BranchAdmin/Enquiry/ViewEnquiry.jsx";
import AddTeacher from "./components/BranchAdmin/Teachers/AddTeacher.jsx";
import ViewTeachers from "./components/BranchAdmin/Teachers/ViewTeachers.jsx";
import AssignTeachers from "./components/BranchAdmin/Teachers/AssignTeachers.jsx";
import ViewPerformance from "./components/BranchAdmin/Teachers/ViewPerfomance.jsx";
import CreateWorkingDays from "./components/BranchAdmin/WorkingDays/CreateWorkingDays.jsx";
import ViewWorkingDays from "./components/BranchAdmin/WorkingDays/ViewWorkingDays.jsx";
import ShowReport from "./components/BranchAdmin/VehicleReport/ShowReport.jsx";
import StrengthReports from "./components/BranchAdmin/StrengthReports/StrengthReports.jsx";
import AddAttendance from "./components/BranchAdmin/Attendance/AddAttendance.jsx";
import ViewAttendance from "./components/BranchAdmin/Attendance/ViewAttendance.jsx";
import ProgressReport from "./components/BranchAdmin/ProgressReport/ProgressReport.jsx";
import ViewAll from "./components/BranchAdmin/Classes/ViewAll.jsx";
import LedgerCreation from "./components/BranchAdmin/Ledger/LedgerCreation.jsx";
import VoucherBook from "./components/BranchAdmin/VoucherCreation/VoucherBook.jsx";
import CashBook from "./components/BranchAdmin/Books/CashBook.jsx";
import BankBook from "./components/BranchAdmin/Books/BankBook.jsx";
import FeeLedger from "./components/BranchAdmin/Ledger/FeeLedger.jsx";
import Data from "./components/BranchAdmin/Students/Data.jsx";
import AddAccount from "./components/BranchAdmin/Accountant/AddAccount.jsx";
import FeeData from "./components/BranchAdmin/Students/FeeData.jsx";
import Info from "./components/BranchAdmin/Students/Info.jsx";
import ViewAccountants from "./components/BranchAdmin/Accountant/ViewAccountants.jsx";
import Upgrade from "./components/BranchAdmin/Promote/Upgrade.jsx";
import Trash from "./components/BranchAdmin/Trash/Trash.jsx";
import Bank from "./components/BranchAdmin/BankBook/Bank.jsx";
import Delete from "./components/BranchAdmin/DeletePrev/Delete.jsx";
import AddNotice from "./components/BranchAdmin/Notices/AddNotice.jsx";
import ViewNotice from "./components/BranchAdmin/Notices/ViewNotice.jsx";

// Teacher Components
import TeacherLayout from "./components/Teacher/TeacherLayout.jsx";
import TeacherDashboard from "./components/Teacher/Dashboard/TeacherDashboard.jsx";
import ClassSchedule from "./components/Teacher/Classes/ClassSchedule.jsx";
import CreateHomeWork from "./components/Teacher/Homework/CreateHomeWork.jsx";
import ViewHomeWorks from "./components/Teacher/Homework/ViewHomeWork.jsx";
import MarksTeacher from "./components/Teacher/Marks/MarksTeacher.jsx";
import EditPortfolio from "./components/Teacher/Portfolio/EditPortfolio.jsx";
import TeacherAttendance from "./components/Teacher/attendance/TeacherAttendance.jsx";
import Timetable from "./components/Teacher/examItems/Timetable.jsx";
import Syllabus from "./components/Teacher/examItems/Syllabus.jsx";
import Marks from "./components/Teacher/examItems/Marks.jsx";

// Student Components
import StudentLayout from "./components/Student/StudentLayout.jsx";
import StudentDashboard from "./components/Student/StudentDashboard.jsx";

// Import CSS
import "./index.css";
import Enquiry from "./components/Teacher/Enquiry/Enquiry.jsx";
import Compain from "./components/Teacher/compain/Compain.jsx";
import AddGallery from "./components/BranchAdmin/Gallery/AddGallery.jsx";
import ViewGallery from "./components/BranchAdmin/Gallery/ViewGallery.jsx";
import AddLink from "./components/BranchAdmin/Links/AddLink.jsx";
import ViewLinks from "./components/BranchAdmin/Links/ViewLinks.jsx";
import Checkbar from "./components/BranchAdmin/checkbar.jsx";
import MBranchAdminlayout from "./components/BranchAdmin/MobileView/MBranchAdminLayout.jsx";
import MDashBoard from "./components/BranchAdmin/MobileView/MDashBoard.jsx";

// Accountant Components
import AccountantLayout from "./components/Accountant/AccountantLayout.jsx";
import AccountantDashboard from "./components/Accountant/Dashboard/AccountantDashboard.jsx";
import AccountantProfile from "./components/Accountant/Profile/AccountantProfile.jsx";
import AccountantCheckbar from "./components/Accountant/AccountantCheckbar.jsx";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: <Home />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/about-us",
        element: <Aboutus />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/contact-us",
        element: <Contactus />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/fee-submission",
        element: <Feesubmission />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/admission-enquiry",
        element: <AdmissionEnquiry />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/login",
        element: <Login />,
        errorElement: <ErrorBoundary />,
      },

      // Student Routes
      {
        path: "/student/*",
        element: <StudentLayout />,
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: "",
            element: <StudentDashboard />,
            errorElement: <ErrorBoundary />,
          },
        ],
      },

      // Teacher Routes
      {
        path: "/teacher",
        element: <TeacherLayout />,
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: "",
            element: <TeacherDashboard />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "exams/timetable",
            element: <Timetable />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "exams/syllabus",
            element: <Syllabus />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "exams/marks",
            element: <Marks />,
            errorElement: <ErrorBoundary />
          }, {
            path: "enquiry",
            element: <Enquiry />,
            errorElement: <ErrorBoundary />
          }, {
            path: "compain",
            element: <Compain />,
            errorElement: <ErrorBoundary />

          },
          {
            path: "portfolio",
            element: <EditPortfolio />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "attendance",
            element: <TeacherAttendance />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "classes/schedule",
            element: <ClassSchedule />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "homework",
            element: <CreateHomeWork />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "marks",
            element: <MarksTeacher />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "viewhomework",
            element: <ViewHomeWorks />,
            errorElement: <ErrorBoundary />,
          },
        ],
      },

      // Admin Routes
      {
        path: "/admin",
        element: <Adminlayout />,
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: "",
            element: <Dashboard />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "branch",
            children: [
              {
                path: "create",
                element: <CreateBranch />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "view",
                element: <ViewBranches />,
                errorElement: <ErrorBoundary />,
              },
            ],
          },
          {
            path: "admins",
            children: [
              {
                path: "view-all-admins",
                element: <ViewBadmin />,
                errorElement: <ErrorBoundary />,
              },
            ],
          },
        ],
      },

      // Branch Admin Routes
      {
        path: "/branch-admin",
        element: <Checkbar />,
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: "",
            element: <Bdashboard />,
            errorElement: <ErrorBoundary />,
          }, {
            path: "mdashboard",
            element: <MDashBoard />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "fee-reciepts/:academicYearID",
            element: <FetchReceipts />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "data",
            element: <Data />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "trash",
            element: <Trash />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "prev-data",
            element: <Delete />
          },
          {
            path: "info",
            element: <Info />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "upgrade",
            element: <Upgrade />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "notice/add",
            element: <AddNotice />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "notice/view",
            element: <ViewNotice />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "gallery/add",
            element: <AddGallery />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "gallery/view",
            element: <ViewGallery />,
            errorElement: <ErrorBoundary />
          }, {
            path: "links/add",
            element: <AddLink />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "links/view",
            element: <ViewLinks />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "FeeData",
            element: <FeeData />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "account",
            element: <AddAccount />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "viewaccount",
            element: <ViewAccountants />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "cash/:academicYearID",
            element: <CashBook />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "bank/:academicYearID",
            element: <BankBook />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "fee-card/:academicYearID",
            element: <FeeLedger />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "exam",
            children: [
              {
                path: "create-timetable",
                element: <CreateTimeTable />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "view-timetable",
                element: <ViewTimeTable />,
                errorElement: <ErrorBoundary />,
              },
            ],
          },
          {
            path: "workingdays",
            children: [
              {
                path: "create",
                element: <CreateWorkingDays />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "view",
                element: <ViewWorkingDays />,
                errorElement: <ErrorBoundary />,
              },
            ],
          },
          {
            path: "attendance",
            children: [
              {
                path: "add/:acid",
                element: <AddAttendance />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "view/:acid",
                element: <ViewAttendance />,
                errorElement: <ErrorBoundary />,
              },
            ],
          },
          {
            path: "marks",
            children: [
              {
                path: "enter",
                element: <EnterMarks />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "update",
                element: <UpdateMarks />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "view",
                element: <ViewMarks />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "create",
                element: <CreateHallTicket />,
                errorElement: <ErrorBoundary />,
              },
            ],
          },
          {
            path: "enquiry",
            children: [
              {
                path: "create-enquiry",
                element: <AddEnquiry />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "view-enquiry",
                element: <ViewEnquiry />,
                errorElement: <ErrorBoundary />,
              },
            ],
          },
          {
            path: "syllabus",
            children: [
              {
                path: "create",
                element: <CreateSyllabus />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "view",
                element: <ViewSyllabus />,
                errorElement: <ErrorBoundary />,
              },
            ],
          },
          {
            path: "vehicle",
            children: [
              {
                path: "create",
                element: <ShowReport />,
                errorElement: <ErrorBoundary />,
              },
            ],
          },
          {
            path: "strengthreports",
            children: [
              {
                path: "create",
                element: <StrengthReports />,
                errorElement: <ErrorBoundary />,
              },
            ],
          },
          {
            path: "progressreports",
            children: [
              {
                path: "create",
                element: <ProgressReport />,
                errorElement: <ErrorBoundary />,
              },
            ],
          },
          {
            path: "teachers",
            children: [
              {
                path: "add-teacher",
                element: <AddTeacher />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "view-teachers",
                element: <ViewTeachers />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "assign-teachers",
                element: <AssignTeachers />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "view-perfomance",
                element: <ViewPerformance />,
                errorElement: <ErrorBoundary />,
              },
            ],
          },
          {
            path: "class/view-all/:acid",
            element: <ViewAll />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "class/view-all",
            element: <Add />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "academic-year",
            children: [
              {
                path: "",
                element: <ViewAcademicYears />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "add",
                element: <Add />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "view",
                element: <ViewAcademicYears />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "add-class/",
                element: <AddAcademicYear />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "add-class/:acid",
                element: <AddClass />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "add-section/:classId",
                element: <Addsection />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "view-sections",
                element: <ViewSections />,
                errorElement: <ErrorBoundary />,
              },
            ],
          },
          {
            path: "fee-type/:acid",
            element: <AddFeeType />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "ledger-creation",
            element: <LedgerCreation />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "voucher-creation",
            element: <VoucherBook />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "bank-creation",
            element: <Bank />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "transport",
            children: [
              {
                path: "add-town",
                element: <AddTown />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "add-bus",
                element: <AddBus />,
                errorElement: <ErrorBoundary />,
              },
            ],
          },
          {
            path: "add-student/:acid",
            element: <AddStudents />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "students-report/:acid",
            element: <StudentsReports />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "students/:sid",
            element: <StudentEdit />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "students-payfee/:sid",
            element: <FeeReport />,
            errorElement: <ErrorBoundary />,
          },
        ],
      },

      // Accountant Routes
      {
        path: "/accountant",
        element: <AccountantCheckbar />,
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: "",
            element: <AccountantDashboard />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "mdashboard",
            element: <MDashBoard />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "fee-reciepts/:academicYearID",
            element: <FetchReceipts />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "data",
            element: <Data />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "trash",
            element: <Trash />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "prev-data",
            element: <Delete />
          },
          {
            path: "info",
            element: <Info />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "upgrade",
            element: <Upgrade />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "notice/add",
            element: <AddNotice />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "notice/view",
            element: <ViewNotice />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "gallery/add",
            element: <AddGallery />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "gallery/view",
            element: <ViewGallery />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "links/add",
            element: <AddLink />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "links/view",
            element: <ViewLinks />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "FeeData",
            element: <FeeData />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "account",
            element: <AddAccount />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "viewaccount",
            element: <ViewAccountants />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "cash/:academicYearID",
            element: <CashBook />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "bank/:academicYearID",
            element: <BankBook />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "fee-card/:academicYearID",
            element: <FeeLedger />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "exam",
            children: [
              {
                path: "create-timetable",
                element: <CreateTimeTable />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "view-timetable",
                element: <ViewTimeTable />,
                errorElement: <ErrorBoundary />,
              },
            ],
          },
          {
            path: "workingdays",
            children: [
              {
                path: "create",
                element: <CreateWorkingDays />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "view",
                element: <ViewWorkingDays />,
                errorElement: <ErrorBoundary />,
              },
            ],
          },
          {
            path: "attendance",
            children: [
              {
                path: "add/:acid",
                element: <AddAttendance />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "view/:acid",
                element: <ViewAttendance />,
                errorElement: <ErrorBoundary />,
              },
            ],
          },
          {
            path: "marks",
            children: [
              {
                path: "enter",
                element: <EnterMarks />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "update",
                element: <UpdateMarks />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "view",
                element: <ViewMarks />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "create",
                element: <CreateHallTicket />,
                errorElement: <ErrorBoundary />,
              },
            ],
          },
          {
            path: "enquiry",
            children: [
              {
                path: "create-enquiry",
                element: <AddEnquiry />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "view-enquiry",
                element: <ViewEnquiry />,
                errorElement: <ErrorBoundary />,
              },
            ],
          },
          {
            path: "syllabus",
            children: [
              {
                path: "create",
                element: <CreateSyllabus />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "view",
                element: <ViewSyllabus />,
                errorElement: <ErrorBoundary />,
              },
            ],
          },
          {
            path: "vehicle",
            children: [
              {
                path: "create",
                element: <ShowReport />,
                errorElement: <ErrorBoundary />,
              },
            ],
          },
          {
            path: "strengthreports",
            children: [
              {
                path: "create",
                element: <StrengthReports />,
                errorElement: <ErrorBoundary />,
              },
            ],
          },
          {
            path: "progressreports",
            children: [
              {
                path: "create",
                element: <ProgressReport />,
                errorElement: <ErrorBoundary />,
              },
            ],
          },
          {
            path: "teachers",
            children: [
              {
                path: "add-teacher",
                element: <AddTeacher />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "view-teachers",
                element: <ViewTeachers />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "assign-teachers",
                element: <AssignTeachers />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "view-perfomance",
                element: <ViewPerformance />,
                errorElement: <ErrorBoundary />,
              },
            ],
          },
          {
            path: "class/view-all/:acid",
            element: <ViewAll />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "class/view-all",
            element: <Add />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "academic-year",
            children: [
              {
                path: "",
                element: <ViewAcademicYears />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "add",
                element: <Add />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "view",
                element: <ViewAcademicYears />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "add-class/",
                element: <AddAcademicYear />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "add-class/:acid",
                element: <AddClass />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "add-section/:classId",
                element: <Addsection />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "view-sections",
                element: <ViewSections />,
                errorElement: <ErrorBoundary />,
              },
            ],
          },
          {
            path: "fee-type/:acid",
            element: <AddFeeType />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "ledger-creation",
            element: <LedgerCreation />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "voucher-creation",
            element: <VoucherBook />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "bank-creation",
            element: <Bank />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "transport",
            children: [
              {
                path: "add-town",
                element: <AddTown />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "add-bus",
                element: <AddBus />,
                errorElement: <ErrorBoundary />,
              },
            ],
          },
          {
            path: "add-student/:acid",
            element: <AddStudents />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "students-report/:acid",
            element: <StudentsReports />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "students/:sid",
            element: <StudentEdit />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "students-payfee/:sid",
            element: <FeeReport />,
            errorElement: <ErrorBoundary />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastContainer />
    <RouterProvider router={Router} />
  </React.StrictMode>
);