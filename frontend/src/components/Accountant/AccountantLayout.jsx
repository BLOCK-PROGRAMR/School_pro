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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and has the correct role
    const token = localStorage.getItem('token');
    const userDataStr = localStorage.getItem('userData');
    const expiryTime = localStorage.getItem('expiryTime');
    
    console.log("Checking authentication for accountant layout");
    
    if (!token || !userDataStr) {
      console.error("Missing token or user data");
      toast.error('Please login to access this page');
      navigate('/login');
      return;
    }

    // Check if token is expired
    if (expiryTime && new Date().getTime() > parseInt(expiryTime)) {
      console.error("Token expired");
      toast.error('Your session has expired. Please login again.');
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      localStorage.removeItem('expiryTime');
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(userDataStr);
      console.log("User role:", userData.role);
      setUserData(userData);
      
      // Check if user is an accountant
      if (userData.role !== 'Account') {
        console.error("Unauthorized access attempt. Role:", userData.role);
        toast.error('Unauthorized access. You must be an accountant to view this page.');
        navigate('/login');
        return;
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error parsing user data:', error);
      toast.error('Authentication error. Please login again.');
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      localStorage.removeItem('expiryTime');
      navigate('/login');
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
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