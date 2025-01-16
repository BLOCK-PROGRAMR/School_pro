import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import FeeReports from "./components/BranchAdmin/Students/Fee-reports.jsx"
import "./index.css";
import CashBook from "./components/BranchAdmin/FeeTypes/CashBook.jsx"
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
import FetchReceipts from  "./components/BranchAdmin/Students/Fee-Reciepts.jsx"
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



const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about-us",
        element: <Aboutus />,
      },
      {
        path: "/contact-us",
        element: <Contactus />,
      },
      {
        path: "/fee-submission",
        element: <Feesubmission />,
      },
      {
        path: "/admission-enquiry",
        element: <AdmissionEnquiry />,
      },
      {
        path: "/login",
        element: <Login />,
      },








      {
        path: "/teacher",
        element: <TeacherLayout />,
        children: [
          {
            path: "",
            element: <TeacherDashboard />,
          },
          {
            path: "portfolio",
            element: <EditPortfolio />,
          },
          {
            path: "attendance",
            element: <TeacherAttendance/>,
          },
          {
            path: "classes/schedule",
            element: <ClassSchedule />,
          },
          {
            path:"homework",
            element: <CreateHomeWork/>
          },
          {
            path:"marks",
            element: <MarksTeacher/>
          },
          {
            path:"viewhomework",
            element: <ViewHomeWorks/>
          },

          // Add more teacher routes here
        ],
      },









      
      {
        path: "/admin",
        element: <Adminlayout />,
        children: [
          {
            path: "",
            element: <Dashboard />,
          },
          {
            path: "branch",

            children: [
              {
                path: "create",
                element: <CreateBranch />,
              },

              {
                path: "view",
                element: <ViewBranches />,
              },
            ],
          },
          {
            path: "admins",
            children: [
              {
                path: "view-all-admins",
                element: <ViewBadmin />,
              },
            ],
          },
        ],
      },
      {
        path: "/branch-admin",
        element: <BranchAdminlayout />,
        children: [
          {
            path: "",
            element: <Bdashboard />,
          },
          {
            path: "fee-reciepts/:academicYearID",
            element: <FetchReceipts/>,
          },
          {
            path: "cash-book/:academicYearID",
            element: <CashBook/>,
          },
          {
            path: "fee-card/:academicYearID",
            element: <FeeReports/>,
          },
          {
            path: "exam",
            children: [{
              path: "create-timetable",
              element: <CreateTimeTable />
            },
            {
              path: "view-timetable",
              element: <ViewTimeTable />
            }]
          },
          {
            path: "workingdays",
            children: [{
              path: "create",
              element: <CreateWorkingDays />
            },
            {
              path: "view",
              element: <ViewWorkingDays />
            }]
          },
          {
            path: "attendance",
            children: [{
              path: "add/:acid",
              element: <AddAttendance />
            },
            {
              path: "view/:acid",
              element: <ViewAttendance />
            }]
          },

          {
            path: "marks",
            children: [{
              path: "enter",
              element: <EnterMarks />
            },
            {
              path: "update",
              element: <UpdateMarks />
            },
            {
              path: "view",
              element: <ViewMarks />
            },

            {


              path: "create",
              element: <CreateHallTicket />

            },
            ]
          },

          {
            path: "enquiry",
            children: [{
              path: "create-enquiry",
              element: <AddEnquiry />
            },
            {
              path: "view-enquiry",
              element: <ViewEnquiry />
            }]
          },
          {
            path: "syllabus",
            children: [{
              path: "create",
              element: <CreateSyllabus />
            },
            {
              path: "view",
              element: <ViewSyllabus />
            }]

          },


          {
            path: "vehicle",
            children: [{
              path: "create",
              element: <ShowReport />
            }]

          }, {
            path: "strengthreports",
            children: [{
              path: "create",
              element: <StrengthReports />
            }]
          }, {
            path: "progressreports",
            children: [
              {
                path: "create",
                element: <ProgressReport />
              },
            ]
          },
          {
            path: "teachers",
            children: [{
              path: "add-teacher",
              element: <AddTeacher />
            },
            {
              path: "view-teachers",
              element: <ViewTeachers />
            }, {
              path: "assign-teachers",
              element: <AssignTeachers />
            }, {
              path: "view-perfomance",
              element: <ViewPerformance />
            }]
          },


          {
            path: "class/view-all/:acid",
            element: <ViewAll />,
          },
          {
            path: "class/view-all",
            element: <Add />,
          },
          {
            path: "academic-year",

            children: [
              {
                path: "add",
                element: <Add />,
              },

              {
                path: "view",
                element: <ViewAcademicYears />,
              },
              {
                path: "add-class/",
                element: <AddAcademicYear />,
              },
              {
                path: "add-class/:acid",
                element: <AddClass />,
              },
              {
                path: "add-section/:classId",
                element: <Addsection />,
              },
              {
                path: "view-sections",
                element: <ViewSections />,
              },
            ],
          },
          {
            path: "fee-type/:acid",
            element: <AddFeeType />,
          },
          {
            path: "transport",
            children: [
              {
                path: "add-town",
                element: <AddTown />,
              },
              {
                path: "add-bus",
                element: <AddBus />,
              },
            ],
          },
          {
            path: "add-student/:acid",
            element: <AddStudents />,
          },
          {
            path: "students-report/:acid",
            element: <StudentsReports />,
          },
          {
            path: "students/:sid",
            element: <StudentEdit />,
          },
          {
            path: "students-payfee/:sid",
            element: <FeeReport />,
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
