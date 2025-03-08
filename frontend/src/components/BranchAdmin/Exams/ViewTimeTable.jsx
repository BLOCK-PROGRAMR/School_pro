import React, { useContext, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Trash2, Printer } from 'lucide-react';
import Allapi from '../../../common';
import { mycon } from '../../../store/Mycontext';

const ViewTimeTable = () => {
  const { branchdet } = useContext(mycon);
  const [acid, setAcid] = useState('');
  const [wholeData, setWholeData] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [sections, setSections] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);

  const curracad = async (bid) => {
    try {
      const response = await fetch(Allapi.getAcademicYears.url(bid), {
        method: Allapi.getAcademicYears.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch academic years");

      const res = await response.json();
      if (res.success && res.data.length > 0) {
        const latestAcademicYear = res.data
          .sort((a, b) => {
            const [startA, endA] = a.year.split("-").map(Number);
            const [startB, endB] = b.year.split("-").map(Number);
            return startB - startA || endB - endA;
          })[0];

        setAcid(latestAcademicYear._id);
      }
    } catch (error) {
      toast.error("Failed to fetch academic year");
    }
  };

  const fetchWholedata = async () => {
    try {
      const response = await fetch(Allapi.getClasses.url(acid), {
        method: Allapi.getClasses.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result.success) {
        setWholeData(result.data);
      } else {
        toast.error(result.message || "Failed to fetch class data");
      }
    } catch (error) {
      toast.error("Error fetching class data");
    }
  };

  const fetchSections = async (classId) => {
    try {
      const selectedClass = wholeData.find(cls => cls._id === classId);
      if (!selectedClass) {
        toast.error("Class not found");
        return;
      }

      const response = await fetch(Allapi.getSectionsByClass.url(selectedClass.name, acid), {
        method: Allapi.getSectionsByClass.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setSections(result.data);
      } else {
        toast.error("Failed to fetch sections");
      }
    } catch (error) {
      toast.error("Error fetching sections");
    }
  };

  const fetchExams = async () => {
    if (!selectedClass || !selectedSection || !branchdet?._id) return;

    setLoading(true);
    try {
      const response = await fetch(Allapi.getAllExams.url(selectedClass, selectedSection, branchdet._id), {
        method: Allapi.getAllExams.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setExams(result.data);
      } else {
        toast.error("Failed to fetch exams");
      }
    } catch (error) {
      toast.error("Error fetching exams");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = async (examId) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) return;

    try {
      const response = await fetch(Allapi.deleteExam.url(examId), {
        method: Allapi.deleteExam.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Exam deleted successfully");
        fetchExams();
        setSelectedExam('');
      } else {
        toast.error(result.message || "Failed to delete exam");
      }
    } catch (error) {
      toast.error("Error deleting exam");
    }
  };

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    const selectedExamData = exams.find(exam => exam._id === selectedExam);

    if (printWindow && selectedExamData) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${selectedExamData.examName} - Timetable</title>
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
              .exam-title {
                font-size: 24px;
                color: #4338ca;
                margin-bottom: 8px;
              }
              .exam-info {
                font-size: 14px;
                color: #666;
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
                background-color: #f8fafc;
                font-weight: bold;
              }
              tr:nth-child(even) {
                background-color: #f9fafb;
              }
              @media print {
                body {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="exam-title">${selectedExamData.examName}</div>
              <div class="exam-info">
                Class: ${selectedExamData.classId.name} | 
                Section: ${selectedExamData.sectionId.name} | 
                Academic Year: ${selectedExamData.academicId.year}
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Total Marks</th>
                  <th>Pass Marks</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                ${getSortedSubjects(selectedExamData.subjects).map(subject => `
                  <tr>
                    <td>${subject.name}</td>
                    <td>${subject.marks}</td>
                    <td>${subject.passMarks}</td>
                    <td>${new Date(subject.date).toLocaleDateString()}</td>
                    <td>${subject.time}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();

      // Wait for content to load before printing
      printWindow.onload = function () {
        printWindow.print();
        printWindow.onafterprint = function () {
          printWindow.close();
        };
      };
    }
  };


  useEffect(() => {
    if (branchdet?._id) {
      curracad(branchdet._id);
    }
  }, [branchdet]);

  useEffect(() => {
    if (acid) {
      fetchWholedata();
    }
  }, [acid]);

  useEffect(() => {
    if (selectedClass) {
      fetchSections(selectedClass);
      setSelectedSection('');
      setSelectedExam('');
      setExams([]);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedClass && selectedSection) {
      fetchExams();
      setSelectedExam('');
    }
  }, [selectedClass, selectedSection]);

  const selectedExamData = exams.find(exam => exam._id === selectedExam);

  const getSortedSubjects = (subjects) => {
    return [...subjects].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100 print:bg-white print:px-0 print:py-0">
      <div className="max-w-6xl p-8 mx-auto bg-white rounded-lg shadow-lg print:shadow-none print:p-0">
        <h2 className="mb-6 text-3xl font-bold text-indigo-700 print:text-center">View Exam TimeTable</h2>

        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3 print:hidden">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Class</option>
              {wholeData.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-500"
              disabled={!selectedClass}
            >
              <option value="">Select Section</option>
              {sections.map((section) => (
                <option key={section._id} value={section._id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Exam
            </label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-500"
              disabled={!selectedSection || exams.length === 0}
            >
              <option value="">Select Exam</option>
              {exams.map((exam) => (
                <option key={exam._id} value={exam._id}>
                  {exam.examName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-16 h-16 border-4 border-indigo-500 rounded-full animate-spin border-t-transparent"></div>
          </div>
        ) : selectedExamData ? (
          <div className="mt-6" id="printableArea">
            <div className="overflow-hidden bg-white rounded-lg shadow print:shadow-none">
              <div className="flex items-center justify-between px-6 py-4 bg-indigo-50 print:bg-white print:border-b">
                <div>
                  <h3 className="text-xl font-semibold text-indigo-700">{selectedExamData.examName}</h3>
                  <p className="text-sm text-gray-600">
                    Class: {selectedExamData.classId.name} | Section: {selectedExamData.sectionId.name} |
                    Academic Year: {selectedExamData.academicId.year}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrint}
                    className="p-2 text-indigo-500 transition-colors rounded-full hover:bg-indigo-50 print:hidden"
                    title="Print Timetable"
                  >
                    <Printer size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteExam(selectedExamData._id)}
                    className="p-2 text-red-500 transition-colors rounded-full hover:bg-red-50 print:hidden"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 print:p-0">
                <div className="overflow-x-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                  <table className="w-full text-sm text-left text-gray-500  min-w-max border-collapse border ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 print:bg-white">
                      <tr>
                        <th className="px-6 py-3 border">Subject</th>
                        <th className="px-6 py-3 border">Total Marks</th>
                        <th className="px-6 py-3 border">Pass Marks</th>
                        <th className="px-6 py-3 border">Date</th>
                        <th className="px-6 py-3 border">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getSortedSubjects(selectedExamData.subjects).map((subject, index) => (
                        <tr key={index} className="bg-white border-b hover:bg-gray-50 print:hover:bg-white">
                          <td className="px-6 py-4 font-medium text-gray-900 border">{subject.name}</td>
                          <td className="px-6 py-4 border">{subject.marks}</td>
                          <td className="px-6 py-4 border">{subject.passMarks}</td>
                          <td className="px-6 py-4 border">{new Date(subject.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 border">{subject.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500 print:hidden">
            {!selectedClass ? "Please select a class to view exam timetables" :
              !selectedSection ? "Please select a section to view exam timetables" :
                !exams.length ? "No exam timetables found for the selected class and section" :
                  "Please select an exam to view its timetable"}
          </div>
        )}

        <ToastContainer />
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            margin: 0;
            padding: 0;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewTimeTable;