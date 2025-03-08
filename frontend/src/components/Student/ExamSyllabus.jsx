


// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { Printer } from 'lucide-react';
// import Allapi from '../../common';

// const ExamSyllabus = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [student, setStudent] = useState(null);
//   const [exams, setExams] = useState([]);
//   const [selectedExam, setSelectedExam] = useState('');
//   const [syllabusData, setSyllabusData] = useState(null);
//   const [branch_id, setBranchId] = useState("");
//   const userData = JSON.parse(localStorage.getItem('userData') || '{}');

//   useEffect(() => {
//     if (userData.username) {
//       fetchStudentDetails();
//     } else {
//       setError('User data not found');
//       setLoading(false);
//     }
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
//         const branchId = data.data.branch;
//         setBranchId(branchId);

//         // Extract required IDs
//         const classId = data.data.class?.id;
//         const sectionId = data.data.section?.id;

//         if (classId && sectionId && branchId) {
//           await fetchExams(classId, sectionId, branchId);
//         } else {
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
//         await fetchSyllabus(data.data[0]);
//       } else {
//         console.log("No exams found for this student's class and section");
//         setExams([]);
//       }
//     } catch (err) {
//       console.error('Error fetching exams:', err);
//       toast.error('Error fetching exams: ' + (err.message || 'Unknown error'));
//     }
//   };

//   const fetchSyllabus = async (exam) => {
//     if (!branch_id || !student?.academic_id || !exam) return;

//     try {
//       const response = await fetch(
//         `${Allapi.backapi}/api/syllabus/${branch_id}/syllabus/${student.academic_id}`,
//         {
//           method: 'GET',
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       );

//       const data = await response.json();

//       if (data.success) {
//         const relevantSyllabus = data.data.find(
//           s => s.examName === exam.examName
//         );
//         setSyllabusData(relevantSyllabus);
//       } else {
//         toast.error('Failed to fetch syllabus');
//         setSyllabusData(null);
//       }
//     } catch (err) {
//       console.error('Error fetching syllabus:', err);
//       toast.error('Error fetching syllabus');
//       setSyllabusData(null);
//     }
//   };

//   const handleExamChange = (e) => {
//     const examId = e.target.value;
//     setSelectedExam(examId);
//     const exam = exams.find(ex => ex._id === examId);
//     fetchSyllabus(exam);
//   };

//   const handlePrint = () => {
//     if (!syllabusData) return;

//     const printWindow = window.open('', '_blank');
//     const selectedExamData = exams.find(exam => exam._id === selectedExam);

//     if (printWindow && selectedExamData && syllabusData) {
//       printWindow.document.write(`
//         <html>
//           <head>
//             <title>${selectedExamData.examName} - Syllabus</title>
//             <style>
//               body {
//                 font-family: Arial, sans-serif;
//                 margin: 20px;
//                 color: #333;
//               }
//               .header {
//                 text-align: center;
//                 margin-bottom: 20px;
//               }
//               table {
//                 width: 100%;
//                 border-collapse: collapse;
//                 margin-top: 20px;
//               }
//               th, td {
//                 border: 1px solid #ddd;
//                 padding: 12px;
//                 text-align: left;
//               }
//               th {
//                 background-color: #f8f9fa;
//               }
//             </style>
//           </head>
//           <body>
//             <div class="header">
//               <h1>${selectedExamData.examName} - Syllabus</h1>
//               <p>Student: ${student.name} (${student.idNo})</p>
//               <p>Class: ${student.class?.name || 'N/A'} | Section: ${student.section?.name || 'N/A'}</p>
//             </div>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Subject</th>
//                   <th>Syllabus Content</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 ${selectedExamData.subjects.map(subject => `
//                   <tr>
//                     <td>${subject.name}</td>
//                     <td>${syllabusData.syllabus[subject._id] || 'No syllabus added'}</td>
//                   </tr>
//                 `).join('')}
//               </tbody>
//             </table>
//           </body>
//         </html>
//       `);

//       printWindow.document.close();
//       printWindow.focus();
//       printWindow.print();
//       printWindow.onafterprint = () => printWindow.close();
//     }
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
//     <div className="min-h-screen px-4 py-8 bg-gray-100">
//       <div className="p-8 mx-auto bg-white rounded-lg shadow-lg max-w-7xl">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-3xl font-bold text-gray-800">My Exam Syllabus</h2>
//           <div className="text-sm text-gray-600">
//             <p>Name: {student.name}</p>
//             <p>ID: {student.idNo}</p>
//             <p>
//               Class: {student.class?.name || 'N/A'} - Section:{' '}
//               {student.section?.name || 'N/A'}
//             </p>
//           </div>
//         </div>

//         {exams.length > 0 ? (
//           <>
//             <div className="mb-6">
//               <label className="block mb-2 text-sm font-medium text-gray-700">
//                 Select Exam
//               </label>
//               <select
//                 value={selectedExam}
//                 onChange={handleExamChange}
//                 className="w-full p-3 text-gray-700 bg-white border rounded"
//               >
//                 {exams.map(exam => (
//                   <option key={exam._id} value={exam._id}>
//                     {exam.examName}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {syllabusData && selectedExamData?.subjects?.length > 0 && (
//               <div className="mt-6">
//                 <div className="flex justify-end mb-4">
//                   <button
//                     onClick={handlePrint}
//                     className="flex items-center px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
//                   >
//                     <Printer className="w-4 h-4 mr-2" />
//                     Print Syllabus
//                   </button>
//                 </div>

