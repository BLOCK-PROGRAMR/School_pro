import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { mycon } from "../../../store/Mycontext";
import Allapi from "../../../common";
import { 
  Plus, 
  Edit, 
  Trash, 
  Search, 
  RefreshCw,
  DollarSign
} from "lucide-react";

const FeeTypes = () => {
  const { branchdet, c_acad } = useContext(mycon);
  const [feeTypes, setFeeTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentFeeType, setCurrentFeeType] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
  });

  useEffect(() => {
    if (c_acad) {
      fetchFeeTypes();
    }
  }, [c_acad]);

  const fetchFeeTypes = async () => {
    setLoading(true);
    try {
      const response = await fetch(Allapi.getAllFeeTypes.url(c_acad), {
        method: Allapi.getAllFeeTypes.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        setFeeTypes(data.data);
      } else {
        toast.error(data.message || "Failed to fetch fee types");
      }
    } catch (error) {
      console.error("Error fetching fee types:", error);
      toast.error("An error occurred while fetching fee types");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "amount" ? (value === "" ? "" : parseFloat(value)) : value,
    });
  };

  const handleAddFeeType = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.amount) {
      toast.warning("Name and amount are required");
      return;
    }

    try {
      const response = await fetch(Allapi.addFeeType.url, {
        method: Allapi.addFeeType.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          academicYear: c_acad,
          branch: branchdet._id,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Fee type added successfully");
        setShowAddModal(false);
        setFormData({ name: "", description: "", amount: "" });
        fetchFeeTypes();
      } else {
        toast.error(data.message || "Failed to add fee type");
      }
    } catch (error) {
      console.error("Error adding fee type:", error);
      toast.error("An error occurred while adding fee type");
    }
  };

  const handleEditFeeType = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.amount) {
      toast.warning("Name and amount are required");
      return;
    }

    try {
      const response = await fetch(Allapi.updateFeeType.url(currentFeeType._id), {
        method: Allapi.updateFeeType.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Fee type updated successfully");
        setShowEditModal(false);
        setCurrentFeeType(null);
        setFormData({ name: "", description: "", amount: "" });
        fetchFeeTypes();
      } else {
        toast.error(data.message || "Failed to update fee type");
      }
    } catch (error) {
      console.error("Error updating fee type:", error);
      toast.error("An error occurred while updating fee type");
    }
  };

  const handleDeleteFeeType = async (id) => {
    if (!window.confirm("Are you sure you want to delete this fee type?")) {
      return;
    }

    try {
      const response = await fetch(Allapi.deleteFeeType.url(id), {
        method: Allapi.deleteFeeType.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Fee type deleted successfully");
        fetchFeeTypes();
      } else {
        toast.error(data.message || "Failed to delete fee type");
      }
    } catch (error) {
      console.error("Error deleting fee type:", error);
      toast.error("An error occurred while deleting fee type");
    }
  };

  const openEditModal = (feeType) => {
    setCurrentFeeType(feeType);
    setFormData({
      name: feeType.name,
      description: feeType.description || "",
      amount: feeType.amount,
    });
    setShowEditModal(true);
  };

  const filteredFeeTypes = feeTypes.filter(
    (feeType) =>
      feeType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (feeType.description &&
        feeType.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Fee Types</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Fee Type
            </button>
            <button
              onClick={fetchFeeTypes}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Current Academic Year */}
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <p className="text-blue-800">
            <strong>Current Academic Year:</strong> {c_acad || "Not set"}
          </p>
          <p className="text-blue-800">
            <strong>Branch:</strong> {branchdet?.name || "Not set"}
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search fee types..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Fee Types Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredFeeTypes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount (₹)
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredFeeTypes.map((feeType) => (
                  <tr key={feeType._id} className="hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {feeType.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {feeType.description || "-"}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      ₹{feeType.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(feeType)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteFeeType(feeType._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No fee types found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "No fee types match your search criteria."
                : "Get started by creating a new fee type."}
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                Add Fee Type
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Fee Type Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Fee Type</h2>
            <form onSubmit={handleAddFeeType}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({ name: "", description: "", amount: "" });
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Fee Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Fee Type Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Fee Type</h2>
            <form onSubmit={handleEditFeeType}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setCurrentFeeType(null);
                    setFormData({ name: "", description: "", amount: "" });
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Update Fee Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeTypes; 