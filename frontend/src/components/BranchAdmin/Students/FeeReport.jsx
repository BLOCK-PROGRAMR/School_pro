// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import { useParams } from "react-router-dom";
// import Allapi from "../../../common"; // Adjust according to your API utility file

// const FeeReport = () => {
//   const [student, setStudent] = useState(null);
//   const { sid } = useParams();
//   const [selectedTerm, setSelectedTerm] = useState(null);
//   const [studentDataForm, setStudentDataForm] = useState({
//     padiFee: [],
//   });

//   useEffect(() => {
//     if (sid) fetchStudentById(sid);
//   }, [sid]);

//   const fetchStudentById = async (sid) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(Allapi.getstudentbyId.url(sid), {
//         method: Allapi.getstudentbyId.method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const result = await response.json();
//       if (result.success) {
//         const initialPaidFee = result.data.feeDetails.map((fee) => {
//           const finalAmount = fee.concession ? fee.finalAmount : fee.amount;
//           return {
//             name: fee.name,
//             finalAmount,
//             extractedAmount: finalAmount / fee.terms,
//             paidAmount: 0,
//             due: 0,
//             enteredAmount: 0,
//           };
//         });

//         setStudentDataForm((prev) => ({
//           ...prev,
//           padiFee: initialPaidFee,
//         }));

//         setStudent(result.data);
//       } else {
//         toast.error(result.message || "Failed to fetch student data.");
//       }
//     } catch (error) {
//       console.error("Error fetching student data:", error);
//       toast.error("An error occurred while fetching student data.");
//     }
//   };

//   const handleTermChange = (term) => {
//     setSelectedTerm(term);
//     setStudentDataForm((prev) => {
//       const updatedPadiFee = prev.padiFee.map((fee) => {
//         const termValue = parseInt(term.split("-")[1], 10);
//         const dueAmount = fee.extractedAmount * termValue;
//         return {
//           ...fee,
//           paidAmount: fee.paidAmount, // Retain already paid amount
//           due: dueAmount > fee.finalAmount ? fee.finalAmount : dueAmount,
//           enteredAmount: 0, // Reset entered amount on term change
//         };
//       });
//       return {
//         ...prev,
//         padiFee: updatedPadiFee,
//       };
//     });
//   };

//   const handleEnteredAmountChange = (feeName, value) => {
//     setStudentDataForm((prev) => {
//       const updatedPadiFee = prev.padiFee.map((fee) => {
//         if (fee.name === feeName) {
//           return {
//             ...fee,
//             enteredAmount: value,
//           };
//         }
//         return fee;
//       });
//       return {
//         ...prev,
//         padiFee: updatedPadiFee,
//       };
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Payment Details Submitted:", studentDataForm);
//     toast.success("Fee Paid Successfully!");
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen p-6 flex justify-center">
//       <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-green-400 to-blue-500 p-5 text-white rounded-t-lg flex justify-between">
//           <h2 className="text-2xl font-bold">Fee Payment</h2>
//           <span>Student Details & Fees</span>
//         </div>

//         {/* Student Details */}
//         {student && (
//           <div className="p-5 border-b">
//             <h3 className="text-xl font-bold mb-3 text-gray-700">
//               Student Details
//             </h3>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-600">
//               <p>
//                 <span className="font-semibold">ID:</span> {student.idNo}
//               </p>
//               <p>
//                 <span className="font-semibold">Name:</span> {student.name}
//               </p>
//               <p>
//                 <span className="font-semibold">Class:</span>{" "}
//                 {student.id ? student.id.name : "N/A"}
//               </p>
//               <p>
//                 <span className="font-semibold">Section:</span>{" "}
//                 {student.section ? student.section.name : "N/A"}
//               </p>
//               <p>
//                 <span className="font-semibold">Admission No:</span>{" "}
//                 {student.admissionNo}
//               </p>
//               <p>
//                 <span className="font-semibold">Aadhar No:</span>{" "}
//                 {student.aadharNo}
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Select Term */}
//         <div className="p-5 border-b">
//           <label className="block text-gray-700 mb-2 text-lg font-semibold">
//             Select Term
//           </label>
//           <select
//             className="border p-2 rounded w-full"
//             value={selectedTerm || ""}
//             onChange={(e) => handleTermChange(e.target.value)}
//           >
//             <option value="">Select Term</option>
//             {Array.from({ length: 4 }, (_, i) => `Term-${i + 1}`).map(
//               (term) => (
//                 <option key={term} value={term}>
//                   {term}
//                 </option>
//               )
//             )}
//           </select>
//         </div>

