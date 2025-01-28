import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { mycon } from '../../../store/Mycontext';
import Allapi from '../../../common';

const Data = () => {
  const { branchdet } = useContext(mycon);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);

  const terms = [
    { id: 'term1', name: 'Term 1' },
    { id: 'term2', name: 'Term 2' },
    { id: 'term3', name: 'Term 3' },
    { id: 'term4', name: 'Term 4' }
  ];

  // Fetch classes when component mounts
  useEffect(() => {
    if (branchdet?.academicYears?.[0]) {
      fetchClasses();
    }
  }, [branchdet]);

  // Fetch sections when class is selected
  useEffect(() => {
    if (selectedClass) {
      fetchSections(selectedClass);
      setSelectedSection('');
      setStudentData([]);
    }
  }, [selectedClass]);

  // Fetch student data when both class and section are selected
  useEffect(() => {
    if (selectedClass && selectedSection && selectedTerm) {
      fetchStudentData();
    }
  }, [selectedClass, selectedSection, selectedTerm]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        Allapi.getClasses.url(branchdet.academicYears[0]),
        {
          method: Allapi.getClasses.method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      if (response.ok) {
        setClasses(data.data || []);
      } else {
        toast.error('Failed to fetch classes');
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Error fetching classes');
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async (classId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        Allapi.getSections.url(classId),
        {
          method: Allapi.getSections.method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSections(data.data || []);
      } else {
        toast.error('Failed to fetch sections');
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast.error('Error fetching sections');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        Allapi.getStudentsBySection.url(selectedSection),
        {
          method: Allapi.getStudentsBySection.method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      if (response.ok) {
        const sortedStudents = (data.data || []).sort((a, b) => a.idNo - b.idNo);
        const studentsWithAmount = sortedStudents.map(student => ({
          ...student,
          totalAmount: student.feeDetails?.reduce((total, fee) => total + (fee.amount || 0), 0) || 0
        }));
        setStudentData(studentsWithAmount);
      } else {
        toast.error('Failed to fetch student data');
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      toast.error('Failed to fetch student data');
    } finally {
      setLoading(false);
    }
  };

  const handleTermChange = (event) => {
    setSelectedTerm(event.target.value);
    setStudentData([]);
  };

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
  };

  const handleSectionChange = (event) => {
    setSelectedSection(event.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Student Data</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Term Dropdown */}
        <div className="relative">
          <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-1">
            Select Term
          </label>
          <select
            id="term"
            value={selectedTerm}
            onChange={handleTermChange}
            disabled={loading}
            className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value="">Select Term</option>
            {terms.map((term) => (
              <option key={term.id} value={term.id}>
                {term.name}
              </option>
            ))}
          </select>
        </div>

        {/* Class Dropdown */}
        <div className="relative">
          <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
            Select Class
          </label>
          <select
            id="class"
            value={selectedClass}
            onChange={handleClassChange}
            disabled={!selectedTerm || loading}
            className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        {/* Section Dropdown */}
        <div className="relative">
          <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1">
            Select Section
          </label>
          <select
            id="section"
            value={selectedSection}
            onChange={handleSectionChange}
            disabled={!selectedClass || loading}
            className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value="">Select Section</option>
            {sections.map((section) => (
              <option key={section._id} value={section._id}>
                {section.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!loading && studentData.length > 0 && (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S.NO
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount to be Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paid
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studentData.map((student, index) => {
                const totalAmount = student.feeDetails?.reduce((total, fee) => total + (fee.amount || 0), 0) || 0;
                const amountPaid = student.feeDetails?.reduce((total, fee) => total + (fee.paidAmount || 0), 0) || 0;
                const amountToBePaid = totalAmount - amountPaid;
                const isPaid = amountToBePaid === 0;
                
                return (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.idNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.surname ? `${student.surname} ${student.name}` : student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{amountPaid}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{amountToBePaid}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {isPaid ? 'Yes' : 'No'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!loading && studentData.length === 0 && selectedClass && selectedSection && selectedTerm && (
        <div className="text-center py-8 text-gray-500">
          No student data found
        </div>
      )}
    </div>
  );
};

export default Data;