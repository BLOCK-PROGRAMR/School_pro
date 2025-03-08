import React, { useState, useEffect, useContext } from 'react';
import { Printer } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Allapi from '../../common';
import { mycon } from '../../store/Mycontext';

const TimeTable = () => {
  const { branchdet } = useContext(mycon);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState(null);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
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
      if (data.success && data.data) {
        setStudent(data.data);
        
        // Now fetch exams using the class and section IDs from student data
        if (data.data.class?._id && data.data.section?._id && branchdet?._id) {
          await fetchExams(data.data.class._id, data.data.section._id, branchdet._id);
        } else {
          console.error('Missing required data:', {
            classId: data.data.class?._id,
            sectionId: data.data.section?._id,
            branchId: branchdet?._id
          });
          toast.error('Student class or section information is missing');
        }
      } else {
        setError('Failed to fetch student details');
        toast.error('Failed to fetch student details');
      }
    } catch (err) {
      console.error('Error fetching student details:', err);
      setError('Error fetching student details');
      toast.error('Error fetching student details');
    } finally {
      setLoading(false);
    }
  };

  const fetchExams = async (classId, sectionId, branchId) => {
    try {
      const response = await fetch(
        `${Allapi.backapi}/api/exams/all-exams/${classId}/${sectionId}/${branchId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setExams(data.data);
        if (data.data.length > 0) {
          setSelectedExam(data.data[0]._id);
        }
      } else {
        console.error('Failed to fetch exams:', data);
        toast.error('Failed to fetch exams');
      }
    } catch (err) {
      console.error('Error fetching exams:', err);
      toast.error('Error fetching exams');
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const selectedExamData = exams.find(exam => exam._id === selectedExam);

    if (printWindow && selectedExamData) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${selectedExamData.examName} - Timetable</title>
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
              <div class="exam-title">${selectedExamData.examName}</div>
              <div class="exam-info">
                Student: ${student.name} (${student.idNo})<br>
                Class: ${student.class?.name || 'N/A'} | Section: ${student.section?.name || 'N/A'}
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
                ${getSortedSubjects(selectedExamData.subjects)
                  .map(
                    subject => `
                  <tr>
                    <td>${subject.name}</td>
                    <td>${new Date(subject.date).toLocaleDateString()}</td>
                    <td>${subject.time}</td>
                    <td>${subject.marks}</td>
                    <td>${subject.passMarks}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    }
  };

  const getSortedSubjects = subjects => {
    return [...subjects].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });
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

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-4 text-yellow-700 bg-yellow-100 rounded-lg">
          No student data available
        </div>
      </div>
    );
  }

  const selectedExamData = exams.find(exam => exam._id === selectedExam);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Exam Timetable</h1>
        <div className="text-sm text-gray-600">
          <p>Name: {student.name}</p>
          <p>ID: {student.idNo}</p>
          <p>
            Class: {student.class?.name || 'N/A'} - Section:{' '}
            {student.section?.name || 'N/A'}
          </p>
        </div>
      </div>

      {exams.length > 0 ? (
        <>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Select Exam
            </label>
            <select
              value={selectedExam}
              onChange={e => setSelectedExam(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {exams.map(exam => (
                <option key={exam._id} value={exam._id}>
                  {exam.examName}
                </option>
              ))}
            </select>
          </div>

          {selectedExamData && (
            <div className="relative overflow-x-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedExamData.examName}
                </h2>
                <button
                  onClick={handlePrint}
                  className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print Timetable
                </button>
              </div>

              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Subject</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Time</th>
                    <th className="px-6 py-3">Total Marks</th>
                    <th className="px-6 py-3">Pass Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {getSortedSubjects(selectedExamData.subjects).map(
                    (subject, index) => (
                      <tr
                        key={index}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {subject.name}
                        </td>
                        <td className="px-6 py-4">
                          {new Date(subject.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">{subject.time}</td>
                        <td className="px-6 py-4">{subject.marks}</td>
                        <td className="px-6 py-4">{subject.passMarks}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
          No exam timetables available at the moment.
        </div>
      )}
    </div>
  );
};

export default TimeTable;