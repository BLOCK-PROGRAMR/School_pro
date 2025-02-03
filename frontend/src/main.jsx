import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import FeeReports from "./components/BranchAdmin/Students/FeeReport.jsx"
import "./index.css";
// import CashBook from "./components/BranchAdmin/FeeTypes/CashBook.jsx"
import { ToastContainer } from "react-toastify";
import React from "react";
import Home from "./pages/Home.jsx";
import ViewAll from "./components/BranchAdmin/Classes/ViewAll.jsx";
import Aboutus from "./pages/Aboutus.jsx";
import Contactus from "./pages/Contactus.jsx";
import AdmissionEnquiry from "./pages/AdmissionEnquiry.jsx";
import Feesubmission from "./pages/Feesubmission.jsx";
import Login from "./pages/Login.jsx";
import Adminlayout from "./pages/Mainadminlayout.jsx";
import Dashboard from "./components/Mainadmin/Dahboard.jsx";
import CreateBranch from "./components/Mainadmin/Branches/CreateBranch.jsx";
import UpdateBranch from "./components/Mainadmin/Branches/UpdateBranch.jsx";
import DeleteBranch from "./components/Mainadmin/Branches/DeleteBranch.jsx";
import ViewBranches from "./components/Mainadmin/Branches/ViewBranches.jsx";
import ViewBadmin from "./components/Mainadmin/BranchAdmin/ViewBadmin.jsx";
import BranchAdminlayout from "./pages/BranchAdminLayout.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import FetchReceipts from "./components/BranchAdmin/Students/Fee-Reciepts.jsx"
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





import TeacherLayout from "./components/Teacher/TeacherLayout.jsx";
import TeacherDashboard from "./components/Teacher/Dashboard/TeacherDashboard.jsx";
import ClassSchedule from "./components/Teacher/Classes/ClassSchedule.jsx";
import CreateHomeWork from "./components/Teacher/Homework/CreateHomeWork.jsx";
import ViewHomeWorks from "./components/Teacher/Homework/ViewHomeWork.jsx";
import MarksTeacher from "./components/Teacher/Marks/MarksTeacher.jsx";


import EditPortfolio from "./components/Teacher/Portfolio/EditPortfolio.jsx";
import TeacherAttendance from "./components/Teacher/attendance/TeacherAttendance.jsx";



import ErrorBoundary from "./components/ErrorBoundary.jsx";
import LedgerCreation from "./components/BranchAdmin/Ledger/LedgerCreation.jsx";
import VoucherBook from "./components/BranchAdmin/VoucherCreation/VoucherBook.jsx";




import CashBook from "./components/BranchAdmin/Books/CashBook.jsx";
import BankBook from "./components/BranchAdmin/Books/BankBook.jsx";
import FeeLedger from "./components/BranchAdmin/Ledger/FeeLedger.jsx";



import Data from "./components/BranchAdmin/Students/Data.jsx"