//         {/* Fee Form */}
//         <form onSubmit={handleSubmit} className="p-5">
//           <div className="mb-5">
//             <h3 className="text-lg font-semibold text-gray-700 mb-2">
//               Fee Details
//             </h3>
//             <table className="w-full border-collapse border text-left">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="p-2 border">Fee Type</th>
//                   <th className="p-2 border">Final Amount</th>
//                   <th className="p-2 border">Paid Amount</th>
//                   <th className="p-2 border">Due</th>
//                   <th className="p-2 border">Enter Amount</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {studentDataForm.padiFee.map((fee) => (
//                   <tr key={fee.name}>
//                     <td className="p-2 border">{fee.name}</td>
//                     <td className="p-2 border">{fee.finalAmount}</td>
//                     <td className="p-2 border">{fee.paidAmount}</td>
//                     <td className="p-2 border">{fee.due}</td>
//                     <td className="p-2 border">
//                       <input
//                         type="number"
//                         className="border p-1 rounded w-full"
//                         value={fee.enteredAmount || ""}
//                         onChange={(e) =>
//                           handleEnteredAmountChange(
//                             fee.name,
//                             parseFloat(e.target.value) || 0
//                           )
//                         }
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Payment Type */}
//           <div className="mb-5">
//             <label className="block text-gray-700 mb-1">Payment Type</label>
//             <select
//               name="paymentType"
//               value={studentDataForm.paymentType || ""}
//               onChange={(e) =>
//                 setStudentDataForm({
//                   ...studentDataForm,
//                   paymentType: e.target.value,
//                 })
//               }
//               className="border p-2 rounded w-full"
//             >
//               <option value="Cash">Cash</option>
//               <option value="Online">Online Payment</option>
//             </select>
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded text-lg font-semibold"
//           >
//             Submit Payment
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FeeReport;

// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import { useParams } from "react-router-dom";
// import Allapi from "../../../common"; // Adjust according to your API utility file

// const FeeReport = () => {
//   const [student, setStudent] = useState(null);
//   const { sid } = useParams();
//   const [selectedTerm, setSelectedTerm] = useState(null);
//   const [studentDataForm, setStudentDataForm] = useState({
//     padiFee: [],
//   });

//   useEffect(() => {
//     if (sid) fetchStudentById(sid);
//   }, [sid]);

//   const fetchStudentById = async (sid) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(Allapi.getstudentbyId.url(sid), {
//         method: Allapi.getstudentbyId.method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const result = await response.json();
//       if (result.success) {
//         const initialPaidFee = result.data.feeDetails.map((fee) => {
//           const finalAmount = fee.concession ? fee.finalAmount : fee.amount;
//           return {
//             name: fee.name,
//             finalAmount,
//             terms: fee.terms, // No. of terms added
//             extractedAmount: finalAmount / fee.terms,
//             paidAmount: 0,
//             due: 0,
//             enteredAmount: 0,
//           };
//         });

//         setStudentDataForm((prev) => ({
//           ...prev,
//           padiFee: initialPaidFee,
//         }));

//         setStudent(result.data);
//       } else {
//         toast.error(result.message || "Failed to fetch student data.");
//       }
//     } catch (error) {
//       console.error("Error fetching student data:", error);
//       toast.error("An error occurred while fetching student data.");
//     }
//   };

//   const handleTermChange = (term) => {
//     setSelectedTerm(term);
//     setStudentDataForm((prev) => {
//       const updatedPadiFee = prev.padiFee.map((fee) => {
//         const termValue = parseInt(term.split("-")[1], 10);
//         const dueAmount = fee.extractedAmount * termValue;
//         return {
//           ...fee,
//           paidAmount: fee.paidAmount,
//           due: dueAmount > fee.finalAmount ? fee.finalAmount : dueAmount,
//           enteredAmount: 0,
//         };
//       });
//       return {
//         ...prev,
//         padiFee: updatedPadiFee,
//       };
//     });
//   };

//   const handleEnteredAmountChange = (feeName, value) => {
//     setStudentDataForm((prev) => {
//       const updatedPadiFee = prev.padiFee.map((fee) => {
//         if (fee.name === feeName) {
//           return {
//             ...fee,
//             enteredAmount: value,
//           };
//         }
//         return fee;
//       });
//       return {
//         ...prev,
//         padiFee: updatedPadiFee,
//       };
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Payment Details Submitted:", studentDataForm);
//     toast.success("Fee Paid Successfully!");
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen p-6 flex justify-center">
//       <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-green-400 to-blue-500 p-5 text-white rounded-t-lg flex justify-between">
//           <h2 className="text-2xl font-bold">Fee Payment</h2>
//           <span>Student Details & Fees</span>
//         </div>

//         {/* Student Details */}
//         {student && (
//           <div className="p-5 border-b">
//             <h3 className="text-xl font-bold mb-3 text-gray-700">
//               Student Details
//             </h3>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-600">
//               <p>
//                 <span className="font-semibold">ID:</span> {student.idNo}
//               </p>
//               <p>
//                 <span className="font-semibold">Name:</span> {student.name}
//               </p>
//               <p>
//                 <span className="font-semibold">Class:</span>{" "}
//                 {student.id ? student.id.name : "N/A"}
//               </p>
//               <p>
//                 <span className="font-semibold">Section:</span>{" "}
//                 {student.section ? student.section.name : "N/A"}
//               </p>
//               <p>
//                 <span className="font-semibold">Admission No:</span>{" "}
//                 {student.admissionNo}
//               </p>
//               <p>
//                 <span className="font-semibold">Aadhar No:</span>{" "}
//                 {student.aadharNo}
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Select Term */}
//         <div className="p-5 border-b">
//           <label className="block text-gray-700 mb-2 text-lg font-semibold">
//             Select Term
//           </label>
//           <select
//             className="border p-2 rounded w-full"
//             value={selectedTerm || ""}
//             onChange={(e) => handleTermChange(e.target.value)}
//           >
//             <option value="">Select Term</option>
//             {Array.from({ length: 4 }, (_, i) => `Term-${i + 1}`).map(
//               (term) => (
//                 <option key={term} value={term}>
//                   {term}
//                 </option>
//               )
//             )}
//           </select>
//         </div>

//         {/* Fee Form */}
//         <form onSubmit={handleSubmit} className="p-5">
//           <div className="mb-5">
//             <h3 className="text-lg font-semibold text-gray-700 mb-2">
//               Fee Details
//             </h3>
//             <table className="w-full border-collapse border text-left">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="p-2 border">Fee Type</th>
//                   <th className="p-2 border">Final Amount</th>
//                   <th className="p-2 border">No. of Terms</th>
//                   <th className="p-2 border">Paid Amount</th>
//                   <th className="p-2 border">Due</th>
//                   <th className="p-2 border">Enter Amount</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {studentDataForm.padiFee.map((fee) => (
//                   <tr key={fee.name}>
//                     <td className="p-2 border">{fee.name}</td>
//                     <td className="p-2 border">{fee.finalAmount}</td>
//                     <td className="p-2 border">{fee.terms}</td>
//                     <td className="p-2 border">{fee.paidAmount}</td>
//                     <td className="p-2 border">{fee.due}</td>
//                     <td className="p-2 border">
//                       <input
//                         type="number"
//                         className="border p-1 rounded w-full"
//                         value={fee.enteredAmount || ""}
//                         onChange={(e) =>
//                           handleEnteredAmountChange(
//                             fee.name,
//                             parseFloat(e.target.value) || 0
//                           )
//                         }
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Payment Type */}
//           <div className="mb-5">
//             <label className="block text-gray-700 mb-1">Payment Type</label>
//             <select
//               name="paymentType"
//               value={studentDataForm.paymentType || ""}
//               onChange={(e) =>
//                 setStudentDataForm({
//                   ...studentDataForm,
//                   paymentType: e.target.value,
//                 })
//               }
//               className="border p-2 rounded w-full"
//             >
//               <option value="Cash">Cash</option>
//               <option value="Online">Online Payment</option>
//             </select>
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded text-lg font-semibold"
//           >
//             Submit Payment
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FeeReport;

import React, { useState, useEffect ,useContext} from "react";


import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Allapi from "../../../common"; // Adjust according to your API utility file
import { mycon } from "../../../store/Mycontext";

