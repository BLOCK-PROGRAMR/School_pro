import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Allapi from "./../../../common/index"; // Adjust the path as needed
import * as XLSX from "xlsx"; // Import xlsx library for Excel export
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

import FeeReport from "./FeeReport.jsx"; // Update the import statement for FeeReport

const StudentsReports = () => {
  const navigate = useNavigate();
  const { acid } = useParams();
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]); // State for filtered students
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("studentList"); // Tab state to toggle between Student List and Download Data
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [feetab, setfeetab] = useState(null);


  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        console.log("academic ear is", acid);
        const response = await fetch(Allapi.getClasses.url(acid), {
          method: Allapi.getClasses.method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setClasses(data.data || []);
        } else {
          console.error("Failed to fetch classes:", data.message);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [acid]);

  useEffect(() => {
    if (!selectedClass) {
      setSections([]);
      return;
    }

    const fetchSections = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(Allapi.getSections.url(selectedClass), {
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
          console.error("Failed to fetch sections:", data.message);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [selectedClass]);

  useEffect(() => {
    if (!selectedSection) {
      setStudents([]);
      setFilteredStudents([]);
      return;
    }

    const fetchStudents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        console.log("selected class is", selectedClass);

        console.log("selected section is", selectedSection);
        const response = await fetch(
          Allapi.getStudentsBySection.url(selectedSection),
          {
            method: Allapi.getStudentsBySection.method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        // const token = localStorage.getItem('token');
        if (data.data.length === 0) {
          toast.error("No students found for this section");
        }
        const decoded = jwtDecode(token);
        const branchId = decoded.branch;
        console.log("branchid", branchId);
        const Data = data.data.filter((student) => student.branch === branchId);
        console.log("Data", Data);
        // if (data.data.length === 0) {
        //   toast.error("No students found for this section");
        // }
        if (response.ok) {
          const sortedStudents = (Data || []).sort(
            (a, b) => a.idNo - b.idNo
          );
          setStudents(sortedStudents);
          setFilteredStudents(sortedStudents); // Initialize filtered students
        } else {
          console.error("Failed to fetch students:", data.message);
          toast.error("No students found for this section");
        }
      } catch (error) {
        toast.error("Error fetching students");
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedSection]);

  const handleClassChange = (event) => {
    const selectedClassId = event.target.value;
    setSelectedClass(selectedClassId);
    setSelectedSection("");
    setStudents([]);
    setFilteredStudents([]);
  };

  const handleSectionChange = (event) => {
    setSelectedSection(event.target.value);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab); // Switch between 'studentList' and 'downloadData' tabs
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter((student) =>
        `${student.name} ${student.surname}`.toLowerCase().includes(term)
      );
      setFilteredStudents(filtered);
    }
  };

  const handleDownloadExcel = () => {
    // Format the student data for Excel with custom headers
    const formattedData = students.map((student) => ({
      "Student Name": `${student.name} ${student.surname}`,
      "Student ID": student.idNo,
      "Admission No": student.admissionNo,
      "Child ID": student.childId || "Not Provided",
      Class: student.class.name,
      Section: student.section.name,
      Gender: student.gender,
      "Date of Birth": new Date(student.dob).toLocaleDateString(),
      "Aadhar No": student.aadharNo,
      "AAPR No": student.studentAAPR,
      "Father's Name": student.fatherName,
      "Father's Occupation": student.fatherOccupation || "Not Provided",
      "Father's Aadhar": student.fatherAadhar || "Not Provided",
      "Mother's Name": student.motherName,
      "Mother's Occupation": student.motherOccupation || "Not Provided",
      "Mother's Aadhar": student.motherAadhar || "Not Provided",
      Caste: student.caste,
      "Sub Caste": student.subCaste,
      Address: `${student.address.doorNo}, ${student.address.street}, ${student.address.city}, ${student.address.pincode}`,
      "Whatsapp No": student.whatsappNo,
      "Emergency Contact": student.emergencyContact,
      Hostel: student.hostel ? "Yes" : "No",
      "Fee Details": student.feeDetails
        .map((fee) => `${fee.name}: ${fee.amount}`)
        .join(", "),
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);

    const wscols = [
      { wch: 25 }, // Student Name
      { wch: 15 }, // Student ID
      { wch: 15 }, // Admission No
      { wch: 20 }, // Child ID
      { wch: 20 }, // Class
      { wch: 20 }, // Section
      { wch: 10 }, // Gender
      { wch: 15 }, // Date of Birth
      { wch: 20 }, // Aadhar No
      { wch: 15 }, // AAPR No
      { wch: 25 }, // Father's Name
      { wch: 25 }, // Father's Occupation
      { wch: 25 }, // Father's Aadhar
      { wch: 25 }, // Mother's Name
      { wch: 25 }, // Mother's Occupation
      { wch: 25 }, // Mother's Aadhar
      { wch: 15 }, // Caste
      { wch: 15 }, // Sub Caste
      { wch: 50 }, // Address
      { wch: 20 }, // Whatsapp No
      { wch: 20 }, // Emergency Contact
      { wch: 10 }, // Hostel
      { wch: 50 }, // Fee Details
    ];

    // Apply the column widths to the worksheet
    ws["!cols"] = wscols;

    // Create the workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");

    // Write the Excel file and trigger the download
    XLSX.writeFile(wb, "Student_Reports.xlsx");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-gray-800 text-2xl font-bold mb-4">Student Reports</h1>

      <div className="mb-4">
        <label
          className="block text-gray-700 font-medium mb-2"
          htmlFor="classDropdown"
        >
          Select Class
        </label>
        <select
          id="classDropdown"
          className="w-full p-2 border border-gray-300 rounded"
          value={selectedClass}
          onChange={handleClassChange}
        >
          <option value="">-- Select a Class --</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 font-medium mb-2"
          htmlFor="sectionDropdown"
        >
          Select Section
        </label>
        <select
          id="sectionDropdown"
          className="w-full p-2 border border-gray-300 rounded"
          value={selectedSection}
          onChange={handleSectionChange}
          disabled={!selectedClass}
        >
          <option value="">-- Select a Section --</option>
          {sections.map((section) => (
            <option key={section._id} value={section._id}>
              {section.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <button
          onClick={() => handleTabChange("studentList")}
          className={`px-4 py-2 mr-2 ${activeTab === "studentList"
            ? "bg-blue-500 text-white"
            : "bg-gray-200"
            }`}
        >
          Student List
        </button>
        <button
          onClick={() => handleTabChange("downloadData")}
          className={`px-4 py-2 ${activeTab === "downloadData"
            ? "bg-blue-500 text-white"
            : "bg-gray-200"
            }`}
        >
          Download Data
        </button>
      </div>

      {activeTab === "studentList" && (
        <>
          {students.length > 0 && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by student name"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student) => (
              <div
                key={student._id}
                className="p-4 bg-white shadow-md rounded hover:shadow-lg cursor-pointer"
                onClick={() =>
                  navigate(`/branch-admin/students/${student._id}`)
                }
              >
                {/* <img
                  src={student.photo || "/placeholder.jpg"}
                  alt={student.name}
                  className="w-16 h-16 rounded-full mx-auto mb-2"
                /> */}
                <h3 className="text-gray-800 text-lg font-semibold text-center">
                  {student.name}
                </h3>
                <p className="text-gray-600 text-center">ID: {student.idNo}</p>
                <p className="text-gray-600 text-center">
                  Class: {student.class.name}
                </p>

                <div className="fee pay-button mt-2 text-center">
                  <Link
                    to={`/branch-admin/students-payfee/${student._id}`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the parent onClick
                      setfeetab(student._id);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 inline-block"
                  >
                    Pay Fee
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === "downloadData" && (
        <div className="mt-4">
          <button
            onClick={handleDownloadExcel}
            className="px-6 py-3 bg-green-500 text-white rounded"
          >
            Download Student Data (Excel)
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentsReports;
