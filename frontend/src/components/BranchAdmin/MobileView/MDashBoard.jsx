// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import {
//     BarChart,
//     Building,
//     Users,
//     CreditCard,
//     BellRing,
//     ImageIcon,
//     ArrowUpRight,
//     ArrowDownRight,
//     Wallet,
//     BanknoteIcon,
//     CoinsIcon,
//     FileText,
//     Calendar
// } from 'lucide-react';
// import Allapi from '../../../common/index';

// const MDashboard = () => {
//     const [branchInfo, setBranchInfo] = useState(null);
//     const [bankCollections, setBankCollections] = useState({ total: 0, today: 0 });
//     const [cashCollections, setCashCollections] = useState({ total: 0, today: 0 });
//     const [bankExpenses, setBankExpenses] = useState({ total: 0, today: 0 });
//     const [cashExpenses, setCashExpenses] = useState({ total: 0, today: 0 });
//     const [studentStats, setStudentStats] = useState({ total: 0, totalDue: 0 });
//     const [notices, setNotices] = useState([]);
//     const [galleries, setGalleries] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchDashboardData = async () => {
//             try {
//                 setLoading(true);
//                 const token = localStorage.getItem('token');

//                 // Fetch branch info
//                 const branchResponse = await axios.get(Allapi.getBranches.url, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });

//                 if (branchResponse.data.success && branchResponse.data.branches.length > 0) {
//                     setBranchInfo(branchResponse.data.branches[0]);

//                     // Use the first branch's academic year for subsequent requests
//                     const academicId = branchResponse.data.branches[0].academicYears[0];

//                     // Fetch bank collections
//                     const bankResponse = await axios.get(`${Allapi.backapi}/api/books/bank`, {
//                         headers: { Authorization: `Bearer ${token}` }
//                     });

//                     if (bankResponse.data.success) {
//                         const bankData = bankResponse.data.data || [];
//                         const receivedEntries = bankData.filter(entry => entry.transactionType === 'received');
//                         const totalReceived = receivedEntries.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);

//                         // Calculate today's collections
//                         const today = new Date().toISOString().split('T')[0];
//                         const todayReceived = receivedEntries
//                             .filter(entry => new Date(entry.date).toISOString().split('T')[0] === today)
//                             .reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);

//                         setBankCollections({ total: totalReceived, today: todayReceived });

//                         // Calculate bank expenses
//                         const paidEntries = bankData.filter(entry => entry.transactionType === 'paid');
//                         const totalPaid = paidEntries.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);

//                         const todayPaid = paidEntries
//                             .filter(entry => new Date(entry.date).toISOString().split('T')[0] === today)
//                             .reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);

//                         setBankExpenses({ total: totalPaid, today: todayPaid });
//                     }

//                     // Fetch cash collections
//                     const cashResponse = await axios.get(`${Allapi.backapi}/api/books/cash`, {
//                         headers: { Authorization: `Bearer ${token}` }
//                     });

//                     if (cashResponse.data.success) {
//                         const cashData = cashResponse.data.data || [];
//                         const receivedEntries = cashData.filter(entry => entry.transactionType === 'received');
//                         const totalReceived = receivedEntries.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);

//                         // Calculate today's collections
//                         const today = new Date().toISOString().split('T')[0];
//                         const todayReceived = receivedEntries
//                             .filter(entry => new Date(entry.date).toISOString().split('T')[0] === today)
//                             .reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);

//                         setCashCollections({ total: totalReceived, today: todayReceived });

//                         // Calculate cash expenses
//                         const paidEntries = cashData.filter(entry => entry.transactionType === 'paid');
//                         const totalPaid = paidEntries.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);

//                         const todayPaid = paidEntries
//                             .filter(entry => new Date(entry.date).toISOString().split('T')[0] === today)
//                             .reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);

//                         setCashExpenses({ total: totalPaid, today: todayPaid });
//                     }

