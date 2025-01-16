import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Allapi from "../../../common";

const CashBook = () => {
  const [loading, setLoading] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [tab, setTab] = useState("received"); // 'received' or 'paid'
  const { academicYearID } = useParams(); // Set this as per your app's context

  const fetchReceipts = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("User is not authenticated. Please log in again.");
        setLoading(false);
        return;
      }

      const url = `${Allapi.getReciepts.url(academicYearID)}`;
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
      if (data.success) {
        const sortedReceipts = data.receipts.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setReceipts(sortedReceipts);
        toast.success("Receipts retrieved successfully!");
      } else {
        toast.error("Failed to fetch receipts.");
      }
    } catch (error) {
      console.error("Error fetching receipts:", error);
      toast.error("Failed to fetch receipts.");
    } finally {
      setLoading(false);
    }
  };

  const groupByDate = () => {
    const grouped = receipts.reduce((acc, receipt) => {
      const date = new Date(receipt.date).toLocaleDateString();
      if (!acc[date]) acc[date] = { totalAmount: 0, count: 0 };

      acc[date].totalAmount += receipt.totalAmount;
      acc[date].count += 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([date, { totalAmount, count }]) => ({
      date,
      totalAmount,
      count,
    }));
  };

  const calculateTotalAmount = () => {
    return groupByDate().reduce((sum, { totalAmount }) => sum + totalAmount, 0);
  };

  useEffect(() => {
    fetchReceipts();
  }, [tab, academicYearID]);

  return (
    <div className="cash-book-container p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Cash Book</h1>

      <div className="tabs mb-6 flex space-x-4">
        <button
          onClick={() => setTab("received")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            tab === "received"
              ? "bg-gray-800 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Received
        </button>
        <button
          onClick={() => setTab("paid")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            tab === "paid"
              ? "bg-gray-800 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Paid
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : (
        <div className="table-container overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-md">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-right">Total Amount</th>
                <th className="p-4 text-center">Receipts Count</th>
              </tr>
            </thead>
            <tbody>
              {groupByDate().map(({ date, totalAmount, count }) => (
                <tr key={date} className="hover:bg-gray-100">
                  <td className="p-4 text-left">{date}</td>
                  <td className="p-4 text-right">{totalAmount.toFixed(2)}</td>
                  <td className="p-4 text-center">{count}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100">
                <td className="p-4 text-left font-bold">Total</td>
                <td className="p-4 text-right font-bold">
                  {calculateTotalAmount().toFixed(2)}
                </td>
                <td className="p-4 text-center"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default CashBook;
