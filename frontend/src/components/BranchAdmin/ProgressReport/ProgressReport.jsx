
import React, { useState, useEffect, useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Printer } from 'lucide-react';
import Allapi from '../../../common';
import { mycon } from '../../../store/Mycontext';

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
  }
`;

const ProgressReport = () => {
  const { branchdet } = useContext(mycon);
  const [acid, setAcid] = useState('');
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedExams, setSelectedExams] = useState([]);
  const [availableExams, setAvailableExams] = useState([]);
  const [examDates, setExamDates] = useState({});
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [examResults, setExamResults] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);

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

  const handleClassChange = async (classId) => {
    setSelectedClass(classId);
    setSelectedSection('');
    setSelectedStudent(null);
    setSelectedExams([]);
    setAvailableExams([]);
    setExamDates({});

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
    setSelectedExams([]);
    setSelectedStudent(null);
    setExamDates({});

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
        const exams = result.data;
        setAvailableExams(exams);
        
        // Fetch exam dates for each exam
        const dates = {};
        for (const exam of exams) {
          const examDetailsResponse = await fetch(
            Allapi.getExamById.url(exam._id, branchdet._id),
            {
              method: Allapi.getExamById.method,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const examDetails = await examDetailsResponse.json();
          if (examDetails.success) {
            dates[exam._id] = examDetails.data.subjects.map(subject => ({
              name: subject.name,
              date: new Date(subject.date).toLocaleDateString(),
              time: subject.time
            }));
          }
        }
        setExamDates(dates);
      }
    } catch (error) {
      toast.error("Failed to fetch exams");
    }
  };

  const fetchStudents = async () => {
    if (!selectedSection || selectedExams.length === 0) return;
    try {
      setLoading(true);
      const response = await fetch(
        Allapi.getStudentsBySection.url(selectedSection),
        {
          method: Allapi.getStudentsBySection.method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const result = await response.json();
      if (result.success) {
        setStudents(result.data.sort((a, b) => a.name.localeCompare(b.name)));
      }
    } catch (error) {
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceData = async (studentId) => {
    try {
      const monthlyData = [];
      
      // Get working days data
      const workingDaysResponse = await fetch(
        Allapi.getWorkingDays.url(branchdet._id, acid),
        {
          method: Allapi.getWorkingDays.method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      const workingDaysData = await workingDaysResponse.json();
      console.log("working days response:", workingDaysData);
      
      // Extract months data from the response
      const monthsData = workingDaysData.success ? workingDaysData.data?.months : {};
      
      // Define all months in order (June to April for academic year)
      const academicMonths = [
        'june', 'july', 'august', 'september', 'october',
        'november', 'december', 'january', 'february', 'march', 'april'
      ];

      // Process each month
      for (const monthName of academicMonths) {
        const monthIndex = new Date(`2024 ${monthName} 1`).getMonth() +1;
        const workingDays = monthsData[monthName] || 0;
        
        try {
          const attendanceResponse = await fetch(
            `${Allapi.getMonthlyAbsents.url}/${branchdet._id}/${acid}/${selectedClass}/${selectedSection}/${monthIndex}`,
            {
              method: Allapi.getMonthlyAbsents.method,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          
          if (attendanceResponse.ok) {
            const data = await attendanceResponse.json();
            const studentAttendance = data.success && data.data 
              ? data.data.find(item => item.studentId === studentId)
              : null;

            const absentCount = studentAttendance?.absentCount || 0;
            const daysPresent = workingDays - absentCount;
            
            monthlyData.push({
              month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
              workingDays: workingDays,
              daysPresent: daysPresent,
              absentCount: absentCount,
              percentage: workingDays > 0 
                ? ((daysPresent / workingDays) * 100).toFixed(1) 
                : '0.0'
            });
          }
        } catch (error) {
          console.error(`Error fetching attendance for ${monthName}:`, error);
          // Add the month with default values if there's an error
          monthlyData.push({
            month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
            workingDays: workingDays,
            daysPresent: 0,
            absentCount: 0,
            percentage: '0.0'
          });
        }
      }
      
      setAttendanceData(monthlyData);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      toast.error('Failed to fetch attendance data');
    }
  };

  const fetchExamResults = async (studentId) => {
    try {
      setLoading(true);
      const promises = selectedExams.map(async (exam) => {
        const examDetailsResponse = await fetch(
          Allapi.getExamById.url(exam._id, branchdet._id),
          {
            method: Allapi.getExamById.method,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const examDetails = await examDetailsResponse.json();
        
        if (!examDetails.success) {
          throw new Error('Failed to fetch exam details');
        }

        const marksResponse = await fetch(
          Allapi.getMarksByStudent.url(studentId, branchdet._id),
          {
            method: Allapi.getMarksByStudent.method,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const marksResult = await marksResponse.json();

        if (!marksResult.success) {
          throw new Error('Failed to fetch marks');
        }

        const examMarks = marksResult.data.find(mark => mark.examId._id === exam._id);
        
        const subjectResults = examDetails.data.subjects.map(subject => {
          const subjectMark = examMarks?.subjectMarks.find(
            mark => mark.subjectId === subject._id
          );

          return {
            name: subject.name,
            marks: subjectMark ? subjectMark.marksObtained : 0,
            maxMarks: subject.marks,
            passMarks: subject.passMarks,
            date: new Date(subject.date).toLocaleDateString(),
            time: subject.time
          };
        });

        const total = subjectResults.reduce((sum, subject) => sum + subject.marks, 0);
        const maxTotal = subjectResults.reduce((sum, subject) => sum + subject.maxMarks, 0);

        return {
          examType: exam.examName,
          examDate: examDetails.data.date,
          subjects: subjectResults,
          total,
          maxTotal,
          percentage: ((total / maxTotal) * 100).toFixed(2)
        };
      });

      const results = await Promise.all(promises);
      setExamResults(results);

      // Fetch attendance data
      await fetchAttendanceData(studentId);

    } catch (error) {
      console.error('Error fetching exam results:', error);
      toast.error('Failed to fetch exam results');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentDetails = async (studentId) => {
    try {
      setLoading(true);
      const response = await fetch(
        Allapi.getstudentbyId.url(studentId),
        {
          method: Allapi.getstudentbyId.method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const result = await response.json();
      if (result.success) {
        setStudentData(result.data);
        await fetchExamResults(studentId);
      }
    } catch (error) {
      toast.error("Failed to fetch student details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSection && selectedExams.length > 0) {
      fetchStudents();
    }
  }, [selectedSection, selectedExams]);

  const handleExamSelect = (examId) => {
    const exam = availableExams.find(e => e._id === examId);
    if (exam && !selectedExams.some(e => e._id === exam._id)) {
      setSelectedExams([...selectedExams, exam]);
    }
  };

  const removeExam = (examId) => {
    setSelectedExams(selectedExams.filter(exam => exam._id !== examId));
  };

  const calculateGrade = (percentage) => {
    if (percentage >= 91) return 'A1';
    if (percentage >= 81) return 'A2';
    if (percentage >= 71) return 'B1';
    if (percentage >= 61) return 'B2';
    if (percentage >= 51) return 'C1';
    if (percentage >= 41) return 'C2';
    if (percentage >= 35) return 'D';
    return 'E';
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 text-black bg-gray-100">
      <style>{printStyles}</style>
      <ToastContainer />
      
      {!showReport ? (
        <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-md text-yellow-700">
          <h2 className="mb-6 text-2xl font-bold">Progress Report Generator</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>{cls.name}</option>
                ))}
              </select>
            </div>

            {selectedClass && (
              <div>
                <label className="block mb-2 text-sm font-medium">Section</label>
                <select
                  value={selectedSection}
                  onChange={(e) => handleSectionChange(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Section</option>
                  {sections.map((section) => (
                    <option key={section._id} value={section._id}>{section.name}</option>
                  ))}
                </select>
              </div>
            )}

            {selectedSection && (
              <div>
                <label className="block mb-2 text-sm font-medium">Exams</label>
                <select
                  onChange={(e) => handleExamSelect(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  value=""
                >
                  <option value="">Add Exam</option>
                  {availableExams
                    .filter(exam => !selectedExams.some(e => e._id === exam._id))
                    .map((exam) => (
                      <option key={exam._id} value={exam._id}>
                        {exam.examName}
                      </option>
                    ))}
                </select>
 
              </div>
            )}

            {students.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-4 text-lg font-semibold">Select Student</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Name
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {student.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => {
                                setSelectedStudent(student._id);
                                fetchStudentDetails(student._id);
                                setShowReport(true);
                              }}
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                            >
                              View Report
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div> 
        </div>
      ) : (
        <div className="max-w-5xl p-8 mx-auto bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-6 print:hidden">
            <button
              onClick={() => setShowReport(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
            >
              <Printer size={20} />
              <span>Print Report</span>
            </button>
          </div>

          {studentData && (
            <>
              <div className="mb-8 text-center">
                <h1 className="mb-4 text-3xl font-bold">Progress Report</h1>
                <div className="grid max-w-2xl grid-cols-2 gap-4 mx-auto text-left">
                  <div>
                    <p><strong>Name:</strong> {studentData.name}</p>
                    <p><strong>Class:</strong> {studentData.class?.name}</p>
                  </div>
                  <div>
                    <p><strong>Roll No:</strong> {studentData.rollNo}</p>
                    <p><strong>Section:</strong> {studentData.section?.name}</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="mb-4 text-xl font-bold">Academic Performance</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 border">Subject</th>
                        <th className="px-4 py-2 border">Date & Time</th>
                        {examResults.map(exam => (
                          <th key={exam.examType} className="px-4 py-2 border">
                            <div>{exam.examType}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {examResults[0]?.subjects.map((subject, index) => (
                        <tr key={subject.name}>
                          <td className="px-4 py-2 font-medium border">
                            {subject.name}
                          </td>
                          <td className="px-4 py-2 border">
                            {subject.date} {subject.time}
                          </td>
                          {examResults.map(result => {
                            const subjectResult = result.subjects[index];
                            const percentage = (subjectResult.marks / subjectResult.maxMarks) * 100;
                            return (
                              <td key={`${result.examType}-${subject.name}`} className="px-4 py-2 text-center border">
                                <div>{subjectResult.marks}/{subjectResult.maxMarks}</div>
                                <div className="text-sm text-gray-600">
                                  {percentage.toFixed(1)}% ({calculateGrade(percentage)})
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                      <tr className="font-semibold bg-gray-50">
                        <td colSpan={2} className="px-4 py-2 text-right border">Total</td>
                        {examResults.map(result => (
                          <td key={result.examType} className="px-4 py-2 text-center border">
                            <div>{result.total}/{result.maxTotal}</div>
                            <div className="text-sm text-gray-600">
                              {result.percentage}% ({calculateGrade(parseFloat(result.percentage))})
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {attendanceData.length > 0 && (
  <div className="mb-8">
    <h2 className="mb-4 text-xl font-bold">Attendance Record</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200">
        <tbody>
          {/* Month Row */}
          <tr className="bg-gray-50">
            <th className="px-4 py-2 font-semibold text-left border" style={{ minWidth: '120px' }}>Month</th>
            {attendanceData.map((month) => (
              <td key={month.month} className="px-4 py-2 font-medium text-center border">
                {month.month}
              </td>
            ))}
            <td className="px-4 py-2 font-semibold text-center bg-gray-100 border">Total</td>
          </tr>

          {/* Working Days Row */}
          <tr>
            <th className="px-4 py-2 font-semibold text-left border bg-gray-50">Working Days</th>
            {attendanceData.map((month) => (
              <td key={`${month.month}-working`} className="px-4 py-2 text-center border">
                {month.workingDays}
              </td>
            ))}
            <td className="px-4 py-2 font-medium text-center bg-gray-100 border">
              {attendanceData.reduce((sum, month) => sum + month.workingDays, 0)}
            </td>
          </tr>

          {/* Days Present Row */}
          <tr>
            <th className="px-4 py-2 font-semibold text-left border bg-gray-50">Days Present</th>
            {attendanceData.map((month) => (
              <td key={`${month.month}-present`} className="px-4 py-2 text-center border">
                {month.daysPresent}
              </td>
            ))}
            <td className="px-4 py-2 font-medium text-center bg-gray-100 border">
              {attendanceData.reduce((sum, month) => sum + month.daysPresent, 0)}
            </td>
          </tr>

          {/* Days Absent Row */}
          <tr>
            <th className="px-4 py-2 font-semibold text-left border bg-gray-50">Days Absent</th>
            {attendanceData.map((month) => (
              <td key={`${month.month}-absent`} className="px-4 py-2 text-center border">
                {month.absentCount}
              </td>
            ))}
            <td className="px-4 py-2 font-medium text-center bg-gray-100 border">
              {attendanceData.reduce((sum, month) => sum + month.absentCount, 0)}
            </td>
          </tr>

          {/* Percentage Row */}
          <tr>
            <th className="px-4 py-2 font-semibold text-left border bg-gray-50">Percentage</th>
            {attendanceData.map((month) => (
              <td key={`${month.month}-percentage`} className="px-4 py-2 text-center border">
                {month.percentage}%
              </td>
            ))}
            <td className="px-4 py-2 font-medium text-center bg-gray-100 border">
              {((attendanceData.reduce((sum, month) => sum + month.daysPresent, 0) / 
                attendanceData.reduce((sum, month) => sum + month.workingDays, 0)) * 100).toFixed(1)}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
)}

              <div className="mt-8 print:mt-4">
                <h3 className="mb-2 text-lg font-semibold">Grading Scale</h3>
                <table className="w-full text-sm border border-collapse border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-2 py-1 border">Grade</th>
                      <th className="px-2 py-1 border">A1</th>
                      <th className="px-2 py-1 border">A2</th>
                      <th className="px-2 py-1 border">B1</th>
                      <th className="px-2 py-1 border">B2</th>
                      <th className="px-2 py-1 border">C1</th>
                      <th className="px-2 py-1 border">C2</th>
                      <th className="px-2 py-1 border">D</th>
                      <th className="px-2 py-1 border">E</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-2 py-1 font-medium border">Marks %</td>
                      <td className="px-2 py-1 border">91-100</td>
                      <td className="px-2 py-1 border">81-90</td>
                      <td className="px-2 py-1 border">71-80</td>
                      <td className="px-2 py-1 border">61-70</td>
                      <td className="px-2 py-1 border">51-60</td>
                      <td className="px-2 py-1 border">41-50</td>
                      <td className="px-2 py-1 border">35-40</td>
                      <td className="px-2 py-1 border">Below 35</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-3 gap-8 mt-12 print:mt-8">
                <div className="text-center">
                  <div className="h-16"></div>
                  <div className="border-t border-gray-300">
                    <p className="mt-1">Class Teacher</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="h-16"></div>
                  <div className="border-t border-gray-300">
                    <p className="mt-1">Principal</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="h-16"></div>
                  <div className="border-t border-gray-300">
                    <p className="mt-1">Parent's Signature</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressReport;