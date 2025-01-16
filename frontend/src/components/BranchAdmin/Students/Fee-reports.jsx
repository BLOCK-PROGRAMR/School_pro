import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Allapi from "../../../common";
const FeeReports = () => {
  const { academicYearID } = useParams();
  const [idNo, setIdNo] = useState("");
  const [student, setStudent] = useState(null);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch student by ID
  const fetchStudentById = async (sid) => {
    try {
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
        setStudent(result.data);
      } else {
        toast.error(result.message || "Failed to fetch student data.");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast.error("An error occurred while fetching student data.");
    }
  };

  // Fetch receipts
  const fetchReceipts = async () => {
    if (!idNo) {
      toast.error("Please enter a student ID.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("User is not authenticated. Please log in again.");
        setLoading(false);
        return;
      }

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
        const errorData = await response.json();
        toast.error(errorData.message || "Error fetching receipts.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setReceipts(data.receipts || []);
      toast.success("Receipts retrieved successfully!");
    } catch (error) {
      console.error("Error fetching receipts:", error);
      toast.error("Failed to fetch receipts.");
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
    await fetchStudentById(idNo);
    await fetchReceipts();
  };

  // Calculate total amount
  const calculateTotalAmount = (items) =>
    items.reduce((total, item) => total + (item.totalAmount || 0), 0);

  // Calculate total due
  const calculateTotalDue = () => {
    const totalFee = student?.feeDetails.reduce(
      (sum, fee) => sum + (fee.finalAmount || 0),
      0
    );
    const totalPaid = calculateTotalAmount(receipts);
    return (totalFee || 0) - totalPaid;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Fee Report</h1>

      <form onSubmit={handleSearch} className="mb-6 flex items-center gap-4">
        <input
          type="text"
          value={idNo}
          onChange={(e) => setIdNo(e.target.value)}
          placeholder="Enter Student ID"
          className="border border-gray-300 rounded px-4 py-2 w-full max-w-sm"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}

      {student && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Fee Details</h2>
          <table className="w-full mt-4 border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Consession</th>

                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">FinalAmount</th>
              </tr>
            </thead>
            <tbody>
              {student.feeDetails.map((fee, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{fee.name}</td>
                  <td className="border px-4 py-2">{fee.concession} %</td>
                  <td className="border px-4 py-2">{fee.amount}</td>

                  <td className="border px-4 py-2">{fee.finalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 text-lg font-bold">
            Total Due: {calculateTotalDue()}
          </div>
        </div>
      )}

      {receipts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Receipts</h2>
          <table className="w-full mt-4 border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">Receipt No</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Fee Ledger</th>
                <th className="border px-4 py-2">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((receipt, index) => (
                <tr key={receipt._id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{receipt.rcNo}</td>
                  <td className="border px-4 py-2">
                    {new Date(receipt.date).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">
                    <ul>
                      {receipt.feeLedger.map((ledger) => (
                        <li key={ledger._id}>
                          {ledger.name}: {ledger.amount}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border px-4 py-2">{receipt.totalAmount}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4" className="border px-4 py-2 font-bold">
                  Grand Total
                </td>
                <td className="border px-4 py-2 font-bold">
                  {calculateTotalAmount(receipts)}
                </td>
              </tr>
            </tfoot>
          </table>
        
        </div>
      )}
    </div>
  );
};

export default FeeReports;
