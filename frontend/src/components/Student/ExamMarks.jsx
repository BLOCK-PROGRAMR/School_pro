import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Printer } from 'lucide-react';
import Allapi from '../../common';
import { mycon } from '../../store/Mycontext';

// Add print styles
const printStyles = `
  @media print {
    @page { 
      size: portrait;
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

const ExamMarks = () => {
  const { branchdet } = useContext(mycon);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState(null);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [marksData, setMarksData] = useState(null);
  const [studentMarks, setStudentMarks] = useState(null);
  const [studentRank, setStudentRank] = useState(null);
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
            
            // Fetch marks for the first exam
            await fetchMarksData(filteredExams[0]._id, classId, sectionId, branchId);
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
          
          // Fetch marks for the first exam
          await fetchMarksData(data.data[0]._id, classId, sectionId, branchId);
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

  const fetchMarksData = async (examId, classId, sectionId, branchId) => {
    if (!examId || !classId || !sectionId || !branchId) {
      console.error("Missing required data for marks fetch:", { examId, classId, sectionId, branchId });
      return;
    }

    try {
      console.log(`Fetching marks for exam: ${examId}`);
      const response = await fetch(
        Allapi.getMarksReport.url(examId, classId, sectionId, branchId),
        {
          method: Allapi.getMarksReport.method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const result = await response.json();
      console.log("Marks API response:", result);

      if (result.success) {
        const sortedData = {
          ...result.data,
          passStudents: result.data.passStudents
            .sort((a, b) => {
              const totalDiff = b.total - a.total;
              if (totalDiff !== 0) return totalDiff;
              return b.percentage - a.percentage;
            })
        };
        
        setMarksData(sortedData);
        
        // Find the current student's marks and rank
        const studentId = student._id;
        let foundStudent = null;
        let rank = null;
        
        // Check in pass students
        const passIndex = sortedData.passStudents.findIndex(s => s.id === studentId);
        if (passIndex !== -1) {
          foundStudent = sortedData.passStudents[passIndex];
          rank = passIndex + 1;
        } else {
          // Check in fail students
          foundStudent = sortedData.failStudents.find(s => s.id === studentId);
        }
        
        setStudentMarks(foundStudent);
        setStudentRank(rank);
        
        console.log("Student marks:", foundStudent);
        console.log("Student rank:", rank);
      } else {
        console.error('Failed to fetch marks data:', result);
        toast.error(result.message || 'Failed to fetch marks data');
      }
    } catch (error) {
      console.error('Error fetching marks data:', error);
      toast.error('Error fetching marks data');
    }
  };

  const handleExamChange = (e) => {
    const examId = e.target.value;
    setSelectedExam(examId);
    
    // Get class and section IDs from student data
    let classId, sectionId;
    
    if (student.class && student.class._id) {
      classId = student.class._id;
    } else if (student.class && student.class.id) {
      classId = student.class.id;
    } else if (student.classId) {
      classId = student.classId;
    }
    
    if (student.section && student.section._id) {
      sectionId = student.section._id;
    } else if (student.section && student.section.id) {
      sectionId = student.section.id;
    } else if (student.sectionId) {
      sectionId = student.sectionId;
    }
    
    fetchMarksData(examId, classId, sectionId, branchdet._id);
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

  const handlePrint = () => {
    window.print();
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
    <>
      <style>{printStyles}</style>
      <div className="min-h-screen px-4 py-8 bg-slate-100 print:bg-white print:p-0">
        <div className="max-w-6xl p-8 mx-auto bg-white rounded-xl shadow-xl print:shadow-none print:max-w-none">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-blue-700 print:text-black">My Exam Results</h2>
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
            <h1 className="text-2xl font-bold mb-2">{branchdet?.name || 'School Name'}</h1>
            <p className="text-lg mb-1">Exam Results</p>
            <p className="text-md mb-1">Student: {student.name} (ID: {student.idNo})</p>
            <p className="text-md">Class: {student.class?.name || 'N/A'} - Section: {student.section?.name || 'N/A'}</p>
          </div>

          {/* Student Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 print:bg-white print:border print:border-gray-300">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <p className="text-sm text-gray-600">Name:</p>
                <p className="text-lg font-semibold">{student.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ID:</p>
                <p className="text-lg font-semibold">{student.idNo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Class:</p>
                <p className="text-lg font-semibold">{student.class?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Section:</p>
                <p className="text-lg font-semibold">{student.section?.name || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Exam Selector */}
          {exams.length > 0 ? (
            <div className="mb-6 no-print">
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
          ) : (
            <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg mb-6">
              <p>No exams available for your class and section.</p>
            </div>
          )}

          {/* Results Display */}
          {marksData && selectedExamData && (
            <div className="space-y-8 print:space-y-4">
              {/* Exam Details */}
              <div className="p-6 bg-blue-50 rounded-xl border border-blue-200 shadow-sm print:bg-white print:shadow-none print:border print:border-gray-300 print:p-4 print-break-inside-avoid">
                <h3 className="mb-4 text-xl font-semibold text-blue-800 print:text-black">Exam Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Exam Name:</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedExamData.examName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Class:</p>
                    <p className="text-lg font-semibold text-gray-900">{student.class?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Section:</p>
                    <p className="text-lg font-semibold text-gray-900">{student.section?.name || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Student's Result */}
              {studentMarks ? (
                <div className="print-break-inside-avoid">
                  <h3 className="mb-4 text-xl font-semibold text-blue-700 print:text-black">
                    Your Results
                    {studentRank && (
                      <span className="ml-2 text-green-600 print:text-black">
                        (Rank: {studentRank}<sup>{getRankSuffix(studentRank)}</sup>)
                      </span>
                    )}
                  </h3>
                  <div className="overflow-x-auto print:overflow-visible">
                    <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden print:shadow-none">
                      <thead className="bg-blue-50 print:bg-gray-100">
                        <tr>
                          <th className="p-4 text-left font-semibold text-blue-900 border-b border-blue-200 print:text-black print:border-gray-300">Subject</th>
                          <th className="p-4 text-left font-semibold text-blue-900 border-b border-blue-200 print:text-black print:border-gray-300">Marks</th>
                          <th className="p-4 text-left font-semibold text-blue-900 border-b border-blue-200 print:text-black print:border-gray-300">Pass Marks</th>
                          <th className="p-4 text-left font-semibold text-blue-900 border-b border-blue-200 print:text-black print:border-gray-300">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentMarks.subjects.map((subject) => (
                          <tr key={subject.name} className="hover:bg-blue-50 print:hover:bg-white">
                            <td className="p-4 border-b border-blue-100 print:border-gray-300 font-medium">
                              {subject.name}
                            </td>
                            <td className="p-4 border-b border-blue-100 print:border-gray-300">
                              {subject.marks}
                            </td>
                            <td className="p-4 border-b border-blue-100 print:border-gray-300">
                              {subject.passMarks}
                            </td>
                            <td className="p-4 border-b border-blue-100 print:border-gray-300">
                              {subject.marks >= subject.passMarks ? (
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold print:bg-white print:border print:border-green-500">
                                  Pass
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold print:bg-white print:border print:border-red-500">
                                  Fail
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50 print:bg-white">
                          <td className="p-4 border-b border-blue-100 print:border-gray-300 font-bold">Total</td>
                          <td className="p-4 border-b border-blue-100 print:border-gray-300 font-bold">{studentMarks.total}</td>
                          <td className="p-4 border-b border-blue-100 print:border-gray-300"></td>
                          <td className="p-4 border-b border-blue-100 print:border-gray-300"></td>
                        </tr>
                        <tr className="bg-gray-50 print:bg-white">
                          <td className="p-4 border-b border-blue-100 print:border-gray-300 font-bold">Percentage</td>
                          <td className="p-4 border-b border-blue-100 print:border-gray-300 font-bold">{studentMarks.percentage}%</td>
                          <td className="p-4 border-b border-blue-100 print:border-gray-300"></td>
                          <td className="p-4 border-b border-blue-100 print:border-gray-300">
                            {studentRank ? (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold print:bg-white print:border print:border-green-500">
                                Pass
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold print:bg-white print:border print:border-red-500">
                                Fail
                              </span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                  <p>No marks data available for you in this exam.</p>
                </div>
              )}

              {/* Class Performance */}
              {marksData.subjectReport?.length > 0 && (
                <div className="print-break-inside-avoid">
                  <h3 className="mb-4 text-xl font-semibold text-gray-800">Class Performance</h3>
                  <div className="overflow-x-auto print:overflow-visible">
                    <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden print:shadow-none">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-4 text-left font-semibold text-gray-800 border-b border-gray-200">Subject</th>
                          <th className="p-4 text-left font-semibold text-gray-800 border-b border-gray-200">Pass Count</th>
                          <th className="p-4 text-left font-semibold text-gray-800 border-b border-gray-200">Fail Count</th>
                          <th className="p-4 text-left font-semibold text-gray-800 border-b border-gray-200">Pass Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {marksData.subjectReport.map((subject) => (
                          <tr key={subject.name} className="hover:bg-gray-50 print:hover:bg-white">
                            <td className="p-4 border-b border-gray-200 text-black font-medium">{subject.name}</td>
                            <td className="p-4 border-b border-gray-200 text-green-700 print:text-black font-medium">{subject.passCount}</td>
                            <td className="p-4 border-b border-gray-200 text-red-700 print:text-black font-medium">{subject.failCount}</td>
                            <td className="p-4 border-b border-gray-200 text-black font-medium">
                              {((subject.passCount / (subject.passCount + subject.failCount)) * 100).toFixed(2)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Print Footer */}
              <div className="mt-8 text-center hidden print:block">
                <p className="text-sm text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          )}

          {!marksData && exams.length > 0 && (
            <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
              <p>No marks data available for the selected exam.</p>
              <p className="mt-2 text-sm">This could be because:</p>
              <ul className="mt-1 text-sm list-disc list-inside">
                <li>Marks have not been entered yet</li>
                <li>There might be a technical issue with the marks data</li>
              </ul>
              <p className="mt-3 text-sm">Please contact your teacher or administrator if you believe this is an error.</p>
            </div>
          )}

          {exams.length === 0 && (
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
      </div>
    </>
  );
};

export default ExamMarks;