import React, { useState, useEffect, useContext, Fragment } from 'react';
import { toast } from 'react-toastify';
import { Trash2, RefreshCw, ChevronDown, CheckSquare, Square, Eye, CreditCard } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import Allapi from '../../../common';
import { mycon } from '../../../store/Mycontext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Trash = () => {
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
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [processingPayment, setProcessingPayment] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate

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

  const handleMoveToTrash = () => {
    if (selectedStudents.length === 0) {
      toast.warning('Please select students to move to trash');
      return;
    }

    const trashedStuds = students.filter((student) =>
      selectedStudents.includes(student._id)
    );
    setTrashedStudents((prev) => [...prev, ...trashedStuds]);
    setStudents((prev) =>
      prev.filter((student) => !selectedStudents.includes(student._id))
    );
    setSelectedStudents([]);
    setSelectAll(false);
    toast.success('Students moved to trash successfully');
  };

  const handleRestoreFromTrash = (studentId) => {
    const studentToRestore = trashedStudents.find((s) => s._id === studentId);
    if (studentToRestore) {
      setTrashedStudents((prev) =>
        prev.filter((student) => student._id !== studentId)
      );
      setStudents((prev) => [...prev, studentToRestore]);
      toast.success('Student restored successfully');
    }
  };

  const handleOpenPaymentModal = (student) => {
    setSelectedStudent(student);
    setPaymentAmount('');
    setPaymentMethod('cash');
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSubmit = async () => {
    if (!paymentAmount || isNaN(paymentAmount) || parseFloat(paymentAmount) <= 0) {
      toast.error('Please enter a valid payment amount');
      return;
    }

    if (!selectedStudent) {
      toast.error('No student selected for payment');
      return;
    }

    setProcessingPayment(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      // Calculate fee ledger
      const feeLedger = [];
      let remainingAmount = parseFloat(paymentAmount);
      const totalDue = calculateFeeDue(selectedStudent);

      if (totalDue <= 0) {
        toast.error("This student has no outstanding fees.");
        setProcessingPayment(false);
        return;
      }

      for (const fee of selectedStudent.feeDetails) {
        const finalAmount = fee.finalAmount || fee.amount || 0;
        const paidAmount = fee.paidFee || 0;
        let dueAmount = finalAmount - paidAmount;

        if (dueAmount > 0 && remainingAmount > 0) {
          let amountToPay = Math.min(remainingAmount, dueAmount);
          feeLedger.push({
            name: fee.name,
            amount: amountToPay
          });
          remainingAmount -= amountToPay;
        }
        if (remainingAmount <= 0) break;
      }

      const paymentData = {
        studentId: selectedStudent._id,
        amount: parseFloat(paymentAmount),
        paymentMethod: paymentMethod,
        academicYearId: currentAcademicYear,
        date: new Date().toISOString(),
        feeLedger: feeLedger,
        terms: "Term-1"  //  Make sure this is dynamic!
      };

      const response = await fetch(Allapi.addReciepts.url, {
        method: Allapi.addReciepts.method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process payment');
      }

      const result = await response.json();

      if (result.success) {
        // --- Navigate directly, NO toast here ---
        navigate(`/branch-admin/fee-reciepts/${currentAcademicYear}?studentID=${selectedStudent.idNo}`);
      } else {
        throw new Error(result.message || 'Failed to process payment');
      }
    } catch (error) {
      toast.error(error.message || 'Error processing payment');
    } finally {
      setProcessingPayment(false);
      setIsPaymentModalOpen(false); // Close the modal *after* processing (success or failure)
    }
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      const response = await fetch(Allapi.deletestudentbyId.url(studentId), {
        method: Allapi.deletestudentbyId.method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete student');
      }

      const result = await response.json();
      if (result.success) {
        setTrashedStudents((prev) =>
          prev.filter((student) => student._id !== studentId)
        );
        toast.success('Student deleted permanently');
      } else {
        throw new Error(result.message || 'Failed to delete student');
      }
    } catch (error) {
      toast.error(error.message || 'Error deleting student');
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
                                onClick={() => handleOpenPaymentModal(student)}
                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                              >
                                Pay Fee
                              </button>
                              <button
                                onClick={() => handleMoveToTrash(student._id)}
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
              {trashedStudents.length === 0 ? (
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

      {/* Payment Modal */}
      <Transition appear show={isPaymentModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsPaymentModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    Process Payment for {selectedStudent?.name}
                  </Dialog.Title>

                  {selectedStudent && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Current Fee Due: ₹{calculateFeeDue(selectedStudent).toLocaleString()}
                      </p>
                    </div>
                  )}

                  <div className="mt-4">
                    <div className="mb-4">
                      <label
                        htmlFor="amount"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Payment Amount (₹)
                      </label>
                      <input
                        type="number"
                        id="amount"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter amount"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="paymentMethod"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Payment Method
                      </label>
                      <select
                        id="paymentMethod"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="cash">Cash</option>
                        <option value="bank">Bank Transfer</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handlePaymentSubmit}
                      disabled={processingPayment}
                    >
                      {processingPayment ? (
                        <span className="flex items-center">
                          <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                          Processing...
                        </span>
                      ) : (
                        'Process Payment'
                      )}
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                      onClick={() => setIsPaymentModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Trash;
