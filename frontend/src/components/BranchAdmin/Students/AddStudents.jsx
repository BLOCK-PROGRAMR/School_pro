import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Allapi from "../../../common";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { mycon } from "../../../store/Mycontext";
import { MdDelete } from "react-icons/md";
const cloudName = import.meta.env.VITE_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET;
import { useReactToPrint } from "react-to-print";

const AddStudents = () => {
  const tableRef = useRef();
  const { branchdet } = useContext(mycon);
  const [hosteladd, sethosteladd] = useState(false);
  const [feeTypes, setFeeTypes] = useState([]);
  const [formData, setFormData] = useState({
    idNo: "",
    admissionNo: "",
    childId: "",
    surname: "",
    name: "",
    gender: "",
    branch: String(branchdet._id),
    class: { name: "", id: "" },
    section: { name: "", id: "" },
    dob: "",
    admissionDate: new Date().toISOString().split("T")[0],
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
      // pincode: "",
    },
    transport: false,
    transportDetails: {
      town: "",
      bus: "",
      halt: "",
      amount: 0,
      terms: 0,
    },
    hostel: false,
    hostelDetails: {
      hostelFee: "",
      terms: "",
    },
    feeDetails: [],
  });

  const [towns, setTowns] = useState([]);
  const [buses, setBuses] = useState([]);
  const [halts, setHalts] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [classname, setClassname] = useState(null);
  const [curr_town, setcurr_town] = useState(null);
  const [stdcount, setstdcount] = useState(0);
  const [ysuffix, setysuffix] = useState(0);

  const Fees = [];
  const { acid } = useParams();
  const casteOptions = ["OC", "BC", "SC", "ST"];
  const fatherOccupationOptions = ["Employee", "Business"];
  const motherOccupationOptions = ["Housewife", "Employee"];
  useEffect(() => {
    // Update feeDetails with default concession and calculated finalAmount
    console.log("formdata feedetails", formData.feeDetails);
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

        const currentCount = studentCountData.count;

        const paddedCount = currentCount.toString().padStart(6, '0');
        alert(paddedCount)
        // Get the first two digits
        const lastFourDigits = parseInt(paddedCount.slice(-4));

        // Increment for the new student
        setstdcount(currentCount);
        setysuffix(yearSuffix);
        const prefix = parseInt(yearSuffix.padEnd(6, "0"))
        console.log("last four digits are", lastFourDigits);
        const id = `${String(prefix + lastFourDigits)}`;

        // alert(id)
        // Update the form data
        setFormData((prev) => ({
          ...prev,
          idNo: id,
          academic_id: acid,
        }));
      } else {
        throw new Error("Failed to retrieve student count data");
      }
    }
  };

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

  useEffect(() => {
    if (acid) {
      fetchFeeTypes(acid);
    }
  }, [acid]);
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
  }, [branchdet]);

  useEffect(() => {
    const fetchSections = async (className, curr_acad) => {
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
    if (!curr_town || !towns.length) {
      return;
    }

    console.log("Finding town in towns array:", curr_town);
    const selectedTown = towns.find(town => town.townName === curr_town);

    if (!selectedTown) {
      console.warn(`Town '${curr_town}' not found in towns array:`, towns);
      return;
    }

    console.log("Selected town details:", selectedTown);

    // Update halts array
    if (Array.isArray(selectedTown.halts)) {
      setHalts(selectedTown.halts);
      console.log("Halts updated to:", selectedTown.halts);
    } else {
      console.warn("Halts array is not valid:", selectedTown.halts);
      setHalts([]);
    }

    // Update transport amount in form data
    if (selectedTown.amount) {
      setFormData(prev => ({
        ...prev,
        transportDetails: {
          ...prev.transportDetails,
          amount: selectedTown.amount
        }
      }));
      console.log("Transport amount updated to:", selectedTown.amount);
    }
  }, [curr_town, towns]);

  const fetchTransportDetails = async () => {
    console.log("Fetching towns for academic year:", acid);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(Allapi.getallTowns.url(acid), {
        method: Allapi.getallTowns.method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch towns: ${response.status} ${response.statusText}`);
      }

      const townsData = await response.json();

      if (!townsData.success) {
        toast.error(townsData.message || "Failed to fetch towns");
        return;
      }

      setTowns(townsData.data || []);
      console.log("Fetched towns:", townsData.data);
    } catch (error) {
      console.error("Error fetching towns:", error);
      toast.error(`Error fetching transport details: ${error.message}`);
    }
  };

  const fetchbusdetails = async (townname) => {
    if (!townname) {
      console.warn("Town name is empty, cannot fetch buses");
      return;
    }

    const token = localStorage.getItem("token");
    console.log("Fetching buses for town:", townname, "academic year:", acid);

    try {
      const bus_response = await fetch(Allapi.getByPlaceBus.url(acid), {
        method: Allapi.getByPlaceBus.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ place: townname }),
      });

      if (!bus_response.ok) {
        throw new Error(`Failed to fetch buses: ${bus_response.status} ${bus_response.statusText}`);
      }

      const busesData = await bus_response.json();

      if (!busesData.success) {
        toast.error(busesData.message || "Failed to fetch buses");
        setBuses([]);
        return;
      }

      setBuses(busesData.data || []);
      console.log("Fetched buses:", busesData.data);
    } catch (error) {
      console.error("Error fetching buses:", error);
      toast.error(`Error fetching buses: ${error.message}`);
      setBuses([]);
    }
  };

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
          formData.transportDetails.terms = 0;
        }
      });
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
    console.log("fee types", feeTypes);
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
    console.log("form fee", formData.feeDetails);
    console.log(" curr fees are ", Fees);
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

  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For name and surname fields, capitalize the first letter
    if (name === 'name' || name === 'surname') {
      setFormData({
        ...formData,
        [name]: capitalizeFirstLetter(value),
      });
    }
    // For nested address fields
    else if (name.includes('.')) {
      const [parent, child] = name.split('.');

      // Handle town selection specifically
      if (parent === 'transportDetails' && child === 'town') {
        setcurr_town(value); // Update current town state to trigger useEffect
      }

      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    }
    // For all other fields
    else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  function addTfee() {
    console.log("form dta ", formData);
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
              finalAmount: parseInt(formData.transportDetails.amount - (formData.transportDetails.amount * (formData.transportDetails.concession ? formData.transportDetails.concession : 0)))
            },
          ],
        }));
      } else {
        toast.error(" transport fee added already");
      }
    }
  }
  function addfee() {
    console.log("adding hostel");
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
            finalAmount: parseInt(formData.hostelDetails.hostelFee - (formData.hostelDetails.hostelFee * (formData.hostelDetails.concession ? formData.hostelDetails.concession : 0)))
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
             నేను ఇచ్చిన సమాచారం సరిగానే ఉందని తెలియజేస్తున్నాను. పై ఫీజు చెల్లించేందుకు నేను ఒప్పుకుంటున్నాను. ఇది సంస్థ ధృవీకరించిన తర్వాతే చెల్లుబాటు అవుతుంది.
            <br>
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);

    // Validate required fields
    if (!formData.name || formData.name.trim() === "") {
      toast.error("Student name is required.");
      return;
    }
    if (!formData.surname || formData.surname.trim() === "") {
      toast.error("Surname is required.");
      return;
    }
    if (!formData.gender) {
      toast.error("Gender is required.");
      return;
    }
    if (!formData.class) {
      toast.error("Class is required.");
      return;
    }
    if (!formData.section) {
      toast.error("Section is required.");
      return;
    }
    if (!formData.aadharNo) {
      toast.error("Aadhar number is required.");
    }

    // Check valid date of birth if provided
    if (formData.dob) {
      const dobDate = new Date(formData.dob);
      if (isNaN(dobDate.getTime()) || dobDate > new Date()) {
        toast.error("Please enter a valid date of birth.");
        return;
      }
    }

    // Admission number validation - only if provided
    if (formData.admissionNo && formData.admissionNo.length >= 10) {
      toast.error("Admission number must be less than 10 characters.");
      return;
    }

    // Aadhar validation - only if provided
    if (formData.aadharNo && !/^\d{12}$/.test(formData.aadharNo)) {
      toast.error("Aadhar number must be 12 digits");
      return;
    }

    // Student AAPR validation - only if provided
    if (formData.studentAAPR && !/^\d{12}$/.test(formData.studentAAPR)) {
      toast.error("Student AAPR number must be 12 digits");
      return;
    }

    // Contact number validations
    if (!formData.whatsappNo || !/^\d{10}$/.test(formData.whatsappNo)) {
      toast.error("Valid WhatsApp number is required (10 digits).");
      return;
    }

    // Emergency contact validation - only if provided
    if (formData.emergencyContact && !/^\d{10}$/.test(formData.emergencyContact)) {
      toast.error("Emergency contact must be 10 digits if provided.");
      return;
    }

    // Address validations - street and city required, door number optional
    if (!formData.address.street || formData.address.street.trim() === "") {
      toast.error("Street in address is required.");
      return;
    }

    if (!formData.address.city || formData.address.city.trim() === "") {
      toast.error("City in address is required.");
      return;
    }

    // if (formData.address.pincode && !/^\d{6}$/.test(formData.address.pincode)) {
    //   toast.error("Valid pincode is required (6 digits).");
    //   return;
    // }

    // Family Aadhar validations - only if provided
    if (formData.fatherAadhar && !/^\d{12}$/.test(formData.fatherAadhar)) {
      toast.error("Father's Aadhar number must be 12 digits if provided.");
      return;
    }

    if (formData.motherAadhar && !/^\d{12}$/.test(formData.motherAadhar)) {
      toast.error("Mother's Aadhar number must be 12 digits if provided.");
      return;
    }

    // Transport validations
    if (formData.transport) {
      // Check if town is selected
      if (!formData.transportDetails.town || formData.transportDetails.town.trim() === "") {
        toast.error("Town is required for transport details.");
        return;
      }

      // Check if bus is selected
      if (!formData.transportDetails.bus || formData.transportDetails.bus.trim() === "") {
        toast.error("Bus is required for transport details.");
        return;
      }

      // Check if halt is selected
      if (!formData.transportDetails.halt || formData.transportDetails.halt.trim() === "") {
        toast.error("Halt is required for transport details.");
        return;
      }

      // Validate amount is present and valid
      if (!formData.transportDetails.amount || isNaN(formData.transportDetails.amount) || formData.transportDetails.amount <= 0) {
        toast.error("Valid transport amount is required.");
        return;
      }

      // Validate transport fee is added to fee details
      const transportFeeAdded = formData.feeDetails.some(fee => fee.name === "Transport-fee");
      if (!transportFeeAdded) {
        toast.error("Please add transport fee by clicking the 'Add Transport Fee' button.");
        return;
      }
    } else {
      // If transport not required, ensure transportDetails is not present in submission
      const dataToSubmit = { ...formData };
      delete dataToSubmit.transportDetails;
      setFormData(dataToSubmit);
    }

    // Check hostel details
    if (formData.hostel) {
      // Validate hostel details
      if (
        !formData.hostelDetails.hostelFee ||
        isNaN(formData.hostelDetails.hostelFee) ||
        formData.hostelDetails.hostelFee <= 0
      ) {
        toast.error("Valid hostel fee is required.");
        return;
      }
      if (
        !formData.hostelDetails.terms ||
        formData.hostelDetails.terms.trim() === ""
      ) {
        toast.error("Terms for hostel details are required.");
        return;
      }

      // Validate hostel fee is added to fee details
      const hostelFeeAdded = formData.feeDetails.some(fee => fee.name === "hostel-fee");
      if (!hostelFeeAdded) {
        toast.error("Please add hostel fee by clicking the 'Add Hostel Fee' button.");
        return;
      }
    } else {
      // If hostel not required, ensure hostelDetails is not present in submission
      const dataToSubmit = { ...formData };
      delete dataToSubmit.hostelDetails;
      setFormData(dataToSubmit);
    }

    // Check if feeDetails array is valid
    if (
      !formData.feeDetails ||
      !Array.isArray(formData.feeDetails) ||
      formData.feeDetails.length === 0
    ) {
      toast.error("At least one fee detail must be provided.");
      return;
    }

    // Add function to prepare data for submission
    const prepareFormDataForSubmission = () => {
      // Create a copy of formData to modify
      const dataToSubmit = { ...formData };

      // Ensure address.pincode is always set (even to empty string)
      // This maintains compatibility with the backend schema
      // if (!dataToSubmit.address.pincode) {
      //   dataToSubmit.address.pincode = "";
      // }

      // Ensure photo field exists but can be empty
      // if (!dataToSubmit.photo) {
      //   dataToSubmit.photo = "";
      // }

      return dataToSubmit;
    };

    // Submit the form
    try {
      const token = localStorage.getItem("token");
      console.log("Submitting data to API:", prepareFormDataForSubmission());

      // Make API request with prepared data
      const res = await fetch(Allapi.addStudent.url, {
        method: Allapi.addStudent.method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prepareFormDataForSubmission()),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API error: ${res.status} ${res.statusText} - ${errorText}`);
      }

      const fres = await res.json();

      if (fres.success) {
        toast.success("Student added successfully!");

        // Reset form data and photo preview
        setFormData({
          idNo: `${ysuffix}${String(stdcount + 1).padStart(4, "0")}`,
          admissionNo: "",
          childId: "",
          surname: "",
          name: "",
          gender: "",
          class: "",
          section: "",
          dob: "",
          admissionDate: new Date().toISOString().split("T")[0],
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
            // pincode: "",
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
          concession: {},
        });
      } else {
        toast.error(fres.message || "Failed to add student");
      }
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error(`An error occurred while adding the student: ${error.message}`);
    }
  };

  const handleTownChange = (e) => {
    const selectedTown = e.target.value;

    // Update form data
    setFormData(prevData => ({
      ...prevData,
      transportDetails: {
        ...prevData.transportDetails,
        town: selectedTown,
        bus: "", // Reset bus when town changes
        halt: "" // Reset halt when town changes
      }
    }));

    // Set current town to trigger useEffect for fetching buses
    setcurr_town(selectedTown);

    // Clear buses and halts if no town is selected
    if (!selectedTown) {
      setBuses([]);
      setHalts([]);
    }
  };

  const handleBusChange = (e) => {
    const selectedBus = e.target.value;
    setFormData(prevData => ({
      ...prevData,
      transportDetails: {
        ...prevData.transportDetails,
        bus: selectedBus
      }
    }));
  };

  const handleHaltChange = (e) => {
    const selectedHalt = e.target.value;
    setFormData(prevData => ({
      ...prevData,
      transportDetails: {
        ...prevData.transportDetails,
        halt: selectedHalt
      }
    }));
  };

  return (
    <div className="bg-white p-6 text-black rounded-lg shadow-md max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-black">ID No:</label>
            <input
              type="text"
              name="idNo"
              value={formData.idNo}
              onChange={handleChange}
              disabled
              className="input-field border-2 border-black text-black bg-white"
            />
          </div>
          <div>
            <label className="block text-sm text-black">Admission No:</label>
            <input
              type="text"
              name="admissionNo"
              value={formData.admissionNo}
              onChange={handleChange}
              maxLength={9}
              className="input-field border-2 border-black text-black bg-white"
            />
          </div>
          <div>
            <label className="block text-sm text-black">Child ID:</label>
            <input
              type="text"
              name="childId"
              value={formData.childId}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
            />
          </div>
          <div>
            <label className="block text-sm text-black">Surname:</label>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
            />
          </div>
          <div>
            <label className="block text-sm text-black">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
            />
          </div>
          <div>
            <label className="block text-sm text-black">Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-black">Class:</label>
            <select
              name="class"
              value={formData.class.name || ""}
              onChange={handleClassChange}
              className="input-field border-2 border-black text-black bg-white"
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
            <label className="block text-sm text-black">Section:</label>
            <select
              name="section"
              value={formData.section.name || ""}
              onChange={handleSectionChange}
              className="input-field border-2 border-black text-black bg-white"
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
            <label className="block text-sm text-black">Date of Birth:</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
            />
          </div>
          <div>
            <label className="block text-sm text-black">Admission Date:</label>
            <input
              type="date"
              name="admissionDate"
              value={
                formData.admissionDate || new Date().toISOString().split("T")[0]
              }
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-black">Aadhar No:</label>
            <input
              type="text"
              name="aadharNo"
              value={formData.aadharNo}
              maxLength={12}
              pattern="\d{12}"
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
            />
          </div>
          <div>
            <label className="block text-sm text-black">Student AAPR:</label>
            <input
              type="text"
              name="studentAAPR"
              value={formData.studentAAPR}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
            />
          </div>
          <div>
            <label className="block text-sm text-black">Caste:</label>
            <select
              name="caste"
              value={formData.caste}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
            >
              {casteOptions.map((caste) => (
                <option key={caste} value={caste}>
                  {caste}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-black">Sub-Caste:</label>
            <input
              type="text"
              name="subCaste"
              value={formData.subCaste}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-black">Father Name:</label>
            <input
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
            />
          </div>
          <div>
            <label className="block text-sm text-black">Father Aadhar:</label>
            <input
              type="text"
              name="fatherAadhar"
              value={formData.fatherAadhar}
              onChange={handleChange}
              maxLength={12}
              pattern="\d{12}"
              className="input-field border-2 border-black text-black bg-white"
            />
          </div>
          <div>
            <label className="block text-sm text-black">
              Father Occupation:
            </label>
            <select
              name="fatherOccupation"
              value={formData.fatherOccupation}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
            >
              {fatherOccupationOptions.map((occupation) => (
                <option key={occupation} value={occupation}>
                  {occupation}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-black">Mother Name:</label>
            <input
              type="text"
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
            />
          </div>
          <div>
            <label className="block text-sm text-black">Mother Aadhar:</label>
            <input
              type="text"
              name="motherAadhar"
              value={formData.motherAadhar}
              onChange={handleChange}
              maxLength={12}
              pattern="\d{12}"
              className="input-field border-2 border-black text-black bg-white"
            />
          </div>
          <div>
            <label className="block text-sm text-black">
              Mother Occupation:
            </label>
            <select
              name="motherOccupation"
              value={formData.motherOccupation}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
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
            <label className="block text-sm text-black">Whatsapp No:</label>
            <input
              type="text"
              name="whatsappNo"
              value={formData.whatsappNo}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
              required
              maxLength="10"
              pattern="\d{10}"
            />
          </div>
          <div>
            <label className="block text-sm text-black">
              Emergency Contact:
            </label>
            <input
              type="text"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-black">Address:</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <input
              type="text"
              name="address.doorNo"
              placeholder="Door No"
              value={formData.address.doorNo}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
            />
            <input
              type="text"
              name="address.street"
              placeholder="Street"
              value={formData.address.street}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
            />
            <input
              type="text"
              name="address.city"
              placeholder="City"
              value={formData.address.city}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
            />
            {/* <input
              type="text"
              name="address.pincode"
              placeholder="Pincode"
              value={formData.address.pincode}
              onChange={handleChange}
              className="input-field border-2 border-black text-black bg-white"
            /> */}
          </div>
        </div>

        <div>
          <label className="flex items-center text-black font-normal">
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
                <label className="block text-sm text-black">Town:</label>
                <select
                  name="transportDetails.town"
                  value={formData.transportDetails.town || ""}
                  onChange={handleTownChange}
                  className="input-field border-2 border-black text-black bg-white"
                >
                  <option value="">Select Town</option>
                  {towns?.length > 0 &&
                    towns.map((town) => (
                      <option key={town._id} value={town.townName}>
                        {town.townName}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-black">Bus:</label>
                <select
                  name="transportDetails.bus"
                  value={formData.transportDetails.bus || ""}
                  onChange={handleBusChange}
                  className="input-field border-2 border-black text-black bg-white"
                  disabled={!formData.transportDetails.town}
                >
                  <option value="">Select Bus</option>
                  {buses && buses.length > 0 ?
                    buses.map((bus) => (
                      <option key={bus._id} value={bus._id}>
                        {bus.busNo}
                      </option>
                    )) : (
                      <option disabled>No buses available</option>
                    )}
                </select>
              </div>
              <div>
                <label className="block text-sm text-black">Halt:</label>
                <select
                  name="transportDetails.halt"
                  value={formData.transportDetails.halt || ""}
                  onChange={handleHaltChange}
                  className="input-field border-2 border-black text-black bg-white"
                  disabled={!formData.transportDetails.town}
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
              </div>
              <div>
                <label className="block text-sm text-black">
                  Number of Terms
                </label>
                <input
                  type="text"
                  name="transportDetails.terms"
                  value={formData.transportDetails.terms || ""}
                  onChange={handleChange}
                  className="input-field border-2 border-black text-black bg-white"
                />
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
          <label className="flex items-center text-black font-normal">
            <input
              type="checkbox"
              name="hostel"
              checked={formData.hostel}
              onChange={handleHostelChange}
              className="mr-2"
            />
            Require Hostel?
          </label>
          {formData.hostel && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-black">
                  Hostel Fee
                </label>
                <input
                  type="number"
                  name="hostelDetails.hostelFee"
                  value={formData.hostelDetails.hostelFee || ""}
                  onChange={handleChange}
                  className="input-field border-2 border-black text-black bg-white"
                />
              </div>
              <div>
                <label className="block text-sm text-black">
                  Number of Terms
                </label>
                <input
                  type="text"
                  name="hostelDetails.terms"
                  value={formData.hostelDetails.terms || ""}
                  onChange={handleChange}
                  className="input-field border-2 border-black text-black bg-white"
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
          <table className="min-w-full table-auto relative bg-white" ref={tableRef}>
            <thead className="bg-white">
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
                        const terms = findObjectByKey(
                          feeTypes,
                          "type",
                          fee.name
                        )
                          ? findObjectByKey(feeTypes, "type", fee.name)
                          : fee.terms;

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
                          terms,
                        };
                        setFormData({ ...formData, feeDetails: updatedFees });
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
              <tr className="border-t bg-white">
                <td
                  colSpan="3"
                  className="px-6 py-4 text-sm text-black text-right"
                >
                  Total Fee:
                </td>
                <td className="px-6 py-4 text-md text-black">
                  {calculateTotalFee().toFixed(2)}
                  {console.log("fee", formData)}
                </td>
              </tr>
            </tfoot>
            <button
              type="button"
              onClick={handlePrint}
              className=" absolute bottom-2 left-2  bg-blue-500 text-white rounded-md hover:bg-blue-600 print:hidden"
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
            Add Student
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudents;
