import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Allapi from "../../../common";
import ErrorBoundary from "../../ErrorBoundary";

const FeeLedger = () => {
  const { academicYearID } = useParams();
  const [idNo, setIdNo] = useState("");
  const [student, setStudent] = useState(null);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch student by ID
  const fetchStudentById = async (sid) => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      const response = await fetch(Allapi.getstudentbyIdNo.url(sid), {
        method: Allapi.getstudentbyId.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setStudent({
          ...result.data,
          name: result.data.name || "N/A",
          class: result.data.class?.name || "N/A",
          phone:
            result.data.whatsappNo || result.data.emergencyContact || "N/A",
          feeDetails: result.data.feeDetails || [],
        });
      } else {
        setError(result.message || "Failed to fetch student data.");
        toast.error(result.message || "Failed to fetch student data.");
      }
    } catch (error) {
      const errorMessage = "An error occurred while fetching student data.";
      setError(errorMessage);
      console.error(errorMessage, error);
      toast.error(errorMessage);
    }
  };

  // Fetch receipts
  const fetchReceipts = async () => {
    if (!idNo) {
      toast.error("Please enter a student ID.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${Allapi.getReciepts.url(academicYearID)}?studentID=${idNo}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch receipts");
      }

      const data = await response.json();

      // Process receipts to organize by fee type
      const processedReceipts = data.receipts.map((receipt) => {
        const feeTypes = receipt.feeLedger
          .reduce((acc, fee) => {
            return acc + `${fee.name} :₹${fee.amount}, `;
          }, "")
          .slice(0, -2); // Remove last comma and space

        return {
          receiptNo: receipt.rcNo,
          date: new Date(receipt.date),
          ledgerType: feeTypes,
          paymentMode: receipt.paymentMode || "Cash",
          totalAmount: Number(receipt.totalAmount) || 0,
        };
      });

      setReceipts(processedReceipts);
    } catch (error) {
      const errorMessage = "Failed to fetch receipts.";
      setError(errorMessage);
      console.error(errorMessage, error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle Search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!idNo) {
      toast.error("Please enter a valid ID.");
      return;
    }
    setError(null);
    await fetchStudentById(idNo);
    await fetchReceipts();
  };

  // Calculate totals
  const calculateTotal = () => {
    try {
      return (
        student?.feeDetails?.reduce(
          (sum, fee) => sum + (Number(fee.finalAmount) || 0),
          0
        ) || 0
      );
    } catch (error) {
      console.error("Error calculating total:", error);
      return 0;
    }
  };

  const calculateTotalPaid = () => {
    try {
      return receipts.reduce((sum, receipt) => sum + receipt.totalAmount, 0);
    } catch (error) {
      console.error("Error calculating total paid:", error);
      return 0;
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-red-600 font-semibold">Error</h3>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="p-4">
        {/* Search Section */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={idNo}
              onChange={(e) => setIdNo(e.target.value)}
              placeholder="Enter Student ID"
              className="p-2 border rounded"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </form>
        </div>

        {student && (
          <div className="border rounded-lg shadow-lg p-6 bg-white">
            <h2 className="text-2xl font-bold text-center mb-6">
              Student Fee Ledger
            </h2>

            {/* Student Details */}
            <div className="grid grid-cols-4 gap-4 mb-6 border-b pb-4">
              <div>
                <span className="font-semibold">ID No:</span>
                <span className="ml-2">{student.idNo || "N/A"}</span>
              </div>
              <div>
                <span className="font-semibold">Student Name:</span>
                <span className="ml-2">{student.name}</span>
              </div>
              <div>
                <span className="font-semibold">Class:</span>
                <span className="ml-2">{student.class}</span>
              </div>
              <div>
                <span className="font-semibold">Phone No:</span>
                <span className="ml-2">{student.phone}</span>
              </div>
            </div>

            {/* Fee Details
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Fee Details</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">S.No</th>
                    <th className="border p-2 text-left">Fee Type</th>
                    <th className="border p-2 text-left">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {student.feeDetails?.map((fee, index) => (
                    <tr key={index}>
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">{fee.name}</td>
                      <td className="border p-2">
                        ₹{Number(fee.finalAmount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <th className="border p-2 text-left">Terms</th>
                  <tr className="font-bold">
                    <td className="border p-2" colSpan="2">
                      Total
                    </td>
                    <td className="border p-2">
                      ₹{calculateTotal().toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div> */}
            {/* Fee Details */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Fee Details</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">S.No</th>
                    <th className="border p-2 text-left">Fee Type</th>
                    <th className="border p-2 text-left">Terms</th>
                    <th className="border p-2 text-left">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {student.feeDetails?.map((fee, index) => (
                    <tr key={index}>
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">{fee.name}</td>
                      <td className="border p-2">{fee.terms}</td>
                      <td className="border p-2">
                        ₹{Number(fee.finalAmount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td className="border p-2" colSpan="3">
                      Total
                    </td>
                    <td className="border p-2">
                      ₹{calculateTotal().toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Payment History with Detailed Ledger Type */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Payment History</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Receipt No</th>
                      <th className="border p-2 text-left">Date</th>
                      <th className="border p-2 text-left whitespace-normal">
                        Ledger Type
                      </th>
                      <th className="border p-2 text-left">Payment Mode</th>
                      <th className="border p-2 text-left">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receipts.map((receipt, index) => (
                      <tr key={index}>
                        <td className="border p-2">{receipt.receiptNo}</td>
                        <td className="border p-2">
                          {receipt.date.toLocaleDateString()}
                        </td>
                        <td className="border p-2 whitespace-pre-wrap">
                          <div className="text-sm">{receipt.ledgerType}</div>
                        </td>
                        <td className="border p-2">{receipt.paymentMode}</td>
                        <td className="border p-2">
                          ₹{receipt.totalAmount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    <tr className="font-bold bg-gray-50">
                      <td className="border p-2" colSpan="4">
                        Total Paid
                      </td>
                      <td className="border p-2">
                        ₹{calculateTotalPaid().toLocaleString()}
                      </td>
                    </tr>
                    <tr className="font-bold text-red-600">
                      <td className="border p-2" colSpan="4">
                        Due Amount
                      </td>
                      <td className="border p-2">
                        ₹
                        {(
                          calculateTotal() - calculateTotalPaid()
                        ).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default FeeLedger;
