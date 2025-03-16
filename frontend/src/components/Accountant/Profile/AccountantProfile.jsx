import React, { useState, useEffect } from 'react';
import { FaUser, FaPhone, FaIdCard, FaGraduationCap, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Allapi from '../../../common';

const AccountantProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [branchDetails, setBranchDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user data from localStorage
        const userDataStr = localStorage.getItem('userData');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          setUserData(userData);

          // Fetch branch details if branch ID exists
          if (userData.branch) {
            const response = await fetch(Allapi.getBranchById.url(userData.branch), {
              method: Allapi.getBranchById.method,
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              }
            });

            const data = await response.json();
            if (data.success) {
              setBranchDetails(data.data);
            } else {
              toast.error('Failed to fetch branch details');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error loading profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-red-600">Failed to load profile data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-blue-100">View and manage your account information</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Image */}
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <FaUser className="text-gray-400 text-5xl" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{userData.name}</h2>
                <p className="text-gray-500">Accountant</p>
              </div>

              {/* Personal Information */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <FaIdCard className="text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Username</p>
                      <p className="font-medium">{userData.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{userData.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaGraduationCap className="text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Qualification</p>
                      <p className="font-medium">{userData.qualification || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Joining Date</p>
                      <p className="font-medium">
                        {userData.joiningDate
                          ? new Date(userData.joiningDate).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Branch Information */}
                {branchDetails && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Branch Information</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Branch Name</p>
                          <p className="font-medium">{branchDetails.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Branch Phone</p>
                          <p className="font-medium">{branchDetails.phone}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="font-medium">
                            {`${branchDetails.street}, ${branchDetails.colony}, ${branchDetails.villageTown}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountantProfile; 