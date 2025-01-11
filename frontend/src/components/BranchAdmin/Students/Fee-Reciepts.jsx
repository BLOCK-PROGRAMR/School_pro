import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Allapi from "../../../common";

const FetchReceipts = () => {
  const { academicYearID } = useParams();
  const [studentID, setStudentID] = useState("");
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReceipts = async () => {
    if (!studentID) {
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
        `${Allapi.getReciepts.url(academicYearID)}?studentID=${studentID}`,
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
      setReceipts(data.receipts);
      toast.success("Receipts retrieved successfully!");
    } catch (error) {
      console.error("Error fetching receipts:", error);
      toast.error("Failed to fetch receipts.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate total amount for the footer row
  const calculateTotal = () => {
    return receipts.reduce((total, receipt) => total + receipt.totalAmount, 0);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Fetch Receipts</h2>
        <div className="mb-4">
          <label htmlFor="studentID" className="block text-gray-700 mb-2">
            Student ID:
          </label>
          <input
            type="text"
            id="studentID"
            value={studentID}
            onChange={(e) => setStudentID(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Enter Student ID"
          />
        </div>
        <button
          onClick={fetchReceipts}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch Receipts"}
        </button>

        {receipts.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Receipts</h3>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-gray-800">
                  <th className="border border-gray-300 p-2">RC No</th>
                  <th className="border border-gray-300 p-2">Date</th>
                  <th className="border border-gray-300 p-2">Fee Details</th>
                  <th className="border border-gray-300 p-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((receipt) =>
                  receipt.feeLedger
                    .filter((fee) => fee.amount > 0) // Only include fees with amount > 0
                    .map((fee, index) => (
                      <tr key={fee._id}>
                        {index === 0 && (
                          <>
                            <td
                              className="border border-gray-300 p-2"
                              rowSpan={
                                receipt.feeLedger.filter(
                                  (fee) => fee.amount > 0
                                ).length
                              }
                            >
                              {receipt.rcNo}
                            </td>
                            <td
                              className="border border-gray-300 p-2"
                              rowSpan={
                                receipt.feeLedger.filter(
                                  (fee) => fee.amount > 0
                                ).length
                              }
                            >
                              {new Date(receipt.date).toLocaleDateString()}
                            </td>
                          </>
                        )}
                        <td className="border border-gray-300 p-2">
                          {fee.name}
                        </td>
                        <td className="border border-gray-300 p-2">
                          ₹{fee.amount}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
              <tfoot>
                <tr className="bg-gray-200 text-gray-800">
                  <td colSpan="3" className="border border-gray-300 p-2 font-bold">
                    Total
                  </td>
                  <td className="border border-gray-300 p-2 font-bold">
                    ₹{calculateTotal()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FetchReceipts;