//                 <div className="overflow-x-auto">
//                   <table className="w-full bg-white border border-collapse border-gray-300">
//                     <thead>
//                       <tr className="bg-gray-100 border-b border-gray-300">
//                         <th className="p-4 font-semibold text-left text-gray-700 border-r border-gray-300">
//                           Subject Name
//                         </th>
//                         <th className="p-4 font-semibold text-left text-gray-700">
//                           Syllabus
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {selectedExamData.subjects.map((subject) => (
//                         <tr key={subject._id} className="border-b border-gray-300">
//                           <td className="p-4 font-medium text-gray-700 border-r border-gray-300">
//                             {subject.name}
//                           </td>
//                           <td className="p-4 text-gray-900">
//                             {syllabusData.syllabus[subject._id] || "No syllabus added"}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}

//             {selectedExamData && !syllabusData && (
//               <div className="p-4 mt-6 text-center text-gray-700 bg-gray-100 rounded">
//                 No syllabus found for the selected exam
//               </div>
//             )}
//           </>
//         ) : (
//           <div className="p-4 text-center text-gray-700 bg-gray-100 rounded">
//             <p>No exams available at the moment.</p>
//             <p className="mt-2 text-sm">This could be because:</p>
//             <ul className="mt-1 text-sm list-disc list-inside">
//               <li>No exams have been scheduled for your class yet</li>
//               <li>Your class or section information may be incorrect</li>
//               <li>There might be a technical issue with the exam data</li>
//             </ul>
//             <p className="mt-3 text-sm">Please contact your administrator if you believe this is an error.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ExamSyllabus;



import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Printer } from 'lucide-react';
import Allapi from '../../common';

const ExamSyllabus = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState(null);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [syllabusData, setSyllabusData] = useState(null);
  const [branch_id, setBranchId] = useState("");
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
        const branchId = data.data.branch;
        setBranchId(branchId);

        // Extract required IDs
        const classId = data.data.class?.id;
        const sectionId = data.data.section?.id;

        if (classId && sectionId && branchId) {
          await fetchExams(classId, sectionId, branchId);
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
        await fetchSyllabus(data.data[0]);
      } else {
        console.log("No exams found for this student's class and section");
        setExams([]);
      }
    } catch (err) {
      console.error('Error fetching exams:', err);
      toast.error('Error fetching exams: ' + (err.message || 'Unknown error'));
    }
  };

  const fetchSyllabus = async (exam) => {
    if (!branch_id || !student?.academic_id || !exam || !student?.class?.id || !student?.section?.id) return;

    try {
      const response = await fetch(
        `${Allapi.backapi}/api/syllabus/${branch_id}/syllabus/${student.academic_id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        // Match syllabus with class, section, and exam name like in ViewSyllabus
        const relevantSyllabus = data.data.find(
          s =>
            s.classId === student.class.id &&
            s.sectionId === student.section.id &&
            s.examName === exam.examName
        );

        setSyllabusData(relevantSyllabus);
      } else {
        toast.error('Failed to fetch syllabus');
        setSyllabusData(null);
      }
    } catch (err) {
      console.error('Error fetching syllabus:', err);
      toast.error('Error fetching syllabus');
      setSyllabusData(null);
    }
  };

  const handleExamChange = (e) => {
    const examId = e.target.value;
    setSelectedExam(examId);
    const exam = exams.find(ex => ex._id === examId);
    fetchSyllabus(exam);
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
                background-color: #f8f9fa;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${selectedExamData.examName} - Syllabus</h1>
              <p>Student: ${student.name} (${student.idNo})</p>
              <p>Class: ${student.class?.name || 'N/A'} | Section: ${student.section?.name || 'N/A'}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Syllabus Content</th>
                </tr>
              </thead>
              <tbody>
                ${selectedExamData.subjects.map(subject => `
                  <tr>
                    <td>${subject.name}</td>
                    <td>${syllabusData.syllabus[subject._id] || 'No syllabus added'}</td>
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
    <div className="min-h-screen px-4 py-8 bg-gray-100">
      <div className="p-8 mx-auto bg-white rounded-lg shadow-lg max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">My Exam Syllabus</h2>
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
                className="w-full p-3 text-gray-700 bg-white border rounded"
              >
                {exams.map(exam => (
                  <option key={exam._id} value={exam._id}>
                    {exam.examName}
                  </option>
                ))}
              </select>
            </div>

            {syllabusData && selectedExamData?.subjects?.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-end mb-4">
                  <button
                    onClick={handlePrint}
                    className="flex items-center px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print Syllabus
                  </button>
                </div>

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
                      {selectedExamData.subjects.map((subject) => (
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

            {selectedExamData && !syllabusData && (
              <div className="p-4 mt-6 text-center text-gray-700 bg-gray-100 rounded">
                No syllabus found for the selected exam
              </div>
            )}
          </>
        ) : (
          <div className="p-4 text-center text-gray-700 bg-gray-100 rounded">
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
  );
};

export default ExamSyllabus;