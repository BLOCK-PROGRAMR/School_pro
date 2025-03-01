import React, { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Allapi from "../../../common";
import { mycon } from "../../../store/Mycontext";

const ViewSyllabus = () => {
  const { branchdet } = useContext(mycon);
  const [acid, setAcid] = useState("");
  const [currentAcademicYear, setCurrentAcademicYear] = useState("");

  // Form states
  const [examList, setExamList] = useState([]);
  const [uniqueClasses, setUniqueClasses] = useState([]);
  const [uniqueSections, setUniqueSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);
  const [filteredExams, setFilteredExams] = useState([]);
  const [syllabusData, setSyllabusData] = useState(null);

  //new
  const [isEditing, setIsEditing] = useState(false);
  const [editedSyllabus, setEditedSyllabus] = useState({});


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
        setCurrentAcademicYear(latestAcademicYear.year);
      }
    } catch (error) {
      toast.error("Failed to fetch academic year");
    }
  };

  const fetchAllExams = async () => {
    try {
      const response = await fetch(Allapi.getEveryExam.url(branchdet._id), {
        method: Allapi.getEveryExam.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        console.log("all exams are",result.data);
        setExamList(result.data);
        const classes = [...new Map(result.data.map(exam =>
          [exam.classId._id, { id: exam.classId._id, name: exam.classId.name }]
        )).values()];
        setUniqueClasses(classes);
      } else {
        toast.error("Failed to fetch exams");
      }
    } catch (error) {
      toast.error("Error fetching exams");
    }
  };

  const fetchSyllabus = async () => {
    if (!selectedExam) return;

    try {
      const response = await fetch(
        Allapi.getAllSyllabus.url(branchdet._id, acid),
        {
          method: Allapi.getAllSyllabus.method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        // Filter syllabus for selected class, section and exam
        const relevantSyllabus = result.data.find(
          s => 
            s.classId === selectedClass && 
            s.sectionId === selectedSection && 
            s.examName === selectedExam.examName
        );

        setSyllabusData(relevantSyllabus);
      } else {
        toast.error("Failed to fetch syllabus");
      }
    } catch (error) {
      toast.error("Error fetching syllabus");
    }
  };

  const handleDeleteSyllabus = async () => {
    if (!syllabusData?._id) return;

    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this syllabus?");
      if (!confirmDelete) return;

      const response = await fetch(
        Allapi.deleteSyllabus.url(syllabusData._id),
        {
          method: Allapi.deleteSyllabus.method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Syllabus deleted successfully");
        setSyllabusData(null);
        setSelectedExam(null);
        setSelectedClass("");
        setSelectedSection("");
      } else {
        const result = await response.json();
        toast.error(result.message || "Failed to delete syllabus");
      }
    } catch (error) {
      toast.error("Error deleting syllabus");
    }
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setSelectedSection("");
    setSelectedExam(null);
    setSyllabusData(null);
  };

  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
    setSelectedExam(null);
    setSyllabusData(null);
  };

  const handleExamChange = (e) => {
    const exam = filteredExams.find((ex) => ex._id === e.target.value);
    setSelectedExam(exam);
    setSyllabusData(null);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    // Initialize edited syllabus with current values
    const initialEditedSyllabus = {};
    selectedExam.subjects.forEach((subject) => {
      initialEditedSyllabus[subject._id] = syllabusData.syllabus[subject._id] || "";
    });
    setEditedSyllabus(initialEditedSyllabus);
  };

  const handleSyllabusChange = (subjectId, value) => {
    setEditedSyllabus(prev => ({
      ...prev,
      [subjectId]: value
    }));
  };

  const handleUpdateSyllabus = async () => {
    console.log("subjed data._id: ",syllabusData._id);
    try {
      const response = await fetch(

        Allapi.updateSyllabus.url(branchdet._id, syllabusData._id),
        {
          method: Allapi.updateSyllabus.method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            syllabus: editedSyllabus
          })
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          toast.success("Syllabus updated successfully");
          setIsEditing(false);
          // Refresh syllabus data
          fetchSyllabus();
        } else {
          toast.error(result.message || "Failed to update syllabus");
        }
      } else {
        toast.error("Failed to update syllabus");
      }
    } catch (error) {
      toast.error("Error updating syllabus");
    }
  };
  useEffect(() => {
    if (branchdet?._id) {
      curracad(branchdet._id);
    }
  }, [branchdet]);

  useEffect(() => {
    if (acid) {
      fetchAllExams();
    }
  }, [acid]);

  useEffect(() => {
    if (selectedClass) {
      const sections = examList
        .filter((exam) => exam.classId._id === selectedClass)
        .map((exam) => ({
          id: exam.sectionId._id,
          name: exam.sectionId.name,
        }));
      const uniqueSections = [...new Map(sections.map((section) => [section.id, section])).values()];
      setUniqueSections(uniqueSections);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedClass && selectedSection) {
      const exams = examList.filter(
        (exam) =>
          exam.classId._id === selectedClass &&
          exam.sectionId._id === selectedSection
      );
      setFilteredExams(exams);
    }
  }, [selectedClass, selectedSection]);

  useEffect(() => {
    if (selectedExam) {
      fetchSyllabus();
    }
  }, [selectedExam]);

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100">
      <div className="p-8 mx-auto bg-white rounded-lg shadow-lg max-w-7xl">
        <h2 className="mb-6 text-3xl font-bold text-gray-800">View Syllabus</h2>

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
              onChange={handleClassChange}
              className="w-full p-3 text-gray-700 bg-white border rounded"
            >
              <option value="">Select Class</option>
              {uniqueClasses.map((cls) => (
                <option key={cls.id} value={cls.id}>
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
                onChange={handleSectionChange}
                className="w-full p-3 text-gray-700 bg-white border rounded"
              >
                <option value="">Select Section</option>
                {uniqueSections.map((section) => (
                  <option key={section.id} value={section.id}>
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
                value={selectedExam?._id || ""}
                onChange={handleExamChange}
                className="w-full p-3 text-gray-700 bg-white border rounded"
              >
                <option value="">Select Exam</option>
                {filteredExams.map((exam) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.examName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {syllabusData && selectedExam?.subjects?.length > 0 && (
          <div className="mt-6">
            <div className="overflow-x-auto">
              <table className="w-full bg-white border border-collapse border-gray-300">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="p-4 font-semibold text-left text-gray-700 border-r border-gray-300">
                      Subject Name
                    </th>
                    <th className="p-4 font-semibold text-left text-gray-700">
                      Syllabus
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedExam.subjects.map((subject) => (
                    <tr key={subject._id} className="border-b border-gray-300">
                      <td className="p-4 font-medium text-gray-700 border-r border-gray-300">
                        {subject.name}
                      </td>
                      <td className="p-4 text-gray-900">
                        {isEditing ? (
                          <textarea
                              value={editedSyllabus[subject._id] || ""}
                              onChange={(e) => handleSyllabusChange(subject._id, e.target.value)}
                              className="w-full p-2 text-gray-900 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows="3"
                            />

                        ) : (
                          syllabusData.syllabus[subject._id] || "No syllabus added"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-4 mt-6">
              {isEditing ? (
                <>
                  <button
                    onClick={handleUpdateSyllabus}
                    className="px-6 py-3 text-white transition-colors bg-green-600 rounded hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 text-white transition-colors bg-gray-600 rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEditClick}
                    className="px-6 py-3 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Edit Syllabus
                  </button>
                  <button
                    onClick={handleDeleteSyllabus}
                    className="px-6 py-3 text-white transition-colors bg-red-600 rounded hover:bg-red-700"
                  >
                    Delete Syllabus
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {selectedExam && !syllabusData && (
          <div className="p-4 mt-6 text-center text-gray-700 bg-gray-100 rounded">
            No syllabus found for the selected criteria
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default ViewSyllabus;


