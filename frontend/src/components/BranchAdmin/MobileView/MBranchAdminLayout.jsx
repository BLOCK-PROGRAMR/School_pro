
// import React, { useEffect, useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Search, Menu } from 'lucide-react';
// import { jwtDecode } from "jwt-decode";
// import MSidebar from "./MSidebar";
// import Allapi from "../../../common/index";
// import { mycon } from "../../../store/Mycontext";

// const MBranchAdminLayout = () => {
//     const token = localStorage.getItem("token");
//     const [c_user, setc_user] = useState(null);
//     const [c_branch, setc_branch] = useState(null);
//     const [branchdet, setBranchdet] = useState(null);
//     const [c_acad, setc_acad] = useState(null);
//     const [studentId, setStudentId] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [isSidebarOpen, setSidebarOpen] = useState(false);

//     useEffect(() => {
//         // Check for token and decode it
//         if (token) {
//             try {
//                 const decoded = jwtDecode(token);
//                 console.log("Decoded token:", decoded);
//                 setc_user(decoded);
//                 setc_branch(decoded.branch);
//                 if (decoded.branch) {
//                     fetchBranchById(decoded.branch);
//                 }
//             } catch (error) {
//                 console.error("Error decoding token:", error);
//                 // If token is invalid, set a mock user for demo purposes
//                 setc_user({ role: "BranchAdmin" });
//             }
//         } else {
//             // Set mock user for demo purposes if no token exists
//             setc_user({ role: "BranchAdmin" });
//         }
//     }, [token]);

//     const fetchBranchById = async (id) => {
//         try {
//             const response = await fetch(Allapi.getBranchById.url(id), {
//                 method: Allapi.getBranchById.method,
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     "Content-Type": "application/json",
//                 },
//             });

//             const res = await response.json();
//             console.log("token", res)
//             if (res.success) {
//                 setBranchdet(res.data);
//             } else {
//                 toast.error("Failed to fetch branch details");
//             }
//         } catch (error) {
//             console.error("Error fetching branch by ID:", error);
//             toast.error("Error occurred while fetching branch details");
//             // Set mock branch data for demo
//             setBranchdet({ name: "Demo Branch", location: "Demo Location" });
//         }
//     };

//     const handlePayFee = async () => {
//         if (!studentId.trim()) {
//             toast.warning("Please enter a student ID");
//             return;
//         }

//         setLoading(true);
//         try {
//             // First try to get student by ID number
//             const response = await fetch(Allapi.getstudentbyIdNo.url(studentId), {
//                 method: Allapi.getstudentbyIdNo.method,
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     "Content-Type": "application/json",
//                 },
//             });

//             const data = await response.json();

//             if (data.success && data.data) {
//                 // Navigate to fee payment page with MongoDB _id
//                 console.log(`Navigating to /branch-admin/students-payfee/${data.data._id}`);
//                 toast.success("Student found! Redirecting to payment page.");
//             } else {
//                 toast.error("Student not found. Please check the ID number.");
//             }
//         } catch (error) {
//             console.error("Error fetching student:", error);
//             toast.error("Error finding student. Please try again.");

//             // For demo purposes, simulate success after error
//             setTimeout(() => {
//                 console.log(`Navigating to /branch-admin/students-payfee/${studentId}`);
//                 toast.info("Demo mode: Simulating navigation to payment page");
//             }, 1000);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleLogout = () => {
//         localStorage.removeItem("token");
//         localStorage.removeItem("expiryTime");
//         console.log("Logging out");
//         toast.success("Logged out Successfully");
//         // In a real app with react-router, you would use: navigate("/login");
//     };

//     const toggleSidebar = () => {
//         setSidebarOpen(!isSidebarOpen);
//     };

//     return (
//         <mycon.Provider value={{ c_branch, branchdet, c_acad, setc_acad, setBranchdet }}>
//             {c_user && c_user.role === "BranchAdmin" ? (
//                 <div className="w-full bg-slate-100 flex">
//                     {/* Mobile menu button */}
//                     <button
//                         onClick={toggleSidebar}
//                         className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white"
//                     >
//                         <Menu className="h-6 w-6" />
//                     </button>

