import React, { useContext, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Printer } from 'lucide-react';
import Allapi from '../../../common';
import { mycon } from '../../../store/Mycontext';

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

const ViewMarks = () => {
  const { branchdet } = useContext(mycon);
  const [acid, setAcid] = useState('');
  const [currentAcademicYear, setCurrentAcademicYear] = useState('');
  const [examId, setExamId] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [marksData, setMarksData] = useState(null);

  // Fetch current academic year
  useEffect(() => {
    if (branchdet?._id) {
      const fetchAcademicYear = async () => {
        try {
          const response = await fetch(Allapi.getAcademicYears.url(branchdet._id), {
            method: Allapi.getAcademicYears.method,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          const res = await response.json();
          console.log("response data", res.data);
          console.log("branchdet?id", branchdet._id);
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
      fetchAcademicYear();
    }
  }, [branchdet]);

  // Fetch classes when academic year is set
  useEffect(() => {
    if (acid) {
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
      fetchClasses();
    }
  }, [acid]);

  const handleClassChange = async (classId) => {
    setSelectedClass(classId);
    setSelectedSection('');
    setExamId('');
    setMarksData(null);

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
    setMarksData(null);

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

  const fetchMarksData = async () => {
    if (!examId || !selectedClass || !selectedSection) {
      toast.error("Please select all required fields");
      return;
    }

    try {
      const response = await fetch(
        Allapi.getMarksReport.url(examId, selectedClass, selectedSection, branchdet._id),
        {
          method: Allapi.getMarksReport.method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const result = await response.json();
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
      } else {
        toast.error(result.message || "Failed to fetch marks data");
      }
    } catch (error) {
      toast.error("Error fetching marks data");
    }
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

  return (
    <>
      <style>{printStyles}</style>
      <div className="min-h-screen px-4 py-8 bg-slate-100 print:bg-white print:p-0">
        <div className="max-w-6xl p-8 mx-auto bg-white rounded-xl shadow-xl print:shadow-none print:max-w-none">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-blue-700 print:text-black">Marks View with Ranks</h2>
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
            <p className="text-md">Academic Year: {currentAcademicYear}</p>
          </div>

          {/* Filters Section */}
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4 no-print">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-800">Academic Year</label>
              <input
                type="text"
                value={currentAcademicYear}
                disabled
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-700"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-800">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>{cls.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-800">Section</label>
              <select
                value={selectedSection}
                onChange={(e) => handleSectionChange(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={!selectedClass}
              >
                <option value="">Select Section</option>
                {sections.map((section) => (
                  <option key={section._id} value={section._id}>{section.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-800">Exam</label>
              <select
                value={examId}
                onChange={(e) => setExamId(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={!selectedSection}
              >
                <option value="">Select Exam</option>
                {exams.map((exam) => (
                  <option key={exam._id} value={exam._id}>{exam.examName}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-8 text-center no-print">
            <button
              onClick={fetchMarksData}
              disabled={!examId || !selectedClass || !selectedSection}
              className={`px-8 py-3 text-white rounded-lg font-medium transition-colors duration-200 ${!examId || !selectedClass || !selectedSection
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                }`}
            >
              View Results
            </button>
          </div>

          {/* Results Display */}
          {marksData && (
            <div className="space-y-8 print:space-y-4">
              {/* Exam Details */}
              <div className="p-6 bg-blue-50 rounded-xl border border-blue-200 shadow-sm print:bg-white print:shadow-none print:border print:border-gray-300 print:p-4 print-break-inside-avoid">
                <h3 className="mb-4 text-xl font-semibold text-blue-800 print:text-black">Exam Details</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Exam Name:</p>
                    <p className="text-lg font-semibold text-gray-900">{marksData.examName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Class:</p>
                    <p className="text-lg font-semibold text-gray-900">{marksData.className}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Section:</p>
                    <p className="text-lg font-semibold text-gray-900">{marksData.sectionName}</p>
                  </div>
                </div>
              </div>

              {/* Pass Students */}
              {marksData.passStudents?.length > 0 && (
                <div className="print-break-inside-avoid">
                  <h3 className="mb-4 text-xl font-semibold text-green-700 print:text-black">
                    Pass Students ({marksData.passStudents.length})
                  </h3>
                  <div className="overflow-x-auto print:overflow-visible">
                    <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden print:shadow-none">
                      <thead className="bg-green-50 print:bg-gray-100">
                        <tr>
                          <th className="p-4 text-left font-semibold text-green-900 border-b border-green-200 print:text-black print:border-gray-300">Rank</th>
                          <th className="p-4 text-left font-semibold text-green-900 border-b border-green-200 print:text-black print:border-gray-300">Name</th>
                          {marksData.passStudents[0]?.subjects.map((subject) => (
                            <th key={subject.name} className="p-4 text-left font-semibold text-green-900 border-b border-green-200 print:text-black print:border-gray-300">
                              {subject.name}
                            </th>
                          ))}
                          <th className="p-4 text-left font-semibold text-green-900 border-b border-green-200 print:text-black print:border-gray-300">Total</th>
                          <th className="p-4 text-left font-semibold text-green-900 border-b border-green-200 print:text-black print:border-gray-300">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {marksData.passStudents.map((student, index) => {
                          const rank = index + 1;
                          const rankSuffix = getRankSuffix(rank);

                          return (
                            <tr key={student.id} className={`hover:bg-green-50 ${index < 3 ? 'bg-green-50' : ''} print:hover:bg-white print:bg-white`}>
                              <td className="p-4 border-b border-green-100 print:border-gray-300">
                                <span className={`font-bold ${index < 3 ? 'text-green-700' : ''} print:text-black`}>
                                  {rank}{rankSuffix}
                                </span>
                              </td>
                              <td className="p-4 border-b border-green-100 print:border-gray-300 font-medium">
                                {student.name}
                                {index < 3 && (
                                  <span className="ml-2 text-xs font-bold text-green-700 print:text-black">
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                  </span>
                                )}
                              </td>
                              {student.subjects.map((subject) => (
                                <td key={subject.name} className="p-4 border-b border-green-100 print:border-gray-300">
                                  {subject.marks}
                                </td>
                              ))}
                              <td className="p-4 border-b border-green-100 print:border-gray-300 font-semibold">
                                {student.total}
                              </td>
                              <td className="p-4 border-b border-green-100 print:border-gray-300 font-semibold text-green-700 print:text-black">
                                {student.percentage}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Failed Students */}
              {marksData.failStudents?.length > 0 && (
                <div className="print-break-inside-avoid">
                  <h3 className="mb-4 text-xl font-semibold text-red-700 print:text-black">
                    Failed Students ({marksData.failStudents.length})
                  </h3>
                  <div className="overflow-x-auto print:overflow-visible">
                    <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden print:shadow-none">
                      <thead className="bg-red-50 print:bg-gray-100">
                        <tr>
                          <th className="p-4 text-left font-semibold text-red-900 border-b border-red-200 print:text-black print:border-gray-300">Name</th>
                          {marksData.failStudents[0]?.subjects.map((subject) => (
                            <th key={subject.name} className="p-4 text-left font-semibold text-red-900 border-b border-red-200 print:text-black print:border-gray-300">
                              {subject.name}
                            </th>
                          ))}
                          <th className="p-4 text-left font-semibold text-red-900 border-b border-red-200 print:text-black print:border-gray-300">Total</th>
                          <th className="p-4 text-left font-semibold text-red-900 border-b border-red-200 print:text-black print:border-gray-300">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {marksData.failStudents.map((student) => (
                          <tr key={student.id} className="hover:bg-red-50 print:hover:bg-white">
                            <td className="p-4 border-b border-red-100 print:border-gray-300 text-black font-medium">{student.name}</td>
                            {student.subjects.map((subject) => (
                              <td key={subject.name} className="p-4 border-b border-red-100 print:border-gray-300">
                                <span className={subject.marks < subject.passMarks ? 'text-red-600 font-bold print:text-black' : 'text-black'}>
                                  {subject.marks}
                                </span>
                              </td>
                            ))}
                            <td className="p-4 border-b border-red-100 print:border-gray-300 text-black font-semibold">{student.total}</td>
                            <td className="p-4 border-b border-red-100 print:border-gray-300 font-semibold text-red-700 print:text-black">{student.percentage}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Subject-wise Report */}
              {marksData.subjectReport?.length > 0 && (
                <div className="print-break-inside-avoid">
                  <h3 className="mb-4 text-xl font-semibold text-gray-800">Subject-wise Report</h3>
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

          <ToastContainer />
        </div>
      </div>
    </>
  );
};

export default ViewMarks;