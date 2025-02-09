// import React, { useState, useEffect } from "react";
// import { FaPlusCircle, FaTrash, FaEdit } from "react-icons/fa";
// import { toast } from "react-toastify";

// const AddFeeType = () => {
//   const [feeTypes, setFeeTypes] = useState([]);
//   const [newFeeType, setNewFeeType] = useState("");
//   const [terms, setTerms] = useState(1);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editIndex, setEditIndex] = useState(null);

//   // Handle adding or updating fee type
//   const handleAddOrUpdateFeeType = () => {
//     if (newFeeType.trim() === "") {
//       toast.error("Fee type cannot be empty");
//       return;
//     }

//     const updatedFeeTypes = [...feeTypes];
//     if (isEditing) {
//       updatedFeeTypes[editIndex] = { type: newFeeType, terms };
//       setIsEditing(false);
//       setEditIndex(null);
//       toast.success("Fee type updated successfully");
//     } else {
//       updatedFeeTypes.push({ type: newFeeType, terms });
//       toast.success("Fee type added successfully");
//     }

//     setFeeTypes(updatedFeeTypes);
//     setNewFeeType("");
//     setTerms(1);
//   };

//   // Handle editing fee type
//   const handleEditFeeType = (index) => {
//     setNewFeeType(feeTypes[index].type);
//     setTerms(feeTypes[index].terms);
//     setIsEditing(true);
//     setEditIndex(index);
//   };

//   // Handle deleting fee type
//   const handleDeleteFeeType = (index) => {
//     if (window.confirm("Are you sure you want to delete this fee type?")) {
//       const updatedFeeTypes = feeTypes.filter((_, i) => i !== index);
//       setFeeTypes(updatedFeeTypes);
//       toast.success("Fee type deleted successfully");
//     }
//   };

//   return (
//     <div className="p-8 max-w-3xl mx-auto bg-white shadow-lg rounded-md">
//       <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Fee Type</h2>

//       <div className="space-y-4">
//         {/* Input for Fee Type */}
//         <div>
//           <label className="block text-gray-700 font-semibold mb-2">
//             Fee Type
//           </label>
//           <input
//             type="text"
//             value={newFeeType}
//             onChange={(e) => setNewFeeType(e.target.value)}
//             className="w-full p-3 border border-gray-300 rounded-md"
//             placeholder="Enter fee type (e.g., Admission Fee, Books Fee)"
//           />
//         </div>

//         {/* Dropdown for Number of Terms */}
//         <div>
//           <label className="block text-gray-700 font-semibold mb-2">
//             Number of Terms
//           </label>
//           <select
//             value={terms}
//             onChange={(e) => setTerms(Number(e.target.value))}
//             className="w-full p-3 border border-gray-300 rounded-md"
//           >
//             <option value={1}>1 Term</option>
//             <option value={2}>2 Terms</option>
//             <option value={3}>3 Terms</option>
//             <option value={4}>4 Terms</option>
//           </select>
//         </div>

//         {/* Button to Add or Update Fee Type */}
//         <button
//           onClick={handleAddOrUpdateFeeType}
//           className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition"
//         >
//           <FaPlusCircle />
//           <span>{isEditing ? "Update Fee Type" : "Add Fee Type"}</span>
//         </button>
//       </div>

//       {/* View All Fee Types */}
//       {feeTypes.length > 0 && (
//         <div className="mt-8">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">
//             View All Fee Types
//           </h2>
//           <table className="w-full border border-gray-300">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border px-4 py-2 text-left text-gray-700">
//                   Fee Type
//                 </th>
//                 <th className="border px-4 py-2 text-left text-gray-700">
//                   Number of Terms
//                 </th>
//                 <th className="border px-4 py-2 text-left text-gray-700">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {feeTypes.map((fee, index) => (
//                 <tr key={index} className="hover:bg-gray-50">
//                   <td className="border px-4 py-2">{fee.type}</td>
//                   <td className="border px-4 py-2">{fee.terms}</td>
//                   <td className="border px-4 py-2 flex space-x-2">
//                     <button
//                       onClick={() => handleEditFeeType(index)}
//                       className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-400 transition"
//                     >
//                       <FaEdit />
//                     </button>
//                     <button
//                       onClick={() => handleDeleteFeeType(index)}
//                       className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-500 transition"
//                     >
//                       <FaTrash />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddFeeType;
import React, { useState, useEffect } from "react";
import { FaPlusCircle, FaTrash, FaEdit } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Allapi from "../../../common";

const AddFeeType = () => {
  const [feeTypes, setFeeTypes] = useState([]);
  const [newFeeType, setNewFeeType] = useState("");
  const [terms, setTerms] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const { acid } = useParams();
  console.log("academic-id", acid);
  // Fetch token from local storage
  const token = localStorage.getItem("token");

  // Fetch all fee types from the server
  const fetchFeeTypes = async () => {
    try {
      console.log("fetching");
      const response = await fetch(Allapi.getAllFeeTypes.url(acid), {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in the request
        },
      });
      const data = await response.json();
      if (data.success) {
        setFeeTypes(data.feeTypes);
      } else {
        toast.error(data.message || "Failed to fetch fee types");
      }
    } catch (error) {
      toast.error("Failed to fetch fee types");
    }
  };

  useEffect(() => {
    fetchFeeTypes();
  }, []);

  // Handle adding a new fee type
  const handleAddFeeType = async () => {
    if (newFeeType.trim() === "") {
      toast.error("Fee type cannot be empty");
      return;
    }

    try {
      console.log(acid);
      const response = await fetch(Allapi.AddFeeType.url, {
        method: Allapi.AddFeeType.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass token in the request
        },
        body: JSON.stringify({ type: newFeeType, terms, academicYear: acid }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Fee type added successfully");
        fetchFeeTypes(); // Refresh fee types
        setNewFeeType(""); // Reset input field
        setTerms(1); // Reset terms
      } else {
        toast.error(data.message || "Failed to add fee type");
      }
    } catch (error) {
      toast.error("Failed to add fee type");
    }
  };

  // Handle adding or updating fee type
  const handleAddOrUpdateFeeType = async () => {
    if (isEditing) {
      // Update fee type logic
      await handleUpdateFeeType();
    } else {
      // Add new fee type
      await handleAddFeeType();
    }
  };

  // Handle updating a fee type
  const handleUpdateFeeType = async () => {
    const feeTypeId = feeTypes[editIndex]._id;

    try {
      const response = await fetch(Allapi.updateFeeType.url(feeTypeId), {
        method: Allapi.updateFeeType.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass token in the request
        },
        body: JSON.stringify({ type: newFeeType, terms }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Fee type updated successfully");
        fetchFeeTypes(); // Refresh fee types
        resetForm(); // Reset form fields
      } else {
        toast.error(data.message || "Failed to update fee type");
      }
    } catch (error) {
      toast.error("Failed to update fee type");
    }
  };

  // Reset form fields
  const resetForm = () => {
    setNewFeeType("");
    setTerms(1);
    setIsEditing(false);
    setEditIndex(null);
  };

  // Handle editing fee type
  const handleEditFeeType = (index) => {
    setNewFeeType(feeTypes[index].type);
    setTerms(feeTypes[index].terms);
    setIsEditing(true);
    setEditIndex(index);
  };

  // Handle deleting fee type
  const handleDeleteFeeType = async (index) => {
    const feeTypeId = feeTypes[index]._id;

    if (window.confirm("Are you sure you want to delete this fee type?")) {
      try {
        const response = await fetch(Allapi.deleteFeeType.url(feeTypeId), {
          method: Allapi.deleteFeeType.method,
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in the request
          },
        });
        const data = await response.json();
        if (data.success) {
          toast.success("Fee type deleted successfully");
          fetchFeeTypes(); // Refresh fee types after deletion
        } else {
          toast.error(data.message || "Failed to delete fee type");
        }
      } catch (error) {
        toast.error("Failed to delete fee type");
      }
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Fee Type</h2>

      <div className="space-y-4">
        {/* Input for Fee Type */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Fee Type
          </label>
          <input
            type="text"
            value={newFeeType}
            onChange={(e) => setNewFeeType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter fee type (e.g., Admission Fee, Books Fee)"
          />
        </div>

        {/* Dropdown for Number of Terms */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Number of Terms
          </label>
          <select
            value={terms}
            onChange={(e) => setTerms(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            <option value={1}>1 Term</option>
            <option value={2}>2 Terms</option>
            <option value={3}>3 Terms</option>
            <option value={4}>4 Terms</option>
          </select>
        </div>

        {/* Button to Add or Update Fee Type */}
        <button
          onClick={handleAddOrUpdateFeeType}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition"
        >
          <FaPlusCircle />
          <span>{isEditing ? "Update Fee Type" : "Add Fee Type"}</span>
        </button>
      </div>

      {/* View All Fee Types */}
      {feeTypes.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            View All Fee Types
          </h2>
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left text-gray-700">
                  Fee Type
                </th>
                <th className="border px-4 py-2 text-left text-gray-700">
                  Number of Terms
                </th>
                <th className="border px-4 py-2 text-left text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {feeTypes.map((fee, index) => (
                <tr key={index} className="hover:bg-gray-50 text-gray-700">
                  <td className="border px-4 py-2">{fee.type}</td>
                  <td className="border px-4 py-2">{fee.terms}</td>
                  <td className="border px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => handleEditFeeType(index)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-400 transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteFeeType(index)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-500 transition"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AddFeeType;
