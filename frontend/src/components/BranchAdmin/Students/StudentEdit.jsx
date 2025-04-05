import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Allapi from "../../../common";
import { useRef } from "react";
import { MdDelete } from "react-icons/md";

import { useContext } from "react";
import { mycon } from "../../../store/Mycontext";
import { useNavigate } from "react-router-dom";
const cloudName = import.meta.env.VITE_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET;
import { useReactToPrint } from "react-to-print";

// Add CSS styles directly to ensure they're applied
const styles = `
  .input-field {
    width: 100%;
    padding: 8px 12px;
    border-radius: 4px;
    transition: border-color 0.3s;
    font-size: 14px;
    line-height: 1.5;
    color: black !important;
    background-color: white !important;
    border: 2px solid black !important;
  }
  
  .input-field:focus {
    outline: none;
    border-color: #3b82f6 !important;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }
  
  label {
    font-weight: 500;
    margin-bottom: 4px;
    display: block;
    color: black !important;
  }
  
  select.input-field {
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
  }
  
  tbody td, thead th {
    color: black !important;
  }
  
  .table-auto {
    border: 1px solid #e5e7eb;
  }
`;

const StudentEdit = () => {
  const navigate = useNavigate();
  const { sid } = useParams();
  // Get student ID from the URL
  const tableRef = useRef();
  const childIdInputRef = useRef(null); // Reference for the childId input
  const { branchdet } = useContext(mycon);
  const [hosteladd, sethosteladd] = useState(false);
  const [feeTypes, setFeeTypes] = useState([]);
  const [photoPreview, setphotoPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize form data with default values
  const [formData, setFormData] = useState({
    idNo: "",
    admissionNo: "",
    childId: "",
    surname: "",
    name: "",
    gender: "",
    class: { name: "", id: "" },
    section: { name: "", id: "" },
    dob: "",
    admissionDate: new Date().toISOString().split("T")[0],
    photo: "",
    academic_id: "",
    aadharNo: "",
    studentAAPR: "",
    caste: "OC",
    subCaste: "",
    fatherName: "",
    fatherAadhar: "",
    fatherOccupation: "Employee",
    motherName: "",
    motherAadhar: "",
    motherOccupation: "House-wife",
    whatsappNo: "",
    emergencyContact: "",
    address: {
      doorNo: "",
      street: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    },
    transport: false,
    transportDetails: {
      town: "",
      bus: "",
      halt: "",
      amount: 0,
    },
    hostel: false,
    hostelDetails: {
      hostelFee: "",
      terms: "",
    },
    feeDetails: [],
  });
  
  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authorization token not found!");
        setLoading(false);
        setError("Authorization token not found");
        return;
      }
      try {
        const response = await fetch(Allapi.getstudentbyId.url(sid), {
          method: Allapi.getstudentbyId.method,
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Server response: ${errorText}`);
          throw new Error(`Failed to fetch student details: ${response.status}`);
        }

        const datares = await response.json();
        console.log("Student data response:", datares);
        
        if (datares.success && datares.data) {
          // Check if the data has a childId directly from the database
          const serverChildId = datares.data.childId || "";
          console.log("Child ID from server:", serverChildId);
          
          // Only use localStorage as fallback if no childId in the database
          const lastChildId = localStorage.getItem('lastChildId');
          
          // Prioritize the database value, fallback to localStorage only if needed
          const effectiveChildId = serverChildId || lastChildId || "";
          console.log("Effective childId to use:", effectiveChildId);
          
          // Make sure to provide default values for any fields that might be undefined
          const studentData = {
            ...datares.data,
            childId: effectiveChildId,
            dob: datares.data.dob || new Date().toISOString(),
            admissionDate: datares.data.admissionDate || new Date().toISOString(),
            address: {
              doorNo: datares.data.address?.doorNo || "",
              street: datares.data.address?.street || "",
              city: datares.data.address?.city || "",
              state: datares.data.address?.state || "",
              country: datares.data.address?.country || "",
              pincode: datares.data.address?.pincode || "",
            },
            class: datares.data.class || { name: "", id: "" },
            section: datares.data.section || { name: "", id: "" },
            feeDetails: Array.isArray(datares.data.feeDetails) ? datares.data.feeDetails : [],
            transportDetails: {
              town: datares.data.transportDetails?.town || "",
              bus: datares.data.transportDetails?.bus || "",
              halt: datares.data.transportDetails?.halt || "",
              amount: datares.data.transportDetails?.amount || 0,
              terms: datares.data.transportDetails?.terms || 0,
            },
            hostelDetails: {
              hostelFee: datares.data.hostelDetails?.hostelFee || "",
              terms: datares.data.hostelDetails?.terms || "",
            }
          };
          
          console.log("Processed student data childId:", studentData.childId);
          
          // Use a functional update to ensure we're using the latest state
          setFormData(prevData => ({
            ...prevData,
            ...studentData
          }));
          
          // Set the current town if it exists to trigger loading of buses and halts
          if (studentData.transportDetails.town) {
            setcurr_town(studentData.transportDetails.town);
          }
          
          // Set classname if it exists to trigger loading of sections
          if (studentData.class.name) {
            setClassname(studentData.class.name);
          }
          
          setphotoPreview(studentData.photo || "");
          
          // Immediately update the childId input if the ref is available
          if (childIdInputRef.current) {
            childIdInputRef.current.value = effectiveChildId;
          }
          
          setTimeout(() => {
            console.log("Child ID after setFormData:", formData.childId);
          }, 0);
          
          toast.success("Student data loaded successfully");
          
          // If we successfully loaded data with a childId from server, clear localStorage
          if (serverChildId) {
            localStorage.removeItem('lastChildId');
            localStorage.removeItem('currentChildId');
          }
        } else {
          setError(datares.message || "Failed to load student data");
          toast.error(datares.message || "Failed to load student data");
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
        setError(error.message);
        toast.error(`Error: ${error.message}`);
      } finally {
        setLoading(false);
        console.log("Form data after loading:", formData);
        console.log("Child ID after loading:", formData.childId);
      }
    };

    fetchStudent();
    
    // Cleanup function when component unmounts
    return () => {
      // We don't need to clean up localStorage here anymore
      // The server is our source of truth for childId
    };
  }, [sid]);

  // Add a dedicated effect to monitor childId changes
  useEffect(() => {
    console.log("childId changed in state:", formData.childId);
    
    // Directly update the input field value if the ref is available
    if (childIdInputRef.current && formData.childId) {
      childIdInputRef.current.value = formData.childId;
    }
  }, [formData.childId]);

  const [towns, setTowns] = useState([]);
  const [buses, setBuses] = useState([]);
  const [halts, setHalts] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [curr_town, setcurr_town] = useState(null);
  const [stdcount, setstdcount] = useState(0);
  const [ysuffix, setysuffix] = useState(0);

  const Fees = [];
  const acid = formData.academic_id;
  const [classname, setClassname] = useState(null);
  const casteOptions = ["OC", "BC", "SC", "ST"];
  const fatherOccupationOptions = ["Employee", "Business"];
  const motherOccupationOptions = ["Housewife", "Employee"];

  const curracad = async (bid) => {
    const response = await fetch(Allapi.getAcademicYears.url(bid), {
      method: Allapi.getAcademicYears.method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch academic years");
    }

    const res = await response.json();
    if (res.success) {
      const years = res.data;
      const present_Acad = years.find((year) => year._id == acid);
      const yearSuffix = present_Acad.year.slice(-2);
      console.log("present academic is", yearSuffix);
      const studentCountResponse = await fetch(
        Allapi.getStudentCountByAcademicYear.url(acid),
        {
          method: Allapi.getStudentCountByAcademicYear.method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!studentCountResponse.ok) {
        throw new Error("Failed to fetch student count for the academic year");
      }

      const studentCountData = await studentCountResponse.json();
      if (studentCountData.success) {
        const currentCount = studentCountData.count + 1; // Increment for the new student
        setstdcount(currentCount);
        setysuffix(yearSuffix);
        const id = `${yearSuffix}${String(currentCount).padStart(4, "0")}`;

        // Update the form data
        setFormData((prev) => ({
          ...prev,

          academic_id: acid,
        }));
        setClassname(formData.class.name);
        setcurr_town(formData.transportDetails.town);
      } else {
        throw new Error("Failed to retrieve student count data");
      }
    }
  };

  useEffect(() => {
    if (branchdet && branchdet._id && acid) {
      curracad(branchdet._id);
    }

    const fetchClasses = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(Allapi.getClasses.url(acid), {
          method: Allapi.getClasses.method,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        if (result.success) {
          setClasses(result.data);
          console.log("classes are", classes);
        } else {
          toast.error(result.message || "Failed to fetch classes");
        }
      } catch (error) {
        toast.error("Error fetching classes");
      }
    };

    if (acid) fetchClasses();
  }, [branchdet, acid]);

  useEffect(() => {
    const fetchSections = async (className, curr_acad) => {
      console.log("hello", className);
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          Allapi.getSectionsByClass.url(className, curr_acad),
          {
            method: Allapi.getSectionsByClass.method,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.json();
        if (result.success) {
          setSections(result.data || []);
        } else {
          toast.error(result.message || "Failed to fetch sections");
        }
      } catch (error) {
        toast.error("Error fetching sections");
      }
    };
    if (classname != null && acid) {
      console.log("classname is", classname);
      console.log("acid is", acid);
      fetchSections(classname, acid);
    }
  }, [branchdet, classname, acid]);

  useEffect(() => {
    if (curr_town) {
      console.log("Fetching buses for town:", curr_town);
      fetchbusdetails(curr_town);
    }
  }, [curr_town]);

  // Set halts when both towns and curr_town are available
  useEffect(() => {
    if (curr_town && towns.length > 0) {
      const selectedtown = towns.find((town) => town.townName === curr_town);
      console.log("Selected town:", selectedtown);

      if (selectedtown) {
        setHalts(selectedtown.halts);
        console.log("Halts updated to:", selectedtown.halts);
        setFormData((prev) => ({
          ...prev,
          transportDetails: {
            ...prev.transportDetails,
            amount: selectedtown.amount,
          },
        }));
        console.log("changeform data is", formData);
      }
    }
  }, [curr_town, towns]);
  const fetchFeeTypes = async (curr_Acad) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(Allapi.getAllFeeTypes.url(curr_Acad), {
        method: Allapi.getAllFeeTypes.method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (result.success) {
        setFeeTypes(result.feeTypes);
      } else {
        toast.error(result.message || "Failed to fetch fee types");
      }
    } catch (error) {
      console.error("Error fetching fee types:", error);
      toast.error("Error fetching fee types");
    }
  };

  const fetchTransportDetails = async () => {
    console.log("fecthing towns");
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(Allapi.getallTowns.url(acid), {
        method: Allapi.getallTowns.method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const townsData = await response.json();
      console.log("towns are ", townsData);
      setTowns(townsData.data);
      console.log("town data is", townsData);
    } catch (error) {
      toast.error("Error fetching transport details");
    }
  };
  const fetchbusdetails = async (townname) => {
    const token = localStorage.getItem("token");
    try {
      console.log("current town to fetch busses is", townname);
      const bus_response = await fetch(Allapi.getByPlaceBus.url(acid), {
        method: Allapi.getByPlaceBus.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({ place: townname }),
      });

      const busesData = await bus_response.json();
      setBuses(busesData.data);
      console.log(busesData);
    } catch (error) {
      console.log("bus error is", error.message);
      toast.error(error);
    }
  };
  useEffect(() => {
    if (formData.transport) {
      fetchTransportDetails();
    }
  }, [acid]);

  const handleTransportChange = async (e) => {
    const checked = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      transport: checked,
    }));
    if (checked) {
      await fetchTransportDetails();
    } else {
      formData.feeDetails.forEach((fee, index) => {
        if (fee.name === "Transport-fee") {
          formData.feeDetails.splice(index, 1);
          formData.transportDetails.amount = 0;
          formData.transportDetails.town = "";
        }
      });
      formData.transportDetails.amount = null;
      formData.transportDetails.bus = null;
      formData.transportDetails.halt = null;
      formData.transportDetails.town = null;
    }
  };

  const handleClassChange = (e) => {
    const selectedClass = classes.find((cls) => cls.name === e.target.value);

    console.log("selected class is ", selectedClass);
    // console.log("selected class name", selectedClass.name);
    setFormData((prev) => ({
      ...prev,
      class: { name: selectedClass.name, id: selectedClass._id }, // Set both class name and id
      section: "", // Reset section if class changes
      feeDetails: [],
    }));
    console.log("form data in classchange is", formData);
    setClassname(selectedClass.name);
    console.log("classname current is", classname);
  };

  const handleSectionChange = async (e) => {
    const selectedSection = sections.find((sec) => sec.name === e.target.value);
    console.log("selected section is", selectedSection);
    setFormData((prev) => ({
      ...prev,
      section: { name: selectedSection.name, id: selectedSection._id },
    }));

    // {selectedSection.fees && selectedSection.fees.map((fee,index)=>{
    //   setfees((prev)=>({
    //     ...prev,

    //   }))
    // })}
    if (selectedSection.fees) {
      console.log("current sec fees are", selectedSection.fees);
      setFormData((prev) => ({
        ...prev,
        feeDetails: selectedSection.fees.map((fees) => ({
          name: fees.feeType,
          amount: fees.amount,
        })),
      }));
    }
    console.log(" curr fees are ", Fees);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      console.log("image data is ", data);
      setphotoPreview(data.secure_url);
      setFormData((prev) => ({ ...prev, photo: data.secure_url }));
      toast.success("Photo uploaded successfully!");
    } catch (error) {
      toast.error("Photo upload failed");
    }
  };
  const handleHostelChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      hostel: e.target.checked,
    }));
    if (!e.target.checked) {
      formData.feeDetails.forEach((fee, index) => {
        if (fee.name === "hostel-fee") {
          formData.feeDetails.splice(index, 1);
          formData.hostelDetails.hostelFee = "";
          formData.hostelDetails.terms = "";
        }
      });
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    console.log("name is", name, " value is", value);
    
    // Special handling for childId to ensure it updates correctly
    if (name === 'childId') {
      console.log("Updating childId to:", value);
      
      // Use a functional update to ensure we're using the latest state
      setFormData(prev => {
        const updated = {
          ...prev,
          childId: value
        };
        console.log("Updated form data childId:", updated.childId);
        return updated;
      });
      
      // No longer need to store in localStorage as the primary source
      // but we'll keep it as a backup in case of page refreshes
      if (value) {
        localStorage.setItem('currentChildId', value);
      }
      
      return; // Exit early after handling childId specially
    }

    if (name === 'name' || name === 'surname') {
      setFormData((prev) => ({
        ...prev,
        [name]: capitalizeFirstLetter(value),
      }));
    } else if (name.startsWith("address.")) {
      const fieldName = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [fieldName]: value,
        },
      }));

      console.log("form data is address ", formData);
    } else if (name.startsWith("transportDetails.")) {
      console.log("details fee are ", formData.feeDetails);
      const fieldName = name.split(".")[1];

      setFormData((prev) => ({
        ...prev,
        transportDetails: { ...prev.transportDetails, [fieldName]: value },
      }));
      if (fieldName == "town") {
        setcurr_town(value);
        formData.feeDetails.forEach((fee, index) => {
          if (fee.name === "Transport-fee") {
            formData.feeDetails.splice(index, 1);
          }
        });
      }
      // Fetch transport details only if the town field is updated
      if (towns.length == 0) {
        await fetchTransportDetails();
      }
    } else if (name.startsWith("hostelDetails.")) {
      const fieldName = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        hostelDetails: {
          ...prev.hostelDetails,
          [fieldName]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  function addTfee() {
    if (formData.transport == true && formData.transportDetails.amount != 0) {
      const checkTfee = formData.feeDetails.some(
        (fee) => fee.name === "Transport-fee"
      );
      if (!checkTfee) {
        setFormData((prev) => ({
          ...prev,
          feeDetails: [
            ...prev.feeDetails,
            {
              name: "Transport-fee",
              amount: parseInt(formData.transportDetails.amount),
              terms: parseInt(formData.transportDetails.terms),
              concession: parseFloat(formData.transportDetails.concession) || 0,
              finalAmount: parseInt(
                formData.transportDetails.amount -
                  formData.transportDetails.amount *
                    (formData.transportDetails.concession
                      ? formData.transportDetails.concession
                      : 0)
              ),
            },
          ],
        }));
      } else {
        toast.error(" transport fee added already");
      }
    }
  }
  function addfee() {
    console.log("current fees are", Fees);

    const checkfee = formData.feeDetails.some(
      (fee) => fee.name === "hostel-fee"
    );
    console.log("checkfee is", checkfee);
    if (!checkfee) {
      setFormData((prev) => ({
        ...prev,
        feeDetails: [
          ...prev.feeDetails,
          {
            name: "hostel-fee",
            amount: parseInt(formData.hostelDetails.hostelFee),
            terms: parseInt(formData.hostelDetails.terms),
            concession: parseFloat(formData.hostelDetails.concession) || 0,
            finalAmount: parseInt(
              formData.hostelDetails.hostelFee -
                formData.hostelDetails.hostelFee *
                  (formData.hostelDetails.concession
                    ? formData.hostelDetails.concession
                    : 0)
            ),
          },
        ],
      }));
      sethosteladd(true);

      console.log("fee form data hostel", formData);
      Fees.push({
        name: "hostel-fee",
        amount: formData.hostelDetails.hostelFee,
      });
      console.log("all fees are", Fees);
    } else {
      toast.error("Hostel Fee added already");
    }
  }
  function imgdel() {
    const del = window.confirm("Do you want to delete this image");
    if (del) {
      setphotoPreview("");
      formData.photo = "";
    }
  }
  const calculateTotalFee = () =>
    formData.feeDetails.reduce(
      (total, fee) => total + (fee.finalAmount || fee.amount),
      0
    );

  const handlePrint = () => {
    // Get the table to print
    const printContents = document.querySelector("table").outerHTML;

    // Add CSS for table formatting
    const style = `
      <style>
        .maintitle {
          font-size: 20px;
          font-weight: bold; 
          text-align: center;
          margin-bottom: 10px; 
        }
        .declaration {
          margin-top: 20px;
          font-size: 14px;
          text-align: justify;
        }
        .signatures {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
        }
        .signature-label {
          font-weight: bold;
          font-size: 16px;
          text-align: center;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #ccc;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f8f8f8;
        }
        tr:hover {
          background-color: #f1f1f1;
        }
      </style>
    `;

    // Open a new window for printing
    const printWindow = window.open("", "_blank");

    // Write contents to the new window
    printWindow.document.write(`
      <html>
        <head>
          <title>Vidya Nidhi Institutions</title>
          ${style}
        </head>
        <body>
          <div class="maintitle">FEE Declaration</div>
          <div>Name: ${formData.name}</div>
          <div>Class: ${formData.class.name}</div>
          <div>Section: ${formData.section.name}</div>
          <div>ID No: ${formData.idNo}</div>
          <div>Father Name: ${formData.fatherName}</div>
          <div>Phone Number: ${formData.whatsappNo}</div>
          ${printContents}
          <div class="declaration">
            I hereby declare that the information provided above is correct, and I agree to pay the fee as mentioned above. I understand that this Fee declaration is valid only upon authentication by the institution.
          </div>
          <div class="signatures">
            <div class="signature-label">
              Principal's Signature
            </div>
            <div class="signature-label">
              Parent's Signature
            </div>
          </div>
        </body>
      </html>
    `);

    // Print the window content
    printWindow.document.close(); // Close document for additional changes
    printWindow.focus(); // Ensure focus on the print window
    printWindow.print(); // Trigger print dialog
    printWindow.close(); // Close the print window after printing
  };
  const handleDelete = async (sid, acid) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authorization token not found!");
      return;
    }

    // Confirm with the user before proceeding with the deletion
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (!isConfirmed) {
      return; // Exit the function if the user cancels the deletion
    }

    try {
      const response = await fetch(Allapi.deletestudentbyId.url(sid), {
        method: Allapi.deletestudentbyId.method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete student");

      toast.success("Student deleted successfully");
      navigate(`/branch-admin/students-report/${acid}`); // Redirect to the academic ID's student list after deletion
    } catch (error) {
      toast.error(error.message);
    }
  };
  function findObjectByKey(array, key, value) {
    console.log("Array is", array);
    console.log("key is", key);
    console.log("value is", value);

    const foundObject = array.find((obj) => {
      // console.log("Checking object:", obj);
      return obj[key] === value; // Ensure the callback returns the condition
    });

    console.log("foundobj", foundObject);

    return foundObject ? foundObject.terms : undefined;
  }
  useEffect(() => {
    if (acid) {
      fetchFeeTypes(acid);
    }
  }, [acid]);
  useEffect(() => {
    // Update feeDetails with default concession and calculated finalAmount
    const updatedFees = formData.feeDetails.map((fee) => {
      const concession = fee.concession || 0; // Default to 0 if concession is not set
      const finalAmount =
        concession === 0
          ? fee.amount
          : fee.amount - (fee.amount * concession) / 100;

      return {
        ...fee,
        concession, // Ensure concession is set
        finalAmount, // Calculate or set default finalAmount
        terms: findObjectByKey(feeTypes, "type", fee.name), // Update terms
      };
    });

    setFormData((prev) => ({
      ...prev,
      feeDetails: updatedFees, // Update feeDetails with the new values
    }));
  }, [formData.section.id]);

  // Add a validation function for childId
  const validateChildId = (childId) => {
    // This function can include any validation logic you need for childId
    // For now, it just ensures it's a string and logs the result
    const validated = childId || "";
    console.log("Validated childId:", validated);
    return validated;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("formdata is edit ", formData);

    // Validate childId and ensure it's properly set in the state
    const validatedChildId = validateChildId(formData.childId);
    
    // Update the form data with validated childId
    const updatedFormData = {
      ...formData,
      childId: validatedChildId
    };
    
    // Set the updated form data
    setFormData(updatedFormData);
    console.log("Submitting form with childId:", validatedChildId);

    // Validate required fields
    if (!updatedFormData.name || updatedFormData.name.trim() === "") {
      toast.error("Student name is required.");
      return;
    }
    if (!updatedFormData.surname || updatedFormData.surname.trim() === "") {
      toast.error("Surname is required.");
      return;
    }
    if (!updatedFormData.gender) {
      toast.error("Gender is required.");
      return;
    }
    if (!updatedFormData.class) {
      toast.error("Class is required.");
      return;
    }
    if (!updatedFormData.section) {
      toast.error("Section is required.");
      return;
    }
    if (!updatedFormData.dob) {
      toast.error("Date of birth is required.");
      return;
    }

    // Check valid date of birth
    const dobDate = new Date(updatedFormData.dob);
    if (isNaN(dobDate.getTime()) || dobDate > new Date()) {
      toast.error("Please enter a valid date of birth.");
      return;
    }

    if (!updatedFormData.admissionNo || updatedFormData.admissionNo.trim() === "") {
      toast.error("Admission number is required.");
      return;
    }
    if (!updatedFormData.aadharNo || !/^\d{12}$/.test(updatedFormData.aadharNo)) {
      toast.error("aadhar number must be 12 digits");
      return;
    }
    if (!updatedFormData.studentAAPR || !/^\d{12}$/.test(updatedFormData.studentAAPR)) {
      toast.error("student aapar number must be 12 digits");
      return;
    }

    if (!updatedFormData.whatsappNo || !/^\d{10}$/.test(updatedFormData.whatsappNo)) {
      toast.error("Valid WhatsApp number is required (10 digits).");
      return;
    }

    if (
      !updatedFormData.emergencyContact ||
      !/^\d{10}$/.test(updatedFormData.emergencyContact)
    ) {
      toast.error("Valid emergency contact is required (10 digits).");
      return;
    }

    if (!updatedFormData.address.doorNo || updatedFormData.address.doorNo.trim() === "") {
      toast.error("Door number in address is required.");
      return;
    }
    if (!updatedFormData.address.street || updatedFormData.address.street.trim() === "") {
      toast.error("Street in address is required.");
      return;
    }
    if (!updatedFormData.address.city || updatedFormData.address.city.trim() === "") {
      toast.error("City in address is required.");
      return;
    }

    // Validate Aadhar details
    if (updatedFormData.aadharNo && !/^\d{12}$/.test(updatedFormData.aadharNo)) {
      toast.error("Aadhar number must be 12 digits.");
      return;
    }
    if (updatedFormData.fatherAadhar && !/^\d{12}$/.test(updatedFormData.fatherAadhar)) {
      toast.error("Father's Aadhar number must be 12 digits.");
      return;
    }
    if (updatedFormData.motherAadhar && !/^\d{12}$/.test(updatedFormData.motherAadhar)) {
      toast.error("Mother's Aadhar number must be 12 digits.");
      return;
    }

    // Remove transportDetails if transport is false
    if (!updatedFormData.transport) {
      // updatedFormData.transportDetails = undefined;
      // updatedFormData.transportDetails.amount=null;
      updatedFormData.transportDetails.bus = null;
      updatedFormData.transportDetails.halt = null;
      updatedFormData.transportDetails.town = null;
    } else {
      // Validate transport details
      if (
        !updatedFormData.transportDetails.town ||
        updatedFormData.transportDetails.town.trim() === ""
      ) {
        toast.error("Town is required for transport details.");
        return;
      }
      if (
        !updatedFormData.transportDetails.bus ||
        updatedFormData.transportDetails.bus.trim() === ""
      ) {
        toast.error("Bus is required for transport details.");
        return;
      }
      if (
        !updatedFormData.transportDetails.halt ||
        updatedFormData.transportDetails.halt.trim() === ""
      ) {
        toast.error("Halt is required for transport details.");
        return;
      }
      if (
        !updatedFormData.transportDetails.amount ||
        isNaN(updatedFormData.transportDetails.amount) ||
        updatedFormData.transportDetails.amount <= 0
      ) {
        toast.error("Valid transport amount is required.");
        return;
      }
    }

    // Remove hostelDetails if hostel is false
    if (!updatedFormData.hostel) {
      if (!updatedFormData.hostel) {
        updatedFormData.hostelDetails.hostelFee = "";
        updatedFormData.hostelDetails.terms = "";
        alert("hi");
      }
    } else {
      // Validate hostel details
      if (
        !updatedFormData.hostelDetails.hostelFee ||
        isNaN(updatedFormData.hostelDetails.hostelFee) ||
        updatedFormData.hostelDetails.hostelFee <= 0
      ) {
        toast.error("Valid hostel fee is required.");
        return;
      }
      if (
        !updatedFormData.hostelDetails.terms ||
        updatedFormData.hostelDetails.terms.trim() === ""
      ) {
        toast.error("Terms for hostel details are required.");
        return;
      }
    }

    // Check if feeDetails array is valid
    if (
      !updatedFormData.feeDetails ||
      !Array.isArray(updatedFormData.feeDetails) ||
      updatedFormData.feeDetails.length === 0
    ) {
      toast.error("At least one fee detail must be provided.");
      return;
    }

    // Submit the form
    try {
      const token = localStorage.getItem("token");

      // Make the API request to submit the form
      const prepareFormDataForSubmission = () => {
        // Create a copy of the updated form data to modify
        const dataToSubmit = { ...updatedFormData };
        
        // Ensure address.pincode is always set (even to empty string)
        // This maintains compatibility with the backend schema
        if (!dataToSubmit.address.pincode) {
          dataToSubmit.address.pincode = "";
        }
        
        // Ensure photo field exists but can be empty
        if (!dataToSubmit.photo) {
          dataToSubmit.photo = "";
        }
        
        // Explicitly ensure childId is included in the submission
        console.log("Child ID before submission:", dataToSubmit.childId);
        
        // Make sure childId is properly set and not null
        dataToSubmit.childId = dataToSubmit.childId || validatedChildId || "";
        console.log("Final childId being submitted:", dataToSubmit.childId);
        
        return dataToSubmit;
      };

      const dataToSend = prepareFormDataForSubmission();
      console.log("Final data being submitted:", dataToSend);

      const res = await fetch(Allapi.editstudentbyId.url(sid), {
        method: Allapi.editstudentbyId.method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      const fres = await res.json();
      console.log("API response after update:", fres);

      if (fres.success) {
        // Log the response data to check if childId was returned
        if (fres.data) {
          console.log("Updated student data from server:", fres.data);
          console.log("Child ID in server response:", fres.data.childId);
        }
        
        toast.success("Student updated successfully!");
        
        // No need to use localStorage anymore since childId is properly stored in DB
        // If we want to ensure it's available on next load, we can still set it
        // but the primary source will be the database
        if (validatedChildId) {
          localStorage.setItem('lastChildId', validatedChildId);
        }
        
        // Slight delay before reload to ensure the state is updated
        setTimeout(() => {
        window.location.reload();
        }, 300);
      } else {
        toast.error(fres.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the student.");
    }
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Safe getter for nested properties
  const getNestedValue = (obj, path, defaultValue = "") => {
    const travel = (regexp) =>
      String.prototype.split
        .call(path, regexp)
        .filter(Boolean)
        .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
    const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
    return result === undefined || result === null ? defaultValue : result;
  };

  // Make both useEffect hooks below run only once on mount to avoid potential conflicts
  useEffect(() => {
    // If we have a stored current childId value, use it
    const currentChildId = localStorage.getItem('currentChildId');
    const lastChildId = localStorage.getItem('lastChildId');
    
    // Use currentChildId first, then lastChildId, in that order of preference
    const preferredChildId = currentChildId || lastChildId || "";
    
    if (preferredChildId && childIdInputRef.current) {
      console.log("Using stored childId from localStorage:", preferredChildId);
      childIdInputRef.current.value = preferredChildId;
      
      // Also update the form data state
      setFormData(prev => ({
        ...prev,
        childId: preferredChildId
      }));
    }
  }, []); // empty dependency array means it runs once on mount

  // Check if student data is loaded properly
  if (!formData || Object.keys(formData).length === 0) {
    return (
      <div className="bg-white p-6 text-black rounded-lg shadow-md max-w-4xl mx-auto">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">No student data available. </strong>
          <span className="block sm:inline">Please try reloading the page or select another student.</span>
          <p className="mt-4">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Reload Page
            </button>
            <button 
              onClick={() => navigate('/branch-admin')} 
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Return to Dashboard
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white p-6 text-black rounded-lg shadow-md max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg font-medium">Loading student data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 text-black rounded-lg shadow-md max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <p className="mt-4">
            <button 
              onClick={() => navigate('/branch-admin')} 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Return to Dashboard
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 text-black rounded-lg shadow-md max-w-4xl mx-auto">
      {/* Add inline styles */}
      <style>{styles}</style>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-black font-medium">ID No:</label>
            <input
              type="text"
              name="idNo"
              value={formData.idNo || ""}
              onChange={handleChange}
              disabled
              className="input-field border-2 border-black text-black bg-white"
            />
          </div>
          <div>
            <label className="block text-sm text-black font-medium">Admission No:</label>
            <input
              type="text"
              name="admissionNo"
              value={formData.admissionNo}
              onChange={handleChange}
              maxLength={9}
              className="input-field border-2 border-black text-black bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-black font-medium">Child ID:</label>
            <input
              type="text"
              name="childId"
              value={formData.childId || ""}
              onChange={handleChange}
              ref={childIdInputRef}
              className="input-field border-2 border-black text-black bg-white"
            />
            {/* Debug output to show current childId value */}
            <div className="text-xs text-gray-500 mt-1">
              Current value: {formData.childId || ""}
            </div>
          </div>
          <div>
            <label className="block text-sm text-black font-medium">Surname:</label>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-black font-medium">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-black font-medium">Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-black font-medium">Class:</label>
            <select
              name="class"
              value={formData.class.name || ""}
              onChange={handleClassChange}
              className="input-field border-2 border-black text-black bg-white"
              required
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls.name}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-black font-medium">Section:</label>
            <select
              name="section"
              value={formData.section.name || ""}
              onChange={handleSectionChange}
              className="input-field border-2 border-black text-black bg-white"
              required
            >
              <option value="">Select Section</option>
              {sections.map((sec) => (
                <option key={sec._id} value={sec.name}>
                  {sec.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-black font-medium">Date of Birth:</label>
            <input
              type="date"
              name="dob"
              value={formData.dob ? formData.dob.split("T")[0] : ""}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-black font-medium">Admission Date:</label>
            <input
              type="date"
              name="admissionDate"
              value={
                formData.admissionDate 
                  ? formData.admissionDate.split("T")[0] 
                  : new Date().toISOString().split("T")[0]
              }
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-black font-medium">Aadhar No:</label>
            <input
              type="text"
              name="aadharNo"
              value={formData.aadharNo}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-black font-medium">Student AAPR:</label>
            <input
              type="text"
              name="studentAAPR"
              value={formData.studentAAPR}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-black font-medium">Caste:</label>
            <select
              name="caste"
              value={formData.caste}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
              required
            >
              {casteOptions.map((caste) => (
                <option key={caste} value={caste}>
                  {caste}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-black font-medium">Sub-Caste:</label>
            <input
              type="text"
              name="subCaste"
              value={formData.subCaste}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-black font-medium">Father Name:</label>
            <input
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-black font-medium">Father Aadhar:</label>
            <input
              type="text"
              name="fatherAadhar"
              value={formData.fatherAadhar}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-black font-medium">
              Father Occupation:
            </label>
            <select
              name="fatherOccupation"
              value={formData.fatherOccupation}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
              required
            >
              {fatherOccupationOptions.map((occupation) => (
                <option key={occupation} value={occupation}>
                  {occupation}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-black font-medium">Mother Name:</label>
            <input
              type="text"
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-black font-medium">Mother Aadhar:</label>
            <input
              type="text"
              name="motherAadhar"
              value={formData.motherAadhar}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-black font-medium">
              Mother Occupation:
            </label>
            <select
              name="motherOccupation"
              value={formData.motherOccupation}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
              required
            >
              {motherOccupationOptions.map((occupation) => (
                <option key={occupation} value={occupation}>
                  {occupation}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-black font-medium">Whatsapp No:</label>
            <input
              type="text"
              name="whatsappNo"
              value={formData.whatsappNo}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-black font-medium">
              Emergency Contact:
            </label>
            <input
              type="text"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-black font-medium">Address:</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <input
              type="text"
              name="address.doorNo"
              placeholder="Door No"
              value={formData.address.doorNo}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
              required
            />
            <input
              type="text"
              name="address.street"
              placeholder="Street"
              value={formData.address.street}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
              required
            />
            <input
              type="text"
              name="address.city"
              placeholder="City"
              value={formData.address.city}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
              required
            />
            <input
              type="text"
              name="address.pincode"
              placeholder="Pincode"
              value={formData.address.pincode}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center text-black">
            <input
              type="checkbox"
              name="transport"
              checked={formData.transport}
              onChange={handleTransportChange}
              className="mr-2"
            />
            Transport Required
          </label>
          {formData.transport && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm text-black font-medium">Town:</label>
                <select
                  name="transportDetails.town"
                  value={formData.transportDetails.town || ""}
                  onChange={handleChange}
                  onLoadStart={handleChange}
                  className="input-field border-2 border-black text-black bg-white"
                  required
                >
                  <option value="">Select Town</option>
                  {towns?.length > 0 ? (
  towns.map((town) => (
    <option key={town._id} value={town.townName}>
      {town.townName}
    </option>
  ))
) : (
  <option disabled>No towns available</option>
)}

                </select>
              </div>
              <div>
                <label className="block text-sm text-black font-medium">Bus:</label>
                <select
                  name="transportDetails.bus"
                  value={formData.transportDetails.bus || ""}
                  onChange={handleChange}
                  className="input-field border-2 border-black text-black bg-white"
                  required
                >
                  <option value="">Select Bus</option>
                  {buses &&
                    buses.map((bus) => (
                      <option key={bus._id} value={bus._id}>
                        {bus.busNo}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-black font-medium">Halt:</label>
                <select
                  name="transportDetails.halt"
                  value={formData.transportDetails.halt || ""}
                  onChange={handleChange}
                  className="input-field border-2 border-black text-black bg-white"
                  required
                >
                  <option value="">Select Halts</option>
                  {halts?.length > 0 ? (
  halts.map((halt, index) => (
    <option key={index} value={halt}>
      {halt}
    </option>
  ))
) : (
  <option disabled>No halts available</option>
)}

                </select>
                <div>
                  <label className="block text-sm text-black font-medium">
                    Number of Terms
                  </label>
                  <input
                    type="text"
                    name="transportDetails.terms"
                    value={formData.transportDetails.terms || ""}
                    onChange={handleChange}
                    className="input-field border-2 border-black text-black bg-white"
                    required
                  />
                </div>
              </div>
              <div className="col-span-3">
                <button
                  type="button"
                  onClick={addTfee}
                  className="text-white justify-center bg-red-600 mt-2 px-4 py-2 rounded"
                >
                  Add Transport Fee
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="col-span-2">
          <label className="flex items-center text-black">
            <input
              type="checkbox"
              checked={formData.hostel}
              onChange={handleHostelChange}
              className="mr-2"
            />
            Require Hostel?
          </label>
          {formData.hostel && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-black font-medium">
                  Hostel Fee
                </label>
                <input
                  type="number"
                  name="hostelDetails.hostelFee"
                  value={formData.hostelDetails.hostelFee || ""}
                  onChange={handleChange}
                  className="input-field border-2 border-black text-black bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-black font-medium">
                  Number of Terms
                </label>
                <input
                  type="text"
                  name="hostelDetails.terms"
                  value={formData.hostelDetails.terms || ""}
                  onChange={handleChange}
                  className="input-field border-2 border-black text-black bg-white"
                  required
                />
              </div>
              <div className="col-span-2">
                <button
                  type="button"
                  onClick={addfee}
                  className="text-white bg-red-600 mt-2 px-4 py-2 rounded"
                >
                  Add Hostel Fee
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto relative" ref={tableRef}>
            <thead className="bg-gray-100">
              <tr className="font-bold text-lg">
                <th className="px-6 py-3 text-left text-sm font-bold text-black">
                  Fee Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-black">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-black">
                  Terms
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-black">
                  Concession (%)
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-black">
                  Final Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {formData.feeDetails.map((fee, index) => (
                <tr key={index} className="border-t text-left hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-black">
                    {fee.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-black">
                    {fee.amount}
                  </td>
                  <td className="py-2 px-4 border-b text-black">
                    {findObjectByKey(feeTypes, "type", fee.name)
                      ? findObjectByKey(feeTypes, "type", fee.name)
                      : fee.terms}
                  </td>
                  <td className="px-6 py-4 text-sm text-black">
                    <input
                      type="number"
                      className="w-20 px-2 py-1 border-2 border-black rounded-md bg-white text-black"
                      value={fee.concession || ""}
                      min="0"
                      max="100"
                      onChange={(e) => {
                        const concession = parseFloat(e.target.value) || 0;
                        const finalAmount = parseFloat(
                          (
                            fee.amount -
                            (fee.amount * concession) / 100
                          ).toFixed(2)
                        );
                        const updatedFees = [...formData.feeDetails];
                        updatedFees[index] = {
                          ...fee,
                          concession,
                          finalAmount,
                        };
                        +setFormData({ ...formData, feeDetails: updatedFees });
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-black">
                    {fee.finalAmount ? fee.finalAmount : fee.amount}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t bg-gray-100">
                <td
                  colSpan="3"
                  className="px-6 py-4 text-sm font-medium text-black text-right"
                >
                  Total Fee:
                </td>
                <td className="px-6 py-4 text-md font-semibold text-black">
                  {calculateTotalFee().toFixed(2)}
                </td>
              </tr>
            </tfoot>
            <button
              type="button"
              onClick={handlePrint}
              className="absolute bottom-2 left-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 print:hidden"
            >
              Print
            </button>
          </table>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md"
          >
            Update Student
          </button>
        </div>
      </form>
      {/* Delete Button and Pay Fee Button */}
      <div className="mt-4 flex space-x-4 justify-center">
        <button
          onClick={() => navigate(`/branch-admin/students-payfee/${sid}`)}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
        >
          Pay Fee
        </button>
        <button
          onClick={() => handleDelete(sid, acid)} // Pass both sid and acid
          className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
        >
          Delete Student
        </button>
      </div>
    </div>
  );
};

export default StudentEdit;
