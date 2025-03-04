

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

// import {
//     Home,
//     GraduationCap,
//     ClipboardList,
//     BookMarked,
//     PlusCircle,
//     List,
//     ChevronDown,
//     ChevronRight,
//     LogOut,
//     X
// } from "lucide-react";

// const MSidebar = ({ onLogout, isSidebarOpen, setSidebarOpen }) => {
//     const navigate = useNavigate(); // ✅ Fix: use inside component
//     const [activeMenu, setActiveMenu] = useState("");

//     const handleMenuClick = (menu) => {
//         setActiveMenu(activeMenu === menu ? "" : menu);
//     };

//     const MenuItem = ({ to, icon: Icon, children }) => (
//         <button
//             className="flex items-center p-2 text-sm transition-colors rounded-lg hover:bg-blue-800 w-full text-left"
//             onClick={() => navigate(to)} // ✅ Fix: Navigate properly
//         >
//             <Icon className="w-4 h-4 mr-2" />
//             <span>{children}</span>
//         </button>
//     );

//     return (
//         <>
//             {/* Overlay for mobile */}
//             {isSidebarOpen && (
//                 <div
//                     className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
//                     onClick={() => setSidebarOpen(false)}
//                 ></div>
//             )}

//             {/* Sidebar */}
//             <aside
//                 className={`fixed left-0 top-0 z-40 h-screen w-64 bg-gradient-to-b from-blue-950 to-blue-900 text-white shadow-xl transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//                     }`}
//             >
//                 <div className="flex flex-col h-full">
//                     {/* Header */}
//                     <div className="flex items-center justify-between p-4 border-b border-blue-800">
//                         <div className="flex items-center space-x-3">
//                             <div className="flex items-center justify-center w-10 h-10 bg-blue-800 rounded-full">
//                                 <GraduationCap className="w-6 h-6" />
//                             </div>
//                             <span className="text-xl font-bold tracking-wider">Branch Admin</span>
//                         </div>
//                         <button
//                             onClick={() => setSidebarOpen(false)}
//                             className="p-2 transition-colors rounded-lg hover:bg-blue-800 md:hidden"
//                         >
//                             <X className="w-5 h-5" />
//                         </button>
//                     </div>

//                     {/* Navigation */}
//                     <nav className="flex-1 overflow-y-auto p-4">
//                         {/* Dashboard */}
//                         <MenuItem to="/dashboard" icon={Home}>Dashboard</MenuItem>

//                         {/* Exams Menu */}
//                         <div>
//                             <button
//                                 onClick={() => handleMenuClick("exams")}
//                                 className="flex items-center justify-between w-full p-3 rounded-lg transition-colors hover:bg-blue-800"
//                             >
//                                 <div className="flex items-center">
//                                     <ClipboardList className="w-5 h-5 mr-3" />
//                                     <span>Exams</span>
//                                 </div>
//                                 {activeMenu === "exams" ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
//                             </button>

//                             {/* Submenu */}
//                             {activeMenu === "exams" && (
//                                 <div className="pl-6 space-y-1 transition-all duration-300">
//                                     <MenuItem to="/branch-admin/exam/view-timetable" icon={List}>View Timetable</MenuItem>
//                                     <MenuItem to="/branch-admin/syllabus/view" icon={BookMarked}>View Syllabus</MenuItem>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Uploads Menu */}
//                         <div>
//                             <button
//                                 onClick={() => handleMenuClick("uploads")}
//                                 className="flex items-center justify-between w-full p-3 rounded-lg transition-colors hover:bg-blue-800"
//                             >
//                                 <div className="flex items-center">
//                                     <PlusCircle className="w-5 h-5 mr-3" />
//                                     <span>Uploads</span>
//                                 </div>
//                                 {activeMenu === "uploads" ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
//                             </button>

//                             {/* Submenu */}
//                             {activeMenu === "uploads" && (
//                                 <div className="pl-6 space-y-1 transition-all duration-300">
//                                     <MenuItem to="/branch-admin/links/add" icon={PlusCircle}>Add Link</MenuItem>
//                                     <MenuItem to="/branch-admin/links/view" icon={List}>View Link</MenuItem>
//                                     <MenuItem to="/branch-admin/notice/add" icon={PlusCircle}>Add Notice</MenuItem>
//                                     <MenuItem to="/branch-admin/notice/view" icon={List}>View Notice</MenuItem>
//                                     <MenuItem to="/branch-admin/gallery/add" icon={PlusCircle}>Add Gallery</MenuItem>
//                                     <MenuItem to="/branch-admin/gallery/view" icon={List}>View Gallery</MenuItem>
//                                 </div>
//                             )}
//                         </div>
//                     </nav>

