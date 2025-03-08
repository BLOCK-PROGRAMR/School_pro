
import React, { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Allapi from "../../../common";
import { mycon } from "../../../store/Mycontext";

const CreateSyllabus = () => {
  const { branchdet } = useContext(mycon);
  const [acid, setAcid] = useState("");
  const [currentAcademicYear, setCurrentAcademicYear] = useState("");

  // Form states
  const [examList, setExamList] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);
  const [syllabusData, setSyllabusData] = useState({});

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
    setSelectedSection("");
    setSelectedExam(null);
    setSyllabusData({});

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
    setSelectedExam(null);
    setSyllabusData({});

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
        setExamList(result.data);
      }
    } catch (error) {
      toast.error("Failed to fetch exams");
    }
  };

  const handleExamChange = (e) => {
    const exam = examList.find((ex) => ex._id === e.target.value);
    setSelectedExam(exam);
    setSyllabusData({});
  };

  const handleSyllabusChange = (subjectId, value) => {
    setSyllabusData((prev) => ({
      ...prev,
      [subjectId]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!selectedExam) {
        toast.error("Please select an exam");
        return;
      }

      const syllabusMap = {};
      Object.entries(syllabusData).forEach(([subjectId, syllabus]) => {
        syllabusMap[subjectId] = syllabus;
      });

      const payload = {
        classId: selectedClass,
        sectionId: selectedSection,
        examName: selectedExam.examName,
        academicId: acid,
        syllabus: syllabusMap
      };

      const response = await fetch(Allapi.addSyllabus.url(branchdet._id), {
        method: Allapi.addSyllabus.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Syllabus added successfully");
        setSelectedExam(null);
        setSelectedClass("");
        setSelectedSection("");
        setSyllabusData({});
      } else {
        toast.error(result.message || "Failed to add syllabus");
      }
    } catch (error) {
      toast.error("An unexpected error occurred while adding syllabus");
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100">
      <div className="p-8 mx-auto bg-white rounded-lg shadow-lg max-w-7xl">
        <h2 className="mb-6 text-3xl font-bold text-gray-800">Create Syllabus</h2>

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
                <option key={cls._id} value={cls._id}>{cls.name}</option>
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
                  <option key={section._id} value={section._id}>{section.name}</option>
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
                value={selectedExam?._id || ""}
                onChange={handleExamChange}
                className="w-full p-3 text-gray-700 bg-white border rounded"
              >
                <option value="">Select Exam</option>
                {examList.map((exam) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.examName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {selectedExam && selectedExam.subjects?.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full bg-white border border-collapse border-gray-300">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="p-4 font-semibold text-left text-gray-700 border-r border-gray-300">
                    Subject Name
                  </th>
                  <th className="p-4 font-semibold text-left text-gray-700 border-r border-gray-300">
                    Syllabus
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedExam.subjects.map((subject) => (
                  <tr key={subject._id}>
                    <td className="p-4 font-medium text-gray-700 border-r border-gray-300">
                      {subject.name}
                    </td>
                    <td className="p-4 border-r border-gray-300">
                      <input
                        type="text"
                        value={syllabusData[subject._id] || ""}
                        onChange={(e) => handleSyllabusChange(subject._id, e.target.value)}
                        className="w-full p-3 text-black bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter syllabus"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={handleSubmit}
              className="w-full px-6 py-3 mt-6 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
            >
              Submit Syllabus
            </button>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default CreateSyllabus;