import React, { useContext, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ArrowLeft, Printer } from 'lucide-react';
import Allapi from '../../../common';
import { mycon } from '../../../store/Mycontext';

const CreateHallTicket = () => {
  const { branchdet } = useContext(mycon);
  const [acid, setAcid] = useState('');
  const [currentAcademicYear, setCurrentAcademicYear] = useState('');
  const [examId, setExamId] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showHallTickets, setShowHallTickets] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState({});

  useEffect(() => {
    if (branchdet?._id) {
      fetchAcademicYear();
    }
  }, [branchdet]);

  useEffect(() => {
    if (acid) {
      fetchClasses();
    }
  }, [acid]);

  const fetchAcademicYear = async () => {
    try {
      const response = await fetch(Allapi.getAcademicYears.url(branchdet._id), {
        method: Allapi.getAcademicYears.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const res = await response.json();
      if (res.success && res.data.length > 0) {
        const latestYear = res.data.sort((a, b) => {
          const [startA] = a.year.split("-").map(Number);
          const [startB] = b.year.split("-").map(Number);
          return startB - startA;
        })[0];

        setAcid(latestYear._id);
        setCurrentAcademicYear(latestYear.year);
      }
    } catch (error) {
      toast.error("Failed to fetch academic year");
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch(Allapi.getClasses.url(acid), {
        method: Allapi.getClasses.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setClasses(result.data);
      }
    } catch (error) {
      toast.error("Failed to fetch classes");
    }
  };

  const fetchStudentDetails = async (studentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(Allapi.getstudentbyId.url(studentId), {
        method: Allapi.getstudentbyId.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setStudentDetails(prev => ({
          ...prev,
          [studentId]: result.data
        }));
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  const handleClassChange = async (classId) => {
    setSelectedClass(classId);
    setSelectedSection('');
    setExamId('');
    setStudents([]);
    setSelectedStudents([]);
    setShowHallTickets(false);
    setSelectedStudent(null);

    if (!classId) return;

    try {
      const selectedClass = classes.find(cls => cls._id === classId);
      if (!selectedClass) return;

      const response = await fetch(Allapi.getSectionsByClass.url(selectedClass.name, acid), {
        method: Allapi.getSectionsByClass.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setSections(result.data);
      }
    } catch (error) {
      toast.error("Failed to fetch sections");
    }
  };

  const handleSectionChange = async (sectionId) => {
    setSelectedSection(sectionId);
    setExamId('');
    setStudents([]);
    setSelectedStudents([]);
    setShowHallTickets(false);
    setSelectedStudent(null);

    if (!sectionId || !selectedClass) return;

    try {
      const response = await fetch(
        Allapi.getAllExams.url(selectedClass, sectionId, branchdet._id),
        {
          method: Allapi.getAllExams.method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const result = await response.json();
      if (result.success) {
        setExams(result.data);
      }
    } catch (error) {
      toast.error("Failed to fetch exams");
    }
  };

  const handleExamChange = async (selectedExamId) => {
    setExamId(selectedExamId);
    setSelectedStudents([]);
    setShowHallTickets(false);
    setSelectedStudent(null);

    if (!selectedExamId || !selectedClass || !selectedSection) return;

    try {
      const response = await fetch(
        Allapi.getStudentsBySection.url(selectedSection),
        {
          method: Allapi.getStudentsBySection.method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ classId: selectedClass })
        }
      );

      const result = await response.json();
      if (result.success) {
        const sortedStudents = result.data.sort((a, b) => a.name.localeCompare(b.name));
        setStudents(sortedStudents);
        sortedStudents.forEach(student => fetchStudentDetails(student._id));
      }
    } catch (error) {
      toast.error("Failed to fetch students");
    }
  };

  const handleStudentSelection = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      }
      return [...prev, studentId];
    });
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(student => student._id));
    }
  };

  const handleViewHallTicket = async (student) => {
    await fetchStudentDetails(student._id);
    setSelectedStudent(student);
    setShowHallTickets(true);
  };

  const calculateTotalDue = (feeDetails) => {
    if (!feeDetails) return 0;
    return feeDetails.reduce((total, fee) => {
      const termAmount = fee.amount / fee.terms;
      const paidAmount = fee.paidAmount || 0;
      return total + (fee.amount - paidAmount);
    }, 0);
  };

  const HallTicket = ({ student }) => {
    const selectedExam = exams.find(e => e._id === examId);
    const className = classes.find(c => c._id === selectedClass)?.name;
    const sectionName = sections.find(s => s._id === selectedSection)?.name;
    const details = studentDetails[student._id] || {};
    const totalDue = calculateTotalDue(details.feeDetails);
    
    return (
      <div className="hall-ticket bg-white border border-gray-300 mx-auto overflow-hidden relative">
        <div className="text-center border-b py-4">
          <h1 className="text-xl font-bold text-red-600 leading-tight">SRI VIDYANIDHI EM SCHOOL</h1>
          <h2 className="text-base text-green-600 leading-tight">PEDDAPURAM</h2>
          <div className="text-lg font-bold text-gray-800 leading-tight mt-2">{selectedExam?.examName} - Hall Ticket</div>
        </div>
    
        <div className="px-6 py-4">
          <div className="flex items-start gap-4">
            <img
              src={details.photo || "/placeholder.jpg"}
              alt={student.name}
              className="w-24 h-24 rounded object-cover border border-gray-300"
            />
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full text-sm">
              <p className="text-gray-700">
                <span className="font-semibold">Name:</span> {student.name}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Class:</span> {className}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Section:</span> {sectionName}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Father:</span> {details.fatherName || "N/A"}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Academic Year:</span> {currentAcademicYear}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Fee Due:</span> ₹{totalDue}
              </p>
            </div>
          </div>
        </div>
  
        <div className="px-6">
          <table className="w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 py-2 px-4 text-left">Subjects</th>
                <th className="border border-gray-300 py-2 px-4 text-left">Date</th>
                <th className="border border-gray-300 py-2 px-4 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {selectedExam?.subjects.map((subject) => (
                <tr key={subject._id}>
                  <td className="border border-gray-300 py-2 px-4">{subject.name}</td>
                  <td className="border border-gray-300 py-2 px-4">
                    {new Date(subject.date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="border border-gray-300 py-2 px-4">{subject.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
  
          <div className="absolute bottom-4 left-0 right-0 px-6">
            <div className="flex justify-between items-center">
              <div className="text-left">
                <div className="border-t border-gray-400 mt-2 pt-1 w-32">
                  <p className="text-sm font-medium text-center">Teacher's Sign</p>
                </div>
              </div>
              <div className="text-right">
                <div className="border-t border-gray-400 mt-2 pt-1 w-32">
                  <p className="text-sm font-medium text-center">Head Mistress</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderHallTicketPairs = () => {
    const studentPairs = [];
    const studentsToRender = selectedStudent 
      ? [selectedStudent] 
      : students.filter(s => selectedStudents.includes(s._id));
  
    for (let i = 0; i < studentsToRender.length; i += 2) {
      studentPairs.push(studentsToRender.slice(i, i + 2));
    }
  
    return studentPairs.map((pair, index) => (
      <div key={index} className="print-page">
        <HallTicket student={pair[0]} />
        {pair[1] && <HallTicket student={pair[1]} />}
      </div>
    ));
  };

  return (
    <>
      {/* Main content - hidden during print */}
      <div className="min-h-screen px-4 py-8 bg-gray-100 print:hidden">
        <div className="max-w-7xl mx-auto">
          {!showHallTickets ? (
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Generate Hall Tickets</h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                  <input
                    type="text"
                    value={currentAcademicYear}
                    disabled
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => handleClassChange(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>{cls.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                  <select
                    value={selectedSection}
                    onChange={(e) => handleSectionChange(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500"
                    disabled={!selectedClass}
                  >
                    <option value="">Select Section</option>
                    {sections.map((section) => (
                      <option key={section._id} value={section._id}>{section.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exam</label>
                  <select
                    value={examId}
                    onChange={(e) => handleExamChange(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500"
                    disabled={!selectedSection}
                  >
                    <option value="">Select Exam</option>
                    {exams.map((exam) => (
                      <option key={exam._id} value={exam._id}>{exam.examName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {students.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedStudents.length === students.length}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="font-medium text-gray-700">Select All Students</span>
                    </div>
                    {selectedStudents.length > 0 && (
                      <button
                        onClick={() => setShowHallTickets(true)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Printer className="w-5 h-5 mr-2" />
                        Print Selected ({selectedStudents.length})
                      </button>
                    )}
                  </div>
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="w-16 p-4 text-left">Select</th>
                        <th className="w-16 p-4 text-left">S.No</th>
                        <th className="p-4 text-left font-medium text-gray-700">Name</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, index) => (
                        <tr key={student._id} className="border-t hover:bg-gray-50">
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selectedStudents.includes(student._id)}
                              onChange={() => handleStudentSelection(student._id)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                          </td>
                          <td className="p-4">{index + 1}</td>
                          <td className="p-4 font-medium text-gray-700">{student.name}</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleViewHallTicket(student)}
                              className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              View Hall Ticket
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="print:hidden">
              <button
                onClick={() => {
                  setShowHallTickets(false);
                  setSelectedStudent(null);
                }}
                className="mb-6 flex items-center text-blue-600 hover:text-blue-700"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to List
              </button>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Printer className="w-5 h-5 mr-2" />
                  Print Hall Ticket{selectedStudent ? '' : 's'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Print-only content */}
      {showHallTickets && (
        <div className="hidden print:block print:bg-white" id="print-section">
          {renderHallTicketPairs()}
        </div>
      )}

      {/* Toast notifications - hidden during print */}
      <div className="print:hidden">
        <ToastContainer />
      </div>

      <style jsx global>{`
        @media print {
          /* Basic page setup */
          @page {
            size: A4 portrait;
            margin: 0;
          }
          
          /* Hide everything except the hall tickets */
          body * {
            visibility: hidden;
          }
          
          /* Only show the print section and its contents */
          #print-section, 
          #print-section * {
            visibility: visible !important;
          }
          
          /* Full page layout */
          #print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            background: white !important;
          }
          
          /* Hall ticket page layout */
          .print-page {
            width: 210mm;
            min-height: 297mm;
            padding: 10mm;
            margin: 0 auto;
            display: flex !important;
            flex-direction: column;
            gap: 10mm;
            page-break-after: always;
            box-sizing: border-box;
          }

          /* Individual hall ticket */
          .hall-ticket {
            width: 190mm;
            height: 138mm;
            margin: 0 auto;
            display: block !important;
            border: 1px solid black !important;
            background-color: white !important;
          }

          /* Ensure colors print correctly */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          /* Make borders visible */
          .border, table, th, td {
            border-color: #000 !important;
          }
        }
      `}</style>
    </>
  );
};

export default CreateHallTicket;