//                     {/* Logout Button */}
//                     <div className="p-4 border-t border-blue-800">
//                         <button
//                             onClick={onLogout}
//                             className="flex items-center justify-center w-full p-3 transition-colors bg-red-600 rounded-lg hover:bg-red-700"
//                         >
//                             <LogOut className="w-5 h-5 mr-2" />
//                             <span>Logout</span>
//                         </button>
//                     </div>
//                 </div>
//             </aside>
//         </>
//     );
// };

// export default MSidebar;

import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
    Home,
    GraduationCap,
    ClipboardList,
    BookMarked,
    PlusCircle,
    List,
    ChevronDown,
    ChevronRight,
    LogOut,
    X
} from "lucide-react";

const MSidebar = ({ onLogout, isSidebarOpen, setSidebarOpen }) => {
    const navigate = useNavigate(); // ✅ Fix: use inside component
    const [activeMenu, setActiveMenu] = useState("");

    const handleMenuClick = (menu) => {
        setActiveMenu(activeMenu === menu ? "" : menu);
    };

    const handleNavigation = (path) => {
        navigate(path);   // ✅ Fix: Ensure navigation works
        setSidebarOpen(false); // ✅ Auto-close sidebar on mobile
    };

    const handleLogout = () => {
        onLogout(); // ✅ Call logout function
        navigate("/login"); // ✅ Redirect to login page
    };

    const MenuItem = ({ to, icon: Icon, children }) => (
        // <div
        //     className="flex items-center p-2 text-sm transition-colors rounded-lg hover:bg-blue-800 w-full cursor-pointer"
        //     onClick={() => handleNavigation(to)} // ✅ Fix: Navigate on click
        // >
        //     <Icon className="w-4 h-4 mr-2" />
        //     <span>{children}</span>
        // </div>
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
            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 z-40 h-screen w-64 bg-gradient-to-b from-blue-950 to-blue-900 text-white shadow-xl transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
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
                            onClick={() => setSidebarOpen(false)}
                            className="p-2 transition-colors rounded-lg hover:bg-blue-800 md:hidden"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4">
                        {/* Dashboard */}
                        <MenuItem to="/branch-admin/mdashboard" icon={Home}>Dashboard</MenuItem>

                        {/* Exams Menu */}
                        <div>
                            <button
                                onClick={() => handleMenuClick("exams")}
                                className="flex items-center justify-between w-full p-3 rounded-lg transition-colors hover:bg-blue-800"
                            >
                                <div className="flex items-center">
                                    <ClipboardList className="w-5 h-5 mr-3" />
                                    <span>Exams</span>
                                </div>
                                {activeMenu === "exams" ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>

                            {/* Submenu */}
                            {activeMenu === "exams" && (
                                <div className="pl-6 space-y-1 transition-all duration-300">
                                    <MenuItem to="/branch-admin/exam/view-timetable" icon={List}>View Timetable</MenuItem>
                                    <MenuItem to="/branch-admin/syllabus/view" icon={BookMarked}>View Syllabus</MenuItem>
                                </div>
                            )}
                        </div>

                        {/* Uploads Menu */}
                        <div>
                            <button
                                onClick={() => handleMenuClick("uploads")}
                                className="flex items-center justify-between w-full p-3 rounded-lg transition-colors hover:bg-blue-800"
                            >
                                <div className="flex items-center">
                                    <PlusCircle className="w-5 h-5 mr-3" />
                                    <span>Uploads</span>
                                </div>
                                {activeMenu === "uploads" ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>

                            {/* Submenu */}
                            {activeMenu === "uploads" && (
                                <div className="pl-6 space-y-1 transition-all duration-300">
                                    <MenuItem to="/branch-admin/links/add" icon={PlusCircle}>Add Link</MenuItem>
                                    <MenuItem to="/branch-admin/links/view" icon={List}>View Link</MenuItem>
                                    <MenuItem to="/branch-admin/notice/add" icon={PlusCircle}>Add Notice</MenuItem>
                                    <MenuItem to="/branch-admin/notice/view" icon={List}>View Notice</MenuItem>
                                    <MenuItem to="/branch-admin/gallery/add" icon={PlusCircle}>Add Gallery</MenuItem>
                                    <MenuItem to="/branch-admin/gallery/view" icon={List}>View Gallery</MenuItem>
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Logout Button */}
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

export default MSidebar;
