import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BookOpen, Users, Calendar, ClipboardList } from 'lucide-react';
import Allapi from '../../../common/index';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [teacherData, setTeacherData] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);

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
    }
  }, [navigate]);

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
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

        {/* Class Assignments Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Subjects Assigned</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments?.map((assignment, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  selectedClass === assignment ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
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
    </div>
  );
};

export default TeacherDashboard;
