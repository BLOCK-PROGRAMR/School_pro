
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  User, 
  BookOpen, 
  Bell, 
  Bus, 
  DollarSign, 
  Calendar, 
  FileText,
  School,
  Phone
} from 'lucide-react';
import Allapi from '../../common';

const StudentDashboard = () => {
  const [student] = useOutletContext();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(Allapi.getNotices.url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch notices');
        }

        const data = await response.json();
        if (data.success) {
          // Get only the latest 3 notices
          setNotices(data.data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching notices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  if (!student) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-600">Loading student information...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Student Dashboard</h1>
      
      {/* Student Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={40} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">{student.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <div className="flex items-center">
                <School className="w-4 h-4 mr-2 text-blue-600" />
                <span className="text-gray-600">
                  Class: {student.class?.name || 'N/A'} {student.section?.name || ''}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-600 mr-2">ID:</span>
                <span className="text-gray-600">{student.idNo}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-blue-600" />
                <span className="text-gray-600">{student.contactNo || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Latest Notices */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Bell className="w-5 h-5 mr-2 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Latest Notices</h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : notices.length > 0 ? (
            <ul className="space-y-3">
              {notices.map((notice) => (
                <li key={notice._id} className="border-b border-gray-100 pb-3">
                  <h3 className="font-medium text-gray-800">{notice.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{notice.content.substring(0, 100)}...</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 py-4">No notices available.</p>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/student/profile" className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <User className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Profile</span>
            </a>
            <a href="/student/fees" className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <DollarSign className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Fees</span>
            </a>
            <a href="/student/exams" className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <Calendar className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Exams</span>
            </a>
            <a href="/student/marks" className="flex flex-col items-center p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
              <FileText className="w-8 h-8 text-amber-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Marks</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;