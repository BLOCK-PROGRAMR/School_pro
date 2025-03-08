import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaUsers, FaCalendarAlt, FaChartLine } from 'react-icons/fa';

const AccountantDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    totalCollected: 0,
    pendingFees: 0,
    studentsCount: 0,
    recentTransactions: []
  });

  useEffect(() => {
    // Get user data from localStorage
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        setUserData(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // In a real application, you would fetch these stats from your API
    // This is just mock data for demonstration
    setStats({
      totalCollected: 125000,
      pendingFees: 45000,
      studentsCount: 250,
      recentTransactions: [
        { id: 1, studentName: 'Rahul Sharma', class: 'Class 10-A', amount: 5000, date: '2023-08-15', type: 'Tuition Fee' },
        { id: 2, studentName: 'Priya Patel', class: 'Class 8-B', amount: 3500, date: '2023-08-14', type: 'Transport Fee' },
        { id: 3, studentName: 'Amit Kumar', class: 'Class 12-A', amount: 6000, date: '2023-08-14', type: 'Tuition Fee' },
        { id: 4, studentName: 'Sneha Gupta', class: 'Class 9-C', amount: 4500, date: '2023-08-13', type: 'Tuition Fee' },
        { id: 5, studentName: 'Vikram Singh', class: 'Class 11-B', amount: 2000, date: '2023-08-13', type: 'Library Fee' }
      ]
    });
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  if (!userData) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="py-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {userData.name}</h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your school finances today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Collected */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <FaMoneyBillWave className="text-green-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Collected</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalCollected)}</p>
            </div>
          </div>
        </div>

        {/* Pending Fees */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 mr-4">
              <FaMoneyBillWave className="text-red-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Pending Fees</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.pendingFees)}</p>
            </div>
          </div>
        </div>

        {/* Total Students */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <FaUsers className="text-blue-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Students</p>
              <p className="text-2xl font-bold text-gray-800">{stats.studentsCount}</p>
            </div>
          </div>
        </div>

        {/* Today's Date */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <FaCalendarAlt className="text-purple-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Today's Date</p>
              <p className="text-2xl font-bold text-gray-800">{formatDate(new Date())}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
            <button className="text-blue-600 hover:text-blue-800 font-medium">View All</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{transaction.studentName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{transaction.class}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{transaction.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(transaction.amount)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(transaction.date)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FaMoneyBillWave className="mr-2" />
            Collect Fees
          </button>
          <button className="flex items-center justify-center p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <FaChartLine className="mr-2" />
            Generate Reports
          </button>
          <button className="flex items-center justify-center p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <FaUsers className="mr-2" />
            View Students
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountantDashboard; 