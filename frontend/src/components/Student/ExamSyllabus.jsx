import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Printer } from 'lucide-react';
import Allapi from '../../common';
import { mycon } from '../../store/Mycontext';

const ExamSyllabus = () => {
  const { branchdet } = useContext(mycon);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState(null);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [syllabusData, setSyllabusData] = useState(null);
  const [academicYear, setAcademicYear] = useState(null);
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
        
        // Extract class and section IDs, handling different possible structures
        let classId, sectionId;
        
        // Check for class ID in different possible locations
        if (data.data.class && data.data.class._id) {
          classId = data.data.class._id;
        } else if (data.data.class && data.data.class.id) {
          classId = data.data.class.id;
        } else if (data.data.classId) {
          classId = data.data.classId;
        }
        
        // Check for section ID in different possible locations
        if (data.data.section && data.data.section._id) {
          sectionId = data.data.section._id;
        } else if (data.data.section && data.data.section.id) {
          sectionId = data.data.section.id;
        } else if (data.data.sectionId) {
          sectionId = data.data.sectionId;
        }
        
        console.log("Extracted IDs:", { classId, sectionId, branchId: branchdet?._id });
        
        // Fetch academic year
        if (data.data.academic_id) {
          setAcademicYear(data.data.academic_id);
        }
        
        // Now fetch exams using the extracted IDs
        if (classId && sectionId && branchdet && branchdet._id) {
          console.log("Fetching exams with params:", {
            classId,
            sectionId,
            branchId: branchdet._id
          });
          
          await fetchExams(classId, sectionId, branchdet._id);
        } else {
          console.error('Missing required data:', {
            classId,
            sectionId,
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
            
            // Fetch syllabus for the first exam
            await fetchSyllabus(filteredExams[0]._id);
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
          
          // Fetch syllabus for the first exam
          await fetchSyllabus(data.data[0]._id);
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
      toast.error('Error fetching exams: ' + (err.message || 'Unknown error'));
    }
  };

  const fetchSyllabus = async (examId) => {
    if (!branchdet || !branchdet._id || !academicYear) {
      console.error('Missing required data for syllabus fetch:', {
        branchId: branchdet?._id,
        academicYear
      });
      return;
    }

    try {
      console.log(`Fetching syllabus for exam: ${examId}`);
      const response = await fetch(
        `${Allapi.backapi}/api/syllabus/${branchdet._id}/syllabus/${academicYear}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const data = await response.json();
      console.log("Syllabus API response:", data);

      if (data.success && data.data) {
        // Find the syllabus for the selected exam
        const selectedExamData = exams.find(exam => exam._id === examId);
        
        if (selectedExamData) {
          const relevantSyllabus = data.data.find(
            s => s.examName === selectedExamData.examName
          );
          
          console.log("Found syllabus:", relevantSyllabus);
          setSyllabusData(relevantSyllabus);
        } else {
          console.log("No exam found with ID:", examId);
          setSyllabusData(null);
        }
      } else {
        console.error('Failed to fetch syllabus:', data);
        toast.error(data.message || 'Failed to fetch syllabus');
        setSyllabusData(null);
      }
    } catch (err) {
      console.error('Error fetching syllabus:', err);
      toast.error('Error fetching syllabus: ' + (err.message || 'Unknown error'));
      setSyllabusData(null);
    }
  };

  const handleExamChange = (e) => {
    const examId = e.target.value;
    setSelectedExam(examId);
    fetchSyllabus(examId);
  };

  const handlePrint = () => {
    if (!syllabusData) return;

    const printWindow = window.open('', '_blank');
    const selectedExamData = exams.find(exam => exam._id === selectedExam);

    if (printWindow && selectedExamData && syllabusData) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${selectedExamData.examName} - Syllabus</title>
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
              .subject-container {
                margin-bottom: 20px;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                overflow: hidden;
              }
              .subject-header {
                background-color: #f3f4f6;
                padding: 12px 16px;
                font-weight: bold;
                border-bottom: 1px solid #e5e7eb;
              }
              .subject-content {
                padding: 16px;
                white-space: pre-wrap;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="exam-title">${selectedExamData.examName} - Syllabus</div>
              <div class="exam-info">
                Student: ${student.name} (${student.idNo})<br>
                Class: ${student.class?.name || 'N/A'} | Section: ${student.section?.name || 'N/A'}
              </div>
            </div>
            ${Array.from(syllabusData.syllabus.entries()).map(([subject, content]) => `
              <div class="subject-container">
                <div class="subject-header">${subject}</div>
                <div class="subject-content">${content}</div>
              </div>
            `).join('')}
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
        <h1 className="text-2xl font-bold text-gray-800">My Exam Syllabus</h1>
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
              onChange={handleExamChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {exams.map(exam => (
                <option key={exam._id} value={exam._id}>
                  {exam.examName}
                </option>
              ))}
            </select>
          </div>

          {syllabusData ? (
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedExamData?.examName} Syllabus
                </h2>
                <button
                  onClick={handlePrint}
                  className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print Syllabus
                </button>
              </div>

              <div className="space-y-4">
                {syllabusData.syllabus && syllabusData.syllabus.size > 0 ? (
                  Array.from(syllabusData.syllabus.entries()).map(([subject, content]) => (
                    <div key={subject} className="overflow-hidden border rounded-lg">
                      <div className="px-4 py-3 font-medium text-gray-700 bg-gray-50">
                        {subject}
                      </div>
                      <div className="p-4 whitespace-pre-wrap">
                        {content}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                    No syllabus content available for this exam.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
              <p>No syllabus available for the selected exam.</p>
              <p className="mt-2 text-sm">This could be because:</p>
              <ul className="mt-1 text-sm list-disc list-inside">
                <li>The syllabus has not been uploaded yet</li>
                <li>There might be a technical issue with the syllabus data</li>
              </ul>
              <p className="mt-3 text-sm">Please contact your teacher or administrator if you believe this is an error.</p>
            </div>
          )}
        </>
      ) : (
        <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
          <p>No exams available at the moment.</p>
          <p className="mt-2 text-sm">This could be because:</p>
          <ul className="mt-1 text-sm list-disc list-inside">
            <li>No exams have been scheduled for your class yet</li>
            <li>Your class or section information may be incorrect</li>
            <li>There might be a technical issue with the exam data</li>
          </ul>
          <p className="mt-3 text-sm">Please contact your administrator if you believe this is an error.</p>
        </div>
      )}
    </div>
  );
};

export default ExamSyllabus; 