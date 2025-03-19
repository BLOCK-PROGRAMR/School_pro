import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { mycon } from "../../store/Mycontext";
import { ThemeContext } from "../../store/ThemeContext";
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
  Layers,
  PlusCircle,
  List,
  X
} from "lucide-react";

const AccountantSidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("");
  const { branchdet, c_acad } = useContext(mycon);
  const { theme } = useContext(ThemeContext);

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const branchId = userData.branchId || userData.branch;
  
  // Get current academic year from context
  const currentAcademicYear = c_acad || "";

  const handleMenuClick = (menu) => {
    setActiveMenu(activeMenu === menu ? "" : menu);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiryTime");
    localStorage.removeItem("userData");
    toast.success("Logged out Successfully");
    navigate("/login");
  };

  // Styling classes
  const menuItemBase = "transition-all duration-200 ease-in-out transform";
  const menuItemHover = "hover:translate-x-2 hover:bg-blue-800";
  const menuItemActive = "bg-blue-800 text-white";
  const submenuBase = "overflow-hidden transition-all duration-300 ease-in-out";
  const submenuActive = "max-h-[500px] opacity-100";
  const submenuInactive = "max-h-0 opacity-0";
  const menuButton =
    "w-full flex items-center justify-between p-3 rounded-lg transition-colors";

  const getMenuButtonClasses = (menuName) => {
    return `${menuButton} ${menuItemBase} ${menuItemHover} ${activeMenu === menuName ? menuItemActive : ""}`;
  };

  const getSubmenuClasses = (menuName) => {
    return `${submenuBase} ${activeMenu === menuName ? submenuActive : submenuInactive}`;
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

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 bg-gradient-to-b from-blue-950 to-blue-900 text-white shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-blue-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-wider">
                Accountant Panel
              </span>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-2 transition-colors rounded-lg hover:bg-blue-800 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 border-b border-blue-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">{userData.name || "Accountant"}</p>
                <p className="text-xs text-blue-300">Accountant</p>
              </div>
            </div>
          </div>

          <div className="p-4 h-[calc(100vh-200px)] overflow-y-auto">
            <nav className="space-y-2">
              {/* Dashboard */}
              <Link
                to="/accountant"
                className="flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-blue-800"
                onClick={() => {
                  if (window.innerWidth < 768) {
                    toggleSidebar();
                  }
                }}
              >
                <Home className="w-5 h-5 mr-3" />
                <span>Dashboard</span>
              </Link>

              {/* Fee Controller */}
              <div className="space-y-1">
                <button
                  onClick={() => handleMenuClick("fees")}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-blue-800 ${
                    activeMenu === "fees" ? "bg-blue-800" : ""
                  }`}
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
                <div className={`overflow-hidden transition-all duration-300 ${
                  activeMenu === "fees" ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}>
                  <div className="pl-6 space-y-1">
                    <Link
                      to={`/accountant/fee-type/${currentAcademicYear}`}
                      className="flex items-center p-2 text-sm transition-colors rounded-lg hover:bg-blue-800"
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          toggleSidebar();
                        }
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      <span>Set Fee Types</span>
                    </Link>
                    <Link
                      to={`/accountant/ledger-creation`}
                      className="flex items-center p-2 text-sm transition-colors rounded-lg hover:bg-blue-800"
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          toggleSidebar();
                        }
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      <span>Ledger Creation</span>
                    </Link>
                    <Link
                      to={`/accountant/voucher-creation`}
                      className="flex items-center p-2 text-sm transition-colors rounded-lg hover:bg-blue-800"
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          toggleSidebar();
                        }
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      <span>Voucher Receipts</span>
                    </Link>
                    <Link
                      to={`/accountant/bank-creation`}
                      className="flex items-center p-2 text-sm transition-colors rounded-lg hover:bg-blue-800"
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          toggleSidebar();
                        }
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      <span>Bank</span>
                    </Link>
                    <Link
                      to={`/accountant/fee-card/${currentAcademicYear}`}
                      className="flex items-center p-2 text-sm transition-colors rounded-lg hover:bg-blue-800"
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          toggleSidebar();
                        }
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      <span>Fee Ledger</span>
                    </Link>
                    <Link
                      to={`/accountant/fee-reciepts/${currentAcademicYear}`}
                      className="flex items-center p-2 text-sm transition-colors rounded-lg hover:bg-blue-800"
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          toggleSidebar();
                        }
                      }}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      <span>Fee Receipts</span>
                    </Link>
                    <Link
                      to={`/accountant/cash/${currentAcademicYear}`}
                      className="flex items-center p-2 text-sm transition-colors rounded-lg hover:bg-blue-800"
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          toggleSidebar();
                        }
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      <span>Cash Book</span>
                    </Link>
                    <Link
                      to={`/accountant/bank/${currentAcademicYear}`}
                      className="flex items-center p-2 text-sm transition-colors rounded-lg hover:bg-blue-800"
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          toggleSidebar();
                        }
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      <span>Bank Book</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Students */}
              <div className="space-y-1">
                <button
                  onClick={() => handleMenuClick("students")}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-blue-800 ${
                    activeMenu === "students" ? "bg-blue-800" : ""
                  }`}
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
                <div className={`overflow-hidden transition-all duration-300 ${
                  activeMenu === "students" ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}>
                  <div className="pl-6 space-y-1">
                    <Link
                      to={`/accountant/add-student/${currentAcademicYear}`}
                      className="flex items-center p-2 text-sm transition-colors rounded-lg hover:bg-blue-800"
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          toggleSidebar();
                        }
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      <span>Add Student</span>
                    </Link>
                    <Link
                      to={`/accountant/students-report/${currentAcademicYear}`}
                      className="flex items-center p-2 text-sm transition-colors rounded-lg hover:bg-blue-800"
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          toggleSidebar();
                        }
                      }}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      <span>Students Report</span>
                    </Link>
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
                    <MenuItem to="/accountant/teachers/add-teacher" icon={UserPlus}>
                      Add Teacher
                    </MenuItem>
                    <MenuItem to="/accountant/teachers/view-teachers" icon={FileText}>
                      View Teachers
                    </MenuItem>
                    <MenuItem to="/accountant/teachers/assign-teachers" icon={UserCheck}>
                      Assign Teachers
                    </MenuItem>
                    <MenuItem to="/accountant/teachers/view-perfomance" icon={BarChart2}>
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
                    <BookOpen className="w-5 h-5 mr-3" />
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
                    <MenuItem to="/accountant/exam/create-timetable" icon={Calendar}>
                      Create Timetable
                    </MenuItem>
                    <MenuItem to="/accountant/exam/view-timetable" icon={FileText}>
                      View Timetable
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
                    <MenuItem to="/accountant/marks/enter" icon={Plus}>
                      Enter Marks
                    </MenuItem>
                    <MenuItem to="/accountant/marks/update" icon={FileText}>
                      Update Marks
                    </MenuItem>
                    <MenuItem to="/accountant/marks/view" icon={FileText}>
                      View Marks
                    </MenuItem>
                    <MenuItem to="/accountant/marks/create" icon={Plus}>
                      Create Hall Ticket
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
                    <MenuItem to="/accountant/syllabus/create" icon={Plus}>
                      Create Syllabus
                    </MenuItem>
                    <MenuItem to="/accountant/syllabus/view" icon={FileText}>
                      View Syllabus
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
                    <Calendar className="w-5 h-5 mr-3" />
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
                    <MenuItem to="/accountant/workingdays/create" icon={Plus}>
                      Create Working Days
                    </MenuItem>
                    <MenuItem to="/accountant/workingdays/view" icon={FileText}>
                      View Working Days
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
                    <Clock className="w-5 h-5 mr-3" />
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
                    <MenuItem to="/accountant/attendance/add" icon={Plus}>
                      Add Attendance
                    </MenuItem>
                    <MenuItem to="/accountant/attendance/view" icon={FileText}>
                      View Attendance
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
                    <MenuItem to="/accountant/enquiry/create-enquiry" icon={Plus}>
                      Create Enquiry
                    </MenuItem>
                    <MenuItem to="/accountant/enquiry/view-enquiry" icon={FileText}>
                      View Enquiry
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
                    <MenuItem to="/accountant/vehicle/create" icon={Bus}>
                      Vehicle Report
                    </MenuItem>
                    <MenuItem to="/accountant/strengthreports/create" icon={Users}>
                      Strength Report
                    </MenuItem>
                    <MenuItem to="/accountant/progressreports/create" icon={TrendingUp}>
                      Progress Report
                  </MenuItem>
                </div>
              </div>
            </div>

            {/* Financial Records */}
              <div className="space-y-1">
              <button
                onClick={() => handleMenuClick("finance")}
                className={getMenuButtonClasses("finance")}
              >
                <div className="flex items-center">
                  <FileText className="w-5 h-5 mr-3" />
                  <span>Financial Records</span>
                </div>
                {activeMenu === "finance" ? (
                    <ChevronDown className="w-4 h-4" />
                ) : (
                    <ChevronRight className="w-4 h-4" />
                )}
              </button>
              <div className={getSubmenuClasses("finance")}>
                  <div className="pl-6 space-y-1">
                  <MenuItem to="/accountant/ledger-creation" icon={Book}>
                    Ledger
                  </MenuItem>
                  <MenuItem to="/accountant/voucher-creation" icon={FileText}>
                    Vouchers
                  </MenuItem>
                    <MenuItem to="/accountant/bank-creation" icon={Book}>
                      Bank
                    </MenuItem>
                  </div>
                </div>
              </div>

              {/* Notice */}
              <div className="space-y-1">
                <button
                  onClick={() => handleMenuClick("notice")}
                  className={getMenuButtonClasses("notice")}
                >
                  <div className="flex items-center">
                    <Bell className="w-5 h-5 mr-3" />
                    <span>Notice</span>
                  </div>
                  {activeMenu === "notice" ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                <div className={getSubmenuClasses("notice")}>
                  <div className="pl-6 space-y-1">
                    <MenuItem to="/accountant/notice/add" icon={Plus}>
                      Add Notice
                  </MenuItem>
                    <MenuItem to="/accountant/notice/view" icon={FileText}>
                      View Notice
                  </MenuItem>
                </div>
              </div>
            </div>

              {/* Gallery */}
              <div className="space-y-1">
                <button
                  onClick={() => handleMenuClick("gallery")}
                  className={getMenuButtonClasses("gallery")}
                >
                  <div className="flex items-center">
                    <Layers className="w-5 h-5 mr-3" />
                    <span>Gallery</span>
                  </div>
                  {activeMenu === "gallery" ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                <div className={getSubmenuClasses("gallery")}>
                  <div className="pl-6 space-y-1">
                    <MenuItem to="/accountant/gallery/add" icon={PlusCircle}>
                      Add Gallery
                    </MenuItem>
                    <MenuItem to="/accountant/gallery/view" icon={FileText}>
                      View Gallery
                    </MenuItem>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="space-y-1">
              <button
                  onClick={() => handleMenuClick("links")}
                  className={getMenuButtonClasses("links")}
              >
                <div className="flex items-center">
                    <Briefcase className="w-5 h-5 mr-3" />
                    <span>Links</span>
                  </div>
                  {activeMenu === "links" ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                <div className={getSubmenuClasses("links")}>
                  <div className="pl-6 space-y-1">
                    <MenuItem to="/accountant/links/add" icon={Plus}>
                      Add Link
                    </MenuItem>
                    <MenuItem to="/accountant/links/view" icon={FileText}>
                      View Links
                    </MenuItem>
                  </div>
                </div>
              </div>

              {/* Promote */}
              <div className="space-y-1">
                <button
                  onClick={() => handleMenuClick("promote")}
                  className={getMenuButtonClasses("promote")}
                >
                  <div className="flex items-center">
                    <UserCheck className="w-5 h-5 mr-3" />
                    <span>Promote</span>
                  </div>
                  {activeMenu === "promote" ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                )}
              </button>
                <div className={getSubmenuClasses("promote")}>
                  <div className="pl-6 space-y-1">
                    <MenuItem to="/accountant/upgrade" icon={UserPlus}>
                      Students Upgrade
                  </MenuItem>
                    <MenuItem to="/accountant/trash" icon={UserPlus}>
                      Trash
                  </MenuItem>
                    <MenuItem to="/accountant/prev-data" icon={UserPlus}>
                      DeletePrev
                  </MenuItem>
                  </div>
              </div>
            </div>

            {/* Profile */}
            <Link
              to="/accountant/profile"
              className={`flex items-center p-3 rounded-lg ${menuItemBase} ${menuItemHover} ${
                location.pathname === "/accountant/profile" ? menuItemActive : ""
              }`}
            >
              <Users className="w-5 h-5 mr-3" />
              <span>Profile</span>
            </Link>
          </nav>
          </div>

          <div className="p-4 mt-auto border-t border-blue-800">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full p-3 transition-colors bg-red-600 rounded-lg hover:bg-red-700"
            >
              <LogOut className="w-5 h-5 mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AccountantSidebar; 