// import React, { useState, useEffect, useContext } from 'react';
// import { toast } from 'react-toastify';
// import { mycon } from '../../../store/Mycontext';
// import Allapi from '../../../common';

// const Data = () => {
//   const { branchdet } = useContext(mycon);
//   const [selectedTerm, setSelectedTerm] = useState('');
//   const [selectedClass, setSelectedClass] = useState('');
//   const [selectedSection, setSelectedSection] = useState('');
//   const [classes, setClasses] = useState([]);
//   const [sections, setSections] = useState([]);
//   const [studentData, setStudentData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [paymentFilter, setPaymentFilter] = useState('all');

//   const terms = [
//     { id: 'term1', name: 'Term 1' },
//     { id: 'term2', name: 'Term 2' },
//     { id: 'term3', name: 'Term 3' },
//     { id: 'term4', name: 'Term 4' }
//   ];

//   useEffect(() => {
//     if (branchdet?.academicYears?.[0]) {
//       fetchClasses();
//     }
//   }, [branchdet]);

//   useEffect(() => {
//     if (selectedClass) {
//       fetchSections(selectedClass);
//       setSelectedSection('');
//       setStudentData([]);
//     }
//   }, [selectedClass]);

//   useEffect(() => {
//     if (selectedClass && selectedSection) {
//       fetchStudentData();
//     }
//   }, [selectedClass, selectedSection, selectedTerm]);

//   const fetchClasses = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       const response = await fetch(
//         Allapi.getClasses.url(branchdet.academicYears[0]),
//         {
//           method: Allapi.getClasses.method,
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );

//       const data = await response.json();
//       if (response.ok) {
//         setClasses(data.data || []);
//       } else {
//         toast.error('Failed to fetch classes');
//       }
//     } catch (error) {
//       console.error('Error fetching classes:', error);
//       toast.error('Error fetching classes');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSections = async (classId) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       const response = await fetch(
//         Allapi.getSections.url(classId),
//         {
//           method: Allapi.getSections.method,
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );

//       const data = await response.json();
//       if (response.ok) {
//         setSections(data.data || []);
//       } else {
//         toast.error('Failed to fetch sections');
//       }
//     } catch (error) {
//       console.error('Error fetching sections:', error);
//       toast.error('Error fetching sections');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchStudentData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');

//       const studentsResponse = await fetch(
//         Allapi.getStudentsBySection.url(selectedSection),
//         {
//           method: Allapi.getStudentsBySection.method,
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );

//       const studentsData = await studentsResponse.json();

//       if (!studentsResponse.ok) {
//         throw new Error('Failed to fetch student data');
//       }

//       const studentsWithFees = await Promise.all(studentsData.data.map(async (student) => {
//         try {
//           // Calculate total fee from student's feeDetails
//           const totalFee = student.feeDetails.reduce((total, fee) => {
//             const feeAmount = fee.finalAmount || fee.amount;
//             const termsCount = parseInt(fee.terms) || 1;
//             // Calculate per-term amount
//             const perTermAmount = feeAmount / termsCount;
//             // If term is selected, return amount for that term only
//             if (selectedTerm) {
//               const selectedTermNumber = parseInt(selectedTerm.replace('term', ''));
//               return total + (selectedTermNumber <= termsCount ? perTermAmount : 0);
//             }
//             // If no term selected, return total amount
//             return total + feeAmount;
//           }, 0);

//           // Fetch receipts for paid amount calculation
//           const receiptsResponse = await fetch(
//             `${Allapi.getReciepts.url(branchdet.academicYears[0])}?studentID=${student.idNo}`,
//             {
//               method: "GET",
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );

//           const receiptsData = await receiptsResponse.json();

//           let termPaidAmount = 0;

