// import React, { useState, useEffect, useContext } from 'react';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { mycon } from '../../../store/Mycontext';
// import { User, Users, Phone, MapPin } from 'lucide-react';
// import Allapi from '../../../common';

// const ViewEnquiry = () => {
//   const { branchdet } = useContext(mycon);
//   const [loading, setLoading] = useState(false);
//   const [teachers, setTeachers] = useState([]);
//   const [uniqueTowns, setUniqueTowns] = useState([]);
//   const [enquiries, setEnquiries] = useState([]);
//   const [filterType, setFilterType] = useState(''); // 'town' or 'teacher'
//   const [selectedTown, setSelectedTown] = useState('');
//   const [selectedTeacher, setSelectedTeacher] = useState('');

//   // Fetch initial data (teachers and towns)
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       if (!branchdet?.academicYears?.[0]) return;

//       try {
//         setLoading(true);
//         // Fetch teachers
//         const teachersResponse = await fetch(Allapi.getTeachers.url(branchdet.academicYears[0]), {
//           method: Allapi.getTeachers.method,
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json'
//           }
//         });

//         // Fetch all enquiries to get unique towns
//         const enquiriesResponse = await fetch(Allapi.getEnquiries.url(branchdet._id), {
//           method: Allapi.getEnquiries.method,
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json'
//           }
//         });

//         const [teachersResult, enquiriesResult] = await Promise.all([
//           teachersResponse.json(),
//           enquiriesResponse.json()
//         ]);

//         if (teachersResult.success) {
//           setTeachers(teachersResult.data.sort((a, b) => a.name.localeCompare(b.name)));
//         }

//         if (enquiriesResult.success) {
//           const towns = [...new Set(enquiriesResult.data.map(enquiry => enquiry.town))];
//           setUniqueTowns(towns.sort());
//         }
//       } catch (error) {
//         toast.error('Error fetching initial data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInitialData();
//   }, [branchdet]);

//   // Fetch filtered enquiries based on selection
//   useEffect(() => {
//     const fetchFilteredEnquiries = async () => {
//       if (!filterType || (!selectedTown && !selectedTeacher) || !branchdet?._id) return;

//       try {
//         setLoading(true);
//         const response = await fetch(Allapi.getEnquiries.url(branchdet._id), {
//           method: Allapi.getEnquiries.method,
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json'
//           }
//         });

//         const result = await response.json();
//         if (result.success) {
//           let filteredData = result.data;

//           if (filterType === 'town' && selectedTown) {
//             filteredData = filteredData.filter(enquiry => enquiry.town === selectedTown);
//           } else if (filterType === 'teacher' && selectedTeacher) {
//             filteredData = filteredData.filter(enquiry => enquiry.reference === selectedTeacher);
//           }

//           setEnquiries(filteredData);
//         }
//       } catch (error) {
//         toast.error('Error fetching enquiries');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFilteredEnquiries();
//   }, [filterType, selectedTown, selectedTeacher, branchdet]);

//   const handleFilterTypeChange = (type) => {
//     setFilterType(type);
//     setSelectedTown('');
//     setSelectedTeacher('');
//     setEnquiries([]);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
//       <div className="max-w-[1400px] mx-auto">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
//           <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 sm:mb-0">
//             View Student Details
//           </h1>
//         </div>

//         {/* Filter Selection */}
//         <div className="bg-white shadow-lg rounded-xl mb-8 p-6">
//           <div className="mb-6">
//             <label className="block text-sm font-semibold text-indigo-600 mb-2">
//               Filter By
//             </label>
//             <div className="flex gap-4">
//               <button
//                 onClick={() => handleFilterTypeChange('town')}
//                 className={`px-4 py-2 rounded-lg ${
//                   filterType === 'town'
//                     ? 'bg-indigo-600 text-white'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 } transition-colors duration-200`}
//               >
//                 Town
//               </button>
//               <button
//                 onClick={() => handleFilterTypeChange('teacher')}
//                 className={`px-4 py-2 rounded-lg ${
//                   filterType === 'teacher'
//                     ? 'bg-indigo-600 text-white'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 } transition-colors duration-200`}
//               >
//                 Reference Teacher
//               </button>
//             </div>
//           </div>

