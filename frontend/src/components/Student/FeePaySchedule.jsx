import React, { useState, useEffect, useContext } from 'react';
import { AlertCircle, Loader, DollarSign, Calendar, CreditCard, FileText } from 'lucide-react';
import Allapi from '../../common';
import { mycon } from '../../store/Mycontext';

const FeePaySchedule = () => {
  const { branchdet } = useContext(mycon);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [student, setStudent] = useState(null);
  const [feeDetails, setFeeDetails] = useState([]);
  const [termSummary, setTermSummary] = useState({});

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      if (!userData.username) {
        setError('User data not found');
        setLoading(false);
        return;
      }

      console.log("Fetching student details for:", userData.username);
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
      console.log("Student data response:", data);
      
      if (data.success && data.data) {
        setStudent(data.data);
        
        // Check if feeDetails exists in the student data
        if (data.data.feeDetails && Array.isArray(data.data.feeDetails)) {
          console.log("Fee details found in student data:", data.data.feeDetails);
          processFeeDetails(data.data.feeDetails);
        } else {
          console.log("No fee details found in student data");
          setLoading(false);
        }
      } else {
        setError('Failed to fetch student details');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching student details:', err);
      setError('Error fetching student details: ' + err.message);
      setLoading(false);
    }
  };

  const processFeeDetails = (feeDetailsArray) => {
    try {
      console.log("Processing fee details:", feeDetailsArray);
      
      if (!feeDetailsArray || feeDetailsArray.length === 0) {
        console.log("No fee details to process");
        setLoading(false);
        return;
      }
      
      // Process fee details
      const processedFees = feeDetailsArray.map(fee => {
        // Ensure all numeric values are properly parsed
        const amount = parseFloat(fee.amount || 0);
        const concession = parseFloat(fee.concession || 0);
        const finalAmount = parseFloat(fee.finalAmount || 0);
        const paidFee = parseFloat(fee.paidFee || 0);
        const dueAmount = finalAmount - paidFee;
        
        // Ensure term is standardized
        const term = fee.terms || 'Unknown';
        
        return {
          ...fee,
          amount,
          concession,
          finalAmount,
          paidFee,
          dueAmount,
          terms: term
        };
      });
      
      console.log("Processed fees:", processedFees);
      setFeeDetails(processedFees);
      
      // Calculate term summary
      const summary = {};
      processedFees.forEach(fee => {
        const term = fee.terms;
        
        if (!summary[term]) {
          summary[term] = {
            totalAmount: 0,
            totalConcession: 0,
            totalFinalAmount: 0,
            totalPaid: 0,
            totalDue: 0,
            items: []
          };
        }
        
        summary[term].totalAmount += fee.amount;
        summary[term].totalConcession += fee.concession;
        summary[term].totalFinalAmount += fee.finalAmount;
        summary[term].totalPaid += fee.paidFee;
        summary[term].totalDue += fee.dueAmount;
        summary[term].items.push(fee);
      });
      
      console.log("Term summary:", summary);
      setTermSummary(summary);
    } catch (error) {
      console.error('Error processing fee details:', error);
      setError('Error processing fee details: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalDue = () => {
    return feeDetails.reduce((total, fee) => total + fee.dueAmount, 0);
  };

  const calculateTotalPaid = () => {
    return feeDetails.reduce((total, fee) => total + fee.paidFee, 0);
  };

  const calculateTotalConcession = () => {
    return feeDetails.reduce((total, fee) => total + fee.concession, 0);
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
              <h3 className="text-lg font-semibold">Error Loading Fee Schedule</h3>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Fee Schedule</h2>
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

        {/* Fee Summary Cards */}
        {feeDetails.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 shadow-md">
              <div className="flex items-center mb-2">
                <DollarSign className="w-5 h-5 text-blue-500 mr-2" />
                <h3 className="font-semibold text-gray-800">Total Fee</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                ₹{feeDetails.reduce((total, fee) => total + fee.finalAmount, 0).toLocaleString()}
              </p>
            </div>
            
            <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 shadow-md">
              <div className="flex items-center mb-2">
                <CreditCard className="w-5 h-5 text-green-500 mr-2" />
                <h3 className="font-semibold text-gray-800">Total Paid</h3>
              </div>
              <p className="text-2xl font-bold text-green-600">
                ₹{calculateTotalPaid().toLocaleString()}
              </p>
            </div>
            
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-md">
              <div className="flex items-center mb-2">
                <Calendar className="w-5 h-5 text-red-500 mr-2" />
                <h3 className="font-semibold text-gray-800">Total Due</h3>
              </div>
              <p className="text-2xl font-bold text-red-600">
                ₹{calculateTotalDue().toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Fee Details Table */}
        {feeDetails.length > 0 ? (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">
                Complete Fee Details
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Showing all fee details across all terms
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fee Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Term
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Concession
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Final Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paid
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {feeDetails.map((fee, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {fee.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {fee.terms}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        ₹{fee.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        ₹{fee.concession.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-right">
                        ₹{fee.finalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium text-right">
                        ₹{fee.paidFee.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium text-right">
                        ₹{fee.dueAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        {fee.dueAmount <= 0 ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Paid
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Due
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="2" className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      Total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                      ₹{feeDetails.reduce((total, fee) => total + fee.amount, 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                      ₹{feeDetails.reduce((total, fee) => total + fee.concession, 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                      ₹{feeDetails.reduce((total, fee) => total + fee.finalAmount, 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 text-right">
                      ₹{feeDetails.reduce((total, fee) => total + fee.paidFee, 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600 text-right">
                      ₹{feeDetails.reduce((total, fee) => total + fee.dueAmount, 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {/* Empty cell for status column */}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Fee Schedule Found</h3>
            <p className="text-gray-600 mb-4">
              There is no fee schedule available for your account at this time.
            </p>
            <p className="text-sm text-gray-500">
              If you believe this is an error, please contact the school administration.
            </p>
          </div>
        )}
 

        {/* Payment Instructions */}
        <div className="mt-6 bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Instructions</h3>
          <div className="space-y-4">
            <p className="text-gray-600">
              Please make your fee payments before the due dates to avoid late fees. You can pay your fees through any of the following methods:
            </p>
            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              <li>Online payment through the school portal</li>
              <li>Direct bank transfer to the school account</li>
              <li>Cash payment at the school fee counter</li>
            </ul>
            <p className="text-gray-600">
              For any queries regarding your fee details, please contact the school accounts department.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeePaySchedule;