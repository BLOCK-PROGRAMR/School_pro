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
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('expiryTime');
    toast.success('Logged out successfully');
    navigate('/login');
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
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:sticky top-0 left-0 z-30 w-64 h-screen transition-transform duration-300 ease-in-out bg-gray-800 text-white overflow-y-auto`}
      >
        <div className="p-5 border-b border-gray-700">
          <h2 className="text-xl font-bold">Accountant Panel</h2>
        </div>

        <nav className="mt-5">
          <ul className="space-y-2 px-4">
            {menuItems.map((item, index) => (
              <li key={index}>
                {!item.dropdown ? (
                  <Link
                    to={item.path}
                    className={`flex items-center p-2 rounded-md hover:bg-gray-700 ${
                      location.pathname === item.path ? 'bg-gray-700' : ''
                    }`}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                ) : (
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.key)}
                      className="flex items-center justify-between w-full p-2 rounded-md hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          dropdowns[item.key] ? 'rotate-180' : ''
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
                        ></path>
                      </svg>
                    </button>
                    {dropdowns[item.key] && (
                      <ul className="mt-2 space-y-1 pl-8">
                        {item.items.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              to={subItem.path}
                              className={`block p-2 rounded-md hover:bg-gray-700 ${
                                location.pathname === subItem.path ? 'bg-gray-700' : ''
                              }`}
                            >
                              {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            ))}

            {/* Logout Button */}
            <li className="mt-10">
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-2 rounded-md hover:bg-red-600 bg-red-700"
              >
                <FaSignOutAlt className="mr-2" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default AccountantSidebar; 