//           {filterType === 'town' && (
//             <div>
//               <label className="block text-sm font-semibold text-indigo-600 mb-2">
//                 Select Town
//               </label>
//               <select
//                 value={selectedTown}
//                 onChange={(e) => setSelectedTown(e.target.value)}
//                 className="block w-full rounded-lg border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm transition-all duration-200"
//               >
//                 <option value="">Select Town</option>
//                 {uniqueTowns.map((town) => (
//                   <option key={town} value={town}>{town}</option>
//                 ))}
//               </select>
//             </div>
//           )}

//           {filterType === 'teacher' && (
//             <div >
//               <label className="block text-sm font-semibold text-indigo-600 mb-2">
//                 Select Reference Teacher
//               </label>
//               <select
//                 value={selectedTeacher}
//                 onChange={(e) => setSelectedTeacher(e.target.value)}
//                 className="block w-full rounded-lg border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm transition-all duration-200"
//               >
//                 <option value="">Select Teacher</option>
//                 {teachers.map((teacher) => (
//                   <option key={teacher._id} value={teacher.name}>{teacher.name}</option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>

//         {/* Students List */}
//         <div className="space-y-4">
//           {loading ? (
//             <div className="bg-white rounded-xl p-8 text-center">
//               <div className="flex items-center justify-center text-indigo-600">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
//                 <span className="ml-2">Loading students...</span>
//               </div>
//             </div>
//           ) : enquiries.length === 0 ? (
//             <div className="bg-white rounded-xl p-8 text-center text-gray-500">
//               {filterType 
//                 ? 'No students found for selected filter'
//                 : 'Please select a filter type to view students'}
//             </div>
//           ) : (
//             enquiries.map((enquiry) => (
//               <div key={enquiry._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
//                 <div className="p-6">
//                   <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//                     {/* Student Info */}
//                     <div className="flex-1">
//                       <div className="flex items-start gap-4">
//                         <div className="flex-1">
//                           <h3 className="text-lg font-semibold text-indigo-600 flex items-center gap-2">
//                             <User className="h-5 w-5" />
//                             {enquiry.studentName}
//                           </h3>
//                           <p className="text-gray-600 flex items-center gap-2 mt-1">
//                             <Users className="h-4 w-4" />
//                             Father: {enquiry.fatherName}
//                           </p>
//                           <div className="mt-2 space-y-1">
//                             <p className="text-gray-600 flex items-center gap-2">
//                               <Phone className="h-4 w-4" />
//                               {enquiry.phoneNo}
//                             </p>
//                             <p className="text-gray-600 flex items-center gap-2">
//                               <MapPin className="h-4 w-4" />
//                               {enquiry.town}, {enquiry.street}, {enquiry.street2}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Class Info */}
//                     <div>
//                       <span className="text-sm text-gray-500">Class:</span>
//                       <p className="font-medium text-gray-900">{enquiry.class?.name} - {enquiry.section?.name}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewEnquiry;

import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { mycon } from '../../../store/Mycontext';
import { User, Users, Phone, MapPin, Calendar, Search } from 'lucide-react';
import Allapi from '../../../common';

