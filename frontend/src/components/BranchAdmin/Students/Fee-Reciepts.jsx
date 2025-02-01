import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Allapi from "../../../common";

const FetchReceipts = () => {
  const { academicYearID } = useParams();
  const [studentID, setStudentID] = useState("");
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentDetails, setStudentDetails] = useState(null);
  const [filterTerm, setFilterTerm] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchReceipts = async () => {
    setLoading(true);
    setReceipts([]);
    setStudentDetails(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("User is not authenticated. Please log in again.");
        return;
      }

      // First fetch student details if studentID is provided
      if (studentID) {
        try {
          const studentResponse = await fetch(Allapi.getstudentbyIdNo.url(studentID), {
            method: Allapi.getstudentbyIdNo.method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const studentData = await studentResponse.json();
          if (studentData.success) {
            setStudentDetails(studentData.data);
          } else {
            toast.error("Student not found with the provided ID");
            return;
          }
        } catch (error) {
          toast.error("Error fetching student details");
          return;
        }
      }

      // Fetch receipts
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
        throw new Error(errorData.message || "Error fetching receipts");
      }

      const data = await response.json();

      // Process and organize receipts by terms
      const processedReceipts = data.receipts.map(receipt => {
        // Group fee ledger entries by terms
        const termGroups = receipt.feeLedger.reduce((groups, fee) => {
          // Ensure we have a valid term number
          const termNumber = parseInt(fee.terms, 10) || 1;
          const term = `Term-${termNumber}`;
          
          if (!groups[term]) {
            groups[term] = [];
          }
          groups[term].push({
            ...fee,
            amount: parseFloat(fee.amount) // Ensure amount is a number
          });
          return groups;
        }, {});

        // Sort the fees within each term group by name
        Object.keys(termGroups).forEach(term => {
          termGroups[term].sort((a, b) => a.name.localeCompare(b.name));
        });

        return {
          ...receipt,
          termGroups,
          date: new Date(receipt.date),
          totalAmount: receipt.totalAmount || receipt.feeLedger.reduce((sum, fee) => sum + parseFloat(fee.amount), 0)
        };
      });

      // Sort receipts
      const sortedReceipts = processedReceipts.sort((a, b) => 
        sortOrder === "desc" ? b.date - a.date : a.date - b.date
      );

      setReceipts(sortedReceipts);
      toast.success(
        `${sortedReceipts.length} receipt${sortedReceipts.length !== 1 ? 's' : ''} found!`
      );
    } catch (error) {
      console.error("Error fetching receipts:", error);
      toast.error(error.message || "Failed to fetch receipts");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredReceipts = () => {
    if (filterTerm === "all") return receipts;
    return receipts.filter(receipt => 
      Object.keys(receipt.termGroups).includes(filterTerm)
    );
  };

  const getAllTerms = () => {
    const terms = new Set();
    receipts.forEach(receipt => {
      Object.keys(receipt.termGroups).forEach(term => terms.add(term));
    });
    return Array.from(terms).sort((a, b) => {
      // Extract term numbers and compare them
      const aNum = parseInt(a.split('-')[1]) || 0;
      const bNum = parseInt(b.split('-')[1]) || 0;
      return aNum - bNum;
    });
  };

  const calculateTotal = (receipts) => {
    return receipts.reduce((total, receipt) => total + receipt.totalAmount, 0);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Fee Receipts</h2>
        
        {/* Search and Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="studentID" className="block text-gray-700 mb-2 font-medium">
              Student ID
            </label>
            <input
              type="text"
              id="studentID"
              value={studentID}
              onChange={(e) => setStudentID(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter Student ID (Optional)"
            />
          </div>
          
          {receipts.length > 0 && (
            <div>
              <label htmlFor="termFilter" className="block text-gray-700 mb-2 font-medium">
                Filter by Term
              </label>
              <select
                id="termFilter"
                value={filterTerm}
                onChange={(e) => setFilterTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Terms</option>
                {getAllTerms().map(term => (
                  <option key={term} value={term}>{term}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mb-6">
          <button
            onClick={fetchReceipts}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Fetching...
              </span>
            ) : (
              "Fetch Receipts"
            )}
          </button>
          
          {receipts.length > 0 && (
            <button
              onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
              className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              <span>Sort by Date</span>
              {sortOrder === "desc" ? "↓" : "↑"}
            </button>
          )}
        </div>

        {studentDetails && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Student Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <p><span className="font-medium">Name:</span> {studentDetails.name}</p>
              <p><span className="font-medium">ID:</span> {studentDetails.idNo}</p>
              <p><span className="font-medium">Class:</span> {studentDetails.class?.name}</p>
              <p><span className="font-medium">Section:</span> {studentDetails.section?.name}</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading receipts...</p>
          </div>
        )}

        {!loading && receipts.length > 0 && (
          <div className="space-y-6">
            {getFilteredReceipts().map((receipt) => (
              <div
                key={receipt._id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xl font-semibold text-gray-800">
                    Receipt No: {receipt.rcNo}
                  </h4>
                  <p className="text-gray-600">
                    Date: {receipt.date.toLocaleDateString()}
                  </p>
                </div>

                {receipts.map((receipt) => (
                  
                  <div key={receipt._id} className="mb-4">
                   
                    <h5 className="font-semibold text-gray-700 mb-2">
                      {receipt.terms|| "term"}
                    </h5>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left border-b border-gray-200">
                            <th className="pb-2">Fee Type</th>
                            <th className="pb-2 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {receipt.feeLedger.map((fee, idx) => (
                            <tr key={idx} className="border-b border-gray-100 last:border-0">
                              <td className="py-2">{fee.name}</td>
                              <td className="py-2 text-right">₹{fee.amount.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}

                {/* {Object.entries(receipt.termGroups).map(([term, fees]) => (
                  
                  <div key={term} className="mb-4">
                    {console.log("term val is",term)}
                    <h5 className="font-semibold text-gray-700 mb-2">
                      {term}
                    </h5>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left border-b border-gray-200">
                            <th className="pb-2">Fee Type</th>
                            <th className="pb-2 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fees.map((fee, idx) => (
                            <tr key={idx} className="border-b border-gray-100 last:border-0">
                              <td className="py-2">{fee.name}</td>
                              <td className="py-2 text-right">₹{fee.amount.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))} */}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-700">Total</span>
                    <span className="text-lg font-semibold text-blue-600">
                      ₹{receipt.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center">
                <h5 className="font-bold text-gray-800">
                  Total for {filterTerm === "all" ? "All Terms" : filterTerm}
                </h5>
                <span className="text-xl font-bold text-blue-600">
                  ₹{calculateTotal(getFilteredReceipts()).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {!loading && receipts.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            No receipts found. {studentID ? "Try a different Student ID or " : ""}Please fetch receipts to view them here.
          </div>
        )}
      </div>
    </div>
  );
};

export default FetchReceipts;
