import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  X,
  Home,
  BookOpen,
  Calendar,
  FileText,
  User,
  Bell,
  LogOut,
  Menu,
  Phone,
  Mail,
  MapPin,
  Download,
  Eye,
  Trash2,
  UserCircle,
  GraduationCap,
  Bus,
  CreditCard,
  ChevronDown,
  BookMarked,
  History,
  ClipboardList, // Added for syllabus
  BarChart, // Added for marks
} from 'lucide-react';
import Allapi from '../../common';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Add print styles (for ViewMarks)
const printStyles = `
@media print {
@page {
size: landscape;
margin: 0.5cm;
}

body {
-webkit-print-color-adjust: exact !important;
print-color-adjust: exact !important;
}

.no-print {
display: none !important;
}

.print-break-inside-avoid {
page-break-inside: avoid !important;
}

.print-visible {
display: block !important;
}

.overflow-x-auto {
overflow: visible !important;
width: 100% !important;
}

table {
width: 100% !important;
page-break-inside: auto !important;
}

tr {
page-break-inside: avoid !important;
}

thead {
display: table-header-group !important;
}

tfoot {
display: table-footer-group !important;
}
}
`;

const StudentSidebar = ({ isSidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  const [activeView, setActiveView] = useState('dashboard');
  const [student, setStudent] = useState(null);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState('');

  const [notices, setNotices] = useState([]);
  const [noticesLoading, setNoticesLoading] = useState(false);
  const [noticesError, setNoticesError] = useState('');
  const [selectedNotice, setSelectedNotice] = useState(null);

  const [examsOpen, setExamsOpen] = useState(false);
  const [feeDetailsOpen, setFeeDetailsOpen] = useState(false);

  // Syllabus states
  const [syllabusData, setSyllabusData] = useState(null);
  const [syllabusLoading, setSyllabusLoading] = useState(false);
  const [syllabusError, setSyllabusError] = useState('');
  const [selectedExam, setSelectedExam] = useState(null);
  const [examList, setExamList] = useState([]);
  const [isEditing, setIsEditing] = useState(false); //for syllabus
  const [editedSyllabus, setEditedSyllabus] = useState({}); //for syllabus

  // Marks states
  const [marksData, setMarksData] = useState(null);
  const [marksLoading, setMarksLoading] = useState(false);
  const [marksError, setMarksError] = useState('');

  const navItems = [
    { name: 'Dashboard', path: 'dashboard', icon: <Home className="w-5 h-5" /> },
    { name: 'Student Details', path: 'details', icon: <UserCircle className="w-5 h-5" /> },
    { name: 'Notice', path: 'notice', icon: <BookMarked className="w-5 h-5" /> },
    { name: 'Transport', path: 'transport', icon: <Bus className="w-5 h-5" /> },
  ];

  const examsItems = [
    { path: "timetable", icon: Calendar, label: "Time Table" },
    { path: "syllabus", icon: ClipboardList, label: "Exam Syllabus" }, // Changed icon
    { path: "marks", icon: BarChart, label: "Exam Marks" }, // Changed icon
    { path: "online-test", icon: FileText, label: "Online Test Link" }
  ];

  const feeItems = [
    { path: "ledger", icon: FileText, label: "Fee Ledger" },
    { path: "schedule", icon: Calendar, label: "Fee Pay Schedule" },
    { path: "gallery", icon: CreditCard, label: "Gallery (5)" }
  ];

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (navItems.some(item => item.path === path) || examsItems.some(item => `exams-${item.path}` === path) || feeItems.some(item => `fees-${item.path}` === path)) {
      setActiveView(path);
    } else {
      setActiveView('dashboard');
    }
  }, [location]);

  useEffect(() => {
    if (activeView === 'details' && userData.username) {
      fetchStudentDetails();
    } else if (activeView === 'notice') {
      fetchNotices();
    } else if (activeView === 'exams-syllabus') {
      fetchStudentExams(); // Fetch exams when syllabus view is active
    } else if (activeView === 'exams-marks') {
      fetchStudentMarks(); // Fetch marks when marks view is active
    }
  }, [activeView, userData.username]);

  const fetchStudentDetails = async () => {
    // ... (existing fetchStudentDetails function remains unchanged)
    try {
      setStudentLoading(true);
      setStudentError('');

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
        setStudentError(response.data.message || 'Failed to fetch student details');
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
      setStudentError(error.response?.data?.message || 'Error fetching student details');
    } finally {
      setStudentLoading(false);
    }
  };

  const fetchNotices = async () => {
    // ... (existing fetchNotices function remains unchanged)
    try {
      setNoticesLoading(true);
      setNoticesError('');

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
        setNoticesError(response.data.message || 'Failed to fetch notices');
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
      setNoticesError(error.response?.data?.message || 'Error fetching notices');
    } finally {
      setNoticesLoading(false);
    }
  };

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('expiryTime');
    window.location.href = '/login';
  };

  const handleNavClick = (path) => {
    setActiveView(path);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // New function to fetch student's exams
  const fetchStudentExams = async () => {
    if (!student) return;

    try {
      setSyllabusLoading(true);
      setSyllabusError('');
      const response = await fetch(
        Allapi.getAllExams.url(student.class?._id, student.section?._id, student.branch?._id),
        {
          method: Allapi.getAllExams.method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const result = await response.json();
      if (result.success) {
        setExamList(result.data);
      } else {
        setSyllabusError("Failed to fetch exams");
      }
    } catch (error) {
      setSyllabusError("Error fetching exams");
    } finally {
      setSyllabusLoading(false);
    }
  };

  // New function to fetch syllabus for the selected exam
  const fetchSyllabus = async () => {
    if (!selectedExam) return;

    try {
      setSyllabusLoading(true);
      setSyllabusError('');
      const response = await fetch(
        Allapi.getAllSyllabus.url(student.branch?._id, student.academicYear?._id),
        {
          method: Allapi.getAllSyllabus.method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        // Filter syllabus for selected class, section and exam
        const relevantSyllabus = result.data.find(
          (s) =>
            s.classId === student.class?._id &&
            s.sectionId === student.section?._id &&
            s.examName === selectedExam.examName
        );
        setSyllabusData(relevantSyllabus);
      } else {
        setSyllabusError("Failed to fetch syllabus");
      }
    } catch (error) {
      setSyllabusError("Error fetching syllabus");
    } finally {
      setSyllabusLoading(false);
    }
  };

  //for syllabus
  const handleExamChange = (e) => {
    const exam = examList.find((ex) => ex._id === e.target.value);
    setSelectedExam(exam);
    setSyllabusData(null); // Reset syllabus data when exam changes
  };

  //for syllabus
  useEffect(() => {
    if (selectedExam) {
      fetchSyllabus();
    }
  }, [selectedExam]);

  // New function to fetch student's marks
  const fetchStudentMarks = async () => {
    if (!student) return;

    try {
      setMarksLoading(true);
      setMarksError('');
      const response = await fetch(
        Allapi.getMarksByStudent.url(student._id, student.branch?._id),
        {
          method: Allapi.getMarksByStudent.method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const result = await response.json();
      if (result.success) {
        setMarksData(result.data);
      } else {
        setMarksError(result.message || "Failed to fetch marks");
      }
    } catch (error) {
      setMarksError("Error fetching marks");
    } finally {
      setMarksLoading(false);
    }
  };

  const getRankSuffix = (rank) => {
    if (rank >= 11 && rank <= 13) return 'th';
    const lastDigit = rank % 10;
    switch (lastDigit) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const handlePrint = () => { //for marks
    window.print();
  };

  const renderContent = () => {
    switch (activeView) {
      case 'details':
        return renderStudentDetailsContent();
      case 'notice':
        return renderNoticesContent();
      case 'exams-syllabus':
        return renderSyllabusContent();
      case 'exams-marks':
        return renderMarksContent();
      case 'dashboard':
      default:
        return renderDashboardContent();
    }
  };

  const renderStudentDetailsContent = () => {
    // ... (existing renderStudentDetailsContent function remains unchanged)
    if (studentLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (studentError) {
      return (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          <p>{studentError}</p>
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
                <p className="text-sm text-gray-500">Class &amp; Section</p>
                <p className="font-medium">
                  {student.class?.name || 'N/A'} - {student.section?.name || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact Number</p>
                <p className="font-medium">{student.contactNo || student.phone || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderNoticesContent = () => {
    // ... (existing renderNoticesContent function remains unchanged)
    if (noticesLoading) {
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
          {noticesError && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
              {noticesError}
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

  const renderDashboardContent = () => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">Select an option from the sidebar to view details.</p>
      </div>
    );
  };

  //for syllabus
  const renderSyllabusContent = () => {
    if (syllabusLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (syllabusError) {
      return (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          <p>{syllabusError}</p>
        </div>
      );
    }
    return (
      <div className="min-h-screen px-4 py-8 bg-gray-100">
        <div className="p-8 mx-auto bg-white rounded-lg shadow-lg max-w-7xl">
          <h2 className="mb-6 text-3xl font-bold text-gray-800">View Syllabus</h2>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Academic Year
            </label>
            <input
              type="text"
              value={student?.academicYear?.year}
              disabled
              className="w-full p-3 text-gray-700 border rounded bg-gray-50"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Class
              </label>
              <input
                type="text"
                value={student?.class?.name}
                disabled
                className="w-full p-3 text-gray-700 border rounded bg-gray-50"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Section
              </label>
              <input
                type="text"
                value={student?.section?.name}
                disabled
                className="w-full p-3 text-gray-700 border rounded bg-gray-50"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Exam
              </label>
              <select
                value={selectedExam?._id || ""}
                onChange={handleExamChange}
                className="w-full p-3 text-gray-700 bg-white border rounded"
              >
                <option value="">Select Exam</option>
                {examList.map((exam) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.examName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {syllabusData && selectedExam?.subjects?.length > 0 && (
            <div className="mt-6">
              <div className="overflow-x-auto">
                <table className="w-full bg-white border border-collapse border-gray-300">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-300">
                      <th className="p-4 font-semibold text-left text-gray-700 border-r border-gray-300">
                        Subject Name
                      </th>
                      <th className="p-4 font-semibold text-left text-gray-700">
                        Syllabus
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedExam.subjects.map((subject) => (
                      <tr key={subject._id} className="border-b border-gray-300">
                        <td className="p-4 font-medium text-gray-700 border-r border-gray-300">
                          {subject.name}
                        </td>
                        <td className="p-4 text-gray-900">

                          {syllabusData.syllabus[subject._id] || "No syllabus added"}

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {selectedExam && !syllabusData && (
            <div className="p-4 mt-6 text-center text-gray-700 bg-gray-100 rounded">
              No syllabus found for the selected criteria
            </div>
          )}

          <ToastContainer />
        </div>
      </div>
    );
  };

  const renderMarksContent = () => {
    if (marksLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (marksError) {
      return (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          <p>{marksError}</p>
        </div>
      );
    }

    if (!marksData || marksData.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500">No marks data available for this student.</p>
        </div>
      );
    }

    return (
      <>
        <style>{printStyles}</style>
        <div className="min-h-screen px-4 py-8 bg-slate-100 print:bg-white print:p-0">
          <div className="max-w-6xl p-8 mx-auto bg-white rounded-xl shadow-xl print:shadow-none print:max-w-none">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-blue-700 print:text-black">Marks View with Ranks</h2>
              {marksData && (
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors no-print"
                >
                  <Printer size={20} />
                  Print Results
                </button>
              )}
            </div>

            {/* Print Header */}
            <div className="hidden print:block text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">{student?.branch?.name || 'School Name'}</h1>
              <p className="text-lg mb-1">Exam Results</p>
              <p className="text-md">Academic Year: {student?.academicYear?.year}</p>
            </div>

            {/* Filters Section (Hidden for simplicity in student view) */}
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4 no-print hidden">
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-800">Academic Year</label>
                <input
                  type="text"
                  value={student?.academicYear?.year}
                  disabled
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-700"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-800">Class</label>
                <input
                    type="text"
                    value={student?.class?.name}
                    disabled
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-700"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-800">Section</label>
                <input
                    type="text"
                    value={student?.section?.name}
                    disabled
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-700"
                />
              </div>
            </div>

            {/* Results Display */}
            {marksData && (
              <div className="space-y-8 print:space-y-4">
                {/* Iterate through each exam */}
                {marksData.map((examData) => (
                  <div
                    key={examData.examId}
                    className="p-6 bg-blue-50 rounded-xl border border-blue-200 shadow-sm print:bg-white print:shadow-none print:border print:border-gray-300 print:p-4 print-break-inside-avoid"
                  >
                    <h3 className="mb-4 text-xl font-semibold text-blue-800 print:text-black">
                      Exam Details: {examData.examName}
                    </h3>

                    {/* Display marks for the current exam */}
                    {examData.subjects && examData.subjects.length > 0 && (
                      <div className="print-break-inside-avoid">
                        <div className="overflow-x-auto print:overflow-visible">
                          <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden print:shadow-none">
                            <thead className="bg-green-50 print:bg-gray-100">
                              <tr>
                                <th className="p-4 text-left font-semibold text-green-900 border-b border-green-200 print:text-black print:border-gray-300">
                                  Subject
                                </th>
                                <th className="p-4 text-left font-semibold text-green-900 border-b border-green-200 print:text-black print:border-gray-300">
                                  Marks Obtained
                                </th>
                                <th className="p-4 text-left font-semibold text-green-900 border-b border-green-200 print:text-black print:border-gray-300">
                                  Max Marks
                                </th>
                                 <th className="p-4 text-left font-semibold text-green-900 border-b border-green-200 print:text-black print:border-gray-300">
                                  Pass Marks
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {examData.subjects.map((subject) => (
                                <tr
                                  key={subject.name}
                                  className={`hover:bg-green-50  print:hover:bg-white print:bg-white`}
                                >
                                  <td className="p-4 border-b border-green-100 print:border-gray-300 font-medium">
                                    {subject.name}
                                  </td>
                                  <td className="p-4 border-b border-green-100 print:border-gray-300">
                                    {subject.marks}
                                  </td>
                                   <td className="p-4 border-b border-green-100 print:border-gray-300">
                                    {subject.maxMarks}
                                  </td>
                                   <td className="p-4 border-b border-green-100 print:border-gray-300">
                                    {subject.passMarks}
                                  </td>
                                </tr>
                              ))}
                              <tr className="bg-gray-100">
                                  <td className="p-4 border-b border-green-100 print:border-gray-300 font-bold" >Total</td>
                                  <td className="p-4 border-b border-green-100 print:border-gray-300 font-bold">{examData.total}</td>
                                  <td className="p-4 border-b border-green-100 print:border-gray-300 font-bold">{examData.maxTotal}</td>
                                   <td className="p-4 border-b border-green-100 print:border-gray-300"></td>

                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Print Footer */}
                <div className="mt-8 text-center hidden print:block">
                  <p className="text-sm text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            )}

            <ToastContainer />
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 bg-gradient-to-b from-blue-950 to-blue-900 text-white shadow-xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-blue-800">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-800 rounded-full">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-wider">Student Portal</span>
            </div>
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 transition-colors rounded-lg hover:bg-blue-800 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Student Profile Summary */}
          {userData && (
            <div className="p-4 border-b border-blue-800">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-700 rounded-full">
                  <UserCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{userData.name || 'Student'}</h3>
                  <p className="text-xs text-blue-200">{userData.username || 'ID: N/A'}</p>
                </div>
              </div>
            </div>
          )}

          <nav className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 hover:bg-blue-800 ${activeView === item.path ? 'bg-blue-800' : ''
                    }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </button>
              ))}

              {/* Exams Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setExamsOpen(!examsOpen)}
                  className="flex items-center w-full p-3 rounded-lg transition-all duration-200 hover:bg-blue-800"
                >
                  <Calendar className="w-5 h-5 mr-3" />
                  <span>Exams</span>
                  <ChevronDown
                    className={`w-4 h-4 ml-auto transition-transform duration-200 ${examsOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`pl-4 mt-2 space-y-2 transition-all duration-200 ${examsOpen ? 'block' : 'hidden'
                    }`}
                >
                  {examsItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavClick(`exams-${item.path}`)}
                      className="flex items-center w-full p-3 rounded-lg transition-all duration-200 hover:bg-blue-800"
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fee Details Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setFeeDetailsOpen(!feeDetailsOpen)}
                  className="flex items-center w-full p-3 rounded-lg transition-all duration-200 hover:bg-blue-800"
                >
                  <CreditCard className="w-5 h-5 mr-3" />
                  <span>Fee Details</span>
                  <ChevronDown
                    className={`w-4 h-4 ml-auto transition-transform duration-200 ${feeDetailsOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`pl-4 mt-2 space-y-2 transition-all duration-200 ${feeDetailsOpen ? 'block' : 'hidden'
                    }`}
                >
                  {feeItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavClick(`fees-${item.path}`)}
                      className="flex items-center w-full p-3 rounded-lg transition-all duration-200 hover:bg-blue-800"
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="p-4 border-t border-blue-800">
            <div className="flex justify-between items-center">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center px-4 py-2 transition-colors bg-red-600 rounded-lg hover:bg-red-700"
              >
                <LogOut className="w-5 h-5 mr-2" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Toggle button for mobile - fixed at the top */}
      <button
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md md:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 md:ml-64 mt-16 md:mt-0">
        {/* Header for mobile */}
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-20 md:hidden">
          <div className="flex items-center justify-center h-16 px-4">
            <GraduationCap className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-xl font-bold text-blue-900">Vidya Nidhi</h1>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};

export default StudentSidebar;
