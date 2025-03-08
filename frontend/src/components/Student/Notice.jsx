import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Eye, X, FileText, Download } from 'lucide-react';
import Allapi from '../../common';

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedNotice, setSelectedNotice] = useState(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await axios({
          method: Allapi.getNotices.method,
          url: Allapi.getNotices.url,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (response.data.success) {
          setNotices(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch notices');
        }
      } catch (error) {
        console.error('Error fetching notices:', error);
        setError(error.response?.data?.message || 'Error fetching notices');
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const handleViewNotice = (notice) => {
    setSelectedNotice(notice);
  };

  const handleCloseModal = () => {
    setSelectedNotice(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">School Notices</h1>
        <p className="text-blue-100">Stay updated with the latest announcements</p>
      </div>
      
      <div className="p-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {notices.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-gray-500">No notices available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {notices.map((notice) => (
              <div key={notice._id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{notice.title}</h2>
                <div className="flex items-center text-gray-500 mb-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">{formatDate(notice.date)}</span>
                </div>
                <p className="text-gray-600 mb-3">{notice.description}</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleViewNotice(notice)}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedNotice.title}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center text-gray-500 mb-6">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{formatDate(selectedNotice.date)}</span>
              </div>

              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 whitespace-pre-line">
                  {selectedNotice.description}
                </p>
              </div>

              {selectedNotice.files && selectedNotice.files.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Attachments
                  </h3>
                  <ul className="space-y-2">
                    {selectedNotice.files.map((file, index) => (
                      <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                        <div className="flex items-center">
                          <FileText className="text-gray-500 mr-2" size={18} />
                          <span className="text-sm text-gray-700">{file.originalname || file.name}</span>
                        </div>
                        <a
                          href={file.url}
                          download
                          className="flex items-center text-blue-600 hover:text-blue-800"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="w-5 h-5 mr-1" />
                          <span>Download</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notice;