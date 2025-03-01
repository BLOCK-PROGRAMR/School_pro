import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { Trash2, RefreshCw, ChevronDown, CheckSquare, Square, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Allapi from '../../../common';
import { mycon } from '../../../store/Mycontext';

const Trash = () => {
  const navigate = useNavigate();
  const { branchdet } = useContext(mycon);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [trashedStudents, setTrashedStudents] = useState([]);
  const [showTrash, setShowTrash] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [currentAcademicYear, setCurrentAcademicYear] = useState(null);
  const [loadingTrash, setLoadingTrash] = useState(false);

  // Calculate fee due for a student
  const calculateFeeDue = (student) => {
    if (!student?.feeDetails) return 0;

    return student.feeDetails.reduce((total, fee) => {
      const finalAmount = fee.finalAmount || fee.amount || 0;
      const paidAmount = fee.paidFee || 0;
      return total + (finalAmount - paidAmount);
    }, 0);
  };

  useEffect(() => {
    const fetchCurrentAcademicYear = async () => {
      if (!branchdet?._id) return;

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Authentication token not found');
          return;
        }

        const response = await fetch(Allapi.getAcademicYears.url(branchdet._id), {
          method: Allapi.getAcademicYears.method,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch academic years');
        }

        const result = await response.json();
        if (result.success && result.data.length > 0) {
          const currentYear = result.data.reduce((latest, year) => {
            return !latest || new Date(year.startDate) > new Date(latest.startDate)
              ? year
              : latest;
          }, null);

          setCurrentAcademicYear(currentYear._id);
        } else {
          toast.error('No academic years found');
        }
      } catch (error) {
        toast.error(error.message || 'Error fetching academic year');
      }
    };

    fetchCurrentAcademicYear();
  }, [branchdet]);

  useEffect(() => {
    if (currentAcademicYear) {
      fetchClasses();
      fetchTrashedStudents();
    }
  }, [currentAcademicYear]);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      const response = await fetch(Allapi.getClasses.url(currentAcademicYear), {
        method: Allapi.getClasses.method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch classes');
      }

      const result = await response.json();
      if (result.success) {
        setClasses(result.data || []);
      } else {
        throw new Error(result.message || 'Failed to fetch classes');
      }
    } catch (error) {
      toast.error(error.message || 'Error fetching classes');
    }
  };

  const fetchTrashedStudents = async () => {
    setLoadingTrash(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      const response = await fetch(`${Allapi.backapi}/api/trash/get-trashed-students`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch trashed students');
      }

      const result = await response.json();
      if (result.success) {
        setTrashedStudents(result.data || []);
      } else {
        throw new Error(result.message || 'Failed to fetch trashed students');
      }
    } catch (error) {
      toast.error(error.message || 'Error fetching trashed students');
    } finally {
      setLoadingTrash(false);
    }
  };

  useEffect(() => {
    if (selectedClass && currentAcademicYear) {
      fetchSections();
    }
  }, [selectedClass, currentAcademicYear]);

  const fetchSections = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      const response = await fetch(
        Allapi.getSectionsByClass.url(selectedClass, currentAcademicYear),
        {
          method: Allapi.getSectionsByClass.method,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch sections');
      }

      const result = await response.json();
      if (result.success) {
        setSections(result.data || []);
      } else {
        throw new Error(result.message || 'Failed to fetch sections');
      }
    } catch (error) {
      toast.error(error.message || 'Error fetching sections');
    }
  };

  useEffect(() => {
    if (selectedSection) {
      fetchStudents();
    }
  }, [selectedSection]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      const response = await fetch(
        Allapi.getStudentsBySection.url(selectedSection),
        {
          method: Allapi.getStudentsBySection.method,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      const result = await response.json();
      if (result.success) {
        setStudents(result.data || []);
      } else {
        throw new Error(result.message || 'Failed to fetch students');
      }
    } catch (error) {
      toast.error(error.message || 'Error fetching students');
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (e) => {
    const selectedClassName = e.target.value;
    setSelectedClass(selectedClassName);
    setSelectedSection('');
    setStudents([]);
    setSelectedStudents([]);
    setSelectAll(false);
  };

  const handleSectionChange = (e) => {
    const sectionId = e.target.value;
    setSelectedSection(sectionId);
    setStudents([]);
    setSelectedStudents([]);
    setSelectAll(false);
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedStudents(selectAll ? [] : students.map((student) => student._id));
  };

  const handleMoveToTrash = async () => {
    if (selectedStudents.length === 0) {
      toast.warning('Please select students to move to trash');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      // Process each selected student
      for (const studentId of selectedStudents) {
        const response = await fetch(`${Allapi.backapi}/api/trash/move-to-trash/${studentId}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to move student ${studentId} to trash`);
        }
      }

      // Refresh the student list and trash list
      fetchStudents();
      fetchTrashedStudents();
      
      // Reset selection
      setSelectedStudents([]);
      setSelectAll(false);
      
      toast.success('Students moved to trash successfully');
    } catch (error) {
      toast.error(error.message || 'Error moving students to trash');
    }
  };

  const handleRestoreFromTrash = async (studentId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      const response = await fetch(`${Allapi.backapi}/api/trash/restore-student/${studentId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to restore student');
      }

      const result = await response.json();
      if (result.success) {
        // Refresh the trashed students list
        fetchTrashedStudents();
        // If the current section matches the restored student's section, refresh the students list
        if (selectedSection) {
          fetchStudents();
        }
        toast.success('Student restored successfully');
      } else {
        throw new Error(result.message || 'Failed to restore student');
      }
    } catch (error) {
      toast.error(error.message || 'Error restoring student');
    }
  };

  const handlePayFee = (student) => {
    // Navigate directly to the fee payment page using the student's MongoDB ID
    navigate(`/branch-admin/students-payfee/${student._id}`);
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      const response = await fetch(`${Allapi.backapi}/api/trash/delete-permanently/${studentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete student permanently');
      }

      const result = await response.json();
      if (result.success) {
        // Refresh the trashed students list
        fetchTrashedStudents();
        toast.success('Student deleted permanently');
      } else {
        throw new Error(result.message || 'Failed to delete student permanently');
      }
    } catch (error) {
      toast.error(error.message || 'Error deleting student permanently');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Student Management System
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class
              </label>
              <div className="relative">
                <select
                  value={selectedClass}
                  onChange={handleClassChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls.name}>
                      {cls.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section
              </label>
              <div className="relative">
                <select
                  value={selectedSection}
                  onChange={handleSectionChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                  disabled={!selectedClass}
                >
                  <option value="">Select Section</option>
                  {sections.map((section) => (
                    <option key={section._id} value={section._id}>
                      {section.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <>
              {students.length > 0 ? (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="flex justify-between items-center p-4 border-b">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleSelectAll}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        {selectAll ? (
                          <CheckSquare className="h-5 w-5 text-indigo-600" />
                        ) : (
                          <Square className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                      <span className="text-sm font-medium text-gray-700">
                        Select All
                      </span>
                    </div>
<button
                      onClick={handleMoveToTrash}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      disabled={selectedStudents.length === 0}
                    >                    
                      <Trash2 className="h-4 w-4" />
                      <span>Move to Trash</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="w-12 px-6 py-3 text-left"></th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Class
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Section
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fee Due
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {students.map((student) => (
                          <tr
                            key={student._id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => handleStudentSelect(student._id)}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                {selectedStudents.includes(student._id) ? (
                                  <CheckSquare className="h-5 w-5 text-indigo-600" />
                                ) : (
                                  <Square className="h-5 w-5 text-gray-400" />
                                )}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {student.idNo}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {student.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {student.class?.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {student.section?.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹{calculateFeeDue(student).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handlePayFee(student)}
                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                              >
                                Pay Fee
                              </button>
                              <button
                                onClick={() => handleMoveToTrash([student._id])}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : selectedSection ? (
                <div className="text-center py-8 text-gray-500">
                  No students found in this section
                </div>
              ) : null}
            </>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowTrash(!showTrash)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>{showTrash ? 'Hide Trash' : 'View Trash'}</span>
            </button>
          </div>

          {showTrash && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Trash</h2>
              {loadingTrash ? (
                <div className="flex justify-center items-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
              ) : trashedStudents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No students in trash
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Class
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Section
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fee Due
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Deleted On
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {trashedStudents.map((student) => (
                        <tr
                          key={student._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.idNo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.class?.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.section?.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{calculateFeeDue(student).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(student.deletedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleRestoreFromTrash(student._id)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              Restore
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trash;