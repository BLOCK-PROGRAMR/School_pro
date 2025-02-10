// import React, { useContext, useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { FaTrash, FaEdit, FaUserPlus, FaSave, FaTimes } from "react-icons/fa"; // Add FaTimes for close icon
// import Allapi from "../../../common";
// import { mycon } from "../../../store/Mycontext";
// import "./animation.css"; // Import the CSS file for animations

// const ViewSections = () => {
//   const { branchdet } = useContext(mycon);
//   const [selectedClass, setSelectedClass] = useState("");
//   const [sections, setSections] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isViewOpen, setViewOpen] = useState(false);

//   const [selectedSection, setSelectedSection] = useState(null);
//   const [feeTypes, setFeeTypes] = useState([]);
//   const [fees, setFees] = useState([{ feeType: "", amount: "" }]); // Array of fee objects

//   const fetchClasses = async (curr_acad) => {
//     const token = localStorage.getItem("token");
//     try {
//       const response = await fetch(Allapi.getClasses.url(curr_acad), {
//         method: Allapi.getClasses.method,
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       const result = await response.json();
//       if (result.success) {
//         setClasses(result.data);
//       } else {
//         toast.error(result.message || "Failed to fetch classes");
//       }
//     } catch (error) {
//       console.error("Error fetching classes:", error);
//       toast.error("Error fetching classes");
//     }
//   };

//   function findObjectByKey(array, key, value) {
//     console.log("Array is", array);
//     console.log("key is", key);
//     console.log("value is", value);

//     const foundObject = array.find((obj) => {
//       console.log("Checking object:", obj);
//       return obj[key] === value; // Ensure the callback returns the condition
//     });

//     console.log("foundobj", foundObject);

//     return foundObject ? foundObject.terms : undefined;
//   }

//   const fetchSections = async (className, curr_acad) => {
//     const token = localStorage.getItem("token");
//     try {
//       const response = await fetch(
//         Allapi.getSectionsByClass.url(className, curr_acad),
//         {
//           method: Allapi.getSectionsByClass.method,
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       const result = await response.json();
//       if (result.success) {
//         setSections(result.data || []);
//       } else {
//         toast.error(result.message || "Failed to fetch sections");
//       }
//     } catch (error) {
//       console.error("Error fetching sections:", error);
//       toast.error("Error fetching sections");
//     }
//   };

//   const fetchFeeTypes = async (curr_Acad) => {
//     const token = localStorage.getItem("token");
//     try {
//       const response = await fetch(Allapi.getAllFeeTypes.url(curr_Acad), {
//         method: Allapi.getAllFeeTypes.method,
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       const result = await response.json();
//       if (result.success) {
//         setFeeTypes(result.feeTypes);
//       } else {
//         toast.error(result.message || "Failed to fetch fee types");
//       }
//     } catch (error) {
//       console.error("Error fetching fee types:", error);
//       toast.error("Error fetching fee types");
//     }
//   };

//   useEffect(() => {
//     if (
//       branchdet &&
//       branchdet.academicYears &&
//       branchdet.academicYears.length > 0
//     ) {
//       const currentAcademicYear = branchdet.academicYears[0];
//       fetchClasses(currentAcademicYear);
//       fetchFeeTypes(currentAcademicYear);
//     }
//   }, [branchdet]);

//   useEffect(() => {
//     if (selectedClass && branchdet && branchdet.academicYears.length > 0) {
//       const currentAcademicYear = branchdet.academicYears[0];
//       fetchSections(selectedClass, currentAcademicYear);
//     }
//   }, [selectedClass, selectedSection]);

//   const handleClassChange = (e) => {
//     setSelectedClass(e.target.value);
//   };

//   const handleAddFee = (section) => {
//     setSelectedSection(section);
//     setIsModalOpen(true);
//     setFees([{ feeType: "", amount: "" }]); // Reset fees array
//   };

//   const handleView = (section) => {
//     setSelectedSection(section);
//     setViewOpen(true);
//   };

//   const handleModalClose = () => {
//     setIsModalOpen(false);
//     setFees([{ feeType: "", amount: "" }]); // Reset fees array
//   };

//   const handleViewClose = () => {
//     setViewOpen(false);
//   };

//   const handleFeeChange = (index, field, value) => {
//     const updatedFees = [...fees];
//     updatedFees[index][field] = value;
//     setFees(updatedFees);
//   };

//   const handleAddFeeEntry = () => {
//     setFees([...fees, { feeType: "", amount: "" }]); // Add new empty fee entry
//   };

//   const handleRemoveFeeEntry = (index) => {
//     const updatedFees = fees.filter((_, i) => i !== index);
//     setFees(updatedFees); // Remove fee entry by index
//   };

//   // Handle fee deletion
//   const handleDeleteFee = async (sectionId, feeId) => {
//     const token = localStorage.getItem("token");

//     try {
//       const response = await fetch(
//         Allapi.deleteFeeStructure.url(sectionId, feeId),
//         {
//           method: Allapi.deleteFeeStructure.method,
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       const result = await response.json();

//       if (result.success) {
//         toast.success("Fee deleted successfully");
//         fetchSections(selectedClass, branchdet.academicYears[0]);
//         setViewOpen(false); // Refresh sections
//       } else {
//         toast.error(result.message || "Failed to delete fee");
//       }
//     } catch (error) {
//       console.error("Error deleting fee:", error);
//       toast.error("Error deleting fee");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");

//     // Validate the fees array
//     for (const fee of fees) {
//       if (!fee.feeType || !fee.amount) {
//         toast.error("Please fill in all fields for each fee entry");
//         return;
//       }
//     }

//     try {
//       const response = await fetch(
//         Allapi.addFeeStructure.url(selectedSection._id),
//         {
//           method: Allapi.addFeeStructure.method,
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ fees }), // Send the entire fees array
//         }
//       );
//       const result = await response.json();
//       if (result.success) {
//         toast.success("Fees added successfully");
//         handleModalClose();
//         fetchSections(selectedClass, branchdet.academicYears[0]);
//       } else {
//         toast.error(result.message || "Failed to add fee");
//       }
//     } catch (error) {
//       console.error("Error adding fee:", error);
//       toast.error("Error adding fee");
//     }
//   };

//   return (
//     <div className="mt-16 p-8 max-w-3xl mx-auto bg-white shadow-lg rounded-2xl text-gray-700">
//       <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
//         View Sections
//       </h2>
//       <select
//         value={selectedClass}
//         onChange={handleClassChange}
//         className="p-2 border rounded-md w-full mb-6"
//       >
//         <option value="">Select a class</option>
//         {classes.map((cls) => (
//           <option key={cls._id} value={cls.name}>
//             {cls.name}
//           </option>
//         ))}
//       </select>

//       <ul className="divide-y divide-gray-300">
//         {sections.length === 0 ? (
//           <p className="text-gray-600 text-center">No sections available.</p>
//         ) : (
//           sections.map((section) => (
//             <li
//               key={section._id}
//               className="flex items-center justify-between py-2"
//             >
//               <span className="text-black">{section.name}</span>
//               <div className="flex space-x-2">
//                 {section.fees && section.fees.length === 0 ? (
//                   <button
//                     className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-500 transition flex items-center"
//                     onClick={() => handleAddFee(section)}
//                   >
//                     <FaSave />
//                     <span className="ml-1">Add Fee</span>
//                   </button>
//                 ) : (
//                   <button
//                     className="px-3 py-1 bg-yellow-300 text-gray-700 rounded-md hover:bg-yellow-400 transition flex items-center"
//                     onClick={() => handleView(section)}
//                   >
//                     <FaSave />
//                     <span className="ml-1">View Fee</span>
//                   </button>
//                 )}
//               </div>
//             </li>
//           ))
//         )}
//       </ul>
//       {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//           <div className={`bg-white rounded-lg p-6 shadow-lg modal-animation`}>
//             <h2 className="text-xl font-bold mb-4 text-gray-700">
//               Add Fee for {selectedSection?.name}
//             </h2>
//             <form onSubmit={handleSubmit} className="text-gray-700">
//               {fees.map((fee, index) => (
//                 <div key={index} className="flex mb-4">
//                   <div className="w-1/2 mr-2">
//                     <label className="block mb-1">Fee Type:</label>
//                     <select
//                       value={fee.feeType}
//                       onChange={(e) =>
//                         handleFeeChange(index, "feeType", e.target.value)
//                       }
//                       className="p-2 border rounded-md w-full"
//                     >
//                       <option value="">Select Fee Type</option>
//                       {feeTypes.map((feeType) => (
//                         <option key={feeType._id} value={feeType.name}>
//                           {feeType.type}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="w-1/2 ml-2">
//                     <label className="block mb-1">Amount:</label>
//                     <input
//                       type="number"
//                       value={fee.amount}
//                       onChange={(e) =>
//                         handleFeeChange(index, "amount", e.target.value)
//                       }
//                       className="p-2 border rounded-md w-full"
//                       placeholder="Amount"
//                     />
//                   </div>
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveFeeEntry(index)}
//                     className="ml-2 mt-6 text-red-600 hover:text-red-500"
//                   >
//                     <FaTrash />
//                   </button>
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={handleAddFeeEntry}
//                 className="mb-4 px-3 py-1 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition"
//               >
//                 Add Another Fee
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
//               >
//                 Save Fees
//               </button>
//               <button
//                 type="button"
//                 onClick={handleModalClose}
//                 className="px-4 py-2 ml-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition"
//               >
//                 Close
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* View Fee Modal */}
//       {isViewOpen && selectedSection && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl w-full relative">
//             <button
//               className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
//               onClick={handleViewClose}
//             >
//               <FaTimes />
//             </button>
//             <h2 className="text-xl font-bold mb-4">
//               Fee Structure for {selectedSection.name}
//             </h2>
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr>
//                   <th className="border-b-2 py-2 px-4">Fee Type</th>
//                   <th className="border-b-2 py-2 px-4">Terms</th>

//                   <th className="border-b-2 py-2 px-4">Amount (Rs)</th>
//                   <th className="border-b-2 py-2 px-4">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedSection.fees.map((fee, index) => (
//                   <tr key={index} className="hover:bg-gray-100">
//                     <td className="py-2 px-4 border-b">{fee.feeType}</td>
//                     <td className="py-2 px-4 border-b">
//                       {findObjectByKey(feeTypes, "type", fee.feeType)}
//                     </td>
//                     <td className="py-2 px-4 border-b">Rs {fee.amount}</td>
//                     <td className="py-2 px-4 border-b">
//                       <FaTrash
//                         className="text-red-500 cursor-pointer hover:text-red-700"
//                         onClick={() =>
//                           handleDeleteFee(selectedSection._id, fee._id)
//                         }
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ViewSections;

import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaTrash, FaEdit, FaUserPlus, FaSave, FaTimes } from "react-icons/fa"; // Add FaTimes for close icon
import Allapi from "../../../common";
import { mycon } from "../../../store/Mycontext";
import "./animation.css"; // Import the CSS file for animations
import UpdateFeeModal from "./Updatefee";
const ViewSections = () => {
  const { branchdet } = useContext(mycon);
  const [selectedClass, setSelectedClass] = useState("");
  const [sections, setSections] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOpen, setViewOpen] = useState(false);

  const [selectedSection, setSelectedSection] = useState(null);
  const [feeTypes, setFeeTypes] = useState([]);
  const [fees, setFees] = useState([{ feeType: "", amount: "" }]); // Array of fee objects

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
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [sectionToUpdate, setSectionToUpdate] = useState(null);

  const handleUpdateFee = (section) => {
    setSectionToUpdate(section);
    setIsUpdateModalOpen(true);
  };

  function findObjectByKey(array, key, value) {
    console.log("Array is", array);
    console.log("key is", key);
    console.log("value is", value);

    const foundObject = array.find((obj) => {
      console.log("Checking object:", obj);
      return obj[key] === value; // Ensure the callback returns the condition
    });

    console.log("foundobj", foundObject);

    return foundObject ? foundObject.terms : undefined;
  }

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

  useEffect(() => {
    if (
      branchdet &&
      branchdet.academicYears &&
      branchdet.academicYears.length > 0
    ) {
      const currentAcademicYear = branchdet.academicYears[0];
      fetchClasses(currentAcademicYear);
      fetchFeeTypes(currentAcademicYear);
    }
  }, [branchdet]);

  useEffect(() => {
    if (selectedClass && branchdet && branchdet.academicYears.length > 0) {
      const currentAcademicYear = branchdet.academicYears[0];
      fetchSections(selectedClass, currentAcademicYear);
    }
  }, [selectedClass, selectedSection]);

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleAddFee = (section) => {
    setSelectedSection(section);
    setIsModalOpen(true);
    setFees([{ feeType: "", amount: "" }]); // Reset fees array
  };

  const handleView = (section) => {
    setSelectedSection(section);
    setViewOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setFees([{ feeType: "", amount: "" }]); // Reset fees array
  };

  const handleViewClose = () => {
    setViewOpen(false);
  };

  const handleFeeChange = (index, field, value) => {
    const updatedFees = [...fees];
    updatedFees[index][field] = value;
    setFees(updatedFees);
  };

  const handleAddFeeEntry = () => {
    setFees([...fees, { feeType: "", amount: "" }]); // Add new empty fee entry
  };

  const handleRemoveFeeEntry = (index) => {
    const updatedFees = fees.filter((_, i) => i !== index);
    setFees(updatedFees); // Remove fee entry by index
  };

  // Handle fee deletion
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
        setViewOpen(false); // Refresh sections
      } else {
        toast.error(result.message || "Failed to delete fee");
      }
    } catch (error) {
      console.error("Error deleting fee:", error);
      toast.error("Error deleting fee");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Validate the fees array
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
          body: JSON.stringify({ fees }), // Send the entire fees array
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
                    <FaSave />
                    <span className="ml-1">Add Fee</span>
                  </button>
                ) : (
                  <button
                    className="px-3 py-1 bg-yellow-300 text-gray-700 rounded-md hover:bg-yellow-400 transition flex items-center"
                    onClick={() => handleView(section)}
                  >
                    <FaSave />
                    <span className="ml-1">View Fee</span>
                  </button>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className={`bg-white rounded-lg p-6 shadow-lg modal-animation`}>
            <h2 className="text-xl font-bold mb-4 text-gray-700">
              Add Fee for {selectedSection?.name}
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
              <button
                type="button"
                onClick={handleAddFeeEntry}
                className="mb-4 px-3 py-1 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition"
              >
                Add Another Fee
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
              >
                Save Fees
              </button>
              <button
                type="button"
                onClick={handleModalClose}
                className="px-4 py-2 ml-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition"
              >
                Close
              </button>
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
                  <td className="py-2 px-4 border-b">
                    <FaEdit
                      className="text-blue-500 cursor-pointer hover:text-blue-700 mr-2"
                      onClick={() => handleUpdateFee(selectedSection)}
                    />
                  </td>
                </tr>
              </thead>
              <tbody>
                {selectedSection.fees.map((fee, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{fee.feeType}</td>
                    <td className="py-2 px-4 border-b">
                      {findObjectByKey(feeTypes, "type", fee.feeType)}
                    </td>
                    <td className="py-2 px-4 border-b">Rs {fee.amount}</td>
                    <td className="py-2 px-4 border-b">
                      <FaTrash
                        className="text-red-500 cursor-pointer hover:text-red-700"
                        onClick={() =>
                          handleDeleteFee(selectedSection._id, fee._id)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Update Fee Modal */}
              {isUpdateModalOpen && sectionToUpdate && (
                <UpdateFeeModal
                  section={sectionToUpdate}
                  onClose={() => setIsUpdateModalOpen(false)}
                  refreshSections={() =>
                    fetchSections(selectedClass, branchdet.academicYears[0])
                  }
                  feeTypes={feeTypes}
                />
              )}
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSections;