//                     // Fetch student stats
//                     const studentCountResponse = await axios.get(Allapi.getStudentCountByAcademicYear.url(academicId), {
//                         headers: { Authorization: `Bearer ${token}` }
//                     });

//                     if (studentCountResponse.data.success) {
//                         const totalStudents = studentCountResponse.data.count || 0;

//                         // Fetch fee data to calculate total due
//                         const classesResponse = await axios.get(Allapi.getClasses.url(academicId), {
//                             headers: { Authorization: `Bearer ${token}` }
//                         });

//                         if (classesResponse.data.success) {
//                             let totalDue = 0;

//                             for (const classItem of classesResponse.data.data) {
//                                 const sectionsResponse = await axios.get(Allapi.getSections.url(classItem._id), {
//                                     headers: { Authorization: `Bearer ${token}` }
//                                 });

//                                 if (sectionsResponse.data.success) {
//                                     for (const section of sectionsResponse.data.data) {
//                                         const studentsResponse = await axios.post(
//                                             Allapi.getStudentsBySection.url(section._id),
//                                             {},
//                                             { headers: { Authorization: `Bearer ${token}` } }
//                                         );

//                                         if (studentsResponse.data.success) {
//                                             for (const student of studentsResponse.data.data) {
//                                                 // Calculate total fee for student
//                                                 const totalFee = student.feeDetails.reduce((sum, fee) => sum + (fee.finalAmount || fee.amount || 0), 0);

//                                                 // Fetch receipts to calculate paid amount
//                                                 const receiptsResponse = await axios.get(
//                                                     `${Allapi.getReciepts.url(academicId)}?studentID=${student.idNo}`,
//                                                     { headers: { Authorization: `Bearer ${token}` } }
//                                                 );

//                                                 if (receiptsResponse.data.receipts) {
//                                                     const paidAmount = receiptsResponse.data.receipts.reduce((sum, receipt) => sum + (receipt.totalAmount || 0), 0);
//                                                     totalDue += (totalFee - paidAmount);
//                                                 } else {
//                                                     totalDue += totalFee;
//                                                 }
//                                             }
//                                         }
//                                     }
//                                 }
//                             }

//                             setStudentStats({ total: totalStudents, totalDue });
//                         }
//                     }

//                     // Fetch notices
//                     const noticesResponse = await axios.get(Allapi.getNotices.url, {
//                         headers: { Authorization: `Bearer ${token}` }
//                     });

//                     if (noticesResponse.data.success) {
//                         setNotices(noticesResponse.data.data.slice(0, 3)); // Get latest 3 notices
//                     }

//                     // Fetch galleries
//                     const galleriesResponse = await axios.get(`${Allapi.backapi}/api/gallery`, {
//                         headers: { Authorization: `Bearer ${token}` }
//                     });

//                     if (galleriesResponse.data.success) {
//                         setGalleries(galleriesResponse.data.data.slice(0, 4)); // Get latest 4 galleries
//                     }
//                 }
//             } catch (error) {
//                 console.error('Error fetching dashboard data:', error);
//                 setError('Failed to load dashboard data. Please try again later.');
//                 toast.error('Failed to load dashboard data');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchDashboardData();
//     }, []);

//     const formatCurrency = (amount) => {
//         return new Intl.NumberFormat('en-IN', {
//             style: 'currency',
//             currency: 'INR',
//             maximumFractionDigits: 0
//         }).format(amount);
//     };

