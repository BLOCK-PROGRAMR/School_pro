import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AccountantSidebar from './AccountantSidebar';
import Header from '../Header';
import Footer from '../Footer';

const AccountantLayout = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in and has the correct role
    const token = localStorage.getItem('token');
    const userDataStr = localStorage.getItem('userData');
    
    if (!token || !userDataStr) {
      toast.error('Please login to access this page');
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(userDataStr);
      setUserData(userData);
      
      // Check if user is an accountant
      if (userData.role !== 'Account') {
        toast.error('Unauthorized access');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      navigate('/login');
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!userData) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <AccountantSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 bg-gray-100">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AccountantLayout; 