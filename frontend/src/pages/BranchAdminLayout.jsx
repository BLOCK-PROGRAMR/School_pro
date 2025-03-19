import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { mycon } from "../store/Mycontext";
import { ThemeContext } from "../store/ThemeContext";
import { useViewport } from "../utils/responsive";
import Allapi from "../common";
import Sidebar from "../components/BranchAdmin/Sidebar";
import Login from "./Login";
import { Search, Menu } from 'lucide-react';

const BranchAdminlayout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [c_user, setc_user] = useState(null);
  const [c_branch, setc_branch] = useState(null);
  const [branchdet, setBranchdet] = useState(null);
  const [c_acad, setc_acad] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { theme } = useContext(ThemeContext);
  const { isMobile } = useViewport();

  useEffect(() => {
    // Close sidebar by default on mobile devices
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);
        setc_user(decoded);
        setc_branch(decoded.branch);
        if (decoded.branch) {
          fetchBranchById(decoded.branch);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  const fetchBranchById = async (id) => {
    try {
      const response = await fetch(Allapi.getBranchById.url(id), {
        method: Allapi.getBranchById.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const res = await response.json();
      if (res.success) {
        setBranchdet(res.data);
      } else {
        toast.error("Failed to fetch branch details");
      }
    } catch (error) {
      console.error("Error fetching branch by ID:", error);
      toast.error("Error occurred while fetching branch details");
    }
  };

  const handlePayFee = async () => {
    if (!studentId.trim()) {
      toast.warning("Please enter a student ID");
      return;
    }

    setLoading(true);
    try {
      // First try to get student by ID number
      const response = await fetch(Allapi.getstudentbyIdNo.url(studentId), {
        method: Allapi.getstudentbyIdNo.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success && data.data) {
        // Navigate to fee payment page with MongoDB _id
        navigate(`/branch-admin/students-payfee/${data.data._id}`);
        if (isMobile) {
          setSidebarOpen(false);
        }
      } else {
        toast.error("Student not found. Please check the ID number.");
      }
    } catch (error) {
      console.error("Error fetching student:", error);
      toast.error("Error finding student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiryTime");
    localStorage.removeItem("userData");
    toast.error("Logged out Successfully");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <mycon.Provider value={{ c_branch, branchdet, c_acad, setc_acad, setBranchdet }}>
      {c_user ? (
        c_user.role === "BranchAdmin" ? (
          <div className={`w-full flex relative ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-800'}`}>
            {/* Desktop sidebar */}
            <div className="hidden md:block">
              <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            </div>
            
            {/* Mobile sidebar */}
            <div className="md:hidden">
              <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            </div>
            
            {/* Show sidebar button when sidebar is hidden */}
            {!isSidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className={`fixed z-50 p-3 rounded-r-md shadow-lg top-20 left-0 transition-transform duration-300 ease-in-out ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-800 hover:bg-blue-700'} text-white`}
                aria-label="Show sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            
            <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
              {/* Top Navigation Bar */}
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-900'} shadow-sm mb-4`}>
                <div className="px-4 py-2">
                  <div className="flex justify-between md:justify-end items-center">
                    {/* Mobile Menu Button - visible only on mobile */}
                    <button
                      onClick={toggleSidebar}
                      className={`p-2 rounded-md md:hidden ${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-gray-800'}`}
                      aria-label="Toggle Sidebar"
                    >
                      <Menu className="w-6 h-6" />
                    </button>
                    
                    <div className="flex items-center space-x-2 md:space-x-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className={`h-4 w-4 md:h-5 md:w-5 ${theme === 'light' ? 'text-gray-400' : 'text-gray-300'}`} />
                        </div>
                        <input
                          type="text"
                          value={studentId}
                          onChange={(e) => setStudentId(e.target.value)}
                          placeholder="Enter Student ID"
                          className={`block w-40 md:w-64 pl-8 md:pl-10 pr-3 py-2 border rounded-md leading-5 text-sm ${
                            theme === 'light' 
                              ? 'border-gray-300 bg-white text-gray-700 placeholder-gray-500 focus:ring-blue-500' 
                              : 'border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-blue-400'
                          } focus:outline-none focus:ring-1 focus:border-blue-500`}
                        />
                      </div>
                      <button
                        onClick={handlePayFee}
                        disabled={loading}
                        className={`inline-flex items-center px-3 md:px-4 py-2 border border-transparent text-xs md:text-sm font-medium rounded-md shadow-sm text-white ${loading
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
                      >
                        {loading ? 'Searching...' : 'Pay Fee'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <main className="p-4 md:p-6">
                <Outlet />
              </main>
            </div>
          </div>
        ) : (
          <div className={`flex items-center justify-center h-screen ${theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gray-900 text-white'}`}>
            <div className="text-center p-4 md:p-8 mx-4 rounded-lg shadow-md">
              <h2 className="text-xl md:text-2xl font-bold mb-4">Access Denied</h2>
              <p className="mb-6">You are not authorized to access this area.</p>
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Return to Home
              </button>
            </div>
          </div>
        )
      ) : (
        <Login />
      )}
    </mycon.Provider>
  );
};

export default BranchAdminlayout;