//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-IN', {
//             day: 'numeric',
//             month: 'short',
//             year: 'numeric'
//         });
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <div className="bg-red-50 text-red-600 p-6 rounded-lg shadow-md">
//                     <h2 className="text-xl font-bold mb-2">Error</h2>
//                     <p>{error}</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//             <div className="max-w-7xl mx-auto">
//                 {/* Branch Information */}
//                 <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
//                         <div className="flex items-center mb-4 md:mb-0">
//                             <Building className="text-blue-600 mr-3" size={28} />
//                             <div>
//                                 <h1 className="text-2xl font-bold text-gray-800">
//                                     {branchInfo?.name || 'Branch Dashboard'}
//                                 </h1>
//                                 <p className="text-gray-500">
//                                     {branchInfo?.location || 'Location not available'}
//                                 </p>
//                             </div>
//                         </div>
//                         <div className="flex flex-col items-end">
//                             <p className="text-sm text-gray-500">Current Academic Year</p>
//                             <p className="text-lg font-semibold text-gray-800">
//                                 {branchInfo?.currentAcademicYear || 'Not set'}
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Stats Overview */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//                     {/* Total Students */}
//                     <div className="bg-white rounded-lg shadow-md p-6">
//                         <div className="flex justify-between items-start">
//                             <div>
//                                 <p className="text-sm text-gray-500 mb-1">Total Students</p>
//                                 <h3 className="text-2xl font-bold text-gray-800">{studentStats.total}</h3>
//                             </div>
//                             <div className="p-2 bg-blue-50 rounded-lg">
//                                 <Users className="text-blue-600" size={24} />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Total Due */}
//                     <div className="bg-white rounded-lg shadow-md p-6">
//                         <div className="flex justify-between items-start">
//                             <div>
//                                 <p className="text-sm text-gray-500 mb-1">Total Due</p>
//                                 <h3 className="text-2xl font-bold text-red-600">
//                                     {formatCurrency(studentStats.totalDue)}
//                                 </h3>
//                             </div>
//                             <div className="p-2 bg-red-50 rounded-lg">
//                                 <CreditCard className="text-red-600" size={24} />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Today's Collections */}
//                     <div className="bg-white rounded-lg shadow-md p-6">
//                         <div className="flex justify-between items-start">
//                             <div>
//                                 <p className="text-sm text-gray-500 mb-1">Today's Collections</p>
//                                 <h3 className="text-2xl font-bold text-green-600">
//                                     {formatCurrency(bankCollections.today + cashCollections.today)}
//                                 </h3>
//                             </div>
//                             <div className="p-2 bg-green-50 rounded-lg">
//                                 <ArrowUpRight className="text-green-600" size={24} />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Today's Expenses */}
//                     <div className="bg-white rounded-lg shadow-md p-6">
//                         <div className="flex justify-between items-start">
//                             <div>
//                                 <p className="text-sm text-gray-500 mb-1">Today's Expenses</p>
//                                 <h3 className="text-2xl font-bold text-orange-600">
//                                     {formatCurrency(bankExpenses.today + cashExpenses.today)}
//                                 </h3>
//                             </div>
//                             <div className="p-2 bg-orange-50 rounded-lg">
//                                 <ArrowDownRight className="text-orange-600" size={24} />
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Collections and Expenses */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//                     {/* Collections */}
//                     <div className="bg-white rounded-lg shadow-md overflow-hidden">
//                         <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600">
//                             <h2 className="text-xl font-bold text-white">Today's Collections</h2>
//                         </div>
//                         <div className="p-6">
//                             <div className="grid grid-cols-1 gap-4">
//                                 {/* Bank Collections */}
//                                 <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
//                                     <div className="flex items-center">
//                                         <div className="p-3 bg-blue-100 rounded-full mr-4">
//                                             <BanknoteIcon className="text-blue-600" size={20} />
//                                         </div>
//                                         <div>
//                                             <p className="text-sm text-gray-500">Collected through Bank</p>
//                                             <p className="text-lg font-semibold text-gray-800">
//                                                 {formatCurrency(bankCollections.today)}
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
//                                         {((bankCollections.today / (bankCollections.today + cashCollections.today)) * 100 || 0).toFixed(1)}%
//                                     </div>
//                                 </div>

