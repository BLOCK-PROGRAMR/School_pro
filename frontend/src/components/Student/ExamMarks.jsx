// import React, { useState, useEffect } from 'react';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { Printer } from 'lucide-react';
// import Allapi from '../../common/index';


// // Add print styles
// const printStyles = `
//   @media print {
//     @page { 
//       size: landscape;
//       margin: 0.5cm;
//     }

//     body {
//       -webkit-print-color-adjust: exact !important;
//       print-color-adjust: exact !important;
//     }

//     .no-print {
//       display: none !important;
//     }

//     .print-break-inside-avoid {
//       page-break-inside: avoid !important;
//     }

//     .print-visible {
//       display: block !important;
//     }

//     .overflow-x-auto {
//       overflow: visible !important;
//       width: 100% !important;
//     }

//     table {
//       width: 100% !important;
//       page-break-inside: auto !important;
//     }

//     tr {
//       page-break-inside: avoid !important;
//     }

//     thead {
//       display: table-header-group !important;
//     }

//     tfoot {
//       display: table-footer-group !important;
//     }
//   }
// `;



// const ExamMarks = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [student, setStudent] = useState(null);
//   const [exams, setExams] = useState([]);
//   const [selectedExam, setSelectedExam] = useState('');
//   const [marksData, setMarksData] = useState(null);
//   const [studentMarks, setStudentMarks] = useState(null);
//   const [studentRank, setStudentRank] = useState(null);
//   const [branch, setBranch] = useState("");
//   const [schoolName, setSchoolName] = useState("School Name");
//   const userData = JSON.parse(localStorage.getItem('userData') || '{}');

//   useEffect(() => {
//     const initializeData = async () => {
//       if (!userData.username) {
//         setError('User data not found');
//         setLoading(false);
//         return;
//       }

//       try {
//         await fetchStudentDetails();
//       } catch (err) {
//         console.error('Error in initialization:', err);
//         setError('Failed to initialize data');
//         setLoading(false);
//       }
//     };

//     initializeData();
//   }, [userData.username]);

//   const fetchStudentDetails = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(
//         `${Allapi.backapi}/api/students/get-studentById/${userData.username}`,
//         {
//           method: 'GET',
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       );

//       const data = await response.json();

//       if (data.success && data.data) {
//         setStudent(data.data);
//         const classId = data.data.class?.id || data.data.class._id;
//         const sectionId = data.data.section?.id || data.data.section._id;
//         const branchId = data.data.branch;
//         setBranch(branchId);

//         if (classId && sectionId && branchId) {
//           await fetchExams(classId, sectionId, branchId);

//           // Fetch branch details to get school name
//           try {
//             const branchResponse = await fetch(
//               `${Allapi.backapi}/api/branch/get-branch/${branchId}`,
//               {
//                 method: 'GET',
//                 headers: {
//                   Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//               }
//             );
//             const branchData = await branchResponse.json();
//             if (branchData.success && branchData.data) {
//               setSchoolName(branchData.data.name);
//             }
//           } catch (err) {
//             console.error('Error fetching branch details:', err);
//           }
//         } else {
//           console.error('Missing required data:', { classId, sectionId, branchId });
//           toast.error('Student class or section information is missing');
//         }
//       } else {
//         setError('Failed to fetch student details');
//         toast.error('Failed to fetch student details');
//       }
//     } catch (err) {
//       console.error('Error fetching student details:', err);
//       setError('Error fetching student details');
//       toast.error('Error fetching student details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchExams = async (classId, sectionId, branchId) => {
//     try {
//       const response = await fetch(
//         `${Allapi.backapi}/api/exams/all-exams/${classId}/${sectionId}/${branchId}`,
//         {
//           method: 'GET',
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       );

//       const data = await response.json();

