// import { CheckCheck } from "lucide-react";
// import React, { useState, useEffect } from "react";
// import BranchAdminlayout from "../../pages/BranchAdminLayout";
// import MBranchAdminLayout from "./MobileView/MBranchAdminLayout";
// import TeacherAttendance from "../Teacher/attendance/TeacherAttendance";
// import Dashboard from "../Mainadmin/Dahboard";
// import MSidebar from "./MobileView/MSidebar";
// import Trash from "./Trash/Trash";
// import Sidebar from "./Sidebar";
// import MBranchAdminlayout from "./MobileView/MBranchAdminLayout";

// const Checkbar = () => {
//     const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//     useEffect(() => {
//         const handleResize = () => {
//             setIsMobile(window.innerWidth < 768);
//         };

//         window.addEventListener("resize", handleResize);
//         console.log("happneing checkbar")
//         handleResize(); // Run once on mount

//         return () => window.removeEventListener("resize", handleResize);
//     }, []);

//     return (
//         <div className="h-screen">
//             {isMobile ? <Sidebar /> : <BranchAdminlayout />}
//         </div>
//     );
// };
// export default Checkbar;
// import React, { useState, useEffect } from "react";
// import BranchAdminlayout from "../../pages/BranchAdminLayout";
// import MBranchAdminLayout from "./MobileView/MBranchAdminLayout";

// const Checkbar = () => {
//     const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//     useEffect(() => {
//         const handleResize = () => {
//             const newIsMobile = window.innerWidth < 768;
//             console.log(`Window resized: isMobile = ${newIsMobile}`);
//             setIsMobile(newIsMobile);
//         };

//         window.addEventListener("resize", handleResize);
//         console.log("Checkbar Mounted & Running");
//         handleResize(); // Run once on mount

//         return () => {
//             console.log("Checkbar Unmounted");
//             window.removeEventListener("resize", handleResize);
//         };
//     }, []);

//     console.log(`Rendering: Showing ${isMobile ? "Mobile" : "Desktop"} View`);

//     return (
//         <div className="h-screen">
//             {isMobile ? <MBranchAdminLayout /> : <BranchAdminlayout />}
//         </div>
//     );
// };

// export default Checkbar;

import React, { useState, useEffect } from "react";
import BranchAdminlayout from "../../pages/BranchAdminLayout";
import MBranchAdminLayout from "./MobileView/MBranchAdminLayout";
import { Sidebar } from "lucide-react";

const Checkbar = () => {
    console.log("Checkbar Component Rendered"); // ✅ Log when component renders

    const [isMobile, setIsMobile] = useState(() => {
        const initial = window.innerWidth < 768;
        console.log(`Initial isMobile: ${initial}`);
        return initial;
    });

    useEffect(() => {
        console.log("Checkbar useEffect Running"); // ✅ Log when useEffect runs

        const handleResize = () => {
            const newIsMobile = window.innerWidth < 768;
            console.log(`Window resized: isMobile = ${newIsMobile}`);
            setIsMobile(newIsMobile);
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Run once on mount

        return () => {
            console.log("Checkbar Unmounted");
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    console.log(`Rendering: Showing ${isMobile ? "Mobile" : "Desktop"} View`);

    return (
        <div className="h-screen">
            {isMobile ? <MBranchAdminLayout /> : <BranchAdminlayout />}
        </div>
    );
};

export default Checkbar;

