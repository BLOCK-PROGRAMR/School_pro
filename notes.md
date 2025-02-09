import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Allapi from "../../../common"; // Adjust according to your API utility file

const FeeReport = () => {
  const [student, setStudent] = useState(null);
  const { sid } = useParams();
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [studentDataForm, setStudentDataForm] = useState({
    padiFee: [],
    paymentType: "",
  });

  useEffect(() => {
    if (sid) fetchStudentById(sid);
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
        const initialPaidFee = result.data.feeDetails.map((fee) => {
          const finalAmount = fee.concession ? fee.finalAmount : fee.amount;
          return {
            name: fee.name,
            finalAmount,
            terms: fee.terms,
            extractedAmount: finalAmount / fee.terms,
            paidAmount: 0,
            due: finalAmount,
            enteredAmount: 0,
          };
        });

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
        const termValue = parseInt(term.split("-")[1], 10);
        const dueAmount = fee.extractedAmount * termValue;
        return {
          ...fee,
          due:
            dueAmount > fee.finalAmount
              ? fee.finalAmount
              : dueAmount - fee.paidAmount,
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
    e.preventDefault();
    const paymentDetails = studentDataForm.padiFee.filter(
      (fee) => fee.enteredAmount > 0
    );
    if (paymentDetails.length === 0 || !studentDataForm.paymentType) {
      toast.error("Please enter payment details and select a payment type.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(Allapi.payFee.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sid,
          paymentDetails,
          paymentType: studentDataForm.paymentType,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Fee Paid Successfully!");
        fetchStudentById(sid); // Refresh data
      } else {
        toast.error(result.message || "Payment submission failed.");
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
            {Array.from({ length: 4 }, (_, i) => `Term-${i + 1}`).map(
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
              <option value="Bank">Bank</option>
            
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