//       if (data.success && data.data && data.data.length > 0) {
//         setExams(data.data);
//         setSelectedExam(data.data[0]._id);
//         await fetchMarksData(data.data[0]._id, classId, sectionId, branchId);
//       } else {
//         // Try alternative endpoint
//         const altResponse = await fetch(
//           `${Allapi.backapi}/api/exams/all-exams/${branchId}`,
//           {
//             method: 'GET',
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`,
//             },
//           }
//         );

//         const altData = await altResponse.json();
//         if (altData.success && altData.data && altData.data.length > 0) {
//           const filteredExams = altData.data.filter(exam => {
//             const examClassId = exam.classId?._id || exam.classId;
//             const examSectionId = exam.sectionId?._id || exam.sectionId;
//             return examClassId === classId && examSectionId === sectionId;
//           });

//           if (filteredExams.length > 0) {
//             setExams(filteredExams);
//             setSelectedExam(filteredExams[0]._id);
//             await fetchMarksData(filteredExams[0]._id, classId, sectionId, branchId);
//           } else {
//             console.log("No exams found for this student's class and section");
//             setExams([]);
//           }
//         }
//       }
//     } catch (err) {
//       console.error('Error fetching exams:', err);
//       toast.error('Error fetching exams: ' + (err.message || 'Unknown error'));
//     }
//   };

//   const fetchMarksData = async (examId, classId, sectionId, branchId) => {
//     if (!examId || !classId || !sectionId || !branchId) {
//       console.error("Missing required data for marks fetch:", { examId, classId, sectionId, branchId });
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${Allapi.backapi}/api/marks/report/${examId}/${classId}/${sectionId}/${branchId}`,
//         {
//           method: 'GET',
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       );

//       const result = await response.json();

//       if (result.success && result.data) {
//         const sortedData = {
//           ...result.data,
//           passStudents: result.data.passStudents
//             ? result.data.passStudents.sort((a, b) => {
//               const totalDiff = b.total - a.total;
//               if (totalDiff !== 0) return totalDiff;
//               return b.percentage - a.percentage;
//             })
//             : []
//         };

//         setMarksData(sortedData);

//         if (student) {
//           // Find student's marks and rank
//           let foundStudent = null;
//           let rank = null;

//           if (sortedData.passStudents) {
//             const passIndex = sortedData.passStudents.findIndex(s => s.id === student._id);
//             if (passIndex !== -1) {
//               foundStudent = sortedData.passStudents[passIndex];
//               rank = passIndex + 1;
//             } else if (sortedData.failStudents) {
//               foundStudent = sortedData.failStudents.find(s => s.id === student._id);
//             }
//           }

//           setStudentMarks(foundStudent);
//           setStudentRank(rank);
//         }
//       } else {
//         console.error('Failed to fetch marks data:', result);
//         toast.error(result.message || 'Failed to fetch marks data');
//       }
//     } catch (error) {
//       console.error('Error fetching marks data:', error);
//       toast.error('Error fetching marks data');
//     }
//   };

//   const handleExamChange = async (e) => {
//     const examId = e.target.value;
//     setSelectedExam(examId);

//     const classId = student?.class?.id || student?.class?._id;
//     const sectionId = student?.section?.id || student?.section?._id;

//     if (classId && sectionId && branch) {
//       await fetchMarksData(examId, classId, sectionId, branch);
//     }
//   };

//   const getRankSuffix = (rank) => {
//     if (!rank) return '';
//     if (rank >= 11 && rank <= 13) return 'th';
//     const lastDigit = rank % 10;
//     switch (lastDigit) {
//       case 1: return 'st';
//       case 2: return 'nd';
//       case 3: return 'rd';
//       default: return 'th';
//     }
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="w-16 h-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="p-4 text-red-500 bg-red-100 rounded-lg">
//           {error}
//         </div>
//       </div>
//     );
//   }

//   if (!student) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="p-4 text-yellow-700 bg-yellow-100 rounded-lg">
//           No student data available
//         </div>
//       </div>
//     );
//   }

//   const selectedExamData = exams.find(exam => exam._id === selectedExam);

//   return (
//     <>
//       <style>{printStyles}</style>
//       <div className="min-h-screen px-4 py-8 bg-slate-100 print:bg-white print:p-0">
//         <div className="max-w-6xl p-8 mx-auto bg-white rounded-xl shadow-xl print:shadow-none print:max-w-none">
//           <div className="flex justify-between items-center mb-8">
//             <h2 className="text-3xl font-bold text-blue-700 print:text-black">My Exam Results</h2>
//             {marksData && (
//               <button
//                 onClick={handlePrint}
//                 className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors no-print"
//               >
//                 <Printer size={20} />
//                 Print Results
//               </button>
//             )}
//           </div>

//           {/* Print Header */}
//           <div className="hidden print:block text-center mb-8">
//             <h1 className="text-2xl font-bold mb-2">{schoolName}</h1>
//             <p className="text-lg mb-1">Exam Results</p>
//             <p className="text-md mb-1">Student: {student.name} (ID: {student.idNo})</p>
//             <p className="text-md">Class: {student.class?.name || 'N/A'} - Section: {student.section?.name || 'N/A'}</p>
//           </div>

//           {/* Student Info */}
//           <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 print:bg-white print:border print:border-gray-300">
//             <div className="flex flex-col md:flex-row justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Name:</p>
//                 <p className="text-lg font-semibold">{student.name}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">ID:</p>
//                 <p className="text-lg font-semibold">{student.idNo}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Class:</p>
//                 <p className="text-lg font-semibold">{student.class?.name || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Section:</p>
//                 <p className="text-lg font-semibold">{student.section?.name || 'N/A'}</p>
//               </div>
//             </div>
//           </div>

//           {/* Exam Selector */}
//           {exams.length > 0 ? (
//             <div className="mb-6 no-print">
//               <label className="block mb-2 text-sm font-medium text-gray-700">
//                 Select Exam
//               </label>
//               <select
//                 value={selectedExam}
//                 onChange={handleExamChange}
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 {exams.map(exam => (
//                   <option key={exam._id} value={exam._id}>
//                     {exam.examName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           ) : (
//             <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg mb-6">
//               <p>No exams available for your class and section.</p>
//             </div>
//           )}

//           {/* Results Display */}
//           {marksData && selectedExamData && (
//             <div className="space-y-8 print:space-y-4">
//               {/* Exam Details */}
//               <div className="p-6 bg-blue-50 rounded-xl border border-blue-200 shadow-sm print:bg-white print:shadow-none print:border print:border-gray-300 print:p-4 print-break-inside-avoid">
//                 <h3 className="mb-4 text-xl font-semibold text-blue-800 print:text-black">Exam Details</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">Exam Name:</p>
//                     <p className="text-lg font-semibold text-gray-900">{selectedExamData.examName}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">Class:</p>
//                     <p className="text-lg font-semibold text-gray-900">{student.class?.name || 'N/A'}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">Section:</p>
//                     <p className="text-lg font-semibold text-gray-900">{student.section?.name || 'N/A'}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Student's Result */}
//               {studentMarks ? (
//                 <div className="print-break-inside-avoid">
//                   <h3 className="mb-4 text-xl font-semibold text-blue-700 print:text-black">
//                     Your Results
//                     {studentRank && (
//                       <span className="ml-2 text-green-600 print:text-black">
//                         (Rank: {studentRank}<sup>{getRankSuffix(studentRank)}</sup>)
//                       </span>
//                     )}
//                   </h3>
//                   <div className="overflow-x-auto print:overflow-visible">
//                     <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden print:shadow-none">
//                       <thead className="bg-blue-50 print:bg-gray-100">
//                         <tr>
//                           <th className="p-4 text-left font-semibold text-blue-900 border-b border-blue-200 print:text-black print:border-gray-300">Subject</th>
//                           <th className="p-4 text-left font-semibold text-blue-900 border-b border-blue-200 print:text-black print:border-gray-300">Marks</th>
//                           <th className="p-4 text-left font-semibold text-blue-900 border-b border-blue-200 print:text-black print:border-gray-300">Pass Marks</th>
//                           <th className="p-4 text-left font-semibold text-blue-900 border-b border-blue-200 print:text-black print:border-gray-300">Status</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {studentMarks.subjects.map((subject) => (
//                           <tr key={subject.name} className="hover:bg-blue-50 print:hover:bg-white">
//                             <td className="p-4 border-b border-blue-100 print:border-gray-300 font-medium">
//                               {subject.name}
//                             </td>
//                             <td className="p-4 border-b border-blue-100 print:border-gray-300">
//                               {subject.marks}
//                             </td>
//                             <td className="p-4 border-b border-blue-100 print:border-gray-300">
//                               {subject.passMarks}
//                             </td>
//                             <td className="p-4 border-b border-blue-100 print:border-gray-300">
//                               {subject.marks >= subject.passMarks ? (
//                                 <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold print:bg-white print:border print:border-green-500">
//                                   Pass
//                                 </span>
//                               ) : (
//                                 <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold print:bg-white print:border print:border-red-500">
//                                   Fail
//                                 </span>
//                               )}
//                             </td>
//                           </tr>
//                         ))}
//                         <tr className="bg-gray-50 print:bg-white">
//                           <td className="p-4 border-b border-blue-100 print:border-gray-300 font-bold">Total</td>
//                           <td className="p-4 border-b border-blue-100 print:border-gray-300 font-bold">{studentMarks.total}</td>
//                           <td className="p-4 border-b border-blue-100 print:border-gray-300"></td>
//                           <td className="p-4 border-b border-blue-100 print:border-gray-300"></td>
//                         </tr>
//                         <tr className="bg-gray-50 print:bg-white">
//                           <td className="p-4 border-b border-blue-100 print:border-gray-300 font-bold">Percentage</td>
//                           <td className="p-4 border-b border-blue-100 print:border-gray-300 font-bold">{studentMarks.percentage}%</td>
//                           <td className="p-4 border-b border-blue-100 print:border-gray-300"></td>
//                           <td className="p-4 border-b border-blue-100 print:border-gray-300">
//                             {studentRank ? (
//                               <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold print:bg-white print:border print:border-green-500">
//                                 Pass
//                               </span>
//                             ) : (
//                               <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold print:bg-white print:border print:border-red-500">
//                                 Fail
//                               </span>
//                             )}
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
//                   <p>No marks data available for you in this exam.</p>
//                 </div>
//               )}

//               {/* Class Performance */}
//               {marksData.subjectReport?.length > 0 && (
//                 <div className="print-break-inside-avoid">
//                   <h3 className="mb-4 text-xl font-semibold text-gray-800">Class Performance</h3>
//                   <div className="overflow-x-auto print:overflow-visible">
//                     <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden print:shadow-none">
//                       <thead className="bg-gray-100">
//                         <tr>
//                           <th className="p-4 text-left font-semibold text-gray-800 border-b border-gray-200">Subject</th>
//                           <th className="p-4 text-left font-semibold text-gray-800 border-b border-gray-200">Pass Count</th>
//                           <th className="p-4 text-left font-semibold text-gray-800 border-b border-gray-200">Fail Count</th>
//                           <th className="p-4 text-left font-semibold text-gray-800 border-b border-gray-200">Pass Percentage</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {marksData.subjectReport.map((subject) => (
//                           <tr key={subject.name} className="hover:bg-gray-50 print:hover:bg-white">
//                             <td className="p-4 border-b border-gray-200 text-black font-medium">{subject.name}</td>
//                             <td className="p-4 border-b border-gray-200 text-green-700 print:text-black font-medium">{subject.passCount}</td>
//                             <td className="p-4 border-b border-gray-200 text-red-700 print:text-black font-medium">{subject.failCount}</td>
//                             <td className="p-4 border-b border-gray-200 text-black font-medium">
//                               {((subject.passCount / (subject.passCount + subject.failCount)) * 100).toFixed(2)}%
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )}

//               {/* Print Footer */}
//               <div className="mt-8 text-center hidden print:block">
//                 <p className="text-sm text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
//               </div>
//             </div>
//           )}

//           {!marksData && exams.length > 0 && (
//             <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
//               <p>No marks data available for the selected exam.</p>
//               <p className="mt-2 text-sm">This could be because:</p>
//               <ul className="mt-1 text-sm list-disc list-inside">
//                 <li>Marks have not been entered yet</li>
//                 <li>There might be a technical issue with the marks data</li>
//               </ul>
//               <p className="mt-3 text-sm">Please contact your teacher or administrator if you believe this is an error.</p>
//             </div>
//           )}

//           {exams.length === 0 && (
//             <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
//               <p>No exams available at the moment.</p>
//               <p className="mt-2 text-sm">This could be because:</p>
//               <ul className="mt-1 text-sm list-disc list-inside">
//                 <li>No exams have been scheduled for your class yet</li>
//                 <li>Your class or section information may be incorrect</li>
//                 <li>There might be a technical issue with the exam data</li>
//               </ul>
//               <p className="mt-3 text-sm">Please contact your administrator if you believe this is an error.</p>
//             </div>
//           )}
//         </div>
//       </div>
//       <ToastContainer position="top-right" autoClose={3000} />
//     </>
//   );
// };

// export default ExamMarks;


import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Printer } from 'lucide-react';
import Allapi from '../../common/index';

