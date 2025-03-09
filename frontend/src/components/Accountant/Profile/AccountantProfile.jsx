import React, { useState, useEffect } from 'react';
import { FaUser, FaPhone, FaIdCard, FaGraduationCap, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

const AccountantProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        setUserData(userData);
        console.log("Loaded accountant profile data:", userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (!userData) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">Failed to load profile data</div>;
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 text-white p-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-blue-100">View and manage your account information</p>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row">
          {/* Profile Image */}
          <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
            <div className="w-48 h-48 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
              <FaUser className="text-gray-400 text-6xl" />
            </div>
          </div>

          {/* Profile Details */}
          <div className="md:w-2/3">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <FaUser className="text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{userData.name || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FaPhone className="text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{userData.phone || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FaIdCard className="text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Aadhar Number</p>
                  <p className="font-medium">
                    {userData.aadharNumber 
                      ? `XXXX-XXXX-${userData.aadharNumber.slice(-4)}` 
                      : 'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FaGraduationCap className="text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Qualification</p>
                  <p className="font-medium">{userData.qualification || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FaCalendarAlt className="text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Joining Date</p>
                  <p className="font-medium">{formatDate(userData.joiningDate)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">
                    {userData.address ? 
                      `${userData.address.doorNo || ''} ${userData.address.street || ''}, 
                       ${userData.address.city || ''} - ${userData.address.pincode || ''}` 
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Account Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="font-medium">{userData.username || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium">{userData.role || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-medium">{userData.experience ? `${userData.experience} years` : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountantProfile; 