//                     {/* Sidebar */}
//                     <MSidebar
//                         onLogout={handleLogout}
//                         isSidebarOpen={isSidebarOpen}
//                         setSidebarOpen={setSidebarOpen}
//                     />

//                     {/* Main content */}
//                     <div className="flex-1 ml-0 md:ml-64 transition-all duration-300">
//                         {/* Top Navigation Bar */}
//                         <div className="bg-white shadow-sm mb-4 p-4">
//                             <div className="flex justify-between items-center">
//                                 <h1 className="text-xl font-bold text-gray-800">
//                                     {branchdet ? `${branchdet.name} Dashboard` : "Branch Admin Dashboard"}
//                                 </h1>
//                                 <div className="flex items-center space-x-4">
//                                     <div className="relative">
//                                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                             <Search className="h-5 w-5 text-gray-400" />
//                                         </div>
//                                         <input
//                                             type="text"
//                                             value={studentId}
//                                             onChange={(e) => setStudentId(e.target.value)}
//                                             placeholder="Enter Student ID Number"
//                                             className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                                         />
//                                     </div>
//                                     <button
//                                         onClick={handlePayFee}
//                                         disabled={loading}
//                                         className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${loading
//                                             ? 'bg-blue-400 cursor-not-allowed'
//                                             : 'bg-blue-600 hover:bg-blue-700'
//                                             } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
//                                     >
//                                         {loading ? 'Searching...' : 'Pay Fee'}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Main content area */}
//                         <main className="p-6">
//                             <div className="bg-white rounded-lg shadow-md p-6">
//                                 <h2 className="text-xl font-semibold mb-4">Welcome to Branch Admin Dashboard</h2>
//                                 <p className="text-gray-600">
//                                     Use the sidebar to navigate through different sections. You can manage exams,
//                                     view timetables, upload notices, and more from here.
//                                 </p>
//                             </div>
//                         </main>
//                     </div>
//                     <ToastContainer position="top-right" autoClose={3000} />
//                 </div>
//             ) : (
//                 <div className="flex items-center justify-center h-screen bg-gray-100">
//                     <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
//                         <h1 className="text-2xl font-bold text-center mb-6">You Are Not Authorized</h1>
//                         <p className="text-gray-600 text-center mb-6">
//                             Please log in with a Branch Admin account to access this dashboard.
//                         </p>
//                         <button
//                             onClick={() => window.location.href = "/login"}
//                             className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
//                         >
//                             Go to Login
//                         </button>
//                     </div>
//                     <ToastContainer position="top-right" autoClose={3000} />
//                 </div>
//             )}
//         </mycon.Provider>
//     );
// };

// export default MBranchAdminLayout;
import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { mycon } from "../../../store/Mycontext";
import Allapi from "../../../common/index";
import MSidebar from "./MSidebar";
import Login from "../../../pages/Login";
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
    const [isSidebarOpen, setSidebarOpen] = useState(false);

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

                    <div className="w-full bg-slate-700 flex">
                        <div className="w-full bg-slate-100 flex">
                            {/* Mobile menu button */}

                            <button
                                onClick={toggleSidebar}
                                className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        </div>

                        <div>
                            {/* <Sidebar ishidden={false} /> */}
                            {/* Sidebar */}
                            <MSidebar
                                onLogout={handleLogout}
                                isSidebarOpen={isSidebarOpen}
                                setSidebarOpen={setSidebarOpen}
                            />

                        </div>
                        <div className="flex-1">
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
                                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${loading
                                                ? 'bg-blue-400 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700'
                                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
                                        >
                                            {loading ? 'Searching...' : 'Pay Fee'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <main className="min-w-[83vw]">
                                <Outlet />
                            </main>
                        </div>
                    </div>
                ) : (
                    <div>You Are Not Authorized</div>
                )
            ) : (
                <Login />
            )}
        </mycon.Provider>
    );
};

export default BranchAdminlayout;