// Add print styles
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

const ExamMarks = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState(null);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [marksData, setMarksData] = useState(null);
  const [studentMarks, setStudentMarks] = useState(null);
  const [studentRank, setStudentRank] = useState(null);
  const [branch, setBranch] = useState("");
  const [schoolName, setSchoolName] = useState("School Name");
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
        const classId = data.data.class?.id || data.data.class._id;
        const sectionId = data.data.section?.id || data.data.section._id;
        const branchId = data.data.branch;
        setBranch(branchId);

        if (classId && sectionId && branchId) {
          await fetchExams(classId, sectionId, branchId);

          // Fetch branch details for school name
          try {
            const branchResponse = await fetch(
              `${Allapi.backapi}/api/branch/get-branch/${branchId}`,
              {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              }
            );
            const branchData = await branchResponse.json();
            if (branchData.success && branchData.data) {
              setSchoolName(branchData.data.name);
            }
          } catch (err) {
            console.error('Error fetching branch details:', err);
          }
        } else {
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

      if (data.success && data.data && data.data.length > 0) {
        setExams(data.data);
        setSelectedExam(data.data[0]._id);
        await fetchMarksData(data.data[0]._id, classId, sectionId, branchId);
      } else {
        // Try alternative endpoint
        const altResponse = await fetch(
          `${Allapi.backapi}/api/exams/all-exams/${branchId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        const altData = await altResponse.json();
        if (altData.success && altData.data && altData.data.length > 0) {
          const filteredExams = altData.data.filter(exam => {
            const examClassId = exam.classId?._id || exam.classId;
            const examSectionId = exam.sectionId?._id || exam.sectionId;
            return examClassId === classId && examSectionId === sectionId;
          });

          if (filteredExams.length > 0) {
            setExams(filteredExams);
            setSelectedExam(filteredExams[0]._id);
            await fetchMarksData(filteredExams[0]._id, classId, sectionId, branchId);
          } else {
            setExams([]);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching exams:', err);
      toast.error('Error fetching exams: ' + (err.message || 'Unknown error'));
    }
  };

  const fetchMarksData = async (examId, classId, sectionId, branchId) => {
    if (!examId || !classId || !sectionId || !branchId) {
      console.error("Missing required data for marks fetch");
      return;
    }

    try {
      const response = await fetch(
        `${Allapi.backapi}/api/marks/report/${examId}/${classId}/${sectionId}/${branchId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const result = await response.json();

      if (result.success && result.data) {
        const sortedData = {
          ...result.data,
          passStudents: result.data.passStudents
            ? result.data.passStudents.sort((a, b) => {
              const totalDiff = b.total - a.total;
              if (totalDiff !== 0) return totalDiff;
              return b.percentage - a.percentage;
            })
            : []
        };

        setMarksData(sortedData);

        if (student) {
          let foundStudent = null;
          let rank = null;

          if (sortedData.passStudents) {
            const passIndex = sortedData.passStudents.findIndex(s => s.id === student._id);
            if (passIndex !== -1) {
              foundStudent = sortedData.passStudents[passIndex];
              rank = passIndex + 1;
            } else if (sortedData.failStudents) {
              foundStudent = sortedData.failStudents.find(s => s.id === student._id);
            }
          }

          setStudentMarks(foundStudent);
          setStudentRank(rank);
        }
      } else {
        toast.error(result.message || 'Failed to fetch marks data');
      }
    } catch (error) {
      console.error('Error fetching marks data:', error);
      toast.error('Error fetching marks data');
    }
  };

  const handleExamChange = async (e) => {
    const examId = e.target.value;
    setSelectedExam(examId);

    const classId = student?.class?.id || student?.class?._id;
    const sectionId = student?.section?.id || student?.section?._id;

    if (classId && sectionId && branch) {
      await fetchMarksData(examId, classId, sectionId, branch);
    }
  };

  const getRankSuffix = (rank) => {
    if (!rank) return '';
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
            <h1 className="text-2xl font-bold mb-2">{schoolName}</h1>
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