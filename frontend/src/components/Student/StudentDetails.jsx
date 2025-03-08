import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCircle } from 'lucide-react';
import Allapi from '../../common';

const StudentDetails = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        setLoading(true);
        setError('');
        
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const response = await axios({
          method: Allapi.getstudentbyIdNo.method,
          url: Allapi.getstudentbyIdNo.url(userData.username),
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (response.data.success) {
          setStudent(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch student details');
        }
      } catch (error) {
        console.error('Error fetching student details:', error);
        setError(error.response?.data?.message || 'Error fetching student details');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        <p>{error}</p>
        <p className="mt-4">Please contact the administrator for assistance.</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center text-gray-600 p-8">
        <p>No student information found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Student Profile</h1>
        <p className="text-blue-100">Basic student information</p>
      </div>

      <div className="p-6">
        <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <UserCircle className="w-5 h-5 mr-2 text-blue-600" />
            Student Information
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Student ID</p>
              <p className="font-medium">{student.idNo || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{student.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Class & Section</p>
              <p className="font-medium">
                {student.class?.name || 'N/A'} - {student.section?.name || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contact Number</p>
              <p className="font-medium">{student.emergencyContact || student.phone || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;