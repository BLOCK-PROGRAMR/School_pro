import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Allapi from '../../common';

const FeeLedger = () => {
  const [feeLedger, setFeeLedger] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterTerm, setFilterTerm] = useState('all');

  useEffect(() => {
    const fetchFeeLedger = async () => {
      try {
        setLoading(true);
        setError('');

        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        console.log('User Data:', userData); // Log userData for debugging
        const academicYearID = userData.academicYearID;

        if (!academicYearID) {
          throw new Error('Academic Year ID is missing');
        }

        const response = await axios({
          method: Allapi.getReciepts.method,
          url: Allapi.getReciepts.url(academicYearID),
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.data.success) {
          const processedReceipts = response.data.receipts.map(receipt => {
            const processedFeeLedger = receipt.feeLedger.map(fee => ({
              ...fee,
              amount: parseFloat(fee.amount),
            }));

            const totalAmount = receipt.totalAmount || processedFeeLedger.reduce((sum, fee) => sum + fee.amount, 0);

            return {
              ...receipt,
              feeLedger: processedFeeLedger,
              date: new Date(receipt.date),
              totalAmount,
              terms: receipt.terms || 'Term-1',
            };
          });

          setFeeLedger(processedReceipts);
        } else {
          setError(response.data.message || 'Failed to fetch fee ledger');
        }
      } catch (error) {
        console.error('Error fetching fee ledger:', error);
        setError(error.response?.data?.message || error.message || 'Error fetching fee ledger');
      } finally {
        setLoading(false);
      }
    };

    fetchFeeLedger();
  }, []);

  const getFilteredReceipts = () => {
    if (filterTerm === 'all') return feeLedger;
    return feeLedger.filter(receipt => receipt.terms === filterTerm);
  };

  const getAllTerms = () => {
    const terms = new Set(feeLedger.map(receipt => receipt.terms));
    return Array.from(terms).sort((a, b) => {
      const aNum = parseInt(a.split('-')[1]) || 0;
      const bNum = parseInt(b.split('-')[1]) || 0;
      return aNum - bNum;
    });
  };

  const calculateTotal = (receipts) => {
    return receipts.reduce((total, receipt) => total + receipt.totalAmount, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        <p>{error}</p>
        <p className="mt-4">Please contact the administrator for assistance.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Fee Ledger</h2>

        {feeLedger.length > 0 && (
          <div className="mb-6">
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

        {feeLedger.length > 0 ? (
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
                    Date: {receipt.date.toLocaleString()}
                  </p>
                </div>

                <div className="mb-4">
                  <h5 className="font-semibold text-gray-700 mb-2">
                    {receipt.terms}
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
                  Total for {filterTerm === 'all' ? 'All Terms' : filterTerm}
                </h5>
                <span className="text-xl font-bold text-blue-600">
                  ₹{calculateTotal(getFilteredReceipts()).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            No fee ledger found. Please fetch the fee ledger to view it here.
          </div>
        )}
      </div>
    </div>
  );
};

export default FeeLedger;