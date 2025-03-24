import React, { useState, useEffect, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Allapi from "../../../common";
import { mycon } from "../../../store/Mycontext";

const Upgrade = () => {
  const { branchdet } = useContext(mycon);

  const [academicYears, setAcademicYears] = useState([]);
  const [fromAcademicYear, setFromAcademicYear] = useState("");
  const [toAcademicYear, setToAcademicYear] = useState("");

  // Separate states for from/to classes and sections
  const [fromClasses, setFromClasses] = useState([]);
  const [toClasses, setToClasses] = useState([]);
  const [fromClass, setFromClass] = useState("");
  const [toClass, setToClass] = useState("");

  const [fromSections, setFromSections] = useState([]);
  const [toSections, setToSections] = useState([]);
  const [fromSection, setFromSection] = useState("");
  const [toSection, setToSection] = useState("");

  useEffect(() => {
    if (branchdet?._id) {
      fetchAcademicYears();
    }
  }, [branchdet]);

  // Fetch classes when academic years change
  useEffect(() => {
    if (fromAcademicYear) {
      fetchClasses(fromAcademicYear, setFromClasses);
      setFromClass("");
      setFromSection("");
    }
  }, [fromAcademicYear]);

  useEffect(() => {
    if (toAcademicYear) {
      fetchClasses(toAcademicYear, setToClasses);
      setToClass("");
      setToSection("");
    }
  }, [toAcademicYear]);

  // Fetch Academic Years
  const fetchAcademicYears = async () => {
    try {
      const response = await fetch(Allapi.getAcademicYears.url(branchdet._id), {
        method: Allapi.getAcademicYears.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const res = await response.json();
      if (res.success) {
        setAcademicYears(res.data);

        // Select latest academic year as "To Academic Year" by default
        const sortedYears = res.data.sort((a, b) => {
          const [startA] = a.year.split("-").map(Number);
          const [startB] = b.year.split("-").map(Number);
          return startB - startA;
        });

        if (sortedYears.length > 0) {
          setToAcademicYear(sortedYears[0]._id);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch academic years");
    }
  };

  // Generic class fetcher
  const fetchClasses = async (academicYearId, setClassState) => {
    try {
      const response = await fetch(Allapi.getClasses.url(academicYearId), {
        method: Allapi.getClasses.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setClassState(result.data);
      }
    } catch (error) {
      toast.error("Failed to fetch classes");
    }
  };

  // Fetch Sections
  const fetchSections = async (classId, type) => {
    if (!classId) return;

    try {
      const response = await fetch(Allapi.getSections.url(classId), {
        method: Allapi.getSections.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        type === "from" 
          ? setFromSections(result.data) 
          : setToSections(result.data);
        
       
      }
    } catch (error) {
      toast.error("Failed to fetch sections");
    }
  };

  // Handle Promote Students (keep the same as before)
  const handlePromoteStudents = async () => {
    if (
      !fromAcademicYear ||
      !toAcademicYear ||
      !fromClass ||
      !fromSection ||
      !toClass ||
      !toSection
    ) {
      toast.error("Please select all fields before promoting students.");
      return;
    }

    try {
      const response = await fetch(Allapi.promoteStudents.url(), {
        method: Allapi.promoteStudents.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromAcademicYear,
          toAcademicYear,
          fromClass,
          fromSection,
          toClass,
          toSection,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Students promoted successfully!");
      } else {
        toast.error(result.message || "Failed to promote students.");
      }
    } catch (error) {
      toast.error("Error promoting students.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-gray-900">
      <ToastContainer />
      <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-900">
          Upgrade Students
        </h2>

        {/* Academic Year Selection */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              From Academic Year
            </label>
            <select
              value={fromAcademicYear}
              onChange={(e) => setFromAcademicYear(e.target.value)}
              className="w-full p-2 border-2 border-black rounded-md bg-white text-gray-900"
            >
              <option value="">Select Academic Year</option>
              {academicYears.map((year) => (
                <option key={year._id} value={year._id}>
                  {year.year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              To Academic Year
            </label>
            <select
              value={toAcademicYear}
              onChange={(e) => setToAcademicYear(e.target.value)}
              className="w-full p-2 border-2 border-black rounded-md bg-white text-gray-900"
            >
              <option value="">Select Academic Year</option>
              {academicYears.map((year) => (
                <option key={year._id} value={year._id}>
                  {year.year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Class & Section Selection */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">From Class</label>
            <select
              value={fromClass}
              onChange={(e) => {
                setFromClass(e.target.value);
                fetchSections(e.target.value, "from");
              }}
              className="w-full p-2 border-2 border-black rounded-md bg-white text-gray-900"
            >
              <option value="">Select Class</option>
              {fromClasses.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>

            <select
              value={fromSection}
              onChange={(e) => setFromSection(e.target.value)}
              className="w-full p-2 mt-2 border-2 border-black rounded-md bg-white text-gray-900"
            >
              <option value="">Select Section</option>
              {fromSections.map((sec) => (
                <option key={sec._id} value={sec._id}>
                  {sec.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">To Class</label>
            <select
              value={toClass}
              onChange={(e) => {
                setToClass(e.target.value);
                fetchSections(e.target.value, "to");
              }}
              className="w-full p-2 border-2 border-black rounded-md bg-white text-gray-900"
            >
              <option value="">Select Class</option>
              {toClasses.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>

            <select
              value={toSection}
              onChange={(e) => setToSection(e.target.value)}
              className="w-full p-2 mt-2 border-2 border-black rounded-md bg-white text-gray-900"
            >
              <option value="">Select Section</option>
              {toSections.map((sec) => (
                <option key={sec._id} value={sec._id}>
                  {sec.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handlePromoteStudents}
          className="w-full px-4 py-2 mt-6 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Promote Students
        </button>
      </div>
    </div>
  );
};

export default Upgrade;