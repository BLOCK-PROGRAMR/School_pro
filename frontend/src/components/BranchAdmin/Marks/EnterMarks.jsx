



import React, { useContext, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Allapi from '../../../common/index';
import { mycon } from '../../../store/Mycontext';

const EnterMarks = () => {
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

  const handleExamChange = async (e) => {
    const examId = e.target.value;
    setExamId(examId);
    setMarksData({});

    if (!examId) return;

    try {
      const response = await fetch(Allapi.getStudentsBySection.url(selectedSection), {
        method: Allapi.getStudentsBySection.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ classId: selectedClass })
      });

      const result = await response.json();
      if (result.success && result.data) {
        setStudents(result.data);

        // Initialize marks data for all students
        const initialMarks = {};
        result.data.forEach(student => {
          initialMarks[student._id] = {};
          const exam = exams.find(e => e._id === examId);
          exam.subjects.forEach(subject => {
            initialMarks[student._id][subject.name] = '';
          });
        });
        setMarksData(initialMarks);
      }
    } catch (error) {
      toast.error("Failed to fetch students");
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
    let hasAtLeastOneMark = false;

    Object.entries(marksData).forEach(([_, subjects]) => {
      Object.entries(subjects).forEach(([_, mark]) => {
        if (mark !== '') {
          hasAtLeastOneMark = true;
          const markValue = parseFloat(mark);
          if (isNaN(markValue)) {
            isValid = false;
          }
        }
      });
    });

    if (!hasAtLeastOneMark) {
      toast.error("Please enter marks for at least one student");
      return false;
    }

    if (!isValid) {
      toast.error("Please ensure all entered marks are valid");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateMarks()) return;

    try {
      const exam = exams.find(e => e._id === examId);
      const submissionPromises = Object.entries(marksData)
        .filter(([_, subjects]) => Object.values(subjects).some(mark => mark !== ''))
        .map(async ([studentId, subjects]) => {
          const submission = {
            examId,
            academicId: acid,
            classId: selectedClass,
            sectionId: selectedSection,
            studentId,
            subjectMarks: Object.entries(subjects)
              .filter(([_, mark]) => mark !== '')
              .map(([subjectName, mark]) => ({
                subjectId: exam.subjects.find(s => s.name === subjectName)?._id,
                marksObtained: parseFloat(mark)
              }))
          };

          try {
            const response = await fetch(Allapi.addMarks.url(branchdet._id), {
              method: Allapi.addMarks.method,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(submission)
            });

            const result = await response.json();
            return { studentId, status: response.ok ? 'success' : 'error', message: result.message };
          } catch (error) {
            return { studentId, status: 'error', message: error.message };
          }
        });

      const results = await Promise.all(submissionPromises);
      const successful = results.filter(r => r.status === 'success').length;
      const errors = results.filter(r => r.status === 'error').length;

      if (successful > 0) {
        toast.success(`Successfully added marks for ${successful} students`);
        setExamId('');
        setSelectedClass('');
        setSelectedSection('');
        setMarksData({});
      }

      if (errors > 0) {
        toast.error(`Failed to add marks for ${errors} students`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100">
      <div className="p-8 mx-auto bg-white rounded-lg shadow-lg max-w-7xl">
        <h2 className="mb-6 text-3xl font-bold text-gray-800">Enter Student Marks</h2>

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

        {examId && students.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full bg-white border border-collapse border-gray-300">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="p-4 font-semibold text-left text-gray-700 border-r border-gray-300">
                    Student Name
                  </th>
                  {exams.find(e => e._id === examId).subjects.map(subject => (
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
                  <tr key={student._id} className="border-b border-gray-300">
                    <td className="p-4 font-medium text-gray-700 border-r border-gray-300">
                      {student.name}
                    </td>
                    {exams.find(e => e._id === examId).subjects.map(subject => (
                      <td key={`${student._id}-${subject._id}`} className="p-4 border-r border-gray-300">
                        <input
                          type="number"
                          value={marksData[student._id]?.[subject.name] || ''}
                          onChange={(e) => handleMarksChange(student._id, subject, e.target.value)}
                          min="0"
                          max={subject.marks}
                          className="w-full text-center text-gray-700 bg-transparent border-none focus:outline-none"
                          placeholder="0"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={handleSubmit}
              className="w-full px-6 py-3 mt-6 text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
            >
              Submit Marks
            </button>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default EnterMarks;