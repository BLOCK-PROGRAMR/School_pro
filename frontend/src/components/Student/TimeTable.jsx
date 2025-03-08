import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Printer, Loader, AlertCircle, Calendar, Clock } from 'lucide-react';
import Allapi from '../../common';
import { mycon } from '../../store/Mycontext';

const TimeTable = () => {
  const { branchdet } = useContext(mycon);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState(null);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);
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
      
      // First try to get student data
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
      
      if (!data.success || !data.data) {
        throw new Error(data.message || 'Failed to fetch student details');
      }
      
      // Store the student data
      const studentData = data.data;
      setStudent(studentData);
      
      // Debug the student data structure
      const debugData = {
        studentData: {
          id: studentData._id,
          name: studentData.name,
          idNo: studentData.idNo,
          classData: studentData.class,
          sectionData: studentData.section,
          hasClass: !!studentData.class,
          hasSection: !!studentData.section,
          hasClassId: !!studentData.classId,
          hasSectionId: !!studentData.sectionId
        }
      };
      
      setDebugInfo(debugData);
      console.log("Debug data:", debugData);
      
      // Extract class and section IDs
      let classId = null;
      let sectionId = null;
      
      // Based on the debug information, we know the structure is:
      // studentData.class = { name: "LKG", id: "67c67b533161761a10a2e068" }
      // studentData.section = { name: "secA", id: "67c67b533161761a10a2e06a" }
      
      if (studentData.class && typeof studentData.class === 'object') {
        if (studentData.class.id) {
          classId = studentData.class.id;
          console.log("Found class ID from class.id:", classId);
        } else if (studentData.class._id) {
          classId = studentData.class._id;
          console.log("Found class ID from class._id:", classId);
        }
      }
      
      if (studentData.section && typeof studentData.section === 'object') {
        if (studentData.section.id) {
          sectionId = studentData.section.id;
          console.log("Found section ID from section.id:", sectionId);
        } else if (studentData.section._id) {
          sectionId = studentData.section._id;
          console.log("Found section ID from section._id:", sectionId);
        }
      }
      
      console.log("Extracted IDs:", { classId, sectionId, branchId: branchdet?._id });
      
      // Final check - if we have class and section IDs, fetch exams
      if (classId && sectionId && branchdet && branchdet._id) {
        console.log("Fetching exams with params:", {
          classId,
          sectionId,
          branchId: branchdet._id
        });
        
        await fetchExams(classId, sectionId, branchdet._id);
      } else {
        // If we still don't have the required IDs, try to fetch all exams and filter them client-side
        if (branchdet && branchdet._id) {
          console.log("Missing class or section ID, trying to fetch all exams for the branch");
          await fetchAllExamsAndFilter(branchdet._id, studentData);
        } else {
          console.error('Missing required data:', {
            classId,
            sectionId,
            branchId: branchdet?._id
          });
          setError('Student class or section information is missing. Please contact your administrator.');
          setLoading(false);
        }
      }
    } catch (err) {
      console.error('Error fetching student details:', err);
      setError('Error fetching student details: ' + (err.message || 'Unknown error'));
      setLoading(false);
    }
  };

  const fetchAllExamsAndFilter = async (branchId, studentData) => {
    try {
      console.log("Fetching all exams for branch:", branchId);
      
      const response = await fetch(
        `${Allapi.backapi}/api/exams/all-exams/${branchId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      const data = await response.json();
      console.log("All exams response:", data);
      
      if (data.success && data.data && data.data.length > 0) {
        // Get class and section names from student data
        let className, sectionName;
        
        if (studentData.class) {
          className = typeof studentData.class === 'object' ? studentData.class.name : studentData.class;
        }
        
        if (studentData.section) {
          sectionName = typeof studentData.section === 'object' ? studentData.section.name : studentData.section;
        }
        
        console.log("Filtering exams by class and section names:", { className, sectionName });
        
        // Filter exams by class and section names
        const filteredExams = data.data.filter(exam => {
          const examClassName = exam.classId && typeof exam.classId === 'object' ? exam.classId.name : null;
          const examSectionName = exam.sectionId && typeof exam.sectionId === 'object' ? exam.sectionId.name : null;
          
          return (examClassName === className && examSectionName === sectionName);
        });
        
        console.log("Filtered exams by name:", filteredExams);
        
        if (filteredExams.length > 0) {
          setExams(filteredExams);
          setSelectedExam(filteredExams[0]._id);
          setLoading(false);
          return;
        } else {
          setError('No exams found for your class and section');
          setLoading(false);
        }
      } else {
        setError('No exams available');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching all exams:', err);
      setError('Error fetching exams: ' + (err.message || 'Unknown error'));
      setLoading(false);
    }
  };

  const fetchExams = async (classId, sectionId, branchId) => {
    try {
      console.log(`Calling API: ${Allapi.backapi}/api/exams/all-exams/${classId}/${sectionId}/${branchId}`);
      
      // First try with the standard endpoint
      let response = await fetch(
        `${Allapi.backapi}/api/exams/all-exams/${classId}/${sectionId}/${branchId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      let data = await response.json();
      console.log("Exams API response:", data);
      
      // If the first attempt fails or returns no exams, try with the alternative endpoint
      if (!data.success || !data.data || data.data.length === 0) {
        console.log("First attempt failed or returned no exams, trying alternative endpoint");
        
        // Try with the branch-only endpoint as a fallback
        response = await fetch(
          `${Allapi.backapi}/api/exams/all-exams/${branchId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        
        data = await response.json();
        console.log("Alternative API response:", data);
        
        // If we got exams from the alternative endpoint, filter them for this class and section
        if (data.success && data.data && data.data.length > 0) {
          // Helper function to compare MongoDB IDs which might be in different formats
          const compareIds = (id1, id2) => {
            if (!id1 || !id2) return false;
            
            // Convert to string if they're objects with toString method
            const str1 = typeof id1 === 'object' && id1 !== null && id1.toString ? id1.toString() : String(id1);
            const str2 = typeof id2 === 'object' && id2 !== null && id2.toString ? id2.toString() : String(id2);
            
            return str1 === str2;
          };
          
          const filteredExams = data.data.filter(exam => {
            // Get the class ID from the exam (might be an object or a string)
            const examClassId = exam.classId && exam.classId._id ? exam.classId._id : exam.classId;
            
            // Get the section ID from the exam (might be an object or a string)
            const examSectionId = exam.sectionId && exam.sectionId._id ? exam.sectionId._id : exam.sectionId;
            
            // Compare the IDs
            return compareIds(examClassId, classId) && compareIds(examSectionId, sectionId);
          });
          
          console.log("Filtered exams:", filteredExams);
          
          if (filteredExams.length > 0) {
            setExams(filteredExams);
            setSelectedExam(filteredExams[0]._id);
            console.log("Exams loaded successfully from alternative endpoint:", filteredExams.length, "exams found");
            setLoading(false);
            return;
          }
        }
      }
      
      // Process the original response if it was successful
      if (data.success) {
        if (data.data && data.data.length > 0) {
          setExams(data.data);
          setSelectedExam(data.data[0]._id);
          console.log("Exams loaded successfully:", data.data.length, "exams found");
        } else {
          console.log("No exams found for this student's class and section");
          setExams([]);
        }
      } else {
        console.error('Failed to fetch exams:', data);
        toast.error(data.message || 'Failed to fetch exams');
      }
    } catch (err) {
      console.error('Error fetching exams:', err);
      setError('Error fetching exams: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const getSortedSubjects = (subjects) => {
    if (!subjects || !Array.isArray(subjects)) {
      console.error("Invalid subjects data:", subjects);
      return [];
    }
    
    return [...subjects].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });
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
                Class: ${student.class?.name || (typeof student.class === 'string' ? student.class : 'N/A')} | 
                Section: ${student.section?.name || (typeof student.section === 'string' ? student.section : 'N/A')}
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="mt-4 text-gray-600">Loading timetable...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto bg-red-50 text-red-600 p-6 rounded-lg shadow-md">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold">Error Loading Timetable</h3>
              <p className="mt-2">{error}</p>
              <p className="mt-4">Please contact the administrator for assistance.</p>
              
              {/* Debug info in development mode */}
              {process.env.NODE_ENV === 'development' && debugInfo && (
                <div className="mt-4 p-4 bg-white rounded border border-red-200 text-gray-800 text-xs">
                  <h4 className="font-bold mb-2">Debug Information:</h4>
                  <pre className="whitespace-pre-wrap overflow-auto max-h-60">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedExamData = exams.find(exam => exam._id === selectedExam);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Student Info Card */}
        {student && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Exam Timetable</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Student Name:</p>
                <p className="font-semibold text-gray-800">{student.name}</p>
              </div>
              <div>
                <p className="text-gray-600">ID Number:</p>
                <p className="font-semibold text-gray-800">{student.idNo}</p>
              </div>
              <div>
                <p className="text-gray-600">Class:</p>
                <p className="font-semibold text-gray-800">
                  {student.class?.name || (typeof student.class === 'string' ? student.class : 'N/A')}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Section:</p>
                <p className="font-semibold text-gray-800">
                  {student.section?.name || (typeof student.section === 'string' ? student.section : 'N/A')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Exam Selector */}
        {exams.length > 0 && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <label htmlFor="examSelector" className="block text-gray-700 font-medium">
                Select Exam
              </label>
              <button 
                onClick={handlePrint}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Timetable
              </button>
            </div>
            <select
              id="examSelector"
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {exams.map(exam => (
                <option key={exam._id} value={exam._id}>
                  {exam.examName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Timetable Display */}
        {selectedExamData ? (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-blue-50">
              <h3 className="text-xl font-semibold text-blue-800">
                {selectedExamData.examName}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {selectedExamData.academicId?.year ? `Academic Year: ${selectedExamData.academicId.year}` : ''}
              </p>
            </div>
            
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                        Total Marks
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                        Pass Marks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedExamData.subjects && getSortedSubjects(selectedExamData.subjects).map((subject, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border">
                          {subject.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                            {new Date(subject.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-blue-500" />
                            {subject.time}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border">
                          {subject.marks}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border">
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
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            {exams.length > 0 ? (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Please select an exam</h3>
                <p className="text-gray-600">
                  Select an exam from the dropdown above to view its timetable.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Exam Timetables Available</h3>
                <p className="text-gray-600 mb-4">
                  There are no exam timetables available for your class and section at the moment.
                </p>
                <p className="text-sm text-gray-500">
                  If you believe this is an error, please contact your teacher or administrator.
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Debug info in development mode */}
        {process.env.NODE_ENV === 'development' && debugInfo && (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg text-xs">
            <h4 className="font-bold mb-2">Debug Information:</h4>
            <pre className="whitespace-pre-wrap overflow-auto max-h-60">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeTable;