import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { mycon } from "../../../store/Mycontext";
import Allapi from "../../../common";
import * as XLSX from 'xlsx';

const Info = () => {
  const { branchdet } = useContext(mycon);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (branchdet?.academicYears?.[0]) {
      fetchClasses();
    }
  }, [branchdet]);

  useEffect(() => {
    if (selectedClass) {
      fetchSections(selectedClass);
      setSelectedSection("");
      setStudentData([]);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedClass && selectedSection) {
      fetchStudentData();
    }
  }, [selectedClass, selectedSection]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        Allapi.getClasses.url(branchdet.academicYears[0]),
        {
          method: Allapi.getClasses.method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setClasses(data.data || []);
      } else {
        toast.error("Failed to fetch classes");
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Error fetching classes");
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async (classId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(Allapi.getSections.url(classId), {
        method: Allapi.getSections.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setSections(data.data || []);
      } else {
        toast.error("Failed to fetch sections");
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      toast.error("Error fetching sections");
    } finally {
      setLoading(false);
    }
  };

  const formatFeeTypes = (feeDetails) => {
    if (!feeDetails || !Array.isArray(feeDetails)) return "-";

    const formattedFees = feeDetails.map(fee => {
      const name = fee.name || fee.feeType || 'Other';
      const amount = parseFloat(fee.amount) || 0;
      return `${name}\t₹${amount.toLocaleString()}`;
    });

    return formattedFees.join('\n');
  };

  const formatConcessions = (feeDetails) => {
    if (!feeDetails || !Array.isArray(feeDetails)) return "-";

    const formattedConcessions = feeDetails.map(fee => {
      const name = fee.name || fee.feeType || 'Other';
      const concession = fee.concession || 0;
      return `${name}: ${concession}%`;
    }).filter(fee => fee.includes('%') && !fee.includes('0%'));

    return formattedConcessions.length > 0 ? formattedConcessions.join('\n') : "-";
  };

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const studentsResponse = await fetch(
        Allapi.getStudentsBySection.url(selectedSection),
        {
          method: Allapi.getStudentsBySection.method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const studentsData = await studentsResponse.json();

      if (!studentsResponse.ok) {
        throw new Error("Failed to fetch student data");
      }

      const studentsWithDetails = await Promise.all(
        studentsData.data.map(async (student) => {
          try {
            // Format fee types and concessions
            const feeTypes = formatFeeTypes(student.feeDetails);
            const concessions = formatConcessions(student.feeDetails);

            // Calculate course fee (original amount)
            const courseFee = (student.feeDetails || []).reduce((total, fee) => {
              return total + (parseFloat(fee.amount) || 0);
            }, 0);

            // Calculate total concession amount
            const concessionAmount = (student.feeDetails || []).reduce((total, fee) => {
              const amount = parseFloat(fee.amount) || 0;
              const concessionPercent = parseFloat(fee.concession) || 0;
              return total + (amount * concessionPercent / 100);
            }, 0);

            // Calculate final fee (after concession)
            const finalFee = courseFee - concessionAmount;

            // Fetch receipts
            const receiptsResponse = await fetch(
              `${Allapi.getReciepts.url(branchdet.academicYears[0])}?studentID=${student.idNo}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            let paidAmount = 0;
            let receiptDetails = [];

            if (receiptsResponse.ok) {
              const receiptsData = await receiptsResponse.json();
              const receipts = receiptsData.receipts || [];

              paidAmount = receipts.reduce((total, receipt) => {
                return total + receipt.feeLedger.reduce((sum, fee) => sum + (parseFloat(fee.amount) || 0), 0);
              }, 0);

              receiptDetails = receipts.map(receipt => ({
                number: receipt.rcNo,
                date: new Date(receipt.date).toLocaleDateString(),
                amount: receipt.feeLedger.reduce((sum, fee) => sum + (parseFloat(fee.amount) || 0), 0),
                terms: receipt.terms || 'Term-1',
                feeDetails: receipt.feeLedger.map(fee => ({
                  name: fee.name,
                  amount: parseFloat(fee.amount) || 0
                }))
              }));
            }

            return {
              ...student,
              feeTypes,
              concessions,
              courseFee,
              concessionAmount,
              finalFee,
              paidAmount,
              receiptDetails
            };
          } catch (error) {
            console.error(`Error processing student ${student.idNo} details:`, error);
            return {
              ...student,
              feeTypes: "-",
              concessions: "-",
              courseFee: 0,
              concessionAmount: 0,
              finalFee: 0,
              paidAmount: 0,
              receiptDetails: []
            };
          }
        })
      );

      setStudentData(studentsWithDetails);
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast.error("Failed to fetch student data");
    } finally {
      setLoading(false);
    }
  };

  const downloadStudentData = () => {
    try {
      if (studentData.length === 0) {
        toast.warning("No student data available to download");
        return;
      }

      // Prepare data for export
      const exportData = filteredStudents.map((student, index) => {
        // Format receipt details
        const receiptDetailsFormatted = student.receiptDetails?.map(receipt => {
          const feeDetailsStr = receipt.feeDetails
            .map(fee => `${fee.name}: ₹${fee.amount.toLocaleString()}`)
            .join('\n');
          return `Receipt #${receipt.number} (${receipt.date})\n${feeDetailsStr}\nTotal: ₹${receipt.amount.toLocaleString()} (${receipt.terms})`
        }).join('\n\n') || '-';

        return {
          'S.No': index + 1,
          'Student ID': student.idNo,
          'Name': student.surname ? `${student.surname} ${student.name}` : student.name,
          'Fee Types': student.feeTypes || '-',
          'Course Fee': `₹${student.courseFee?.toLocaleString() || '-'}`,
          'Concession': student.concessions || '-',
          'Final Fee': `₹${student.finalFee?.toLocaleString() || '-'}`,
          'Paid Amount': `₹${student.paidAmount?.toLocaleString() || '-'}`,
          'Receipt Details': receiptDetailsFormatted
        };
      });

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Students");

      // Auto-size columns and set column widths
      const colWidths = [
        { wch: 6 },  // S.No
        { wch: 15 }, // Student ID
        { wch: 30 }, // Name
        { wch: 30 }, // Fee Types
        { wch: 15 }, // Course Fee
        { wch: 20 }, // Concession
        { wch: 15 }, // Final Fee
        { wch: 15 }, // Paid Amount
        { wch: 50 }  // Receipt Details
      ];
      ws['!cols'] = colWidths;

      // Set row height for better readability
      const rowCount = exportData.length + 1; // +1 for header
      ws['!rows'] = Array(rowCount).fill({ hpt: 30 }); // Set height for all rows

      // Generate filename with class and section
      const selectedClassName = classes.find(c => c._id === selectedClass)?.name || '';
      const selectedSectionName = sections.find(s => s._id === selectedSection)?.name || '';
      const filename = `Students_${selectedClassName}_${selectedSectionName}_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);
      toast.success("Student data downloaded successfully!");
    } catch (error) {
      console.error("Error downloading student data:", error);
      toast.error("Failed to download student data");
    }
  };

  const filteredStudents = studentData.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Information</h1>
          <p className="text-gray-600">Manage and view student details, fees, and receipts</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="class" className="block text-sm font-semibold text-gray-700 mb-2">
                Class
              </label>
              <select
                id="class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                disabled={loading}
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors duration-200"
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="section" className="block text-sm font-semibold text-gray-700 mb-2">
                Section
              </label>
              <select
                id="section"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                disabled={!selectedClass || loading}
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors duration-200"
              >
                <option value="">Select Section</option>
                {sections.map((section) => (
                  <option key={section._id} value={section._id}>
                    {section.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">
                Search Students
              </label>
              <div className="relative flex-grow">
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by student name..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                />
                <svg
                  className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={downloadStudentData}
              disabled={loading || studentData.length === 0}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <svg
                className="mr-2 -ml-1 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Download Student Data
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading student data...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      S.No
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Fee Types
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Course Fee
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Concession
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Final Fee
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Paid Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Receipt Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student, index) => (
                    <tr key={student._id || index} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.idNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {student.surname ? `${student.surname} ${student.name}` : student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-pre text-sm text-gray-900 font-mono">
                        {student.feeTypes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-medium">₹{student.courseFee?.toLocaleString() || "-"}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-pre text-sm text-gray-900">
                        {student.concessions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-medium">₹{student.finalFee?.toLocaleString() || "-"}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-medium">₹{student.paidAmount?.toLocaleString() || "-"}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                          {student.receiptDetails?.map((receipt, idx) => (
                            <div key={idx} className="mb-3 last:mb-0 p-2 rounded-md bg-gray-50">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-indigo-600">#{receipt.number}</span>
                                <span className="text-sm text-gray-500">{receipt.date}</span>
                              </div>
                              <div className="mt-1 pl-3 border-l-2 border-gray-200">
                                {receipt.feeDetails.map((fee, feeIdx) => (
                                  <div key={feeIdx} className="text-xs text-gray-600 flex justify-between">
                                    <span>{fee.name}:</span>
                                    <span className="font-medium">₹{fee.amount.toLocaleString()}</span>
                                  </div>
                                ))}
                                <div className="text-sm font-medium text-gray-900 mt-1 pt-1 border-t border-gray-200 flex justify-between items-center">
                                  <span>Total:</span>
                                  <div>
                                    <span className="text-indigo-600">₹{receipt.amount.toLocaleString()}</span>
                                    <span className="text-xs text-gray-500 ml-1">({receipt.terms})</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )) || "-"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredStudents.length === 0 && (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
                  <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Info;