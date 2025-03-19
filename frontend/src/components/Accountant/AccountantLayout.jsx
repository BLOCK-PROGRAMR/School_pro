import React, { useState, useEffect, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { Search, Menu } from "lucide-react";
import AccountantSidebar from "./AccountantSidebar";
import Login from "../../pages/Login";
import Allapi from "../../common";
import { mycon } from "../../store/Mycontext";
import { ThemeContext } from "../../store/ThemeContext";

const AccountantLayout = () => {
  const [c_user, setc_user] = useState(null);
  const [c_branch, setc_branch] = useState(null);
  const [branchdet, setBranchdet] = useState(null);
  const [c_acad, setc_acad] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setc_user(decoded);
        setc_branch(decoded.branch);
        if (decoded.branch) {
          fetchBranchById(decoded.branch);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

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
        // Set current academic year if available
        if (res.data.academicYears && res.data.academicYears.length > 0) {
          setc_acad(res.data.academicYears[0]);
        }
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
      const response = await fetch(Allapi.getstudentbyIdNo.url(studentId), {
        method: Allapi.getstudentbyIdNo.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success && data.data) {
        navigate(`/accountant/students-payfee/${data.data._id}`);
        if (window.innerWidth < 768) {
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
    toast.success("Logged out Successfully");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {c_user ? (
        c_user.role === "Account" ? (
          <mycon.Provider value={{ c_branch, branchdet, c_acad, setc_acad, setBranchdet }}>
            <div className="w-full flex relative bg-gray-100 dark:bg-gray-800">
              <AccountantSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
              
              {/* Toggle button for mobile when sidebar is closed */}
              {!sidebarOpen && (
                <button
                  onClick={toggleSidebar}
                  className={`fixed z-50 p-3 rounded-r-md shadow-lg top-20 left-0 transition-transform duration-300 ease-in-out ${
                    theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-800 hover:bg-blue-700'
                  } text-white`}
                  aria-label="Show sidebar"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
              
              <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
                {/* Top Navigation Bar */}
                <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-900'} shadow-sm mb-4`}>
                  <div className="px-4 py-2">
                    <div className="flex justify-between md:justify-end items-center">
                      {/* Mobile menu button - visible only on mobile */}
                      <button
                        onClick={toggleSidebar}
                        className={`p-2 rounded-md md:hidden ${
                          theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-gray-800'
                        }`}
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
                          className={`inline-flex items-center px-3 md:px-4 py-2 border border-transparent text-xs md:text-sm font-medium rounded-md shadow-sm text-white ${
                            loading
                              ? "bg-blue-400 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700"
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
                        >
                          {loading ? "Searching..." : "Pay Fee"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <main className="p-4 md:p-6 min-h-screen">
                  <Outlet />
                </main>
              </div>
            </div>
          </mycon.Provider>
        ) : (
          <div className={`flex items-center justify-center h-screen ${theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gray-900 text-white'}`}>
            <div className="text-center p-4 md:p-8 mx-4 rounded-lg shadow-md">
              <h2 className="text-xl md:text-2xl font-bold mb-4">Access Denied</h2>
              <p className="mb-6">You are not authorized to access this area. This area is restricted to accountants only.</p>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Return to Login
              </button>
            </div>
          </div>
        )
      ) : (
        <Login />
      )}
    </>
  );
};

export default AccountantLayout; 