//                                 {/* Cash Collections */}
//                                 <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
//                                     <div className="flex items-center">
//                                         <div className="p-3 bg-green-100 rounded-full mr-4">
//                                             <Wallet className="text-green-600" size={20} />
//                                         </div>
//                                         <div>
//                                             <p className="text-sm text-gray-500">Collected through Cash</p>
//                                             <p className="text-lg font-semibold text-gray-800">
//                                                 {formatCurrency(cashCollections.today)}
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
//                                         {((cashCollections.today / (bankCollections.today + cashCollections.today)) * 100 || 0).toFixed(1)}%
//                                     </div>
//                                 </div>

//                                 {/* Total Collections */}
//                                 <div className="mt-2 pt-4 border-t border-gray-100">
//                                     <div className="flex justify-between items-center">
//                                         <p className="text-sm font-medium text-gray-500">Total Collections Today</p>
//                                         <p className="text-xl font-bold text-gray-800">
//                                             {formatCurrency(bankCollections.today + cashCollections.today)}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Expenses */}
//                     <div className="bg-white rounded-lg shadow-md overflow-hidden">
//                         <div className="px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600">
//                             <h2 className="text-xl font-bold text-white">Today's Expenses</h2>
//                         </div>
//                         <div className="p-6">
//                             <div className="grid grid-cols-1 gap-4">
//                                 {/* Bank Expenses */}
//                                 <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
//                                     <div className="flex items-center">
//                                         <div className="p-3 bg-orange-100 rounded-full mr-4">
//                                             <BanknoteIcon className="text-orange-600" size={20} />
//                                         </div>
//                                         <div>
//                                             <p className="text-sm text-gray-500">Paid through Bank</p>
//                                             <p className="text-lg font-semibold text-gray-800">
//                                                 {formatCurrency(bankExpenses.today)}
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <div className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
//                                         {((bankExpenses.today / (bankExpenses.today + cashExpenses.today)) * 100 || 0).toFixed(1)}%
//                                     </div>
//                                 </div>

//                                 {/* Cash Expenses */}
//                                 <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
//                                     <div className="flex items-center">
//                                         <div className="p-3 bg-red-100 rounded-full mr-4">
//                                             <CoinsIcon className="text-red-600" size={20} />
//                                         </div>
//                                         <div>
//                                             <p className="text-sm text-gray-500">Paid through Cash</p>
//                                             <p className="text-lg font-semibold text-gray-800">
//                                                 {formatCurrency(cashExpenses.today)}
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <div className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
//                                         {((cashExpenses.today / (bankExpenses.today + cashExpenses.today)) * 100 || 0).toFixed(1)}%
//                                     </div>
//                                 </div>

//                                 {/* Total Expenses */}
//                                 <div className="mt-2 pt-4 border-t border-gray-100">
//                                     <div className="flex justify-between items-center">
//                                         <p className="text-sm font-medium text-gray-500">Total Expenses Today</p>
//                                         <p className="text-xl font-bold text-gray-800">
//                                             {formatCurrency(bankExpenses.today + cashExpenses.today)}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Notices and Gallery */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                     {/* Notices */}
//                     <div className="bg-white rounded-lg shadow-md overflow-hidden">
//                         <div className="px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 flex justify-between items-center">
//                             <h2 className="text-xl font-bold text-white">Latest Notices</h2>
//                             <BellRing className="text-white" size={20} />
//                         </div>
//                         <div className="p-6">
//                             {notices.length > 0 ? (
//                                 <div className="space-y-4">
//                                     {notices.map((notice) => (
//                                         <div key={notice._id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
//                                             <div className="flex items-start">
//                                                 <div className="p-2 bg-purple-100 rounded-lg mr-4">
//                                                     <FileText className="text-purple-600" size={18} />
//                                                 </div>
//                                                 <div>
//                                                     <h3 className="font-semibold text-gray-800">{notice.title}</h3>
//                                                     <p className="text-sm text-gray-500 mt-1 line-clamp-2">{notice.description}</p>
//                                                     <div className="flex items-center mt-2 text-xs text-gray-400">
//                                                         <Calendar size={12} className="mr-1" />
//                                                         <span>{formatDate(notice.date)}</span>
//                                                     </div>

