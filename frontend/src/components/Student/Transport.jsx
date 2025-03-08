 // filepath: /c:/Users/KomaleswarReddy/Desktop/mine/Vidy-proj/frontend/src/components/Student/Transport.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bus, Phone, User } from 'lucide-react';
import Allapi from '../../common';

const Transport = () => {
  const [transportDetails, setTransportDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bus,setbus]=useState(null);
  
  

  useEffect(() => {
    const fetchTransportDetails = async () => {
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
            console.log("response bus was ",response.data.bus)
            setbus(response.data.bus);
            console.log("response was ",response.data.data.transportDetails)
          setTransportDetails(response.data.data.transportDetails);
        } else {
          setError(response.data.message || 'Failed to fetch transport details');
        }
      } catch (error) {
        console.error('Error fetching transport details:', error);
        setError(error.response?.data?.message || 'Error fetching transport details');
      } finally {
        setLoading(false);
      }
    };

    fetchTransportDetails();
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

  if (!transportDetails) {
    return (
      <div className="text-center text-gray-600 p-8">
        <p>No transport information found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Transport Details</h1>
        {console.log("transoort",transportDetails)}
        <p className="text-blue-100">Information about your transport arrangements</p>
      </div>

      <div className="p-6">
        <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Bus className="w-5 h-5 mr-2 text-blue-600" />
            Transport Information
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Bus Stop</p>
              <p className="font-medium">{transportDetails.halt || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Driver Name</p>
              <p className="font-medium">{bus.driverName }</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contact Number</p>
              <p className="font-medium">{bus.driverPhone }</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transport;