import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Printer } from 'lucide-react';
import Allapi from '../../../common';

const Timetable = () => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);

    // States for teacher data
    const [teacherAssignments, setTeacherAssignments] = useState([]);
    const [assignedClasses, setAssignedClasses] = useState([]);
    const [assignedSections, setAssignedSections] = useState([]);
    const [examTypes, setExamTypes] = useState([]);
    const [timetableData, setTimetableData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Form states
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedExamType, setSelectedExamType] = useState('');

    // Fetch teacher assignments
    useEffect(() => {
        const fetchTeacherAssignments = async () => {
            try {
                const response = await fetch(Allapi.getTeacherAssignments.url(decoded.teacherData.academic_id), {
                    method: Allapi.getTeacherAssignments.method,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.json();
                if (result.success) {
                    const teacherData = result.data.find(t => t.teacherId === decoded.teacherData._id);
                    setTeacherAssignments(teacherData?.classAssignments || []);

                    // Extract unique classes
                    const classes = [...new Set(teacherData?.classAssignments.map(ca => ca.className))];
                    setAssignedClasses(classes);
                }
            } catch (error) {
                toast.error("Failed to fetch teacher assignments");
            }
        };

        if (token) {
            fetchTeacherAssignments();
        }
    }, [token]);

    // Update sections when class is selected
    useEffect(() => {
        if (selectedClass) {
            const classData = teacherAssignments.find(ca => ca.className === selectedClass);
            const sections = [...new Set(classData?.sections.map(s => s.sectionName))];
            setAssignedSections(sections);
            setSelectedSection('');
            setSelectedExamType('');
            setTimetableData(null);
        }
    }, [selectedClass]);

    // Fetch exam types when section is selected
    useEffect(() => {
        const fetchExamTypes = async () => {
            if (!selectedClass || !selectedSection) return;

            try {
                setLoading(true);
                const response = await fetch(Allapi.getEveryExam.url(decoded.teacherData.branchId), {
                    method: Allapi.getEveryExam.method,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const result = await response.json();
                if (result.success) {
                    // Filter exams for selected class and section
                    const currentDate = new Date();
                    const upcomingExams = result.data.filter(exam =>
                        exam.classId.name === selectedClass &&
                        exam.sectionId.name === selectedSection &&
                        new Date(exam.subjects[0]?.date) <= new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 29)
                    );

                    setExamTypes(upcomingExams);
                }
            } catch (error) {
                toast.error("Failed to fetch exam types");
            } finally {
                setLoading(false);
            }
        };

        fetchExamTypes();
    }, [selectedClass, selectedSection]);

    // Handle exam type selection
    const handleExamTypeChange = (examId) => {
        setSelectedExamType(examId);
        const selectedExam = examTypes.find(exam => exam._id === examId);
        setTimetableData(selectedExam);
    };

    // Handle print functionality
    const handlePrint = () => {
        const printWindow = window.open('', '_blank');

        if (printWindow && timetableData) {
            printWindow.document.write(`
        <html>
          <head>
            <title>${timetableData.examName} - Timetable</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
                color: #333;
              }
              .header {
                text-align: center;
                margin-bottom: 20px;
              }
              .exam-title {
                font-size: 24px;
                color: #4338ca;
                margin-bottom: 8px;
              }
              .exam-info {
                font-size: 14px;
                color: #666;
                margin-bottom: 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
              }
              th {
                background-color: #f8fafc;
                font-weight: bold;
              }
              tr:nth-child(even) {
                background-color: #f9fafb;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="exam-title">${timetableData.examName}</div>
              <div class="exam-info">
                Class: ${selectedClass} | 
                Section: ${selectedSection}
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Total Marks</th>
                  <th>Pass Marks</th>
                </tr>
              </thead>
              <tbody>
                ${timetableData.subjects
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map(subject => `
                    <tr>
                      <td>${subject.name}</td>
                      <td>${new Date(subject.date).toLocaleDateString()}</td>
                      <td>${subject.time}</td>
                      <td>${subject.marks}</td>
                      <td>${subject.passMarks}</td>
                    </tr>
                  `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `);

            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Exam Timetable</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Class Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Class
                            </label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select Class</option>
                                {assignedClasses.map((className) => (
                                    <option key={className} value={className}>
                                        {className}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Section Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Section
                            </label>
                            <select
                                value={selectedSection}
                                onChange={(e) => setSelectedSection(e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                disabled={!selectedClass}
                            >
                                <option value="">Select Section</option>
                                {assignedSections.map((section) => (
                                    <option key={section} value={section}>
                                        {section}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Exam Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Exam Type
                            </label>
                            <select
                                value={selectedExamType}
                                onChange={(e) => handleExamTypeChange(e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                disabled={!selectedSection}
                            >
                                <option value="">Select Exam</option>
                                {examTypes.map((exam) => (
                                    <option key={exam._id} value={exam._id}>
                                        {exam.examName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : timetableData ? (
                        <div className="mt-6">
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">{timetableData.examName}</h3>
                                        <p className="text-sm text-gray-600">
                                            Class: {selectedClass} | Section: {selectedSection}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handlePrint}
                                        className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                                        title="Print Timetable"
                                    >
                                        <Printer size={20} />
                                    </button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Subject
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Time
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Total Marks
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Pass Marks
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {timetableData.subjects
                                                .sort((a, b) => new Date(a.date) - new Date(b.date))
                                                .map((subject, index) => (
                                                    <tr key={index}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {subject.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(subject.date).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {subject.time}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {subject.marks}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {subject.passMarks}
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            {!selectedClass ? "Please select a class" :
                                !selectedSection ? "Please select a section" :
                                    examTypes.length === 0 ? "No upcoming exams found" :
                                        "Please select an exam to view its timetable"}
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Timetable;