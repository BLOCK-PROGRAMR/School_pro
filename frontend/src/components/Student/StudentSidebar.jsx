 // filepath: /c:/Users/KomaleswarReddy/Desktop/mine/Vidy-proj/frontend/src/components/Student/StudentSidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  X, 
  Home, 
  BookOpen, 
  Calendar, 
  FileText, 
  User, 
  Bell, 
  LogOut,
  Menu,
  Phone,
  Mail,
  MapPin,
  Download,
  Eye,
  Trash2,
  UserCircle,
  GraduationCap,
  Bus,
  CreditCard,
  ChevronDown,
  BookMarked,
  History
} from 'lucide-react';
import Allapi from '../../common';
import SidebarRoutes from './SidebarRoutes';

const StudentSidebar = ({ isSidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  
  const [activeView, setActiveView] = useState('dashboard');
  const [student, setStudent] = useState(null);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState('');
  
  const [notices, setNotices] = useState([]);
  const [noticesLoading, setNoticesLoading] = useState(false);
  const [noticesError, setNoticesError] = useState('');
  const [selectedNotice, setSelectedNotice] = useState(null);
  
  const [examsOpen, setExamsOpen] = useState(false);
  const [feeDetailsOpen, setFeeDetailsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: 'dashboard', icon: <Home className="w-5 h-5" /> },
    { name: 'Student Details', path: 'details', icon: <UserCircle className="w-5 h-5" /> },
    { name: 'Notice', path: 'notice', icon: <BookMarked className="w-5 h-5" /> },
    { name: 'Transport', path: 'transport', icon: <Bus className="w-5 h-5" /> },
  ];

  const examsItems = [
    { path: "timetable", icon: Calendar, label: "Time Table" },
    { path: "syllabus", icon: BookOpen, label: "Exam Syllabus" },
    { path: "marks", icon: Bell, label: "Exam Marks" },
    { path: "online-test", icon: FileText, label: "Online Test Link" }
  ];

  const feeItems = [
    { path: "ledger", icon: FileText, label: "Fee Ledger" },
    { path: "schedule", icon: Calendar, label: "Fee Pay Schedule" },
    { path: "gallery", icon: CreditCard, label: "Gallery (5)" }
  ];

  useEffect(() => {
    // Extract the current view from the location
    const path = location.pathname.split('/').pop();
    if (path && navItems.some(item => item.path === path)) {
      setActiveView(path);
    } else {
      setActiveView('dashboard');
    }
  }, [location]);

  useEffect(() => {
    if (activeView === 'details' && userData.username) {
      fetchStudentDetails();
    } else if (activeView === 'notice') {
      fetchNotices();
    }
  }, [activeView, userData.username]);

  const fetchStudentDetails = async () => {
    try {
      setStudentLoading(true);
      setStudentError('');
      
      const response = await axios({
        method: Allapi.getstudentbyIdNo.method,
        url: Allapi.getstudentbyIdNo.url(userData.username),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.data.success) {
        setStudent(response.data.data);
      } else {
        setStudentError(response.data.message || 'Failed to fetch student details');
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
      setStudentError(error.response?.data?.message || 'Error fetching student details');
    } finally {
      setStudentLoading(false);
    }
  };

  const fetchNotices = async () => {
    try {
      setNoticesLoading(true);
      setNoticesError('');
      
      const response = await axios({
        method: Allapi.getNotices.method,
        url: Allapi.getNotices.url,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.data.success) {
        setNotices(response.data.data);
      } else {
        setNoticesError(response.data.message || 'Failed to fetch notices');
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
      setNoticesError(error.response?.data?.message || 'Error fetching notices');
    } finally {
      setNoticesLoading(false);
    }
  };

  const handleViewNotice = (notice) => {
    setSelectedNotice(notice);
  };

  const handleCloseModal = () => {
    setSelectedNotice(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('expiryTime');
    window.location.href = '/login';
  };

  const handleNavClick = (path) => {
    setActiveView(path);
    navigate(`/student/${path}`);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
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
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-wider">Student Portal</span>
            </div>
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 transition-colors rounded-lg hover:bg-blue-800 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Student Profile Summary */}
          {userData && (
            <div className="p-4 border-b border-blue-800">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-700 rounded-full">
                  <UserCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{userData.name || 'Student'}</h3>
                  <p className="text-xs text-blue-200">{userData.username || 'ID: N/A'}</p>
                </div>
              </div>
            </div>
          )}

          <nav className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 hover:bg-blue-800 ${
                    activeView === item.path ? 'bg-blue-800' : ''
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </button>
              ))}

              {/* Exams Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setExamsOpen(!examsOpen)}
                  className="flex items-center w-full p-3 rounded-lg transition-all duration-200 hover:bg-blue-800"
                >
                  <Calendar className="w-5 h-5 mr-3" />
                  <span>Exams</span>
                  <ChevronDown
                    className={`w-4 h-4 ml-auto transition-transform duration-200 ${
                      examsOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`pl-4 mt-2 space-y-2 transition-all duration-200 ${
                    examsOpen ? 'block' : 'hidden'
                  }`}
                >
                  {examsItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavClick(`exams/${item.path}`)}
                      className="flex items-center w-full p-3 rounded-lg transition-all duration-200 hover:bg-blue-800"
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fee Details Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setFeeDetailsOpen(!feeDetailsOpen)}
                  className="flex items-center w-full p-3 rounded-lg transition-all duration-200 hover:bg-blue-800"
                >
                  <CreditCard className="w-5 h-5 mr-3" />
                  <span>Fee Details</span>
                  <ChevronDown
                    className={`w-4 h-4 ml-auto transition-transform duration-200 ${
                      feeDetailsOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`pl-4 mt-2 space-y-2 transition-all duration-200 ${
                    feeDetailsOpen ? 'block' : 'hidden'
                  }`}
                >
                  {feeItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavClick(`fees/${item.path}`)}
                      className="flex items-center w-full p-3 rounded-lg transition-all duration-200 hover:bg-blue-800"
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="p-4 border-t border-blue-800">
            <div className="flex justify-between items-center">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center px-4 py-2 transition-colors bg-red-600 rounded-lg hover:bg-red-700"
              >
                <LogOut className="w-5 h-5 mr-2" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Toggle button for mobile - fixed at the top */}
      <button
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md md:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 md:ml-64 mt-16 md:mt-0">
        {/* Header for mobile */}
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-20 md:hidden">
          <div className="flex items-center justify-center h-16 px-4">
            <GraduationCap className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-xl font-bold text-blue-900">Vidya Nidhi</h1>
          </div>
        </header>

        <SidebarRoutes />
      </main>
    </div>
  );
};

export default StudentSidebar;