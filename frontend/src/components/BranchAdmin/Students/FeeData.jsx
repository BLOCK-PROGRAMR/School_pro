
import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { mycon } from "../../../store/Mycontext";
import Allapi from "../../../common";

const FeeData = () => {
    const { branchdet } = useContext(mycon);
    const [selectedFeeType, setSelectedFeeType] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedSection, setSelectedSection] = useState("");
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [studentData, setStudentData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [paymentFilter, setPaymentFilter] = useState("all");
    const [feeTypes, setFeeTypes] = useState([]);

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
    }, [selectedClass, selectedSection, selectedFeeType]);

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
                // Extract unique fee types from sections
                const allFeeTypes = data.data.reduce((types, section) => {
                    section.fees?.forEach(fee => {
                        if (!types.includes(fee.feeType)) {
                            types.push(fee.feeType);
                        }
                    });
                    return types;
                }, []);
                // Add static fee types
                allFeeTypes.push("Transport Fee", "Hostel Fee");
                setFeeTypes(allFeeTypes);
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

            const studentsWithFees = await Promise.all(
                studentsData.data.map(async (student) => {
                    try {
                        let totalFee = 0;
                        console.log("selectedFeetype", selectedFeeType);
                        console.log("studentdata", student);
                        console.log("section fee", sections);
                        // Calculate fee based on selected fee type
                        if (selectedFeeType) {
                            if (selectedFeeType === "Transport Fee") {
                                // Handle transport fee
                                // totalFee = student.transportFee || 0;
                                const FeeEntry = student.feeDetails.find(fee => fee.name === "Transport-fee");
                                console.log("Feeentry", FeeEntry);
                                const TransportationFee = FeeEntry ? FeeEntry.amount || 0 : 0;
                                console.log("TransportationFee", TransportationFee);
                                totalFee = TransportationFee;
                            } else if (selectedFeeType === "Hostel Fee") {
                                // Handle hostel fee
                                // totalFee = student.feeDetails.hostelFee ? (student.hostelDetails.hostelFee || 0) : 0;
                                const FeeEntry = student.feeDetails.find(fee => fee.name === "hostel-fee");
                                console.log("hostelEntry", FeeEntry);
                                const hostelFee = FeeEntry ? FeeEntry.amount || 0 : 0;
                                console.log("hostelFee", hostelFee);
                                totalFee = hostelFee;
                            } else {
                                // Handle other fee types from section fees
                                const sectionFee = sections
                                    .find(s => s._id === selectedSection)
                                    ?.fees
                                    .find(f => f.feeType === selectedFeeType);
                                totalFee = sectionFee ? sectionFee.amount : 0;
                            }
                        } else {
                            // Calculate total of all fees if no specific type is selected
                            totalFee = student.feeDetails.reduce((total, fee) => {
                                return total + (fee.finalAmount || fee.amount);
                            }, 0);
                        }

                        // Fetch receipts for paid amount calculation
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

                        const receiptsData = await receiptsResponse.json();

                        let paidAmount = 0;
                        receiptsData.receipts.forEach((receipt) => {
                            if (selectedFeeType) {
                                // Sum up payments for specific fee type
                                receipt.feeLedger.forEach((fee) => {
                                    const kebabCaseText = selectedFeeType.toLowerCase().replace(/ /g, "-");
                                    console.log("fee.name", fee.name);
                                    console.log("convert text", kebabCaseText);
                                    if (kebabCaseText === fee.name) {
                                        paidAmount += parseFloat(fee.amount) || 0;
                                    }
                                    else if (fee.name === selectedFeeType) {
                                        paidAmount += parseFloat(fee.amount) || 0;
                                    }
                                });
                            } else {
                                // Sum up all payments if no specific type selected
                                paidAmount += receipt.totalAmount;
                            }
                        });

                        const remainingAmount = totalFee - paidAmount;

                        return {
                            ...student,
                            totalAmount: totalFee,
                            amountPaid: paidAmount,
                            amountToBePaid: remainingAmount,
                        };
                    } catch (error) {
                        console.error(
                            `Error fetching receipts for student ${student.idNo}:`,
                            error
                        );
                        return {
                            ...student,
                            totalAmount: 0,
                            amountPaid: 0,
                            amountToBePaid: 0,
                        };
                    }
                })
            );

            const sortedStudents = studentsWithFees.sort((a, b) => a.idNo - b.idNo);
            setStudentData(sortedStudents);
        } catch (error) {
            console.error("Error fetching student data:", error);
            toast.error("Failed to fetch student data");
        } finally {
            setLoading(false);
        }
    };

    const handleFeeTypeChange = (event) => {
        setSelectedFeeType(event.target.value);
    };

    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
    };

    const handleSectionChange = (event) => {
        setSelectedSection(event.target.value);
    };

    const getFilteredStudents = () => {
        return studentData.filter((student) => {
            if (paymentFilter === "paid" && student.amountToBePaid !== 0)
                return false;
            if (paymentFilter === "unpaid" && student.amountToBePaid === 0)
                return false;

            const searchString = `${student.idNo} ${student.name} ${student.surname || ""
                }`.toLowerCase();
            return searchString.includes(searchQuery.toLowerCase());
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Student Fee Data</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="relative">
                    <label
                        htmlFor="class"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Select Class
                    </label>
                    <select
                        id="class"
                        value={selectedClass}
                        onChange={handleClassChange}
                        disabled={loading}
                        className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    >
                        <option value="">Select Class</option>
                        {classes.map((cls) => (
                            <option key={cls._id} value={cls._id}>
                                {cls.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="relative">
                    <label
                        htmlFor="section"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Select Section
                    </label>
                    <select
                        id="section"
                        value={selectedSection}
                        onChange={handleSectionChange}
                        disabled={!selectedClass || loading}
                        className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    >
                        <option value="">Select Section</option>
                        {sections.map((section) => (
                            <option key={section._id} value={section._id}>
                                {section.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="relative">
                    <label
                        htmlFor="feeType"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Select Fee Type
                    </label>
                    <select
                        id="feeType"
                        value={selectedFeeType}
                        onChange={handleFeeTypeChange}
                        disabled={loading}
                        className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    >
                        <option value="">All Fee Types</option>
                        {feeTypes.map((feeType) => (
                            <option key={feeType} value={feeType}>
                                {feeType}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {!loading && studentData.length > 0 && (
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <label
                            htmlFor="search"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Search Students
                        </label>
                        <input
                            type="text"
                            id="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by ID or Name..."
                            className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="relative">
                        <label
                            htmlFor="paymentFilter"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Payment Status
                        </label>
                        <select
                            id="paymentFilter"
                            value={paymentFilter}
                            onChange={(e) => setPaymentFilter(e.target.value)}
                            className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Students</option>
                            <option value="paid">Fees Paid</option>
                            <option value="unpaid">Fees Pending</option>
                        </select>
                    </div>
                </div>
            )}

            {!loading && studentData.length > 0 && (
                <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">
                            Total Students
                        </h3>
                        <p className="text-2xl font-semibold text-gray-900">
                            {studentData.length}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Fees Paid</h3>
                        <p className="text-2xl font-semibold text-green-600">
                            {studentData.filter((s) => s.amountToBePaid === 0).length}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Fees Pending</h3>
                        <p className="text-2xl font-semibold text-red-600">
                            {studentData.filter((s) => s.amountToBePaid > 0).length}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">
                            Total Collection
                        </h3>
                        <p className="text-2xl font-semibold text-blue-600">
                            ₹
                            {studentData
                                .reduce((sum, s) => sum + s.amountPaid, 0)
                                .toLocaleString()}
                        </p>
                    </div>
                </div>
            )}

            {loading && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            )}

            {!loading && studentData.length > 0 && (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    S.NO
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {selectedFeeType || "Total"} Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount Paid
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Due
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {getFilteredStudents().map((student, index) => (
                                <tr key={student._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {student.idNo}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {student.surname
                                            ? `${student.surname} ${student.name}`
                                            : student.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ₹{student.totalAmount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ₹{student.amountPaid.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ₹{student.amountToBePaid.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.amountToBePaid === 0
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {student.amountToBePaid === 0 ? "Paid" : "Pending"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {getFilteredStudents().length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                            No students found matching your search criteria
                        </div>
                    )}
                </div>
            )}

            {!loading &&
                studentData.length === 0 &&
                selectedClass &&
                selectedSection && (
                    <div className="text-center py-8 text-gray-500">
                        No student data found
                    </div>
                )}
        </div>
    );
}

export default FeeData;