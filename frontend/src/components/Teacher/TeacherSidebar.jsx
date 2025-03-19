import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Home, UserCircle, GraduationCap, ClipboardList, Users, Menu, LogOut, X, Calendar, Book, PieChart, PenIcon, BookCheckIcon } from 'lucide-react';

const TeacherSidebar = ({ isSidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [examDropdownOpen, setExamDropdownOpen] = useState(false);
  const [homeDropdownOpen, setHomeDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiryTime");
    localStorage.removeItem("userData");
    toast.success("Logged out Successfully");
    navigate("/login");
  };

  const menuItems = [
    { path: "/teacher", icon: Home, label: "Dashboard" },
    { path: "/teacher/portfolio", icon: UserCircle, label: "Edit Portfolio" },
    { path: "/teacher/enquiry", icon: PenIcon, label: "Enquiry" },
  ];
  
  const Home_work = [
    { path: "/teacher/homework", icon: GraduationCap, label: "Homework" },
    { path: "/teacher/viewhomework", icon: GraduationCap, label: "View Homework" },
  ];
  
  const examItems = [
    { path: "/teacher/exams/timetable", icon: Calendar, label: "Timetable" },
    { path: "/teacher/exams/syllabus", icon: Book, label: "Syllabus" },
    { path: "/teacher/exams/marks", icon: PieChart, label: "Marks" }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 bg-gradient-to-b from-blue-950 to-blue-900 text-white shadow-xl transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-blue-800">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-800 rounded-full">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-wider">Teacher Panel</span>
            </div>
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 transition-colors rounded-lg hover:bg-blue-800 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Teacher profile summary */}
          <div className="p-4 border-b border-blue-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center">
                <UserCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium">{JSON.parse(localStorage.getItem("userData") || '{}').name || "Teacher"}</p>
                <p className="text-xs text-blue-300">Teacher</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-blue-800 ${location.pathname === item.path ? 'bg-blue-800' : ''
                    }`}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setSidebarOpen(false);
                    }
                  }}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {/* Homework Dropdown */}
              <div className='relative'>
                <button
                  onClick={() => setHomeDropdownOpen(!homeDropdownOpen)}
                  className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 hover:bg-blue-800 ${location.pathname.includes('/teacher/homework') ? 'bg-blue-800' : ''
                    }`}
                >
                  <GraduationCap className="w-5 h-5 mr-3" />
                  <span>Homeworks</span>
                  <svg
                    className={`w-4 h-4 ml-auto transition-transform duration-200 ${homeDropdownOpen ? 'rotate-180' : ''
                      }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                
                {/* Homework Submenu */}
                <div
                  className={`pl-4 mt-2 space-y-2 transition-all duration-200 ${homeDropdownOpen ? 'block' : 'hidden'
                    }`}
                >
                  {Home_work.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-blue-800 ${location.pathname === item.path ? 'bg-blue-800' : ''
                        }`}
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          setSidebarOpen(false);
                        }
                      }}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Exams Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setExamDropdownOpen(!examDropdownOpen)}
                  className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 hover:bg-blue-800 ${location.pathname.includes('/teacher/exams') ? 'bg-blue-800' : ''
                    }`}
                >
                  <GraduationCap className="w-5 h-5 mr-3" />
                  <span>Exams</span>
                  <svg
                    className={`w-4 h-4 ml-auto transition-transform duration-200 ${examDropdownOpen ? 'rotate-180' : ''
                      }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`pl-4 mt-2 space-y-2 transition-all duration-200 ${examDropdownOpen ? 'block' : 'hidden'
                    }`}
                >
                  {examItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-blue-800 ${location.pathname === item.path ? 'bg-blue-800' : ''
                        }`}
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          setSidebarOpen(false);
                        }
                      }}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="p-4 border-t border-blue-800">
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

export default TeacherSidebar;