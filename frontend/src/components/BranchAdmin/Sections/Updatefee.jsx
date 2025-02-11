// import React, { useState } from "react";
// import { FaTrash, FaTimes } from "react-icons/fa";
// import { toast } from "react-toastify";
// import Allapi from "../../../common";

// const UpdateFeeModal = ({ section, onClose, refreshSections, feeTypes }) => {
//   const [fees, setFees] = useState(section.fees || []);

//   const handleFeeChange = (index, field, value) => {
//     const updatedFees = [...fees];
//     updatedFees[index][field] = value;
//     setFees(updatedFees);
//   };

//   const handleRemoveFeeEntry = (index) => {
//     const updatedFees = fees.filter((_, i) => i !== index);
//     setFees(updatedFees);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");

//     for (const fee of fees) {
//       if (!fee.feeType || !fee.amount) {
//         toast.error("Please fill in all fields for each fee entry");
//         return;
//       }
//     }

//     try {
//       const response = await fetch(Allapi.updateFeeStructure.url(section._id), {
//         method: Allapi.updateFeeStructure.method,
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ fees }),
//       });

//       const result = await response.json();
//       if (result.success) {
//         toast.success("Fees updated successfully");
//         onClose();
//         refreshSections();
//       } else {
//         toast.error(result.message || "Failed to update fee");
//       }
//     } catch (error) {
//       console.error("Error updating fee:", error);
//       toast.error("Error updating fee");
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 shadow-lg">
//         <h2 className="text-xl font-bold mb-4">
//           Update Fee for {section.name}
//         </h2>
//         <form onSubmit={handleSubmit}>
//           {fees.map((fee, index) => (
//             <div key={index} className="flex mb-4">
//               <div className="w-1/2 mr-2">
//                 <label className="block mb-1">Fee Type:</label>
//                 <select
//                   value={fee.feeType}
//                   onChange={(e) =>
//                     handleFeeChange(index, "feeType", e.target.value)
//                   }
//                   className="p-2 border rounded-md w-full"
//                 >
//                   <option value="">Select Fee Type</option>
//                   {feeTypes.map((feeType) => (
//                     <option key={feeType._id} value={feeType.name}>
//                       {feeType.type}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="w-1/2 ml-2">
//                 <label className="block mb-1">Amount:</label>
//                 <input
//                   type="number"
//                   value={fee.amount}
//                   onChange={(e) =>
//                     handleFeeChange(index, "amount", e.target.value)
//                   }
//                   className="p-2 border rounded-md w-full"
//                   placeholder="Amount"
//                 />
//               </div>
//               <button
//                 type="button"
//                 onClick={() => handleRemoveFeeEntry(index)}
//                 className="ml-2 mt-6 text-red-600 hover:text-red-500"
//               >
//                 <FaTrash />
//               </button>
//             </div>
//           ))}
//           <button
//             type="submit"
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
//           >
//             Update Fees
//           </button>
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 py-2 ml-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition"
//           >
//             Close
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UpdateFeeModal;

import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import Allapi from "../../../common";

const UpdateFeeModal = ({ section, onClose, refreshSections, feeTypes }) => {
  const [fees, setFees] = useState(section.fees || []);

  // Handle Fee Type & Amount Change
  const handleFeeChange = (index, field, value) => {
    const updatedFees = [...fees];
    updatedFees[index][field] = value;
    setFees(updatedFees);
  };

  // Add Another Fee Entry
  const handleAddFeeEntry = () => {
    setFees([...fees, { feeType: "", amount: "" }]);
  };

  // Remove a Fee Entry
  const handleRemoveFeeEntry = (index) => {
    const updatedFees = fees.filter((_, i) => i !== index);
    setFees(updatedFees);
  };

  // Submit Updated Fees
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Ensure all fields are filled
    for (const fee of fees) {
      if (!fee.feeType || !fee.amount) {
        toast.error("Please fill in all fields for each fee entry");
        return;
      }
    }

    try {
      console.log("section id is", section._id);
      const response = await fetch(Allapi.updateFeeStructure.url(section._id), {
        method: Allapi.updateFeeStructure.method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fees }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Fees updated successfully");
        onClose();
        refreshSections();
      } else {
        toast.error(result.message || "Failed to update fee");
      }
    } catch (error) {
      console.error("Error updating fee:", error);
      toast.error("Error updating fee");
    }
  };

  return (
    <>
      {section && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg modal-animation">
            <h2 className="text-xl font-bold mb-4 text-gray-700">
              Update Fee for {section.name}
            </h2>
            <form onSubmit={handleSubmit} className="text-gray-700">
              {fees.map((fee, index) => (
                <div key={index} className="flex mb-4">
                  <div className="w-1/2 mr-2">
                    <label className="block mb-1">Fee Type:</label>
                    <select
                      value={fee.feeType}
                      onChange={(e) =>
                        handleFeeChange(index, "feeType", e.target.value)
                      }
                      className="p-2 border rounded-md w-full"
                    >
                      <option value="">Select Fee Type</option>
                      {feeTypes.map((feeType) => (
                        <option key={feeType._id} value={feeType.name}>
                          {feeType.type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-1/2 ml-2">
                    <label className="block mb-1">Amount:</label>
                    <input
                      type="number"
                      value={fee.amount}
                      onChange={(e) =>
                        handleFeeChange(index, "amount", e.target.value)
                      }
                      className="p-2 border rounded-md w-full"
                      placeholder="Amount"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeeEntry(index)}
                    className="ml-2 mt-6 text-red-600 hover:text-red-500"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              {/* Add Another Fee Button */}
              <button
                type="button"
                onClick={handleAddFeeEntry}
                className="mb-4 px-3 py-1 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition"
              >
                Add Another Fee
              </button>
              {/* Save Fee Button */}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
              >
                Save Fees
              </button>
              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 ml-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateFeeModal;
