import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { Search } from "lucide-react";
import AccountantSidebar from "./AccountantSidebar";
import Login from "../../pages/Login";
import Allapi from "../../common";
import { mycon } from "../../store/Mycontext";

const AccountantLayout = () => {
  const [c_user, setc_user] = useState(null);
  const [c_branch, setc_branch] = useState(null);
  const [branchdet, setBranchdet] = useState(null);
  const [c_acad, setc_acad] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
            <div className="w-full bg-slate-700 flex">
              <div>
                <AccountantSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
              </div>
              <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
                {/* Top Navigation Bar */}
                <div className="bg-white shadow-sm mb-4">
                  <div className="px-4 py-2">
                    <div className="flex justify-end items-center space-x-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={studentId}
                          onChange={(e) => setStudentId(e.target.value)}
                          placeholder="Enter Student ID Number"
                          className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <button
                        onClick={handlePayFee}
                        disabled={loading}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
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
                <main className="p-6 bg-gray-100 min-h-screen">
                  <Outlet />
                </main>
              </div>
            </div>
          </mycon.Provider>
        ) : (
          <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h2>
              <p className="text-gray-700 mb-6">
                You are not authorized to access this page. This area is restricted to accountants only.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
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