 


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BookOpen, Users, Calendar, ClipboardList, Bell, FileText, Download, Eye, X, Image } from 'lucide-react';
import axios from 'axios';
import Allapi from '../../../common/index';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [teacherData, setTeacherData] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);
  const [notices, setNotices] = useState([]);
  const [error, setError] = useState(null);
  const [selectedNotice, setSelectedNotice] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== 'Teacher') {
      navigate('/login');
      return;
    }

    // Get teacher data from token
    const tokenData = parseJwt(token);
    if (tokenData.teacherData) {
      setTeacherData(tokenData.teacherData);
      fetchTeacherAssignments(tokenData.teacherData._id, tokenData.teacherData.academic_id);
      fetchNotices();
    }
  }, [navigate]);

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  const fetchNotices = async () => {
    try {
      const response = await axios({
        method: Allapi.getNotices.method,
        url: Allapi.getNotices.url,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setNotices(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch notices");
        toast.error(response.data.message || "Failed to fetch notices");
      }
    } catch (error) {
      console.error("Error fetching notices:", error);
      setError(error.response?.data?.message || "Error fetching notices");
      toast.error(error.response?.data?.message || "Error fetching notices");
    }
  };

  const fetchTeacherAssignments = async (teacherId, academicId) => {
    try {
      const response = await fetch(
        Allapi.getTeacherAssignments.url(academicId),
        {
          method: Allapi.getTeacherAssignments.method,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const result = await response.json();

      if (result.success) {
        // Filter assignments for current teacher
        const teacherAssignments = result.data.find(t => t.teacherId === teacherId);
        if (teacherAssignments) {
          setAssignments(teacherAssignments.classAssignments);
        } else {
          setAssignments([]);
        }
      } else {
        toast.error(result.message || 'Error fetching assignments');
        setAssignments([]);
      }
    } catch (error) {
      toast.error('Error fetching assignments');
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClassSelect = (classData) => {
    setSelectedClass(classData);
  };

  const handleViewNotice = (notice) => {
    setSelectedNotice(notice);
  };

  const handleCloseModal = () => {
    setSelectedNotice(null);
  };

  // Function to handle direct file download
  const handleDownload = async (url, filename = 'attachment') => {
    try {
      // Fetch the file
      const response = await fetch(url);
      const blob = await response.blob();

      // Create a temporary link element
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = filename;

      // Append to the document, click it, and remove it
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download file");
    }
  };

  // Function to determine if a URL is an image
  const isImageUrl = (url) => {
    if (!url) return false;
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  };

  // Function to get filename from URL
  const getFilenameFromUrl = (url) => {
    if (!url) return 'attachment';
    const parts = url.split('/');
    const filenameWithParams = parts[parts.length - 1];
    // Remove query parameters if any
    return filenameWithParams.split('?')[0];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Teacher Profile Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {teacherData?.name}</h1>
              <div className="space-y-2 text-gray-600">
                <p><span className="font-medium">Phone:</span> {teacherData?.phone}</p>
                <p><span className="font-medium">Qualification:</span> {teacherData?.qualification}</p>
                <p><span className="font-medium">Experience:</span> {teacherData?.experience} years</p>
                <p><span className="font-medium">Joined:</span> {formatDate(teacherData?.joiningDate)}</p>
              </div>
            </div>
            <div className="flex gap-4">
              {teacherData?.teachingSubjects?.map((subject, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {subject.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Teaching Subjects</p>
                <p className="text-2xl font-semibold text-gray-900">{teacherData?.teachingSubjects?.length || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Classes Assigned</p>
                <p className="text-2xl font-semibold text-gray-900">{assignments?.length || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Experience</p>
                <p className="text-2xl font-semibold text-gray-900">{teacherData?.experience} years</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <ClipboardList className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sections</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {assignments?.reduce((total, curr) => total + curr.sections.length, 0) || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notices Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center mb-4">
            <Bell className="h-6 w-6 text-red-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">School Notices</h2>
          </div>

          {notices && notices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notices.map((notice, index) => (
                <div key={index} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{notice.title}</h3>
                    <div className="flex items-center text-gray-500 mb-3">
                      <Calendar size={16} className="mr-1" />
                      <span className="text-sm">{formatDate(notice.createdAt)}</span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-3">{notice.content}</p>

                    {/* Show attachment indicators */}
                    {notice.files && notice.files.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-500">
                          {notice.files.length} attachment{notice.files.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    )}

                    {notice.attachmentUrl && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-500">
                          {isImageUrl(notice.attachmentUrl) ? 'Image attachment' : 'File attachment'}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => handleViewNotice(notice)}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Eye size={18} className="mr-1" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>No notices available at this time.</p>
            </div>
          )}
        </div>

        {/* Class Assignments Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Subjects Assigned</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments?.map((assignment, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${selectedClass === assignment ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                onClick={() => handleClassSelect(assignment)}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Class {assignment.className}</h3>
                <div className="space-y-2">
                  {assignment.sections.map((section, sIndex) => (
                    <div key={sIndex} className="flex justify-between items-center">
                      <span className="text-gray-600">Section {section.sectionName}</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {section.subject}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
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
                  <X size={24} />
                </button>
              </div>

              <div className="flex items-center text-gray-500 mb-6">
                <Calendar size={18} className="mr-2" />
                <span>{formatDate(selectedNotice.createdAt)}</span>
              </div>

              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 whitespace-pre-line">
                  {selectedNotice.content}
                </p>
              </div>

              {/* Display image if attachmentUrl is an image */}
              {selectedNotice.attachmentUrl && isImageUrl(selectedNotice.attachmentUrl) && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Image</h3>
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <img
                      src={selectedNotice.attachmentUrl}
                      alt="Notice attachment"
                      className="max-w-full h-auto rounded-md mx-auto"
                    />
                    <div className="mt-3 flex justify-center">
                      <button
                        onClick={() => handleDownload(
                          selectedNotice.attachmentUrl,
                          getFilenameFromUrl(selectedNotice.attachmentUrl)
                        )}
                        className="flex items-center text-blue-600 hover:text-blue-800 bg-white px-3 py-2 rounded-md shadow-sm"
                      >
                        <Download size={18} className="mr-1" />
                        <span>Download Image</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Handle multiple files */}
              {selectedNotice.files && selectedNotice.files.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Attachments
                  </h3>
                  <ul className="space-y-4">
                    {selectedNotice.files.map((file, index) => {
                      const isImage = isImageUrl(file.url);
                      const filename = file.originalname || file.name || getFilenameFromUrl(file.url);

                      return (
                        <li key={index} className="bg-gray-50 p-3 rounded-md">
                          {isImage ? (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <Image className="text-gray-500 mr-2" size={18} />
                                  <span className="text-sm text-gray-700">{filename}</span>
                                </div>
                                <button
                                  onClick={() => handleDownload(file.url, filename)}
                                  className="flex items-center text-blue-600 hover:text-blue-800"
                                >
                                  <Download size={18} className="mr-1" />
                                  <span>Download</span>
                                </button>
                              </div>
                              <div className="mt-2">
                                <img
                                  src={file.url}
                                  alt={filename}
                                  className="max-w-full h-auto rounded-md mx-auto"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <FileText className="text-gray-500 mr-2" size={18} />
                                <span className="text-sm text-gray-700">{filename}</span>
                              </div>
                              <button
                                onClick={() => handleDownload(file.url, filename)}
                                className="flex items-center text-blue-600 hover:text-blue-800"
                              >
                                <Download size={18} className="mr-1" />
                                <span>Download</span>
                              </button>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Handle single attachment that's not an image */}
              {selectedNotice.attachmentUrl && !isImageUrl(selectedNotice.attachmentUrl) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Attachment
                  </h3>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center">
                      <FileText className="text-gray-500 mr-2" size={18} />
                      <span className="text-sm text-gray-700">
                        {getFilenameFromUrl(selectedNotice.attachmentUrl)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDownload(
                        selectedNotice.attachmentUrl,
                        getFilenameFromUrl(selectedNotice.attachmentUrl)
                      )}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Download size={18} className="mr-1" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;