const FeeReport = () => {
  const [student, setStudent] = useState(null);
  const { sid } = useParams();
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [numTerms, setNumTerms] = useState(null);
    const { branchdet } = useContext(mycon);
  const [acid,setAcid]=useState(null)
  const [studentDataForm, setStudentDataForm] = useState({
    padiFee: [],
    paymentType: "",
  });

  useEffect(() => {
    if (sid) fetchStudentById(sid);
    // if(branchdet.academicYears) setAcid(branchdet.academicYears[0])
    // console.log(student)
    // console.log(mycon)
  }, [sid]);

  const fetchStudentById = async (sid) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(Allapi.getstudentbyId.url(sid), {
        method: Allapi.getstudentbyId.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        console.log(result.data.feeDetails);
        const maxTerms = Math.max(
          ...result.data.feeDetails.map((fee) => parseInt(fee.terms, 10))
        );

        // Set the numTerms state to the highest term value
        setNumTerms(maxTerms);
        alert(maxTerms);
        const initialPaidFee = result.data.feeDetails.map((fee) => {
          // Ensure paidFee is set to 0 if it's missing
          const paidAmount = fee.paidFee ? fee.paidFee : 0;
          const finalAmount = fee.finalAmount; // Fix: define finalAmount here
          return {
            name: fee.name,
            amount: fee.amount,
            terms: fee.terms,
            concession: fee.concession,
            finalAmount, // Use finalAmount here
            extractedAmount: finalAmount / fee.terms,
            paidAmount, // Set to 0 if no paidFee is provided
            due: finalAmount - paidAmount, // Adjust due based on paidAmount
            enteredAmount: 0, // Initialize enteredAmount to 0
          };
        });
        console.log(initialPaidFee);
        setStudentDataForm((prev) => ({
          ...prev,
          padiFee: initialPaidFee,
        }));

        setStudent(result.data);
  
      } else {
        toast.error(result.message || "Failed to fetch student data.");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast.error("An error occurred while fetching student data.");
    }
  };

  const handleTermChange = (term) => {
    setSelectedTerm(term);
    setStudentDataForm((prev) => {
      const updatedPadiFee = prev.padiFee.map((fee) => {
        let termValue = parseInt(term.split("-")[1], 10);
        // Fix typo
        console.log(termValue);
        termValue > fee.terms
          ? (termValue = fee.terms)
          : (termValue = termValue);
        console.log("termvalue ,", fee.terms);
        const dueAmount =
          termValue * fee.extractedAmount - fee.paidAmount > 0
            ? termValue * fee.extractedAmount - fee.paidAmount
            : 0;
        // Ensure due calculation considers the correct term
        return {
          ...fee,
          due: dueAmount, // Adjusted the formula
        };
      });
      return {
        ...prev,
        padiFee: updatedPadiFee,
      };
    });
  };

  const handleEnteredAmountChange = (feeName, value) => {
    setStudentDataForm((prev) => {
      const updatedPadiFee = prev.padiFee.map((fee) => {
        if (fee.name === feeName) {
          const enteredAmount = parseFloat(value) || 0;
          if (enteredAmount > fee.due) {
            toast.error(`Entered amount for ${fee.name} exceeds due amount.`);
            return fee;
          }
          return {
            ...fee,
            enteredAmount,
          };
        }
        return fee;
      });
      return {
        ...prev,
        padiFee: updatedPadiFee,
      };
    });
  };
  const handleSubmit = async (e) => {
    console.log(studentDataForm.padiFee, "padi"); // Check the value of padiFee
    e.preventDefault();
    const paymentDetails = studentDataForm.padiFee;

    if (paymentDetails.length === 0 || !studentDataForm.paymentType) {
      toast.error("Please enter payment details and select a payment type.");
      return;
    }

    try {
      // Update the fee details for the student
      const token = localStorage.getItem("token");

      // Log the payment details to see if enteredAmount and padiFee exist
      console.log(paymentDetails, "paymentDetails before update");

      const updatedFeeDetails = paymentDetails.map((fee) => {
        console.log(fee, "fee before update");

        const updatedFee = {
          name: fee.name,
          amount: fee.amount,
          terms: fee.terms,
          concession: fee.concession || 0,
          finalAmount: fee.finalAmount,
          // Ensure enteredAmount and padiFee are added correctly
          paidFee: fee.enteredAmount + fee.paidAmount, // Add padiFee if available, otherwise 0
        };

        console.log(updatedFee, "updatedFee");
        return updatedFee;
      });

      console.log(updatedFeeDetails, "updatedFeeDetails");

      const feeResponse = await fetch(Allapi.payFeeById.url(sid), {
        method: Allapi.payFeeById.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          feeDetails: updatedFeeDetails,
        }),
      });

      const feeResult = await feeResponse.json();

      if (!feeResult.success) {
        toast.error(feeResult.message || "Failed to update fee details.");
        return;
      }

      // Create the receipt
      const receiptResponse = await fetch(Allapi.addReciepts.url, {
        method: Allapi.addReciepts.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          academicYearID: student.academic_id,
          studentID: student.idNo,
          date: new Date(),
          rcNo: `RC-${Date.now()}`, // Generate a unique receipt number
          feeLedger: paymentDetails.map((fee) => ({
            name: fee.name,
            amount: fee.enteredAmount,
          })),
        }),
      }); 
      console.log(student,"t")

      const receiptResult = await receiptResponse.json();

      if (receiptResult.success) {
        toast.success("Fee Paid Successfully and Receipt Created!");
        console.log(receiptResult);
        window.location.reload();
        fetchStudentById(sid); // Refresh data
      } else {
        toast.error(receiptResult.message || "Failed to create receipt.");
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
      toast.error("An error occurred during payment submission.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6 flex justify-center">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl">
        <div className="bg-gradient-to-r from-green-400 to-blue-500 p-5 text-white rounded-t-lg flex justify-between">
          <h2 className="text-2xl font-bold">Fee Payment</h2>
          <span>Student Details & Fees</span>
        </div>

        {student && (
          <div className="p-5 border-b">
            <h3 className="text-xl font-bold mb-3 text-gray-700">
              Student Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-600">
              <p>
                <span className="font-semibold">ID:</span> {student.idNo}
              </p>
              <p>
                <span className="font-semibold">Name:</span> {student.name}
              </p>
              <p>
                <span className="font-semibold">Class:</span>{" "}
                {student.class?.name || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Section:</span>{" "}
                {student.section?.name || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Admission No:</span>{" "}
                {student.admissionNo}
              </p>
              <p>
                <span className="font-semibold">Aadhar No:</span>{" "}
                {student.aadharNo}
              </p>
            </div>
          </div>
        )}

        <div className="p-5 border-b">
          <label className="block text-gray-700 mb-2 text-lg font-semibold">
            Select Term
          </label>
          <select
            className="border p-2 rounded w-full"
            value={selectedTerm || ""}
            onChange={(e) => handleTermChange(e.target.value)}
          >
            <option value="">Select Term</option>
            {Array.from({ length: numTerms }, (_, i) => `Term-${i + 1}`).map(
              (term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              )
            )}
          </select>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Fee Details
            </h3>
            <table className="w-full border-collapse border text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Fee Type</th>
                  <th className="p-2 border">Final Amount</th>
                  <th className="p-2 border">No. of Terms</th>
                  <th className="p-2 border">Paid Amount</th>
                  <th className="p-2 border">Due</th>
                  <th className="p-2 border">Enter Amount</th>
                </tr>
              </thead>
              <tbody>
                {studentDataForm.padiFee.map((fee) => (
                  <tr key={fee.name}>
                    <td className="p-2 border">{fee.name}</td>
                    <td className="p-2 border">{fee.finalAmount}</td>
                    <td className="p-2 border">{fee.terms}</td>
                    <td className="p-2 border">{fee.paidAmount}</td>
                    <td className="p-2 border">{fee.due}</td>
                    <td className="p-2 border">
                      <input
                        type="number"
                        className="border p-1 rounded w-full"
                        value={fee.enteredAmount || ""}
                        onChange={(e) =>
                          handleEnteredAmountChange(fee.name, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 mb-1">Payment Type</label>
            <select
              name="paymentType"
              value={studentDataForm.paymentType || ""}
              onChange={(e) =>
                setStudentDataForm({
                  ...studentDataForm,
                  paymentType: e.target.value,
                })
              }
              className="border p-2 rounded w-full"
            >
              <option value="">Select Payment Type</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Online">Online</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
          >
            Submit Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeeReport;
