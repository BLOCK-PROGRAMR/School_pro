import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ExternalLink, Calendar, Search } from 'lucide-react';
import Allapi from '../../common';
import { mycon } from '../../store/Mycontext';

const OnlineTestLink = () => {
  const { branchdet } = useContext(mycon);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState(null);
  const [linkCollections, setLinkCollections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  useEffect(() => {
    if (userData.username) {
      fetchStudentDetails();
    } else {
      setError('User data not found');
      setLoading(false);
    }
  }, [userData.username]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      console.log("Fetching student details for:", userData.username);
      const response = await fetch(
        `${Allapi.backapi}/api/students/get-studentById/${userData.username}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const data = await response.json();
      console.log("Student data response:", data);
      
      if (data.success && data.data) {
        setStudent(data.data);
        fetchLinkCollections();
      } else {
        setError('Failed to fetch student details');
        toast.error('Failed to fetch student details');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching student details:', err);
      setError('Error fetching student details');
      toast.error('Error fetching student details');
      setLoading(false);
    }
  };

  const fetchLinkCollections = async () => {
    try {
      console.log("Fetching link collections");
      const response = await fetch(
        `${Allapi.backapi}/api/links`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const data = await response.json();
      console.log("Link collections response:", data);
      
      if (data.success) {
        // Sort by date (newest first)
        const sortedLinks = data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setLinkCollections(sortedLinks);
      } else {
        console.error('Failed to fetch link collections:', data);
        toast.error('Failed to fetch online test links');
      }
    } catch (err) {
      console.error('Error fetching link collections:', err);
      toast.error('Error fetching online test links');
    } finally {
      setLoading(false);
    }
  };

  // Filter link collections based on search term
  const filteredLinkCollections = linkCollections.filter(collection =>
    collection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.links.some(link =>
      link.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.url.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Format date to a readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-4 text-red-500 bg-red-100 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Online Test Links</h1>
          <p className="text-gray-600">
            Access your online tests and assessments here. Click on the links to start your tests.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by title, description or URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredLinkCollections.length > 0 ? (
          <div className="space-y-6">
            {filteredLinkCollections.map((collection) => (
              <div key={collection._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-5 border-b border-gray-200 bg-blue-50">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">{collection.title}</h2>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">{formatDate(collection.date)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-5">
                  <ul className="divide-y divide-gray-200">
                    {collection.links.map((link, index) => (
                      <li key={index} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className="text-lg font-medium text-gray-800 mb-1">{link.description}</p>
                            <p className="text-sm text-blue-600 truncate">{link.url}</p>
                          </div>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            {searchTerm ? (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No matching links found</h3>
                <p className="text-gray-600">Try adjusting your search terms or clear the search to see all available links.</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No online test links available</h3>
                <p className="text-gray-600">There are currently no online test links available for you. Please check back later.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineTestLink;