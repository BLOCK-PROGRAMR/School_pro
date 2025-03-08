



import React, { useContext, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Allapi from '../../../common/index';
import { mycon } from '../../../store/Mycontext';

const UpdateMarks = () => {
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
  const [marksData, setMarksData] = useState({});
  const [marksIds, setMarksIds] = useState({});
  const [selectedExam, setSelectedExam] = useState(null);

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
    setMarksData({});
    setSelectedExam(null);

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
    setMarksData({});
    setSelectedExam(null);

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

  const fetchExistingMarks = async (examId) => {
    try {
      // First, get the exam details
      const examResponse = await fetch(Allapi.getExamById.url(examId, branchdet._id), {
        method: Allapi.getExamById.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const examResult = await examResponse.json();
      if (!examResult.success) {
        toast.error("Failed to fetch exam details");
        return;
      }

      setSelectedExam(examResult.data);

      // Then fetch marks report
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
        const allStudents = [...result.data.passStudents, ...result.data.failStudents];
        setStudents(allStudents);

        // Fetch individual marks for each student
        const marksPromises = allStudents.map(student =>
          fetch(Allapi.getMarksByStudent.url(student.id, branchdet._id), {
            method: Allapi.getMarksByStudent.method,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }).then(res => res.json())
        );

        const marksResults = await Promise.all(marksPromises);

        const marksObj = {};
        const marksIdMap = {};

        allStudents.forEach((student, index) => {
          const studentMarksResult = marksResults[index];
          if (studentMarksResult.success && Array.isArray(studentMarksResult.data)) {
            const studentMarks = studentMarksResult.data.find(
              mark => mark.examId._id === examId
            );

            if (studentMarks) {
              marksIdMap[student.id] = studentMarks._id;
              marksObj[student.id] = {};

              studentMarks.subjectMarks.forEach(mark => {
                const subject = examResult.data.subjects.find(s => s._id === mark.subjectId);
                if (subject) {
                  marksObj[student.id][subject.name] = mark.marksObtained.toString();
                }
              });
            }
          }
        });

        setMarksData(marksObj);
        setMarksIds(marksIdMap);
      } else {
        toast.info("No marks found for the selected criteria");
        setStudents([]);
        setMarksData({});
        setMarksIds({});
      }
    } catch (error) {
      console.error("Error fetching existing marks:", error);
      toast.error("Failed to fetch marks");
    }
  };

  const handleExamChange = (e) => {
    const examId = e.target.value;
    setExamId(examId);
    if (examId) {
      fetchExistingMarks(examId);
    } else {
      setSelectedExam(null);
      setMarksData({});
      setStudents([]);
    }
  };

  const handleMarksChange = (studentId, subject, value) => {
    if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= subject.marks)) {
      setMarksData(prev => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [subject.name]: value
        }
      }));
    }
  };

  const validateMarks = () => {
    let isValid = true;
    let hasChanges = false;

    Object.entries(marksData).forEach(([studentId, subjects]) => {
      Object.entries(subjects).forEach(([subjectName, mark]) => {
        if (mark !== '') {
          const subject = selectedExam.subjects.find(s => s.name === subjectName);
          const markValue = parseFloat(mark);
          if (isNaN(markValue) || markValue < 0 || markValue > subject.marks) {
            isValid = false;
          }

          // Check if mark has changed
          const student = students.find(s => s.id === studentId);
          const originalMark = student?.subjects.find(s => s.name === subjectName)?.marks.toString();
          if (mark !== originalMark) {
            hasChanges = true;
          }
        }
      });
    });

    if (!hasChanges) {
      toast.info("No changes detected");
      return false;
    }

    if (!isValid) {
      toast.error("Please ensure all entered marks are valid");
      return false;
    }

    return true;
  };

  const handleUpdate = async () => {
    if (!validateMarks()) return;

    try {
      const updatePromises = Object.entries(marksData).map(async ([studentId, subjects]) => {
        const marksId = marksIds[studentId];
        if (!marksId) return { studentId, status: 'error', message: 'Marks record not found' };

        const subjectMarks = Object.entries(subjects).map(([subjectName, mark]) => ({
          subjectId: selectedExam.subjects.find(s => s.name === subjectName)._id,
          marksObtained: parseFloat(mark)
        }));

        const submission = {
          branchId: branchdet._id,
          studentId,
          examId: selectedExam._id,
          academicId: acid,
          classId: selectedClass,
          sectionId: selectedSection,
          subjectMarks
        };

        try {
          const response = await fetch(Allapi.updateMarks.url(marksId, branchdet._id), {
            method: Allapi.updateMarks.method,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(submission)
          });

          const result = await response.json();
          return {
            studentId,
            status: result.success ? 'success' : 'error',
            message: result.message
          };
        } catch (error) {
          return { studentId, status: 'error', message: error.message };
        }
      });

      const results = await Promise.all(updatePromises);
      const successful = results.filter(r => r.status === 'success').length;
      const errors = results.filter(r => r.status === 'error').length;

      if (successful > 0) {
        toast.success(`Successfully updated marks for ${successful} students`);
        await fetchExistingMarks(selectedExam._id);
      }

      if (errors > 0) {
        toast.error(`Failed to update marks for ${errors} students`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100">
      <div className="p-8 mx-auto bg-white rounded-lg shadow-lg max-w-7xl">
        <h2 className="mb-6 text-3xl font-bold text-gray-800">Update Student Marks</h2>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Academic Year
          </label>
          <input
            type="text"
            value={currentAcademicYear}
            disabled
            className="w-full p-3 text-gray-700 border rounded bg-gray-50"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => handleClassChange(e.target.value)}
              className="w-full p-3 text-gray-700 bg-white border rounded"
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {selectedClass && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Section
              </label>
              <select
                value={selectedSection}
                onChange={(e) => handleSectionChange(e.target.value)}
                className="w-full p-3 text-gray-700 bg-white border rounded"
              >
                <option value="">Select Section</option>
                {sections.map((section) => (
                  <option key={section._id} value={section._id}>
                    {section.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedSection && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Exam
              </label>
              <select
                value={examId}
                onChange={handleExamChange}
                className="w-full p-3 text-gray-700 bg-white border rounded"
              >
                <option value="">Select Exam</option>
                {exams.map((exam) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.examName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {selectedExam && students.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full bg-white border border-collapse border-gray-300">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="p-4 font-semibold text-left text-gray-700 border-r border-gray-300">
                    Student Name
                  </th>
                  {selectedExam.subjects.map(subject => (
                    <th key={subject._id} className="p-4 font-semibold text-left text-gray-700 border-r border-gray-300">
                      <div>{subject.name}</div>
                      <div className="text-xs text-gray-500">
                        Max: {subject.marks} | Pass: {subject.passMarks}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-gray-300">
                    <td className="p-4 font-medium text-gray-700 border-r border-gray-300">
                      {student.name}
                    </td>
                    {selectedExam.subjects.map(subject => (
                      <td key={`${student.id}-${subject._id}`} className="p-4 border-r border-gray-300">
                        <input
                          type="number"
                          value={marksData[student.id]?.[subject.name] || ''}
                          onChange={(e) => handleMarksChange(student.id, subject, e.target.value)}
                          min="0"
                          max={subject.marks}
                          className="w-full text-center text-gray-700 bg-transparent border-none focus:outline-none"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={handleUpdate}
              className="w-full px-6 py-3 mt-6 text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
            >
              Update Marks
            </button>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default UpdateMarks;