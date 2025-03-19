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

import React, { useState, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import TeacherSidebar from './TeacherSidebar';
import { Menu } from 'lucide-react';
import { ThemeContext } from '../../store/ThemeContext';

const TeacherLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { theme } = useContext(ThemeContext);

  return (
    <div className="relative flex w-full min-h-screen bg-gray-100 dark:bg-gray-800">
      <TeacherSidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Toggle button for mobile view when sidebar is closed */}
      {!isSidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className={`fixed z-50 p-3 rounded-r-md shadow-lg top-20 left-0 transition-transform duration-300 ease-in-out ${
            theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-800 hover:bg-blue-700'
          } text-white`}
          aria-label="Show sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}
      
      <main
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'md:ml-64' : 'ml-0'
        }`}
      >
        <div className="w-full h-full min-h-screen p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default TeacherLayout;
