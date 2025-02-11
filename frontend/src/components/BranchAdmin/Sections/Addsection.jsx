
// export default AddSection;
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Allapi from "../../../common";
import { FaTrash, FaEdit, FaSave } from "react-icons/fa"; // Add Save icon

const AddSection = () => {
  const { classId } = useParams();
  const [classDetails, setClassDetails] = useState(null);
  const [sections, setSections] = useState([]);
  const [newSection, setNewSection] = useState("");
  const [editSection, setEditSection] = useState(null); // Tracks section being edited
  const [editSectionName, setEditSectionName] = useState(""); // Stores new name during edit

  const fetchClassDetails = async (classId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(Allapi.getClassDetails.url(classId), {
        method: Allapi.getClassDetails.method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (result.success) {
        console.log("class-details", result.data);
        setClassDetails(result.data);
        // setSections(result.data.sections || []);
      } else {
        toast.error(result.message || "Failed to fetch class details");
      }
    } catch (error) {
      console.error("Error fetching class details:", error);
      toast.error("Error fetching class details");
    }
  };
  // Fetch all sections when the component loads
  const fetchAllSections = async (classId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(Allapi.getSections.url(classId), {
        method: Allapi.getSections.method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (result.success) {
        setSections(result.data || []);
        console.log("all sections is", result.data);
      } else {
        toast.error(result.message || "Failed to fetch sections");
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      toast.error("Error fetching sections");
    }
  };

  // Add new section
  const handleAddSection = async (classId) => {
    if (!newSection.trim()) {
      toast.error("Section name cannot be empty");
      return;
    }
    if (sections.some((sec) => sec.name === newSection)) {
      toast.error("Section name must be unique");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(Allapi.addSection.url(classId), {
        method: Allapi.addSection.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sectionName: newSection }),
      });
      const result = await response.json();

      if (result.success) {
        toast.success("Section added successfully");
        setNewSection("");
        fetchAllSections(classId); // Refresh sections list
      } else {
        toast.error(result.message || "Failed to add section");
      }
    } catch (error) {
      console.error("Error adding section:", error.message);
      toast.error(`Error adding section: ${error.message}`);
    }
  };

  // Update section name
  const handleUpdateSection = async (sectionId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(Allapi.updateSection.url(sectionId), {
        method: Allapi.updateSection.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editSectionName }),
      });
      const result = await response.json();

      if (result.success) {
        toast.success("Section updated successfully");
        setEditSection(null);
        setEditSectionName("");
        fetchAllSections(classId); // Refresh sections list
      } else {
        toast.error(result.message || "Failed to update section");
      }
    } catch (error) {
      console.error("Error updating section:", error.message);
      toast.error(`Error updating section: ${error.message}`);
    }
  };
  const handleDeleteSection = async (classId, sectionId) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          Allapi.deleteSection.url(classId, sectionId),
          {
            method: Allapi.deleteSection.method,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.json();
        if (result.success) {
          toast.error("Section deleted successfully");
          fetchAllSections(classId);
        } else {
          toast.error(result.message || "Failed to delete section");
        }
      } catch (error) {
        toast.error("Error deleting section");
      }
    }
  };

  useEffect(() => {
    fetchClassDetails(classId);
    fetchAllSections(classId);
  }, [classId]);

  return (
    <div className="mt-16 p-8 max-w-3xl mx-auto bg-white shadow-lg rounded-2xl">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Add Section to {classDetails?.name || "Class"}
      </h2>
      <div className="flex items-center space-x-4 mb-4">
        <input
          type="text"
          value={newSection}
          onChange={(e) => setNewSection(e.target.value)}
          placeholder="Enter section name"
          className="p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => handleAddSection(classId)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition"
        >
          Add Section
        </button>
      </div>
      <ul className="divide-y divide-gray-300">
        {sections.length === 0 ? (
          <p className="text-gray-600 text-center">No sections available.</p>
        ) : (
          sections.map((section) => (
            <li
              key={section._id}
              className="flex items-center justify-between py-2"
            >
              {editSection === section._id ? (
                <input
                  type="text"
                  value={editSectionName}
                  onChange={(e) => setEditSectionName(e.target.value)}
                  className="p-2 border rounded-md"
                />
              ) : (
                <span className="text-black">{section.name}</span>
              )}
              <div className="flex space-x-2">
                {editSection === section._id ? (
                  <button
                    onClick={() => handleUpdateSection(section._id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition flex items-center"
                  >
                    <FaSave />
                    <span className="ml-1">Save</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditSection(section._id);
                      setEditSectionName(section.name);
                      console.log(
                        "present edit sec id and name",
                        editSection,

                        editSectionName
                      );
                    }}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-400 transition flex items-center"
                  >
                    <FaEdit />
                    <span className="ml-1">Edit</span>
                  </button>
                )}
                <button
                  onClick={() => handleDeleteSection(classId, section._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-500 transition flex items-center"
                >
                  <FaTrash />
                  <span className="ml-1">Delete</span>
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default AddSection;
