import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaUser, FaPhone, FaIdCard, FaGraduationCap, FaBriefcase, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

const AccountantProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: {
      doorNo: '',
      street: '',
      city: '',
      pincode: ''
    },
    qualification: '',
    experience: ''
  });

  useEffect(() => {
    // Get user data from localStorage
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        setUserData(userData);
        setFormData({
          name: userData.name || '',
          phone: userData.phone || '',
          address: {
            doorNo: userData.address?.doorNo || '',
            street: userData.address?.street || '',
            city: userData.address?.city || '',
            pincode: userData.address?.pincode || ''
          },
          qualification: userData.qualification || '',
          experience: userData.experience || ''
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        toast.error('Error loading profile data');
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // In a real application, you would send this data to your API
    // For now, we'll just show a success message
    toast.success('Profile updated successfully');
    setIsEditing(false);
    
    // Update the local userData state to reflect changes
    setUserData(prev => ({
      ...prev,
      ...formData
    }));
    
    // Update localStorage
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        const updatedUserData = {
          ...userData,
          ...formData
        };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    }
  };

  if (!userData) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-blue-600 text-white">
          <h1 className="text-2xl font-bold">Accountant Profile</h1>
        </div>

        {!isEditing ? (
          <div className="p-6">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="p-2 bg-blue-100 rounded-full mr-4">
                  <FaUser className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Name</p>
                  <p className="text-lg font-semibold">{userData.name}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-blue-100 rounded-full mr-4">
                  <FaPhone className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Phone</p>
                  <p className="text-lg font-semibold">{userData.phone}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-blue-100 rounded-full mr-4">
                  <FaIdCard className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Aadhar Number</p>
                  <p className="text-lg font-semibold">{userData.aadharNumber}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-blue-100 rounded-full mr-4">
                  <FaGraduationCap className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Qualification</p>
                  <p className="text-lg font-semibold">{userData.qualification || 'Not specified'}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-blue-100 rounded-full mr-4">
                  <FaBriefcase className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Experience</p>
                  <p className="text-lg font-semibold">{userData.experience ? `${userData.experience} years` : 'Not specified'}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-blue-100 rounded-full mr-4">
                  <FaCalendarAlt className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Joining Date</p>
                  <p className="text-lg font-semibold">
                    {userData.joiningDate 
                      ? new Date(userData.joiningDate).toLocaleDateString('en-IN', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) 
                      : 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="flex items-start md:col-span-2">
                <div className="p-2 bg-blue-100 rounded-full mr-4">
                  <FaMapMarkerAlt className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Address</p>
                  <p className="text-lg font-semibold">
                    {userData.address?.doorNo && userData.address?.street
                      ? `${userData.address.doorNo}, ${userData.address.street}, ${userData.address.city || ''} ${userData.address.pincode ? `- ${userData.address.pincode}` : ''}`
                      : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Qualification
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Experience (years)
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Door No
                  </label>
                  <input
                    type="text"
                    name="address.doorNo"
                    value={formData.address.doorNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Street
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="address.pincode"
                    value={formData.address.pincode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={6}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountantProfile; 