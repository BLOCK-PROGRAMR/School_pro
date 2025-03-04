import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import StudentSidebar from './StudentSidebar';

const StudentLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="relative flex w-full min-h-screen bg-gray-100">
      <StudentSidebar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

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

export default StudentLayout;