const ViewEnquiry = () => {
  const { branchdet } = useContext(mycon);
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [allEnquiries, setAllEnquiries] = useState([]); // Store all enquiries for filtering
  const [filterType, setFilterType] = useState(''); // 'teacher', 'date', or 'name'
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [searchName, setSearchName] = useState('');

  // Fetch initial data (teachers and enquiries)
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!branchdet?.academicYears?.[0]) return;

      try {
        setLoading(true);
        // Fetch teachers
        const teachersResponse = await fetch(
          Allapi.getTeachers.url(branchdet.academicYears[0]),
          {
            method: Allapi.getTeachers.method,
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );

        // Fetch all enquiries
        const enquiriesResponse = await fetch(
          Allapi.getEnquiries.url(branchdet._id),
          {
            method: Allapi.getEnquiries.method,
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const [teachersResult, enquiriesResult] = await Promise.all([
          teachersResponse.json(),
          enquiriesResponse.json()
        ]);

        if (teachersResult.success) {
          setTeachers(teachersResult.data.sort((a, b) => a.name.localeCompare(b.name)));
        }

        if (enquiriesResult.success) {
          const sortedEnquiries = enquiriesResult.data.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setAllEnquiries(sortedEnquiries);
          setEnquiries(sortedEnquiries);
        }
      } catch (error) {
        toast.error('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [branchdet]);

  const handleFilterTypeChange = (type) => {
    setFilterType(type);
    setSelectedTeacher('');
    setDateRange({ from: '', to: '' });
    setSearchName('');
    setEnquiries(allEnquiries);
  };

  const applyFilters = () => {
    let filteredData = [...allEnquiries];

    if (filterType === 'teacher' && selectedTeacher) {
      filteredData = filteredData.filter(enquiry =>
        enquiry.reference === selectedTeacher
      );
    } else if (filterType === 'date' && dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59); // Include the entire 'to' date

      filteredData = filteredData.filter(enquiry => {
        const enquiryDate = new Date(enquiry.createdAt);
        return enquiryDate >= fromDate && enquiryDate <= toDate;
      });
    } else if (filterType === 'name' && searchName) {
      const searchLower = searchName.toLowerCase();
      filteredData = filteredData.filter(enquiry =>
        enquiry.studentName.toLowerCase().includes(searchLower)
      );
    }

    setEnquiries(filteredData);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedTeacher, dateRange.from, dateRange.to, searchName]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 sm:mb-0">
            View Student Enquiries
          </h1>
        </div>

        {/* Filter Selection */}
        <div className="bg-white shadow-lg rounded-xl mb-8 p-6">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-indigo-600 mb-2">
              Filter By
            </label>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => handleFilterTypeChange('teacher')}
                className={`px-4 py-2 rounded-lg ${filterType === 'teacher'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors duration-200`}
              >
                Reference Teacher
              </button>
              <button
                onClick={() => handleFilterTypeChange('date')}
                className={`px-4 py-2 rounded-lg ${filterType === 'date'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors duration-200`}
              >
                Date Range
              </button>
              <button
                onClick={() => handleFilterTypeChange('name')}
                className={`px-4 py-2 rounded-lg ${filterType === 'name'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors duration-200`}
              >
                Student Name
              </button>
            </div>
          </div>

          {filterType === 'teacher' && (
            <div>
              <label className="block text-sm font-semibold text-indigo-600 mb-2">
                Select Reference Teacher
              </label>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="block w-full rounded-lg border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm transition-all duration-200"
              >
                <option value="">All Teachers</option>
                <option value="None">No Reference</option>
                {teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher.name}>{teacher.name}</option>
                ))}
              </select>
            </div>
          )}

          {filterType === 'date' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-indigo-600 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                  className="block w-full rounded-lg border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-indigo-600 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                  className="block w-full rounded-lg border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm transition-all duration-200"
                />
              </div>
            </div>
          )}

          {filterType === 'name' && (
            <div>
              <label className="block text-sm font-semibold text-indigo-600 mb-2">
                Search by Student Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Enter student name..."
                  className="block w-full rounded-lg border-0 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm transition-all duration-200"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          )}
        </div>

        {/* Enquiries List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="flex items-center justify-center text-indigo-600">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
                <span className="ml-2">Loading enquiries...</span>
              </div>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500">
              {filterType
                ? 'No enquiries found for selected filter'
                : 'No enquiries available'}
            </div>
          ) : (
            enquiries.map((enquiry) => (
              <div key={enquiry._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Student Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-indigo-600 flex items-center gap-2">
                            <User className="h-5 w-5" />
                            {enquiry.studentName}
                          </h3>
                          <div className="mt-2 space-y-1">
                            <p className="text-gray-600 flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Age: {enquiry.age} years
                            </p>
                            <p className="text-gray-600 flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {enquiry.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Class:</span>
                        <p className="font-medium text-gray-900">{enquiry.class}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Reference:</span>
                        <p className="font-medium text-gray-900">{enquiry.reference}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Date:</span>
                        <p className="font-medium text-gray-900">{formatDate(enquiry.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewEnquiry;