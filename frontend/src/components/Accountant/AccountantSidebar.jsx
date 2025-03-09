import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaMoneyBillWave, FaFileInvoiceDollar, FaChartLine, FaBook, FaUserCog, FaSignOutAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AccountantSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdowns, setDropdowns] = useState({});

  const toggleDropdown = (key) => {
    setDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('expiryTime');
    
    console.log("Logging out accountant");
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Check if a menu item is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Check if a dropdown menu has an active item
  const hasActiveChild = (items) => {
    return items.some(item => location.pathname === item.path);
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <FaHome className="mr-2" />,
      path: '/accountant',
      dropdown: false
    },
    {
      title: 'Fee Management',
      icon: <FaMoneyBillWave className="mr-2" />,
      dropdown: true,
      key: 'fee',
      items: [
        { title: 'Collect Fees', path: '/accountant/fee/collect' },
        { title: 'Fee Reports', path: '/accountant/fee/reports' },
        { title: 'Fee Structure', path: '/accountant/fee/structure' }
      ]
    },
    {
      title: 'Financial Records',
      icon: <FaFileInvoiceDollar className="mr-2" />,
      dropdown: true,
      key: 'finance',
      items: [
        { title: 'Cash Book', path: '/accountant/finance/cash-book' },
        { title: 'Bank Book', path: '/accountant/finance/bank-book' },
        { title: 'Ledger', path: '/accountant/finance/ledger' },
        { title: 'Vouchers', path: '/accountant/finance/vouchers' }
      ]
    },
    {
      title: 'Reports',
      icon: <FaChartLine className="mr-2" />,
      dropdown: true,
      key: 'reports',
      items: [
        { title: 'Daily Collection', path: '/accountant/reports/daily' },
        { title: 'Monthly Collection', path: '/accountant/reports/monthly' },
        { title: 'Outstanding Fees', path: '/accountant/reports/outstanding' }
      ]
    },
    {
      title: 'Student Records',
      icon: <FaBook className="mr-2" />,
      dropdown: true,
      key: 'students',
      items: [
        { title: 'View Students', path: '/accountant/students/view' },
        { title: 'Fee History', path: '/accountant/students/fee-history' }
      ]
    },
    {
      title: 'Profile',
      icon: <FaUserCog className="mr-2" />,
      path: '/accountant/profile',
      dropdown: false
    }
  ];

  return (
    <>
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-16 left-0 z-20 p-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white w-64 min-h-screen flex-shrink-0 ${
          isOpen ? 'block' : 'hidden'
        } lg:block transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Accountant Panel</h2>
        </div>

        <nav className="mt-4">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index} className="mb-1">
                {item.dropdown ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.key)}
                      className={`flex items-center w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors ${
                        hasActiveChild(item.items) ? 'bg-gray-700' : ''
                      }`}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                      <svg
                        className={`ml-auto w-4 h-4 transition-transform ${
                          dropdowns[item.key] ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {dropdowns[item.key] && (
                      <ul className="pl-8 mt-1">
                        {item.items.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              to={subItem.path}
                              className={`block px-4 py-2 hover:bg-gray-700 transition-colors ${
                                isActive(subItem.path) ? 'bg-gray-700 text-blue-400' : ''
                              }`}
                            >
                              {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-2 hover:bg-gray-700 transition-colors ${
                      isActive(item.path) ? 'bg-gray-700 text-blue-400' : ''
                    }`}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                )}
              </li>
            ))}
            <li className="mt-4">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 transition-colors"
              >
                <FaSignOutAlt className="mr-2" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default AccountantSidebar; 