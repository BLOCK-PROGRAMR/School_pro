import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Search, CreditCard } from "lucide-react";
import React, { useState } from "react";
import App from "./App";
import FeeReports from "./components/BranchAdmin/Students/FeeReport";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import ViewAll from "./components/BranchAdmin/Classes/ViewAll";
import Aboutus from "./pages/Aboutus";
import Contactus from "./pages/Contactus";
import AdmissionEnquiry from "./pages/AdmissionEnquiry";
import Feesubmission from "./pages/Feesubmission";
import Login from "./pages/Login";
import Adminlayout from "./pages/Mainadminlayout";
import Dashboard from "./components/Mainadmin/Dahboard";
import CreateBranch from "./components/Mainadmin/Branches/CreateBranch";
import UpdateBranch from "./components/Mainadmin/Branches/UpdateBranch";
import DeleteBranch from "./components/Mainadmin/Branches/DeleteBranch";
import ViewBranches from "./components/Mainadmin/Branches/ViewBranches";
import ViewBadmin from "./components/Mainadmin/BranchAdmin/ViewBadmin";
import BranchAdminlayout from "./pages/BranchAdminLayout";
import Bdashboard from "./components/BranchAdmin/Dashboard";
import Add from "./components/BranchAdmin/AcademicYears/Add";
import ViewAcademicYears from "./components/BranchAdmin/AcademicYears/view-all";
import AddClass from "./components/BranchAdmin/Classes/AddClass";
import AddAcademicYear from "./components/BranchAdmin/AcademicYears/Add";
import Addsection from "./components/BranchAdmin/Sections/Addsection";
import ViewSections from "./components/BranchAdmin/Sections/Viewsec";
import AddFeeType from "./components/BranchAdmin/FeeTypes/AddFeeTypes";
import AddTown from "./components/BranchAdmin/Transport/AddTown";
import AddBus from "./components/BranchAdmin/Transport/AddBus";
import AddStudents from "./components/BranchAdmin/Students/AddStudents";
import StudentsReports from "./components/BranchAdmin/Students/StudentsReports";
import FeeReport from "./components/BranchAdmin/Students/FeeReport";
import StudentEdit from "./components/BranchAdmin/Students/StudentEdit";
import CreateTimeTable from "./components/BranchAdmin/Exams/CreateTimeTable";
import ViewTimeTable from "./components/BranchAdmin/Exams/ViewTimeTable";
import FetchReceipts from "./components/BranchAdmin/Students/Fee-Reciepts";
import EnterMarks from "./components/BranchAdmin/Marks/EnterMarks";
import ViewMarks from "./components/BranchAdmin/Marks/ViewMarks";
import CreateSyllabus from "./components/BranchAdmin/Syllabus/CreateSyllabus";
import ViewSyllabus from "./components/BranchAdmin/Syllabus/ViewSyllabus";
import UpdateMarks from "./components/BranchAdmin/Marks/UpdateMarks";
import CreateHallTicket from "./components/BranchAdmin/Marks/CreateHallTicket";
import AddEnquiry from "./components/BranchAdmin/Enquiry/AddEnquiry";
import ViewEnquiry from "./components/BranchAdmin/Enquiry/ViewEnquiry";
import AddTeacher from "./components/BranchAdmin/Teachers/AddTeacher";
import ViewTeachers from "./components/BranchAdmin/Teachers/ViewTeachers";
import AssignTeachers from "./components/BranchAdmin/Teachers/AssignTeachers";
import ViewPerformance from "./components/BranchAdmin/Teachers/ViewPerfomance";
import CreateWorkingDays from "./components/BranchAdmin/WorkingDays/CreateWorkingDays";
import ViewWorkingDays from "./components/BranchAdmin/WorkingDays/ViewWorkingDays";
import ShowReport from "./components/BranchAdmin/VehicleReport/ShowReport";
import StrengthReports from "./components/BranchAdmin/StrengthReports/StrengthReports";
import AddAttendance from "./components/BranchAdmin/Attendance/AddAttendance";
import ViewAttendance from "./components/BranchAdmin/Attendance/ViewAttendance";
import ProgressReport from "./components/BranchAdmin/ProgressReport/ProgressReport";
import TeacherLayout from "./components/Teacher/TeacherLayout";
import TeacherDashboard from "./components/Teacher/Dashboard/TeacherDashboard";
import ClassSchedule from "./components/Teacher/Classes/ClassSchedule";
import CreateHomeWork from "./components/Teacher/Homework/CreateHomeWork";
import ViewHomeWorks from "./components/Teacher/Homework/ViewHomeWork";
import MarksTeacher from "./components/Teacher/Marks/MarksTeacher";
import EditPortfolio from "./components/Teacher/Portfolio/EditPortfolio";
import TeacherAttendance from "./components/Teacher/attendance/TeacherAttendance";
import ErrorBoundary from "./components/ErrorBoundary";
import LedgerCreation from "./components/BranchAdmin/Ledger/LedgerCreation";
import VoucherBook from "./components/BranchAdmin/VoucherCreation/VoucherBook";
import CashBook from "./components/BranchAdmin/Books/CashBook";
import BankBook from "./components/BranchAdmin/Books/BankBook";
import FeeLedger from "./components/BranchAdmin/Ledger/FeeLedger";
import Data from "./components/BranchAdmin/Students/Data";
import AddAccount from "./components/BranchAdmin/Accountant/addAccount";
import FeeData from "./components/BranchAdmin/Students/FeeData";
import Info from "./components/BranchAdmin/Students/Info";
import ViewAccountants from "./components/BranchAdmin/Accountant/ViewAccountants";

// SearchAndPayComponent with improved validation and error handling
const SearchAndPayComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on login page or when paying fees
  if (location.pathname === "/login" || location.pathname.includes("students-payfee")) {
    return null;
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error("Please enter a student ID");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in first");
        navigate("/login");
        return;
      }

      // First get student by ID number
      const response = await fetch(`http://localhost:3490/api/students/get-studentById/${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success && data.data) {
        // Navigate using the MongoDB _id from the response
        navigate(`/branch-admin/students-payfee/${data.data._id}`);
        setSearchQuery(""); // Clear search after navigation
        toast.success("Student found! Redirecting to fee payment...");
      } else {
        toast.error("Student not found. Please check the ID and try again.");
      }
    } catch (error) {
      console.error("Error searching for student:", error);
      toast.error("Error searching for student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <form onSubmit={handleSearch} className="relative flex items-center">
        <input
          type="text"
          placeholder="Student ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-20 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-64 transition-all"
          disabled={loading}
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-0 top-0 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <CreditCard className="h-4 w-4" />
          {loading ? "Searching..." : "Pay Fee"}
        </button>
      </form>
    </div>
  );
};

// AppWrapper component to add search functionality
const AppWrapper = ({ children }) => {
  return (
    <>
      <SearchAndPayComponent />
      {children}
    </>
  );
};

// Create router configuration
const Router = createBrowserRouter([
  {
    path: "/",
    element: <AppWrapper><App /></AppWrapper>,
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
      {
        path: "/branch-admin",
        element: <BranchAdminlayout />,
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: "",
            element: <Bdashboard />,
            errorElement: <ErrorBoundary />,
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
            path: "info",
            element: <Info />,
            errorElement: <ErrorBoundary />,
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

// Render the application
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastContainer 
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    <RouterProvider router={Router} />
  </StrictMode>
);