import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Allapi from "../../../common";
import { mycon } from "../../../store/Mycontext";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditAcademicYearModal from "./EditAcademicYear"; // Import the modal component
import "./animation.css"; // Custom CSS for animations

const ViewAcademicYears = () => {
  const { c_branch, branchdet } = useContext(mycon);
  const [academicYears, setAcademicYears] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);

  useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        const response = await fetch(Allapi.getAcademicYears.url(c_branch), {
          method: Allapi.getAcademicYears.method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch academic years");
        }

        const res = await response.json();
        setAcademicYears(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching academic years:", error);
        toast.error("Failed to fetch academic years");
        setIsLoading(false);
      }
    };

    fetchAcademicYears();
  }, [c_branch]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this academic year?")) {
      try {
        const response = await fetch(Allapi.deleteAcademicYear.url(id), {
          method: Allapi.deleteAcademicYear.method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          toast.success("Academic year deleted successfully");
          setAcademicYears(academicYears.filter((year) => year._id !== id));
        } else {
          toast.error(data.message || "Failed to delete academic year");
        }
      } catch (error) {
        console.error("Error deleting academic year:", error);
        toast.error("An error occurred while deleting the academic year");
      }
    }
  };

  const openEditModal = (year) => {
    setSelectedAcademicYear(year);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setSelectedAcademicYear(null);
  };

  return (
    <div className="relative bg-white p-8 rounded-lg shadow-lg max-w-7xl mx-auto my-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Academic Years for {branchdet ? branchdet.name : "Loading..."} Branch
      </h2>
      <Link
        to="/branch-admin/academic-year/add"
        className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
      >
        Add Academic Year
      </Link>

      {isLoading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <div className={`overflow-x-auto animate-slide-down`}>
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-b-2 p-3 text-gray-800">#</th>
                <th className="border-b-2 p-3 text-gray-800">Academic Year</th>
                <th className="border-b-2 p-3 text-gray-800">Start Date</th>
                <th className="border-b-2 p-3 text-gray-800">End Date</th>
                <th className="border-b-2 p-3 text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {academicYears.length > 0 ? (
                academicYears.map((year, index) => (
                  <tr key={year._id} className="hover:bg-gray-50 transition-all">
                    <td className="border-b p-3 text-center text-gray-800">{index + 1}</td>
                    <td className="border-b p-3 text-gray-800">{year.year}</td>
                    <td className="border-b p-3 text-gray-800">{new Date(year.startDate).toLocaleDateString()}</td>
                    <td className="border-b p-3 text-gray-800">{new Date(year.endDate).toLocaleDateString()}</td>
                    <td className="border-b p-3 text-center">
                      <button
                        onClick={() => openEditModal(year)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(year._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-3 text-gray-500">No academic years found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {selectedAcademicYear && (
        <EditAcademicYearModal
          isOpen={isModalOpen}
          onClose={closeEditModal}
          academicYear={selectedAcademicYear}
          setAcademicYears={setAcademicYears} // Pass the state setter function
        />
      )}
    </div>
  );
};

export default ViewAcademicYears;
