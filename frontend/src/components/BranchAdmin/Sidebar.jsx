import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { mycon } from "../../store/Mycontext";
import {
  Home,
  GraduationCap,
  Calendar,
  Plus,
  FileText,
  LogOut,
  DollarSign,
  Bus,
  Users,
  Book,
  Award,
  ClipboardList,
  MessageSquare,
  Clock,
  UserCheck,
  BarChart2,
  TrendingUp,
  Menu,
  ChevronDown,
  ChevronRight,
  School,
  BookOpen,
  CalendarDays,
  Building,
  Briefcase,
  BookMarked,
  UserPlus,
  ClipboardCheck,
  MapPin,
  Bell,
  Layers
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { branchdet } = useContext(mycon);

  const currentAcademicYear = branchdet?.academicYears?.[0] || "";

  const handleMenuClick = (menu) => {
    setActiveMenu(activeMenu === menu ? "" : menu);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiryTime");
    localStorage.removeItem("userData");
    toast.error("Logged out Successfully");
    navigate("/login");
  };

  // Styling classes
  const menuItemBase = "transition-all duration-200 ease-in-out transform";
  const menuItemHover = "hover:translate-x-2 hover:bg-blue-800";
  const menuItemActive = "bg-blue-800 text-white";
  const submenuBase = "overflow-hidden transition-all duration-300 ease-in-out";
  const submenuActive = "max-h-[500px] opacity-100";
  const submenuInactive = "max-h-0 opacity-0";
  const menuButton = "w-full flex items-center justify-between p-3 rounded-lg transition-colors";

  const getMenuButtonClasses = (menuName) => {
    return `${menuButton} ${menuItemBase} ${menuItemHover} ${activeMenu === menuName ? menuItemActive : ""
      }`;
  };

  const getSubmenuClasses = (menuName) => {
    return `${submenuBase} ${activeMenu === menuName ? submenuActive : submenuInactive
      }`;
  };

  const MenuItem = ({ to, icon: Icon, children }) => (
    <Link
      to={to}
      className="flex items-center p-2 text-sm transition-colors rounded-lg hover:bg-blue-800"
    >
      <Icon className="w-4 h-4 mr-2" />
      <span>{children}</span>
    </Link>
  );

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <aside className={`fixed left-0 top-0 z-40 h-screen w-64 bg-gradient-to-b from-blue-950 to-blue-900 text-white shadow-xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-blue-800">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-800 rounded-full">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-wider">Branch Admin</span>
            </div>
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 transition-colors rounded-lg hover:bg-blue-800"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-800 scrollbar-track-transparent">
            <div className="p-4 space-y-2">
              {/* Dashboard */}
              <Link
                to="/branch-admin"
                className={`${menuItemBase} ${menuItemHover} flex items-center p-3 rounded-lg ${location.pathname === "/branch-admin" ? menuItemActive : ""
                  }`}
              >
                <Home className="w-5 h-5 mr-3" />
                <span>Dashboard</span>
              </Link>

              {/* Academic Year Section */}
              <div className="space-y-1">
                <button
                  onClick={() => handleMenuClick("academic")}
                  className={getMenuButtonClasses("academic")}
                >
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-3" />
                    <span>Academic Year</span>
                  </div>
                  {activeMenu === "academic" ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                <div className={getSubmenuClasses("academic")}>
                  <div className="pl-6 space-y-1">
                    <MenuItem to="/branch-admin/academic-year/add" icon={Plus}>
                      Add Academic Year
                    </MenuItem>
                    <MenuItem to="/branch-admin/academic-year/view" icon={FileText}>
                      View All Years
                    </MenuItem>
                  </div>
                </div>
              </div>

              {/* Class Management */}
              <div className="space-y-1">
                <button
                  onClick={() => handleMenuClick("classes")}
                  className={getMenuButtonClasses("classes")}
                >
                  <div className="flex items-center">
                    <School className="w-5 h-5 mr-3" />
                    <span>Class Management</span>
                  </div>
                  {activeMenu === "classes" ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                <div className={getSubmenuClasses("classes")}>
                  <div className="pl-6 space-y-1">
                    <MenuItem
                      to={`/branch-admin/academic-year/add-class/${currentAcademicYear}`}
                      icon={Plus}
                    >
                      Add Class
                    </MenuItem>
                    <MenuItem
                      to={`/branch-admin/class/view-all/${currentAcademicYear}`}
                      icon={FileText}
                    >
                      View All Classes
                    </MenuItem>
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-1">
                <button
                  onClick={() => handleMenuClick("sections")}
                  className={getMenuButtonClasses("sections")}
                >
                  <div className="flex items-center">
                    <Building className="w-5 h-5 mr-3" />
                    <span>Section Management</span>
                  </div>
                  {activeMenu === "sections" ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                <div className={getSubmenuClasses("sections")}>
                  <div className="pl-6 space-y-1">
                    <MenuItem to="/branch-admin/academic-year/view-sections" icon={FileText}>
                      View Sections
                    </MenuItem>
                  </div>
                </div>
              </div>

              {/* Fee Controller */}
              <div className="space-y-1">
                <button
                  onClick={() => handleMenuClick("fees")}
                  className={getMenuButtonClasses("fees")}
                >
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-3" />
                    <span>Fee Controller</span>
                  </div>
                  {activeMenu === "fees" ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                <div className={getSubmenuClasses("fees")}>
                  <div className="pl-6 space-y-1">
                    <MenuItem
                      to={`/branch-admin/fee-type/${currentAcademicYear}`}
                      icon={Plus}
                    >
                      Set Fee Types
                    </MenuItem>
                    <MenuItem
                      to={`/branch-admin/ledger-creation`}
                      icon={Plus}
                    >
                      Ledger Creation
                    </MenuItem>
                    <MenuItem
                      to={`/branch-admin/voucher-creation`}
                      icon={Plus}
                    >
                      Voucher Receipts
                    </MenuItem>
                    <MenuItem
                      to={`/branch-admin/fee-card/${currentAcademicYear}`}
                      icon={Plus}
                    >
                      Fee Ledger
                    </MenuItem>
                    <MenuItem
                      to={`/branch-admin/fee-reciepts/${currentAcademicYear}`}
                      icon={FileText}
                    >
                      Fee-Reciepts
                    </MenuItem>
                    {/* <MenuItem
                      to={`/branch-admin/cash-book/${currentAcademicYear}`}
                      icon={Plus}
                    >
                      CashBook
                    </MenuItem> */}



                    <MenuItem
                      to={`/branch-admin/cash/${currentAcademicYear}`}
                      icon={Plus}
                    >
                      cash-Book
                    </MenuItem>



                    <MenuItem
                      to={`/branch-admin/bank/${currentAcademicYear}`}
                      icon={Plus}
                    >
                      BankBook
                    </MenuItem>









                  </div>
                </div>
              </div>

              {/* Transport */}
              <div className="space-y-1">
                <button
                  onClick={() => handleMenuClick("transport")}
                  className={getMenuButtonClasses("transport")}
                >
                  <div className="flex items-center">
                    <Bus className="w-5 h-5 mr-3" />
                    <span>Transport</span>
                  </div>
                  {activeMenu === "transport" ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                <div className={getSubmenuClasses("transport")}>
                  <div className="pl-6 space-y-1">
                    <MenuItem to="/branch-admin/transport/add-town" icon={MapPin}>
                      Add Towns
                    </MenuItem>
                    <MenuItem to="/branch-admin/transport/add-bus" icon={Bus}>
                      Add Bus
                    </MenuItem>
                  </div>
                </div>
              </div>

              {/* Students */}
              <div className="space-y-1">
                <button
                  onClick={() => handleMenuClick("students")}
                  className={getMenuButtonClasses("students")}
                >
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-3" />
                    <span>Students</span>
                  </div>
                  {activeMenu === "students" ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                <div className={getSubmenuClasses("students")}>
                  <div className="pl-6 space-y-1">
                    <MenuItem
                      to={`/branch-admin/add-student/${currentAcademicYear}`}
                      icon={UserPlus}
                    >
                      Add Student
                    </MenuItem>
                    <MenuItem
                      to={`/branch-admin/students-report/${currentAcademicYear}`}
                      icon={FileText}
                    >
                      View All
                    </MenuItem>

                  </div>
                </div>
              </div>

              {/* Teachers */}
              <div className="space-y-1">
                <button
                  onClick={() => handleMenuClick("teachers")}
                  className={getMenuButtonClasses("teachers")}
                >
                  <div className="flex items-center">
                    <UserCheck className="w-5 h-5 mr-3" />
                    <span>Teachers</span>
                  </div>
                  {activeMenu === "teachers" ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                <div className={getSubmenuClasses("teachers")}>
                  <div className="pl-6 space-y-1">
                    <MenuItem to="/branch-admin/teachers/add-teacher" icon={UserPlus}>
                      Add Teacher
                    </MenuItem>
                    <MenuItem to="/branch-admin/teachers/view-teachers" icon={FileText}>
                      View Teachers
                    </MenuItem>
                    <MenuItem to="/branch-admin/teachers/assign-teachers" icon={UserCheck}>
                      Assign Teachers
                    </MenuItem>
                    <MenuItem to="/branch-admin/teachers/view-perfomance" icon={BarChart2}>
                      View Performance
                    </MenuItem>
                  </div>
                </div>
              </div>

              {/* Exams */}
              <div className="space-y-1">
                <button
                  onClick={() => handleMenuClick("exams")}
                  className={getMenuButtonClasses("exams")}
                >
                  <div className="flex items-center">
                    <ClipboardList className="w-5 h-5 mr-3" />
                    <span>Exams</span>
                  </div>
                  {activeMenu === "exams" ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                <div className={getSubmenuClasses("exams")}>
                  <div className="pl-6 space-y-1">
                    <MenuItem to="/branch-admin/exam/create-timetable" icon={Plus}>
                      Create Timetable
                    </MenuItem>
                    <MenuItem to="/branch-admin/exam/view-timetable" icon={FileText}>
                      View Timetable
                    </MenuItem>
                  </div>
                </div>
              </div>

              {/* Syllabus */}
              <div className="space-y-1">
                <button
                  onClick={() => handleMenuClick("syllabus")}
                  className={getMenuButtonClasses("syllabus")}
                >
                  <div className="flex items-center">
                    <BookMarked className="w-5 h-5 mr-3" />
                    <span>Syllabus</span>
                  </div>
                  {activeMenu === "syllabus" ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                <div className={getSubmenuClasses("syllabus")}>
                  <div className="pl-6 space-y-1">
                    <MenuItem to="/branch-admin/syllabus/create" icon={Plus}>
                      Create Syllabus
                    </MenuItem>
                    <MenuItem to="/branch-admin/syllabus/view" icon={FileText}>
                      View Syllabus
                    </MenuItem>
                  </div>
                </div>
              </div>

              {/* Marks */}
              <div className="space-y-1">
                <button
                  onClick={() => handleMenuClick("marks")}
                  className={getMenuButtonClasses("marks")}
                >
                  <div className="flex items-center">
                    <Award className="w-5 h-5 mr-3" />
                    <span>Marks</span>
                  </div>
                  {activeMenu === "marks" ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                <div className={getSubmenuClasses("marks")}>
                  <div className="pl-6 space-y-1">
                    <MenuItem to="/branch-admin/marks/enter" icon={Plus}>
                      Enter Marks
                    </MenuItem>
                    <MenuItem to="/branch-admin/marks/update" icon={FileText}>
                      Update Marks
                    </MenuItem>
                    <MenuItem to="/branch-admin/marks/view" icon={FileText}>
                      View Marks
                    </MenuItem>
                    <MenuItem to="/branch-admin/marks/create" icon={Plus}>
                      Create Hall Ticket
                    </MenuItem>
                  </div>
                </div>
              </div>

              {/* Enquiry */}
              <div className="space-y-1">
                <button
                  onClick={() => handleMenuClick("enquiry")}
                  className={getMenuButtonClasses("enquiry")}
                >
                  <div className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-3" />
                    <span>Enquiry</span>
                  </div>
                  {activeMenu === "enquiry" ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                <div className={getSubmenuClasses("enquiry")}>
                  <div className="pl-6 space-y-1">
                    <MenuItem to="/branch-admin/enquiry/create-enquiry" icon={Plus}>
                      Add Enquiry
                    </MenuItem>
                    <MenuItem to="/branch-admin/enquiry/view-enquiry" icon={FileText}>
                      View Enquiry
                    </MenuItem>
                  </div>
                </div>
              </div>

              {/* Working Days */}
              <div className="space-y-1">
                <button
                  onClick={() => handleMenuClick("workingdays")}
                  className={getMenuButtonClasses("workingdays")}
                >
                  <div className="flex items-center">
                    <CalendarDays className="w-5 h-5 mr-3" />
                    <span>Working Days</span>
                  </div>
                  {activeMenu === "workingdays" ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                <div className={getSubmenuClasses("workingdays")}>
                  <div className="pl-6 space-y-1">
                    <MenuItem to="/branch-admin/workingdays/create" icon={Plus}>
                      Working Days
                    </MenuItem>
                  </div>
                </div>
              </div>

              {/* Attendance */}
              <div className="space-y-1">
                <button
                  onClick={() => handleMenuClick("attendance")}
                  className={getMenuButtonClasses("attendance")}
                >
                  <div className="flex items-center">
                    <ClipboardCheck className="w-5 h-5 mr-3" />
                    <span>Attendance</span>
                  </div>
                  {activeMenu === "attendance" ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                <div className={getSubmenuClasses("attendance")}>
                  <div className="pl-6 space-y-1">
                    <MenuItem
                      to={`/branch-admin/attendance/add/${currentAcademicYear}`}
                      icon={Plus}
                    >
                      Add Attendance
                    </MenuItem>
                    <MenuItem
                      to={`/branch-admin/attendance/view/${currentAcademicYear}`}
                      icon={FileText}
                    >
                      View Attendance
                    </MenuItem>
                  </div>
                </div>
              </div>

              {/* Reports */}
              <div className="space-y-1">
                <button
                  onClick={() => handleMenuClick("reports")}
                  className={getMenuButtonClasses("reports")}
                >
                  <div className="flex items-center">
                    <BarChart2 className="w-5 h-5 mr-3" />
                    <span>Reports</span>
                  </div>
                  {activeMenu === "reports" ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                <div className={getSubmenuClasses("reports")}>
                  <div className="pl-6 space-y-1">
                    <MenuItem to="/branch-admin/vehicle/create" icon={Bus}>
                      Vehicle Reports
                    </MenuItem>
                    <MenuItem to="/branch-admin/strengthreports/create" icon={TrendingUp}>
                      Strength Reports
                    </MenuItem>
                    <MenuItem to="/branch-admin/progressreports/create" icon={Award}>
                      Progress Reports
                    </MenuItem>
                  </div>
                </div>
              </div>


            </div>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-blue-800">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full p-3 transition-colors bg-red-300 rounded-lg hover:bg-red-700"
            >
              <LogOut className="w-5 h-5 mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Custom Scrollbar Styles */}
        <style jsx>{`
          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
          }
          .scrollbar-thin::-webkit-scrollbar-track {
            background: transparent;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background: rgba(30, 58, 138, 0.5);
            border-radius: 3px;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: rgba(30, 58, 138, 0.8);
          }
        `}</style>
      </aside>

      {/* Main Content Margin */}
      <div className={`ml-64 transition-all duration-300 ${isSidebarOpen ? '' : 'ml-0'}`}>
        {/* Your main content goes here */}
      </div>
    </>
  );
};

export default Sidebar;