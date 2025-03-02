import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  User,
  BookOpen,
  Bell,
  Bus,
  DollarSign,
  Calendar,
  FileText,
  LogOut,
  X,
  Home
} from 'lucide-react';
import { toast } from 'react-toastify';


const StudentSidebar = ({ isSidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiryTime");
    localStorage.removeItem("userData");
    toast.success("Logged out Successfully");
    navigate("/login");
  };

  const menuItems = [
    { path: '/student', icon: Home, label: 'Dashboard' },
    { path: '/student/profile', icon: User, label: 'My Profile' },
    { path: '/student/notices', icon: Bell, label: 'Notices' },
    { path: '/student/transport', icon: Bus, label: 'Transport' },
    { path: '/student/exams', icon: Calendar, label: 'Exams' },
    { path: '/student/syllabus', icon: BookOpen, label: 'Syllabus' },
    { path: '/student/fees', icon: DollarSign, label: 'Fee Details' },
    { path: '/student/marks', icon: FileText, label: 'Marks' },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen w-64 bg-gradient-to-b from-blue-950 to-blue-900 text-white shadow-xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-blue-800">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-800 rounded-full">
              <User className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-wider">Student Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 transition-colors rounded-lg hover:bg-blue-800"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />} {/* This button is always visible */}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-blue-800 ${location.pathname === item.path ? 'bg-blue-800' : ''
                  }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </Link>
            ))}
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
  );
};

export default StudentSidebar;