//           receiptsData.receipts.forEach(receipt => {
//             if (selectedTerm) {
//               // If term is selected, only count payments for this term
//               if (receipt.terms === selectedTerm) {
//                 receipt.feeLedger.forEach(fee => {
//                   termPaidAmount += parseFloat(fee.amount) || 0;
//                 });
//               }
//             } else {
//               // If no term selected, count all payments
//               receipt.feeLedger.forEach(fee => {
//                 termPaidAmount += parseFloat(fee.amount) || 0;
//               });
//             }
//           });

//           const termRemainingAmount = totalFee - termPaidAmount;

//           return {
//             ...student,
//             totalAmount: totalFee,
//             amountPaid: termPaidAmount,
//             amountToBePaid: termRemainingAmount
//           };
//         } catch (error) {
//           console.error(`Error fetching receipts for student ${student.idNo}:`, error);
//           return {
//             ...student,
//             totalAmount: 0,
//             amountPaid: 0,
//             amountToBePaid: 0
//           };
//         }
//       }));

//       const sortedStudents = studentsWithFees.sort((a, b) => a.idNo - b.idNo);
//       setStudentData(sortedStudents);

//     } catch (error) {
//       console.error('Error fetching student data:', error);
//       toast.error('Failed to fetch student data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTermChange = (event) => {
//     setSelectedTerm(event.target.value);
//   };

//   const handleClassChange = (event) => {
//     setSelectedClass(event.target.value);
//   };

//   const handleSectionChange = (event) => {
//     setSelectedSection(event.target.value);
//   };

//   const getFilteredStudents = () => {
//     return studentData.filter(student => {
//       if (paymentFilter === 'paid' && student.amountToBePaid !== 0) return false;
//       if (paymentFilter === 'unpaid' && student.amountToBePaid === 0) return false;

//       const searchString = `${student.idNo} ${student.name} ${student.surname || ''}`.toLowerCase();
//       return searchString.includes(searchQuery.toLowerCase());
//     });
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8">Student Data</h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//         <div className="relative">
//           <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
//             Select Class
//           </label>
//           <select
//             id="class"
//             value={selectedClass}
//             onChange={handleClassChange}
//             disabled={loading}
//             className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
//           >
//             <option value="">Select Class</option>
//             {classes.map((cls) => (
//               <option key={cls._id} value={cls._id}>
//                 {cls.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="relative">
//           <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1">
//             Select Section
//           </label>
//           <select
//             id="section"
//             value={selectedSection}
//             onChange={handleSectionChange}
//             disabled={!selectedClass || loading}
//             className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
//           >
//             <option value="">Select Section</option>
//             {sections.map((section) => (
//               <option key={section._id} value={section._id}>
//                 {section.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="relative">
//           <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-1">
//             Select Term
//           </label>
//           <select
//             id="term"
//             value={selectedTerm}
//             onChange={handleTermChange}
//             disabled={loading}
//             className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
//           >
//             <option value="">All Terms</option>
//             {terms.map((term) => (
//               <option key={term.id} value={term.id}>
//                 {term.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {!loading && studentData.length > 0 && (
//         <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="relative">
//             <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
//               Search Students
//             </label>
//             <input
//               type="text"
//               id="search"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search by ID or Name..."
//               className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           <div className="relative">
//             <label htmlFor="paymentFilter" className="block text-sm font-medium text-gray-700 mb-1">
//               Payment Status
//             </label>
//             <select
//               id="paymentFilter"
//               value={paymentFilter}
//               onChange={(e) => setPaymentFilter(e.target.value)}
//               className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="all">All Students</option>
//               <option value="paid">Fees Paid</option>
//               <option value="unpaid">Fees Pending</option>
//             </select>
//           </div>
//         </div>
//       )}

