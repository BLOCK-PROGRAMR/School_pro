<<<<<<< HEAD
 

import React, { useState, useEffect ,useContext} from "react";


=======
import React, { useState, useEffect, useContext } from "react";
>>>>>>> c29445ce47f8ddff99c58c5c50aaef155f500d36
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import axios from "axios";
import Allapi from "../../../common"; // Adjust according to your API utility file
import { mycon } from "../../../store/Mycontext";

const FeeReport = () => {
  const [student, setStudent] = useState(null);
  const { sid } = useParams();
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [numTerms, setNumTerms] = useState(null);
  const [bankBranches, setBankBranches] = useState([]);
  const [selectedBankBranch, setSelectedBankBranch] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymenttype, setPaymenttype] = useState("");
  const { branchdet } = useContext(mycon);
  const [acid, setAcid] = useState(null)
  const [studentDataForm, setStudentDataForm] = useState({
    padiFee: [],
    paymentType: "",
    bankDetails: {
      bankId: "",
      bankName: "",
      branchId: "",
      branchName: ""
    }
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

  const fetchBankBranches = async () => {
    if (studentDataForm.paymentType !== "Bank") return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(Allapi.getLedgers.url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const bankLedgers = response.data.data.filter(
          ledger => ledger.ledgerType === 'Bank'
        );
        // Flatten the bank and branch structure into a single array
        const allBranches = bankLedgers.reduce((acc, bank) => {
          const bankBranches = bank.subLedgers.map(branch => ({
            _id: branch._id,
            name: `${bank.groupLedgerName} - ${branch.name}`,
            bankId: bank._id,
            bankName: bank.groupLedgerName,
            branchId: branch._id,
            branchName: branch.name
          }));
          return [...acc, ...bankBranches];
        }, []);
        setBankBranches(allBranches);
      }
    } catch (error) {
      console.error('Error fetching bank branches:', error);
      toast.error('Failed to fetch bank branches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankBranches();
  }, [studentDataForm.paymentType]);

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

  const handlePaymentTypeChange = (type) => {
    setStudentDataForm(prev => ({
      ...prev,
      paymentType: type,
      bankDetails: type === "Bank" ? prev.bankDetails : {
        bankId: "",
        branchId: "",
        bankName: "",
        branchName: ""
      }
    }));
    setSelectedBankBranch("");
  };

  const handleBankBranchChange = (branchId) => {
    const selectedBranchData = bankBranches.find(branch => branch._id === branchId);
    setSelectedBankBranch(branchId);

    if (selectedBranchData) {
      setStudentDataForm(prev => ({
        ...prev,
        bankDetails: {
          bankId: selectedBranchData.bankId,
          bankName: selectedBranchData.bankName,
          branchId: selectedBranchData.branchId,
          branchName: selectedBranchData.branchName
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    alert(studentDataForm.paymentType);
    console.log("abnk", studentDataForm.bankDetails)
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
          terms: selectedTerm,
          date: new Date(),
          rcNo: `RC-${Date.now()}`, // Generate a unique receipt number
          feeLedger: paymentDetails.map((fee) => ({
            name: fee.name,
            amount: fee.enteredAmount,

          })),
          paymentType: studentDataForm.paymentType,
          bankDetails: studentDataForm.bankDetails
        }),
      });
      console.log(student, "t")

      const receiptResult = await receiptResponse.json();

      if (receiptResult.success) {
        toast.success("Fee Paid Successfully and Receipt Created!");
        console.log(receiptResult, "recieots");
        // window.location.reload();
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
              value={studentDataForm.paymentType}
              onChange={(e) => handlePaymentTypeChange(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="">Select Payment Type</option>
              <option value="Cash">Cash</option>
              <option value="Bank">Bank</option>
            </select>

            {studentDataForm.paymentType === "Bank" && (
              <div className="mt-3">
                <label className="block text-gray-700 mb-1">Select Bank and Branch</label>
                <select
                  value={selectedBankBranch}
                  onChange={(e) => handleBankBranchChange(e.target.value)}
                  className="border p-2 rounded w-full"
                  disabled={loading}
                >
                  <option value="">Select Bank and Branch</option>
                  {bankBranches.map((branch) => (
                    <option key={branch._id} value={branch._id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
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