//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <div className="text-center py-8 text-gray-500">
//                                     <BellRing className="mx-auto mb-2 text-gray-300" size={32} />
//                                     <p>No notices available</p>
//                                 </div>
//                             )}

//                             {notices.length > 0 && (
//                                 <div className="mt-4 text-center">
//                                     <a href="/notices" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
//                                         View all notices
//                                     </a>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Gallery */}
//                     <div className="bg-white rounded-lg shadow-md overflow-hidden">
//                         <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 flex justify-between items-center">
//                             <h2 className="text-xl font-bold text-white">Gallery</h2>
//                             <ImageIcon className="text-white" size={20} />
//                         </div>
//                         <div className="p-6">
//                             {galleries.length > 0 ? (
//                                 <div>
//                                     <div className="grid grid-cols-2 gap-4">
//                                         {galleries.slice(0, 4).map((gallery) => (
//                                             <div key={gallery._id} className="relative overflow-hidden rounded-lg aspect-video bg-gray-100">
//                                                 {gallery.images && gallery.images.length > 0 ? (
//                                                     <img
//                                                         src={gallery.images[0].url}
//                                                         alt={gallery.title}
//                                                         className="w-full h-full object-cover transition-transform hover:scale-105"
//                                                     />
//                                                 ) : (
//                                                     <div className="w-full h-full flex items-center justify-center">
//                                                         <ImageIcon className="text-gray-300" size={32} />
//                                                     </div>
//                                                 )}
//                                                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
//                                                     <p className="text-white text-sm font-medium p-3 truncate w-full">
//                                                         {gallery.title}
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>

//                                     <div className="mt-4 text-center">
//                                         <a href="/gallery" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
//                                             View all images
//                                         </a>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <div className="text-center py-8 text-gray-500">
//                                     <ImageIcon className="mx-auto mb-2 text-gray-300" size={32} />
//                                     <p>No gallery images available</p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MDashboard;





import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    BarChart,
    Building,
    Users,
    CreditCard,
    BellRing,
    ImageIcon,
    ArrowUpRight,
    ArrowDownRight,
    Wallet,
    BanknoteIcon,
    CoinsIcon,
    FileText,
    Calendar,
    X,
    Eye
} from 'lucide-react';
import Allapi from '../../../common/index';

