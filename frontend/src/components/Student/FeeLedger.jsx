import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Calendar, DollarSign, FileText, Filter, AlertCircle, Loader } from 'lucide-react';
import Allapi from '../../common';
import { mycon } from '../../store/Mycontext';

const FeeLedger = () => {
  const { branchdet } = useContext(mycon);
  const [feeLedger, setFeeLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterTerm, setFilterTerm] = useState('all');
  const [student, setStudent] = useState(null);
  const [termSummary, setTermSummary] = useState({});

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  const fetchStudentDetails = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      if (!userData.username) {
        setError('User data not found');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${Allapi.backapi}/api/students/get-studentById/${userData.username}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const data = await response.json();
      
      if (data.success && data.data) {
        setStudent(data.data);
        fetchFeeLedger(data.data);
      } else {
        setError('Failed to fetch student details');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching student details:', err);
      setError('Error fetching student details');
      setLoading(false);
    }
  };

  const fetchFeeLedger = async (studentData) => {
    try {
      setLoading(true);
      setError('');

      const academicYearID = studentData.academic_id;

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
        const processedReceipts = response.data.receipts
          .filter(receipt => receipt.studentID === studentData.idNo) // Filter receipts for this student only
          .map(receipt => {
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
        
        // Calculate term summary
        const summary = {};
        processedReceipts.forEach(receipt => {
          if (!summary[receipt.terms]) {
            summary[receipt.terms] = {
              total: 0,
              count: 0,
              receipts: []
            };
          }
          summary[receipt.terms].total += receipt.totalAmount;
          summary[receipt.terms].count += 1;
          summary[receipt.terms].receipts.push(receipt);
        });
        
        setTermSummary(summary);
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="mt-4 text-gray-600">Loading fee details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto bg-red-50 text-red-600 p-6 rounded-lg shadow-md">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold">Error Loading Fee Ledger</h3>
              <p className="mt-2">{error}</p>
              <p className="mt-4">Please contact the administrator for assistance.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Student Info Card */}
        {student && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Fee Ledger</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Student Name:</p>
                <p className="font-semibold text-gray-800">{student.name}</p>
              </div>
              <div>
                <p className="text-gray-600">ID Number:</p>
                <p className="font-semibold text-gray-800">{student.idNo}</p>
              </div>
              <div>
                <p className="text-gray-600">Class:</p>
                <p className="font-semibold text-gray-800">{student.class?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">Section:</p>
                <p className="font-semibold text-gray-800">{student.section?.name || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Term Summary */}
        {Object.keys(termSummary).length > 0 && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Term-wise Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(termSummary).map(([term, data]) => (
                <div 
                  key={term} 
                  className={`p-4 rounded-lg border-l-4 ${filterTerm === term ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-300'}`}
                  onClick={() => setFilterTerm(term)}
                  style={{ cursor: 'pointer' }}
                >
                  <h4 className="font-semibold text-gray-800">{term}</h4>
                  <div className="mt-2 flex justify-between">
                    <span className="text-gray-600">Total Paid:</span>
                    <span className="font-semibold text-gray-800">₹{data.total.toLocaleString()}</span>
                  </div>
                  <div className="mt-1 flex justify-between">
                    <span className="text-gray-600">Receipts:</span>
                    <span className="font-semibold text-gray-800">{data.count}</span>
                  </div>
                </div>
              ))}
              <div 
                className={`p-4 rounded-lg border-l-4 ${filterTerm === 'all' ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-300'}`}
                onClick={() => setFilterTerm('all')}
                style={{ cursor: 'pointer' }}
              >
                <h4 className="font-semibold text-gray-800">All Terms</h4>
                <div className="mt-2 flex justify-between">
                  <span className="text-gray-600">Total Paid:</span>
                  <span className="font-semibold text-gray-800">₹{calculateTotal(feeLedger).toLocaleString()}</span>
                </div>
                <div className="mt-1 flex justify-between">
                  <span className="text-gray-600">Receipts:</span>
                  <span className="font-semibold text-gray-800">{feeLedger.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter */}
        {feeLedger.length > 0 && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <Filter className="w-5 h-5 text-gray-500 mr-2" />
              <label htmlFor="termFilter" className="block text-gray-700 font-medium">
                Filter by Term
              </label>
            </div>
            <select
              id="termFilter"
              value={filterTerm}
              onChange={(e) => setFilterTerm(e.target.value)}
              className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Terms</option>
              {getAllTerms().map(term => (
                <option key={term} value={term}>{term}</option>
              ))}
            </select>
          </div>
        )}

        {/* Receipts */}
        {feeLedger.length > 0 ? (
          <div className="space-y-6">
            {getFilteredReceipts().map((receipt) => (
              <div
                key={receipt._id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center mb-2 md:mb-0">
                    <FileText className="w-5 h-5 text-blue-500 mr-2" />
                    <h4 className="text-xl font-semibold text-gray-800">
                      Receipt No: {receipt.rcNo}
                    </h4>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                    <p className="text-gray-600">
                      {formatDate(receipt.date)}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {receipt.terms}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-gray-200">
                          <th className="pb-2 font-semibold text-gray-700">Fee Type</th>
                          <th className="pb-2 text-right font-semibold text-gray-700">Amount</th>
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
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-blue-500 mr-2" />
                  <h5 className="font-bold text-gray-800">
                    Total for {filterTerm === 'all' ? 'All Terms' : filterTerm}
                  </h5>
                </div>
                <span className="text-xl font-bold text-blue-600">
                  ₹{calculateTotal(getFilteredReceipts()).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Fee Records Found</h3>
            <p className="text-gray-600 mb-4">
              There are no fee payment records available for your account at this time.
            </p>
            <p className="text-sm text-gray-500">
              If you believe this is an error or have recently made a payment, please contact the school administration.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeeLedger; 