import AddAccount from "./components/BranchAdmin/Accountant/addAccount.jsx";
import FeeData from "./components/BranchAdmin/Students/FeeData.jsx";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: <Home />,
        errorElement: <ErrorBoundary />
      },
      {
        path: "/about-us",
        element: <Aboutus />,
        errorElement: <ErrorBoundary />
      },
      {
        path: "/contact-us",
        element: <Contactus />,
        errorElement: <ErrorBoundary />
      },
      {
        path: "/fee-submission",
        element: <Feesubmission />,
        errorElement: <ErrorBoundary />
      },
      {
        path: "/admission-enquiry",
        element: <AdmissionEnquiry />,
        errorElement: <ErrorBoundary />
      },
      {
        path: "/login",
        element: <Login />,
        errorElement: <ErrorBoundary />
      },








      {
        path: "/teacher",
        element: <TeacherLayout />,
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: "",
            element: <TeacherDashboard />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "portfolio",
            element: <EditPortfolio />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "attendance",
            element: <TeacherAttendance />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "classes/schedule",
            element: <ClassSchedule />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "homework",
            element: <CreateHomeWork />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "marks",
            element: <MarksTeacher />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "viewhomework",
            element: <ViewHomeWorks />,
            errorElement: <ErrorBoundary />
          },

          // Add more teacher routes here
        ],
      },










      {
        path: "/admin",
        element: <Adminlayout />,
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: "",
            element: <Dashboard />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "branch",

            children: [
              {
                path: "create",
                element: <CreateBranch />,
                errorElement: <ErrorBoundary />
              },

              {
                path: "view",
                element: <ViewBranches />,
                errorElement: <ErrorBoundary />
              },
            ],
          },
          {
            path: "admins",
            children: [
              {
                path: "view-all-admins",
                element: <ViewBadmin />,
                errorElement: <ErrorBoundary />
              },
            ],
          },
        ],
      },
      {
        path: "/branch-admin",
        element: <BranchAdminlayout />,
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: "",
            element: <Bdashboard />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "fee-reciepts/:academicYearID",
            element: <FetchReceipts />,
            errorElement: <ErrorBoundary />
          },



          {
            path: "data",
            element: <Data />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "FeeData",
            element: <FeeData />,
            errorElement: <ErrorBoundary />
          },


          {
            path: "account",
            element: <AddAccount />,
            errorElement: <ErrorBoundary />
          },



          // {
          //   path: "cash-book/:academicYearID",
          //   element: <CashBook />,
          //   errorElement: <ErrorBoundary />
          // },
          {
            path: "cash/:academicYearID",
            element: <CashBook />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "bank/:academicYearID",
            element: <BankBook />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "fee-card/:academicYearID",
            element: <FeeLedger />,//<FeeLedger><FeeLedger/>
            errorElement: <ErrorBoundary />
          },
          // {
          //   path: "fee-report/:academicYearID",
          //   element: <FeeReport />,//<FeeLedger><FeeLedger/>
          //   errorElement: <ErrorBoundary />
          // },
          {
            path: "exam",
            children: [{
              path: "create-timetable",
              element: <CreateTimeTable />,
              errorElement: <ErrorBoundary />
            },
            {
              path: "view-timetable",
              element: <ViewTimeTable />,
              errorElement: <ErrorBoundary />
            }]
          },
          {
            path: "workingdays",
            children: [{
              path: "create",
              element: <CreateWorkingDays />,
              errorElement: <ErrorBoundary />
            },
            {
              path: "view",
              element: <ViewWorkingDays />,
              errorElement: <ErrorBoundary />
            }]
          },
          {
            path: "attendance",
            children: [{
              path: "add/:acid",
              element: <AddAttendance />,
              errorElement: <ErrorBoundary />
            },
            {
              path: "view/:acid",
              element: <ViewAttendance />,
              errorElement: <ErrorBoundary />
            }]
          },

          {
            path: "marks",
            children: [{
              path: "enter",
              element: <EnterMarks />,
              errorElement: <ErrorBoundary />
            },
            {
              path: "update",
              element: <UpdateMarks />,
              errorElement: <ErrorBoundary />
            },
            {
              path: "view",
              element: <ViewMarks />,
              errorElement: <ErrorBoundary />
            },

            {


              path: "create",
              element: <CreateHallTicket />,
              errorElement: <ErrorBoundary />
            },
            ]
          },

          {
            path: "enquiry",
            children: [{
              path: "create-enquiry",
              element: <AddEnquiry />,
              errorElement: <ErrorBoundary />
            },
            {
              path: "view-enquiry",
              element: <ViewEnquiry />,
              errorElement: <ErrorBoundary />
            }]
          },
          {
            path: "syllabus",
            children: [{
              path: "create",
              element: <CreateSyllabus />,
              errorElement: <ErrorBoundary />
            },
            {
              path: "view",
              element: <ViewSyllabus />,
              errorElement: <ErrorBoundary />
            }]

          },


          {
            path: "vehicle",
            children: [{
              path: "create",
              element: <ShowReport />,
              errorElement: <ErrorBoundary />
            }]

          }, {
            path: "strengthreports",
            children: [{
              path: "create",
              element: <StrengthReports />,
              errorElement: <ErrorBoundary />
            }]
          }, {
            path: "progressreports",
            children: [
              {
                path: "create",
                element: <ProgressReport />,
                errorElement: <ErrorBoundary />
              },
            ]
          },
          {
            path: "teachers",
            children: [{
              path: "add-teacher",
              element: <AddTeacher />,
              errorElement: <ErrorBoundary />
            },
            {
              path: "view-teachers",
              element: <ViewTeachers />,
              errorElement: <ErrorBoundary />
            }, {
              path: "assign-teachers",
              element: <AssignTeachers />,
              errorElement: <ErrorBoundary />
            }, {
              path: "view-perfomance",
              element: <ViewPerformance />,
              errorElement: <ErrorBoundary />
            }]
          },


          {
            path: "class/view-all/:acid",
            element: <ViewAll />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "class/view-all",
            element: <Add />,
            errorElement: <ErrorBoundary />
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
                errorElement: <ErrorBoundary />
              },

              {
                path: "view",
                element: <ViewAcademicYears />,
                errorElement: <ErrorBoundary />
              },
              {
                path: "add-class/",
                element: <AddAcademicYear />,
                errorElement: <ErrorBoundary />
              },
              {
                path: "add-class/:acid",
                element: <AddClass />,
                errorElement: <ErrorBoundary />
              },
              {
                path: "add-section/:classId",
                element: <Addsection />,
                errorElement: <ErrorBoundary />
              },
              {
                path: "view-sections",
                element: <ViewSections />,
                errorElement: <ErrorBoundary />
              },
            ],
          },
          {
            path: "fee-type/:academicYear",
            element: <AddFeeType />,
            errorElement: <ErrorBoundary />
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
            path: "transport",
            children: [
              {
                path: "add-town",
                element: <AddTown />,
                errorElement: <ErrorBoundary />
              },
              {
                path: "add-bus",
                element: <AddBus />,
                errorElement: <ErrorBoundary />
              },
            ],
          },
          {
            path: "add-student/:acid",
            element: <AddStudents />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "students-report/:acid",
            element: <StudentsReports />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "students/:sid",
            element: <StudentEdit />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "students-payfee/:sid",
            element: <FeeReport />,
            errorElement: <ErrorBoundary />
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
