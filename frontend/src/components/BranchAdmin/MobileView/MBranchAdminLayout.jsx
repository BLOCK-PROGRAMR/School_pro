import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { mycon } from "../../../store/Mycontext";
import { ThemeContext } from "../../../store/ThemeContext";
import Allapi from "../../../common/index";
import MSidebar from "./MSidebar";
import { Search, Menu } from 'lucide-react';

const MBranchAdminLayout = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [c_user, setc_user] = useState(null);
    const [c_branch, setc_branch] = useState(null);
    const [branchdet, setBranchdet] = useState(null);
    const [c_acad, setc_acad] = useState(null);
    const [studentId, setStudentId] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        // Check for token and decode it
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
                toast.error("Session expired. Please login again.");
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    }, [token, navigate]);

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
                setSidebarOpen(false); // Close sidebar when navigating
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
            <div className="flex h-full bg-gray-100 dark:bg-gray-800">
                            {/* Sidebar */}
                            <MSidebar
                                onLogout={handleLogout}
                                isSidebarOpen={isSidebarOpen}
                                setSidebarOpen={setSidebarOpen}
                            />

                {/* Main Content */}
                        <div className="flex-1">
                            {/* Top Navigation Bar */}
                    <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-900'} shadow-sm p-4 flex justify-between items-center`}>
                        <button 
                            onClick={toggleSidebar} 
                            className={`p-2 rounded-md ${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-gray-800'}`}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        
                        <div className="flex items-center space-x-2">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className={`h-4 w-4 ${theme === 'light' ? 'text-gray-400' : 'text-gray-300'}`} />
                                            </div>
                                            <input
                                                type="text"
                                                value={studentId}
                                                onChange={(e) => setStudentId(e.target.value)}
                                    placeholder="Student ID"
                                    className={`block w-32 pl-10 pr-2 py-2 border rounded-md text-sm ${
                                        theme === 'light' 
                                            ? 'border-gray-300 bg-white text-gray-700' 
                                            : 'border-gray-700 bg-gray-800 text-white'
                                    }`}
                                            />
                                        </div>
                                        <button
                                            onClick={handlePayFee}
                                            disabled={loading}
                                className={`text-xs px-3 py-2 rounded-md shadow-sm text-white ${
                                    loading
                                                ? 'bg-blue-400 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                                        >
                                            {loading ? 'Searching...' : 'Pay Fee'}
                                        </button>
                                    </div>
                                </div>

                    {/* Page Content */}
                    <main className="p-4">
                                <Outlet />
                            </main>
                        </div>
                    </div>
        </mycon.Provider>
    );
};

export default MBranchAdminLayout;