const MDashboard = () => {
    const [branchInfo, setBranchInfo] = useState(null);
    const [bankCollections, setBankCollections] = useState({ total: 0, today: 0 });
    const [cashCollections, setCashCollections] = useState({ total: 0, today: 0 });
    const [bankExpenses, setBankExpenses] = useState({ total: 0, today: 0 });
    const [cashExpenses, setCashExpenses] = useState({ total: 0, today: 0 });
    const [studentStats, setStudentStats] = useState({ total: 0, totalDue: 0, totalAmount: 0 });
    const [notices, setNotices] = useState([]);
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [selectedGallery, setSelectedGallery] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');

                // Fetch branch info
                const branchResponse = await axios.get(Allapi.getBranches.url, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (branchResponse.data.success && branchResponse.data.branches.length > 0) {
                    setBranchInfo(branchResponse.data.branches[0]);

                    // Use the first branch's academic year for subsequent requests
                    const academicId = branchResponse.data.branches[0].academicYears[0];

                    // Fetch bank collections
                    const bankResponse = await axios.get(`${Allapi.backapi}/api/books/bank`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (bankResponse.data.success) {
                        const bankData = bankResponse.data.data || [];
                        const receivedEntries = bankData.filter(entry => entry.transactionType === 'received');
                        const totalReceived = receivedEntries.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);

                        // Calculate today's collections
                        const today = new Date().toISOString().split('T')[0];
                        const todayReceived = receivedEntries
                            .filter(entry => new Date(entry.date).toISOString().split('T')[0] === today)
                            .reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);

                        setBankCollections({ total: totalReceived, today: todayReceived });

                        // Calculate bank expenses
                        const paidEntries = bankData.filter(entry => entry.transactionType === 'paid');
                        const totalPaid = paidEntries.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);

                        const todayPaid = paidEntries
                            .filter(entry => new Date(entry.date).toISOString().split('T')[0] === today)
                            .reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);

                        setBankExpenses({ total: totalPaid, today: todayPaid });
                    }

                    // Fetch cash collections
                    const cashResponse = await axios.get(`${Allapi.backapi}/api/books/cash`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (cashResponse.data.success) {
                        const cashData = cashResponse.data.data || [];
                        const receivedEntries = cashData.filter(entry => entry.transactionType === 'received');
                        const totalReceived = receivedEntries.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);

                        // Calculate today's collections
                        const today = new Date().toISOString().split('T')[0];
                        const todayReceived = receivedEntries
                            .filter(entry => new Date(entry.date).toISOString().split('T')[0] === today)
                            .reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);

                        setCashCollections({ total: totalReceived, today: todayReceived });

                        // Calculate cash expenses
                        const paidEntries = cashData.filter(entry => entry.transactionType === 'paid');
                        const totalPaid = paidEntries.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);

                        const todayPaid = paidEntries
                            .filter(entry => new Date(entry.date).toISOString().split('T')[0] === today)
                            .reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);

                        setCashExpenses({ total: totalPaid, today: todayPaid });
                    }

                    // Fetch student stats
                    const studentCountResponse = await axios.get(Allapi.getStudentCountByAcademicYear.url(academicId), {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    console.log("student respose", studentCountResponse)

                    if (studentCountResponse.data.success) {
                        const totalStudents = studentCountResponse.data.count || 0;

                        // Fetch fee data to calculate total due
                        const classesResponse = await axios.get(Allapi.getClasses.url(academicId), {
                            headers: { Authorization: `Bearer ${token}` }
                        });

                        if (classesResponse.data.success) {
                            let totalDue = 0;
                            let totalAmount = 0;

                            for (const classItem of classesResponse.data.data) {
                                const sectionsResponse = await axios.get(Allapi.getSections.url(classItem._id), {
                                    headers: { Authorization: `Bearer ${token}` }
                                });

                                if (sectionsResponse.data.success) {
                                    for (const section of sectionsResponse.data.data) {
                                        const studentsResponse = await axios.post(
                                            Allapi.getStudentsBySection.url(section._id),
                                            {},
                                            { headers: { Authorization: `Bearer ${token}` } }
                                        );
                                        // console.log("studntrespiod", studentsResponse)
                                        if (studentsResponse.data.success) {
                                            for (const student of studentsResponse.data.data) {
                                                console.log("students data", studentsResponse.data.data);
                                                // Calculate total fee for student
                                                const studentTotalFee = student.feeDetails.reduce((sum, fee) => sum + (fee.finalAmount || fee.amount || 0), 0);
                                                totalAmount += studentTotalFee;

                                                // Fetch receipts to calculate paid amount
                                                const receiptsResponse = await axios.get(
                                                    `${Allapi.getReciepts.url(academicId)}?studentID=${student.idNo}`,
                                                    { headers: { Authorization: `Bearer ${token}` } }
                                                );

                                                if (receiptsResponse.data.receipts) {
                                                    const paidAmount = receiptsResponse.data.receipts.reduce((sum, receipt) => sum + (receipt.totalAmount || 0), 0);
                                                    totalDue += (studentTotalFee - paidAmount);
                                                } else {
                                                    totalDue += studentTotalFee;
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            setStudentStats({ total: totalStudents, totalDue, totalAmount });
                        }
                    }

                    // Fetch notices
                    const noticesResponse = await axios.get(Allapi.getNotices.url, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (noticesResponse.data.success) {
                        setNotices(noticesResponse.data.data.slice(0, 3)); // Get latest 3 notices
                    }

                    // Fetch galleries
                    const galleriesResponse = await axios.get(`${Allapi.backapi}/api/gallery`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (galleriesResponse.data.success) {
                        setGalleries(galleriesResponse.data.data.slice(0, 4)); // Get latest 4 galleries
                    }
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError('Failed to load dashboard data. Please try again later.');
                toast.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const handleViewNotice = (notice) => {
        setSelectedNotice(notice);
    };

    const handleCloseNotice = () => {
        setSelectedNotice(null);
    };

    const handleViewGallery = (gallery) => {
        setSelectedGallery(gallery);
    };

    const handleCloseGallery = () => {
        setSelectedGallery(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-red-50 text-red-600 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Branch Information */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex items-center mb-4 md:mb-0">
                            <Building className="text-blue-600 mr-3" size={28} />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    {branchInfo?.name || 'Branch Dashboard'}
                                </h1>
                                <p className="text-gray-500">
                                    {branchInfo?.location || 'Location not available'}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <p className="text-sm text-gray-500">Current Academic Year</p>
                            <p className="text-lg font-semibold text-gray-800">
                                {branchInfo?.currentAcademicYear || 'Not set'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {/* Total Students */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Students</p>
                                <h3 className="text-2xl font-bold text-gray-800">{studentStats.total}</h3>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Users className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Total Amount */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                                <h3 className="text-2xl font-bold text-blue-600">
                                    {formatCurrency(studentStats.totalAmount)}
                                </h3>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <BanknoteIcon className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Total Due */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Due</p>
                                <h3 className="text-2xl font-bold text-red-600">
                                    {formatCurrency(studentStats.totalDue)}
                                </h3>
                            </div>
                            <div className="p-2 bg-red-50 rounded-lg">
                                <CreditCard className="text-red-600" size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Collection Rate */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Collection Rate</p>
                                <h3 className="text-2xl font-bold text-green-600">
                                    {studentStats.totalAmount > 0
                                        ? `${(((studentStats.totalAmount - studentStats.totalDue) / studentStats.totalAmount) * 100).toFixed(1)}%`
                                        : '0%'}
                                </h3>
                            </div>
                            <div className="p-2 bg-green-50 rounded-lg">
                                <BarChart className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Collections and Expenses */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Collections */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600">
                            <h2 className="text-xl font-bold text-white">Today's Collections</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-4">
                                {/* Bank Collections */}
                                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="p-3 bg-blue-100 rounded-full mr-4">
                                            <BanknoteIcon className="text-blue-600" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Collected through Bank</p>
                                            <p className="text-lg font-semibold text-gray-800">
                                                {formatCurrency(bankCollections.today)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                        {((bankCollections.today / (bankCollections.today + cashCollections.today || 1)) * 100).toFixed(1)}%
                                    </div>
                                </div>

                                {/* Cash Collections */}
                                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="p-3 bg-green-100 rounded-full mr-4">
                                            <Wallet className="text-green-600" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Collected through Cash</p>
                                            <p className="text-lg font-semibold text-gray-800">
                                                {formatCurrency(cashCollections.today)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                        {((cashCollections.today / (bankCollections.today + cashCollections.today || 1)) * 100).toFixed(1)}%
                                    </div>
                                </div>

                                {/* Total Collections */}
                                <div className="mt-2 pt-4 border-t border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm font-medium text-gray-500">Total Collections Today</p>
                                        <p className="text-xl font-bold text-gray-800">
                                            {formatCurrency(bankCollections.today + cashCollections.today)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Expenses */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600">
                            <h2 className="text-xl font-bold text-white">Today's Expenses</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-4">
                                {/* Bank Expenses */}
                                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="p-3 bg-orange-100 rounded-full mr-4">
                                            <BanknoteIcon className="text-orange-600" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Paid through Bank</p>
                                            <p className="text-lg font-semibold text-gray-800">
                                                {formatCurrency(bankExpenses.today)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                                        {((bankExpenses.today / (bankExpenses.today + cashExpenses.today || 1)) * 100).toFixed(1)}%
                                    </div>
                                </div>

                                {/* Cash Expenses */}
                                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="p-3 bg-red-100 rounded-full mr-4">
                                            <CoinsIcon className="text-red-600" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Paid through Cash</p>
                                            <p className="text-lg font-semibold text-gray-800">
                                                {formatCurrency(cashExpenses.today)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                                        {((cashExpenses.today / (bankExpenses.today + cashExpenses.today || 1)) * 100).toFixed(1)}%
                                    </div>
                                </div>

                                {/* Total Expenses */}
                                <div className="mt-2 pt-4 border-t border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm font-medium text-gray-500">Total Expenses Today</p>
                                        <p className="text-xl font-bold text-gray-800">
                                            {formatCurrency(bankExpenses.today + cashExpenses.today)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notices and Gallery */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Notices */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Latest Notices</h2>
                            <BellRing className="text-white" size={20} />
                        </div>
                        <div className="p-6">
                            {notices.length > 0 ? (
                                <div className="space-y-4">
                                    {notices.map((notice) => (
                                        <div key={notice._id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                                            <div className="flex items-start">
                                                <div className="p-2 bg-purple-100 rounded-lg mr-4">
                                                    <FileText className="text-purple-600" size={18} />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-800">{notice.title}</h3>
                                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{notice.description}</p>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <div className="flex items-center text-xs text-gray-400">
                                                            <Calendar size={12} className="mr-1" />
                                                            <span>{formatDate(notice.date)}</span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleViewNotice(notice)}
                                                            className="text-purple-600 hover:text-purple-800 text-xs font-medium flex items-center"
                                                        >
                                                            <Eye size={14} className="mr-1" />
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <BellRing className="mx-auto mb-2 text-gray-300" size={32} />
                                    <p>No notices available</p>
                                </div>
                            )}

                            {notices.length > 0 && (
                                <div className="mt-4 text-center">
                                    <a href="/notices" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                                        View all notices
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Gallery */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Gallery</h2>
                            <ImageIcon className="text-white" size={20} />
                        </div>
                        <div className="p-6">
                            {galleries.length > 0 ? (
                                <div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {galleries.slice(0, 4).map((gallery) => (
                                            <div
                                                key={gallery._id}
                                                className="relative overflow-hidden rounded-lg aspect-video bg-gray-100 cursor-pointer"
                                                onClick={() => handleViewGallery(gallery)}
                                            >
                                                {gallery.images && gallery.images.length > 0 ? (
                                                    <img
                                                        src={gallery.images[0].url}
                                                        alt={gallery.title}
                                                        className="w-full h-full object-cover transition-transform hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ImageIcon className="text-gray-300" size={32} />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                                                    <p className="text-white text-sm font-medium p-3 truncate w-full">
                                                        {gallery.title}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 text-center">
                                        <a href="/gallery" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                            View all images
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <ImageIcon className="mx-auto mb-2 text-gray-300" size={32} />
                                    <p>No gallery images available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Notice Modal */}
            {selectedNotice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {selectedNotice.title}
                                </h2>
                                <button
                                    onClick={handleCloseNotice}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex items-center text-gray-500 mb-6">
                                <Calendar size={18} className="mr-2" />
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
                                                    className="text-blue-600 hover:text-blue-800"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Download
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

            {/* Gallery Modal */}
            {selectedGallery && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">{selectedGallery.title}</h2>
                            <button
                                onClick={handleCloseGallery}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
                            {selectedGallery.description && (
                                <p className="text-gray-600 mb-4">{selectedGallery.description}</p>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedGallery.images && selectedGallery.images.map((image, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                        <img
                                            src={image.url}
                                            alt={`Gallery image ${index + 1}`}
                                            className="w-full h-auto"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={handleCloseGallery}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MDashboard;