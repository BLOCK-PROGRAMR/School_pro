import React, { useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPlusCircle, FaTrash } from "react-icons/fa";
import Allapi from "../../../common/index";
import "./Addclassform.css";
import { mycon } from "../../../store/Mycontext";

const AddClassForm = () => {
  const { acid } = useParams();
  const navigate = useNavigate();
  const [className, setClassName] = useState("");
  const [mainSubjects, setMainSubjects] = useState([""]);
  const [additionalSubjects, setAdditionalSubjects] = useState([""]);
  const { branchdet } = useContext(mycon);

  const classOptions = [
    "LKG",
    "UKG",
    "1-st Class",
    "Second",
    "Third",
    "Fourth",
    "Fifth",
    "Sixth",
    "Seventh",
    "Eighth",
    "Ninth",
    "Tenth",
    "inter",
    "Degree",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const classData = {
      name: className,
      academicYear: acid,
      mainSubjects,
      additionalSubjects,
    };

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(Allapi.addClass.url, {
        method: Allapi.addClass.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(classData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Class created successfully");
        console.log("new class det is", result.data);
        setClassName("");
        setMainSubjects([""]);
        setAdditionalSubjects([""]);
      } else {
        toast.error(result.message || "Failed to create class");
      }
    } catch (error) {
      console.error("Error creating class:", error);
      toast.error("Error creating class");
    }
  };

  const handleMainSubjectsChange = (index, value) => {
    const updatedMainSubjects = [...mainSubjects];
    updatedMainSubjects[index] = value;
    setMainSubjects(updatedMainSubjects);
  };

  const handleAdditionalSubjectsChange = (index, value) => {
    const updatedAdditionalSubjects = [...additionalSubjects];
    updatedAdditionalSubjects[index] = value;
    setAdditionalSubjects(updatedAdditionalSubjects);
  };

  const addMainSubjectField = () => {
    setMainSubjects([...mainSubjects, ""]);
  };

  const addAdditionalSubjectField = () => {
    setAdditionalSubjects([...additionalSubjects, ""]);
  };

  const removeMainSubjectField = (index) => {
    const updatedMainSubjects = mainSubjects.filter((_, i) => i !== index);
    setMainSubjects(updatedMainSubjects);
  };

  const removeAdditionalSubjectField = (index) => {
    const updatedAdditionalSubjects = additionalSubjects.filter(
      (_, i) => i !== index
    );
    setAdditionalSubjects(updatedAdditionalSubjects);
  };

  return (
    <div className="hidden md:block mt-16 form-container zoom-in-animation p-8 max-w-2xl mx-auto bg-white shadow-lg rounded-2xl">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {branchdet ? branchdet.name : "loading"} Branch
        </h1>
        <h2 className="text-3xl font-bold text-gray-800">Create New Class</h2>
        <Link
          to={`/branch-admin/class/view-all/${
            branchdet ? branchdet.academicYears[0] : ""
          }`}
        >
          <button className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-600 transition flex items-center space-x-1">
            <span>View All Classes</span>
          </button>
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2 text-lg">
            Select Class
          </label>
          <select
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          >
            <option value="">Select Class</option>
            {classOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Main Subjects Section */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2 text-lg">
            Main Subjects
          </label>
          {mainSubjects.map((subject, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={subject}
                onChange={(e) =>
                  handleMainSubjectsChange(index, e.target.value)
                }
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder={`Enter Main Subject ${index + 1}`}
              />
              {mainSubjects.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMainSubjectField(index)}
                  className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-600 transition flex items-center space-x-1"
                >
                  <FaTrash />
                  <span>Remove</span>
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addMainSubjectField}
            className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-600 transition flex items-center space-x-2"
          >
            <FaPlusCircle />
            <span>Add Main Subject</span>
          </button>
        </div>

        {/* Additional Subjects Section */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2 text-lg">
            Additional Subjects
          </label>
          {additionalSubjects.map((subject, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={subject}
                onChange={(e) =>
                  handleAdditionalSubjectsChange(index, e.target.value)
                }
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder={`Enter Additional Subject ${index + 1}`}
              />
              {additionalSubjects.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAdditionalSubjectField(index)}
                  className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-600 transition flex items-center space-x-1"
                >
                  <FaTrash />
                  <span>Remove</span>
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addAdditionalSubjectField}
            className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-600 transition flex items-center space-x-2"
          >
            <FaPlusCircle />
            <span>Add Additional Subject</span>
          </button>
        </div>

        <button
          type="submit"
          className="w-full p-4 bg-gradient-to-r from-blue-700 to-pink-600 text-gray-900 rounded-lg hover:from-pink-500 hover:to-blue-700 transition text-lg font-semibold"
        >
          Create Class
        </button>
      </form>
    </div>
  );
};

export default AddClassForm;