//       {!loading && studentData.length > 0 && (
//         <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
//             <p className="text-2xl font-semibold text-gray-900">{studentData.length}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-sm font-medium text-gray-500">Fees Paid</h3>
//             <p className="text-2xl font-semibold text-green-600">
//               {studentData.filter(s => s.amountToBePaid === 0).length}
//             </p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-sm font-medium text-gray-500">Fees Pending</h3>
//             <p className="text-2xl font-semibold text-red-600">
//               {studentData.filter(s => s.amountToBePaid > 0).length}
//             </p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-sm font-medium text-gray-500">Total Collection</h3>
//             <p className="text-2xl font-semibold text-blue-600">
//               ₹{studentData.reduce((sum, s) => sum + s.amountPaid, 0).toLocaleString()}
//             </p>
//           </div>
//         </div>
//       )}

//       {loading && (
//         <div className="flex justify-center items-center py-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//         </div>
//       )}

//       {!loading && studentData.length > 0 && (
//         <div className="overflow-x-auto shadow-md rounded-lg">
//           <table className="min-w-full table-auto">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   S.NO
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Student ID
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   {selectedTerm ? `${terms.find(t => t.id === selectedTerm)?.name} Amount` : 'Total Amount'}
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   {selectedTerm ? `${terms.find(t => t.id === selectedTerm)?.name} Paid` : 'Total Paid'}
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Due
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Paid
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {getFilteredStudents().map((student, index) => (
//                 <tr key={student._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {index + 1}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {student.idNo}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {student.surname ? `${student.surname} ${student.name}` : student.name}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     ₹{student.totalAmount.toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     ₹{student.amountPaid.toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     ₹{student.amountToBePaid.toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                       student.amountToBePaid === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                     }`}>
//                       {student.amountToBePaid === 0 ? 'Yes' : 'No'}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {getFilteredStudents().length === 0 && (
//             <div className="text-center py-4 text-gray-500">
//               No students found matching your search criteria
//             </div>
//           )}
//         </div>
//       )}

//       {!loading && studentData.length === 0 && selectedClass && selectedSection && (
//         <div className="text-center py-8 text-gray-500">
//           No student data found
//         </div>
//       )}
//     </div>
//   );
// };

// export default Data;
// import React, { useState, useEffect, useContext } from 'react';
// import { toast } from 'react-toastify';
// import { mycon } from '../../../store/Mycontext';
// import Allapi from '../../../common';

// const Data = () => {
//   const { branchdet } = useContext(mycon);
//   const [selectedTerm, setSelectedTerm] = useState('');
//   const [selectedClass, setSelectedClass] = useState('');
//   const [selectedSection, setSelectedSection] = useState('');
//   const [classes, setClasses] = useState([]);
//   const [sections, setSections] = useState([]);
//   const [studentData, setStudentData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [paymentFilter, setPaymentFilter] = useState('all');

//   const terms = [
//     { id: 'term1', name: 'Term 1' },
//     { id: 'term2', name: 'Term 2' },
//     { id: 'term3', name: 'Term 3' },
//     { id: 'term4', name: 'Term 4' }
//   ];

//   useEffect(() => {
//     if (branchdet?.academicYears?.[0]) {
//       fetchClasses();
//     }
//   }, [branchdet]);

//   useEffect(() => {
//     if (selectedClass) {
//       fetchSections(selectedClass);
//       setSelectedSection('');
//       setStudentData([]);
//     }
//   }, [selectedClass]);

//   useEffect(() => {
//     if (selectedClass && selectedSection) {
//       fetchStudentData();
//     }
//   }, [selectedClass, selectedSection, selectedTerm]);

//   const fetchClasses = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       const response = await fetch(
//         Allapi.getClasses.url(branchdet.academicYears[0]),
//         {
//           method: Allapi.getClasses.method,
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );

//       const data = await response.json();
//       if (response.ok) {
//         setClasses(data.data || []);
//       } else {
//         toast.error('Failed to fetch classes');
//       }
//     } catch (error) {
//       console.error('Error fetching classes:', error);
//       toast.error('Error fetching classes');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSections = async (classId) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       const response = await fetch(
//         Allapi.getSections.url(classId),
//         {
//           method: Allapi.getSections.method,
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );

//       const data = await response.json();
//       if (response.ok) {
//         setSections(data.data || []);
//       } else {
//         toast.error('Failed to fetch sections');
//       }
//     } catch (error) {
//       console.error('Error fetching sections:', error);
//       toast.error('Error fetching sections');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateTermAmount = (feeDetails, selectedTerm) => {
//     return feeDetails.reduce((total, fee) => {
//       const termsCount = parseInt(fee.terms) || 1;
//       const perTermAmount = fee.finalAmount || fee.amount;

//       // If term is selected, calculate amount for that term
//       if (selectedTerm) {
//         const selectedTermNumber = parseInt(selectedTerm.replace('term', ''));
//         return total + (selectedTermNumber <= termsCount ? perTermAmount / termsCount : 0);
//       }

//       // If no term selected, return total amount
//       return total + perTermAmount;
//     }, 0);
//   };

//   const fetchStudentData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');

//       // Fetch students
//       const studentsResponse = await fetch(
//         Allapi.getStudentsBySection.url(selectedSection),
//         {
//           method: Allapi.getStudentsBySection.method,
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );

//       const studentsData = await studentsResponse.json();

//       if (!studentsResponse.ok) {
//         throw new Error('Failed to fetch student data');
//       }

//       // Process each student's data
//       const studentsWithFees = await Promise.all(studentsData.data.map(async (student) => {
//         try {
//           // Calculate total fee for the selected term
//           const totalFee = calculateTermAmount(student.feeDetails, selectedTerm);

//           // Fetch receipts for the student
//           const receiptsResponse = await fetch(
//             `${Allapi.getReciepts.url(branchdet.academicYears[0])}?studentID=${student.idNo}`,
//             {
//               method: "GET",
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );

//           const receiptsData = await receiptsResponse.json();

//           // Calculate paid amount for the selected term
//           let termPaidAmount = 0;
//           receiptsData.receipts.forEach(receipt => {
//             if (selectedTerm) {
//               // If term is selected, only count payments for this term
//               if (receipt.terms === selectedTerm) {
//                 receipt.feeLedger.forEach(fee => {
//                   termPaidAmount += parseFloat(fee.amount) || 0;
//                 });
//               }
//             } else {
//               // If no term selected, count all payments
//               receipt.feeLedger.forEach(fee => {
//                 termPaidAmount += parseFloat(fee.amount) || 0;
//               });
//             }
//           });

//           const termRemainingAmount = totalFee - termPaidAmount;

//           return {
//             ...student,
//             totalAmount: totalFee,
//             amountPaid: termPaidAmount,
//             amountToBePaid: termRemainingAmount
//           };
//         } catch (error) {
//           console.error(`Error processing student ${student.idNo}:`, error);
//           return {
//             ...student,
//             totalAmount: 0,
//             amountPaid: 0,
//             amountToBePaid: 0
//           };
//         }
//       }));

//       // Sort students by ID
//       const sortedStudents = studentsWithFees.sort((a, b) => a.idNo - b.idNo);
//       setStudentData(sortedStudents);

//     } catch (error) {
//       console.error('Error fetching student data:', error);
//       toast.error('Failed to fetch student data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTermChange = (event) => {
//     setSelectedTerm(event.target.value);
//   };

//   const handleClassChange = (event) => {
//     setSelectedClass(event.target.value);
//   };

//   const handleSectionChange = (event) => {
//     setSelectedSection(event.target.value);
//   };

//   const getFilteredStudents = () => {
//     return studentData.filter(student => {
//       if (paymentFilter === 'paid' && student.amountToBePaid !== 0) return false;
//       if (paymentFilter === 'unpaid' && student.amountToBePaid === 0) return false;

//       const searchString = `${student.idNo} ${student.name} ${student.surname || ''}`.toLowerCase();
//       return searchString.includes(searchQuery.toLowerCase());
//     });
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8">Student Fee Data</h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//         <div className="relative">
//           <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
//             Select Class
//           </label>
//           <select
//             id="class"
//             value={selectedClass}
//             onChange={handleClassChange}
//             disabled={loading}
//             className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
//           >
//             <option value="">Select Class</option>
//             {classes.map((cls) => (
//               <option key={cls._id} value={cls._id}>
//                 {cls.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="relative">
//           <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1">
//             Select Section
//           </label>
//           <select
//             id="section"
//             value={selectedSection}
//             onChange={handleSectionChange}
//             disabled={!selectedClass || loading}
//             className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
//           >
//             <option value="">Select Section</option>
//             {sections.map((section) => (
//               <option key={section._id} value={section._id}>
//                 {section.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="relative">
//           <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-1">
//             Select Term
//           </label>
//           <select
//             id="term"
//             value={selectedTerm}
//             onChange={handleTermChange}
//             disabled={loading}
//             className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
//           >
//             <option value="">All Terms</option>
//             {terms.map((term) => (
//               <option key={term.id} value={term.id}>
//                 {term.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {!loading && studentData.length > 0 && (
//         <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="relative">
//             <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
//               Search Students
//             </label>
//             <input
//               type="text"
//               id="search"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search by ID or Name..."
//               className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           <div className="relative">
//             <label htmlFor="paymentFilter" className="block text-sm font-medium text-gray-700 mb-1">
//               Payment Status
//             </label>
//             <select
//               id="paymentFilter"
//               value={paymentFilter}
//               onChange={(e) => setPaymentFilter(e.target.value)}
//               className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="all">All Students</option>
//               <option value="paid">Fees Paid</option>
//               <option value="unpaid">Fees Pending</option>
//             </select>
//           </div>
//         </div>
//       )}

//       {!loading && studentData.length > 0 && (
//         <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
//             <p className="text-2xl font-semibold text-gray-900">{studentData.length}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-sm font-medium text-gray-500">Fees Paid</h3>
//             <p className="text-2xl font-semibold text-green-600">
//               {studentData.filter(s => s.amountToBePaid === 0).length}
//             </p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-sm font-medium text-gray-500">Fees Pending</h3>
//             <p className="text-2xl font-semibold text-red-600">
//               {studentData.filter(s => s.amountToBePaid > 0).length}
//             </p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-sm font-medium text-gray-500">Total Collection</h3>
//             <p className="text-2xl font-semibold text-blue-600">
//               ₹{studentData.reduce((sum, s) => sum + s.amountPaid, 0).toLocaleString()}
//             </p>
//           </div>
//         </div>
//       )}

//       {loading && (
//         <div className="flex justify-center items-center py-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//         </div>
//       )}

//       {!loading && studentData.length > 0 && (
//         <div className="overflow-x-auto shadow-md rounded-lg">
//           <table className="min-w-full table-auto">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   S.NO
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Student ID
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   {selectedTerm ? `${terms.find(t => t.id === selectedTerm)?.name} Amount` : 'Total Amount'}
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   {selectedTerm ? `${terms.find(t => t.id === selectedTerm)?.name} Paid` : 'Total Paid'}
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Due
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {getFilteredStudents().map((student, index) => (
//                 <tr key={student._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {index + 1}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {student.idNo}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {student.surname ? `${student.surname} ${student.name}` : student.name}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     ₹{student.totalAmount.toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     ₹{student.amountPaid.toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     ₹{student.amountToBePaid.toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.amountToBePaid === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                       }`}>
//                       {student.amountToBePaid === 0 ? 'Paid' : 'Pending'}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {getFilteredStudents().length === 0 && (
//             <div className="text-center py-4 text-gray-500">
//               No students found matching your search criteria
//             </div>
//           )}
//         </div>
//       )}

//       {!loading && studentData.length === 0 && selectedClass && selectedSection && (
//         <div className="text-center py-8 text-gray-500">
//           No student data found
//         </div>
//       )}
//     </div>
//   );
// };

// export default Data;

