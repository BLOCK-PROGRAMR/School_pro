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
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("User is not authenticated. Please log in again.");
        setLoading(false);
        return;
      }

      // If studentID is provided, filter by both academicYearID and studentID
      const url = studentID
        ? `${Allapi.getReciepts.url(academicYearID)}?studentID=${studentID}`
        : `${Allapi.getReciepts.url(academicYearID)}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Error fetching receipts.");
        setLoading(false);
        return;
      }

      const data = await response.json();

      // Sort receipts by date in descending order (newest first)
      const sortedReceipts = data.receipts.sort((a, b) => new Date(b.date) - new Date(a.date));

      setReceipts(sortedReceipts);
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
            Student ID (Optional):
          </label>
          <input
            type="text"
            id="studentID"
            value={studentID}
            onChange={(e) => setStudentID(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Enter Student ID (Optional)"
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
          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Receipts</h3>
            <div className="space-y-6">
              {receipts.map((receipt) => (
                <div
                  key={receipt._id}
                  className="bg-gradient-to-br from-white to-gray-100 shadow-xl rounded-lg p-6 relative"
                  style={{
                    backgroundColor: "#f9f9f9", // Simulating a paper background
                    border: "1px solid #e1e1e1", // Paper-like border
                    boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)", // Soft shadow
                    width: "100%",
                    marginBottom: "20px",
                    padding: "20px",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 opacity-10 rounded-lg"></div> {/* Subtle paper texture */}
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">
                    Receipt No: {receipt.rcNo}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Date: {new Date(receipt.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mb-4">
                    Student: {receipt.studentID}
                  </p>

                  <div>
                    <h5 className="font-bold text-gray-700 mb-2">Fee Details:</h5>
                    {receipt.feeLedger
                      .filter((fee) => fee.amount > 0) // Only include fees with amount > 0
                      .map((fee) => (
                        <div
                          key={fee._id}
                          className="flex justify-between text-gray-800 mb-2"
                        >
                          <span>{fee.name}</span>
                          <span>₹{fee.amount}</span>
                        </div>
                      ))}
                  </div>

                  <div className="mt-4 flex justify-between">
                    <span className="text-lg font-semibold text-gray-700">Total</span>
                    <span className="text-lg font-semibold text-blue-600">
                      ₹{receipt.totalAmount}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-gray-200 p-4 rounded-lg">
              <h5 className="font-bold text-gray-700">Total for All Receipts: ₹{calculateTotal()}</h5>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FetchReceipts;
