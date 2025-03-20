// import React, { useState } from 'react';
// import { Outlet } from 'react-router-dom';
// import TeacherSidebar from './TeacherSideBar';

// const TeacherLayout = () => {
//   const [isSidebarOpen, setSidebarOpen] = useState(true);

//   return (
//     <div className="flex w-full min-h-screen ">
//       <TeacherSidebar 
//         isSidebarOpen={isSidebarOpen} 
//         setSidebarOpen={setSidebarOpen} 
//       />
//       <main 
//         className={`flex-1 transition-all duration-300 ${
//           isSidebarOpen ? 'ml-64' : 'ml-0'
//         }`}
//       >
//         <div className="w-full h-full min-h-screen p-8">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default TeacherLayout;

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TeacherSidebar from './TeacherSidebar';
import { Menu } from 'lucide-react';

const TeacherLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="relative flex w-full min-h-screen">
      <TeacherSidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      {!isSidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed z-50 p-2 text-white bg-blue-800 rounded-full shadow-lg top-4 left-4 hover:bg-blue-700"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}
      <main
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <div className="w-full h-full min-h-screen p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default TeacherLayout;
