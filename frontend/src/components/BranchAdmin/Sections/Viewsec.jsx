import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaTrash, FaEdit, FaSave, FaTimes, FaPlus } from "react-icons/fa";
import Allapi from "../../../common";
import { mycon } from "../../../store/Mycontext";

const ViewSections = () => {
  const { branchdet } = useContext(mycon);
  const [selectedClass, setSelectedClass] = useState("");
  const [sections, setSections] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOpen, setViewOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [feeTypes, setFeeTypes] = useState([]);
  const [fees, setFees] = useState([{ feeType: "", amount: "" }]);
  const [editingFee, setEditingFee] = useState(null);

  const fetchClasses = async (curr_acad) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(Allapi.getClasses.url(curr_acad), {
        method: Allapi.getClasses.method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (result.success) {
        setClasses(result.data);
      } else {
        toast.error(result.message || "Failed to fetch classes");
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Error fetching classes");
    }
  };

  const fetchFeeTypes = async (curr_Acad) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(Allapi.getAllFeeTypes.url(curr_Acad), {
        method: Allapi.getAllFeeTypes.method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (result.success) {
        setFeeTypes(result.feeTypes);
      } else {
        toast.error(result.message || "Failed to fetch fee types");
      }
    } catch (error) {
      console.error("Error fetching fee types:", error);
      toast.error("Error fetching fee types");
    }
  };

  const fetchSections = async (className, curr_acad) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        Allapi.getSectionsByClass.url(className, curr_acad),
        {
          method: Allapi.getSectionsByClass.method,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      if (result.success) {
        setSections(result.data || []);
      } else {
        toast.error(result.message || "Failed to fetch sections");
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      toast.error("Error fetching sections");
    }
  };

  useEffect(() => {
    if (branchdet?.academicYears?.length > 0) {
      const currentAcademicYear = branchdet.academicYears[0];
      fetchClasses(currentAcademicYear);
      fetchFeeTypes(currentAcademicYear);
    }
  }, [branchdet]);

  useEffect(() => {
    if (selectedClass && branchdet?.academicYears?.length > 0) {
      const currentAcademicYear = branchdet.academicYears[0];
      fetchSections(selectedClass, currentAcademicYear);
    }
  }, [selectedClass]);

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleAddFee = (section) => {
    setSelectedSection(section);
    setIsModalOpen(true);
    setFees([{ feeType: "", amount: "" }]);
  };

  const handleEditFee = (section, fee) => {
    setSelectedSection(section);
    setEditingFee(fee);
    setIsEditModalOpen(true);
  };

  const handleView = (section) => {
    setSelectedSection(section);
    setViewOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setFees([{ feeType: "", amount: "" }]);
    setEditingFee(null);
  };

  const handleViewClose = () => {
    setViewOpen(false);
  };

  const handleFeeChange = (index, field, value) => {
    const updatedFees = [...fees];
    updatedFees[index][field] = value;
    setFees(updatedFees);
  };

  const handleEditFeeChange = (field, value) => {
    setEditingFee({ ...editingFee, [field]: value });
  };

  const handleAddFeeEntry = () => {
    setFees([...fees, { feeType: "", amount: "" }]);
  };

  const handleRemoveFeeEntry = (index) => {
    const updatedFees = fees.filter((_, i) => i !== index);
    setFees(updatedFees);
  };

  const handleDeleteFee = async (sectionId, feeId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        Allapi.deleteFeeStructure.url(sectionId, feeId),
        {
          method: Allapi.deleteFeeStructure.method,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      if (result.success) {
        toast.success("Fee deleted successfully");
        fetchSections(selectedClass, branchdet.academicYears[0]);
        setViewOpen(false);
      } else {
        toast.error(result.message || "Failed to delete fee");
      }
    } catch (error) {
      console.error("Error deleting fee:", error);
      toast.error("Error deleting fee");
    }
  };

  const handleUpdateFee = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!editingFee.feeType || !editingFee.amount) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      // Using the same endpoint as addFeeStructure but with PUT method
      const response = await fetch(
        `${backapi}/api/Fee-types/fees-section/${selectedSection._id}/${editingFee._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fee: editingFee }),
        }
      );
      const result = await response.json();
      if (result.success) {
        toast.success("Fee updated successfully");
        handleModalClose();
        fetchSections(selectedClass, branchdet.academicYears[0]);
      } else {
        toast.error(result.message || "Failed to update fee");
      }
    } catch (error) {
      console.error("Error updating fee:", error);
      toast.error("Error updating fee");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    for (const fee of fees) {
      if (!fee.feeType || !fee.amount) {
        toast.error("Please fill in all fields for each fee entry");
        return;
      }
    }

    try {
      const response = await fetch(
        Allapi.addFeeStructure.url(selectedSection._id),
        {
          method: Allapi.addFeeStructure.method,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fees }),
        }
      );
      const result = await response.json();
      if (result.success) {
        toast.success("Fees added successfully");
        handleModalClose();
        fetchSections(selectedClass, branchdet.academicYears[0]);
      } else {
        toast.error(result.message || "Failed to add fee");
      }
    } catch (error) {
      console.error("Error adding fee:", error);
      toast.error("Error adding fee");
    }
  };

  function findObjectByKey(array, key, value) {
    const foundObject = array.find((obj) => obj[key] === value);
    return foundObject ? foundObject.terms : undefined;
  }

  return (
    <div className="mt-16 p-8 max-w-3xl mx-auto bg-white shadow-lg rounded-2xl text-gray-700">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        View Sections
      </h2>
      <select
        value={selectedClass}
        onChange={handleClassChange}
        className="p-2 border rounded-md w-full mb-6"
      >
        <option value="">Select a class</option>
        {classes.map((cls) => (
          <option key={cls._id} value={cls.name}>
            {cls.name}
          </option>
        ))}
      </select>

      <ul className="divide-y divide-gray-300">
        {sections.length === 0 ? (
          <p className="text-gray-600 text-center">No sections available.</p>
        ) : (
          sections.map((section) => (
            <li
              key={section._id}
              className="flex items-center justify-between py-2"
            >
              <span className="text-black">{section.name}</span>
              <div className="flex space-x-2">
                {section.fees && section.fees.length === 0 ? (
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-500 transition flex items-center"
                    onClick={() => handleAddFee(section)}
                  >
                    <FaPlus className="mr-1" />
                    Add Fee
                  </button>
                ) : (
                  <button
                    className="px-3 py-1 bg-yellow-300 text-gray-700 rounded-md hover:bg-yellow-400 transition flex items-center"
                    onClick={() => handleView(section)}
                  >
                    <FaEdit className="mr-1" />
                    View Fee
                  </button>
                )}
              </div>
            </li>
          ))
        )}
      </ul>

      {/* Add Fee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Add Fee for {selectedSection?.name}
              </h2>
              <button
                onClick={handleModalClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {fees.map((fee, index) => (
                <div key={index} className="mb-4">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">
                        Fee Type
                      </label>
                      <select
                        value={fee.feeType}
                        onChange={(e) =>
                          handleFeeChange(index, "feeType", e.target.value)
                        }
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="">Select Fee Type</option>
                        {feeTypes.map((type) => (
                          <option key={type._id} value={type.type}>
                            {type.type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">
                        Amount
                      </label>
                      <input
                        type="number"
                        value={fee.amount}
                        onChange={(e) =>
                          handleFeeChange(index, "amount", e.target.value)
                        }
                        className="w-full p-2 border rounded-md"
                        placeholder="Amount"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeeEntry(index)}
                      className="mt-7 text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={handleAddFeeEntry}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition flex items-center"
                >
                  <FaPlus className="mr-1" />
                  Add Another Fee
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition flex items-center"
                >
                  <FaSave className="mr-1" />
                  Save All
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Fee Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Edit Fee for {selectedSection?.name}
              </h2>
              <button
                onClick={handleModalClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleUpdateFee}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Fee Type</label>
                <select
                  value={editingFee?.feeType || ""}
                  onChange={(e) => handleEditFeeChange("feeType", e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Fee Type</option>
                  {feeTypes.map((type) => (
                    <option key={type._id} value={type.type}>
                      {type.type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  value={editingFee?.amount || ""}
                  onChange={(e) => handleEditFeeChange("amount", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Amount"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition flex items-center"
                >
                  <FaSave className="mr-1" />
                  Update
                </button>
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Fee Modal */}
      {isViewOpen && selectedSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={handleViewClose}
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold mb-4">
              Fee Structure for {selectedSection.name}
            </h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 py-2 px-4">Fee Type</th>
                  <th className="border-b-2 py-2 px-4">Terms</th>
                  <th className="border-b-2 py-2 px-4">Amount (Rs)</th>
                  <th className="border-b-2 py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedSection.fees.map((fee) => (
                  <tr key={fee._id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{fee.feeType}</td>
                    <td className="py-2 px-4 border-b">
                      {findObjectByKey(feeTypes, "type", fee.feeType)}
                    </td>
                    <td className="py-2 px-4 border-b">Rs {fee.amount}</td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditFee(selectedSection, fee)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteFee(selectedSection._id, fee._id)
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSections;