// import React, { useState, useEffect, useContext } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Allapi from "../../../common";
// import { mycon } from "../../../store/Mycontext";

// const Upgrade = () => {
//   const { branchdet } = useContext(mycon);
//   const [acid, setAcid] = useState("");
//   const [classes, setClasses] = useState([]);
//   const [sections, setSections] = useState([]);

//   // State for From and To fields
//   const [fromClass, setFromClass] = useState("");
//   const [fromSection, setFromSection] = useState("");
//   const [toClass, setToClass] = useState("");
//   const [toSection, setToSection] = useState("");

//   useEffect(() => {
//     if (branchdet?._id) {
//       fetchAcademicYear();
//     }
//   }, [branchdet]);

//   useEffect(() => {
//     if (acid) {
//       fetchClasses();
//     }
//   }, [acid]);

//   // Fetch Academic Year
//   const fetchAcademicYear = async () => {
//     try {
//       const response = await fetch(Allapi.getAcademicYears.url(branchdet._id), {
//         method: Allapi.getAcademicYears.method,
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       const res = await response.json();
//       if (res.success && res.data.length > 0) {
//         const latestYear = res.data.sort((a, b) => {
//           const [startA] = a.year.split("-").map(Number);
//           const [startB] = b.year.split("-").map(Number);
//           return startB - startA;
//         })[0];

//         setAcid(latestYear._id);
//       }
//     } catch (error) {
//       toast.error("Failed to fetch academic year");
//     }
//   };

//   // Fetch Classes
//   const fetchClasses = async () => {
//     try {
//       const response = await fetch(Allapi.getClasses.url(acid), {
//         method: Allapi.getClasses.method,
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       const result = await response.json();
//       if (result.success) {
//         setClasses(result.data);
//       }
//     } catch (error) {
//       toast.error("Failed to fetch classes");
//     }
//   };

//   // Fetch Sections for a Selected Class
//   const fetchSections = async (classId, type) => {
//     if (!classId) return;

//     try {
//       const selectedClass = classes.find((cls) => cls._id === classId);
//       if (!selectedClass) return;

//       const response = await fetch(
//         Allapi.getSectionsByClass.url(selectedClass.name, acid),
//         {
//           method: Allapi.getSectionsByClass.method,
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       const result = await response.json();
//       if (result.success) {
//         setSections(result.data);

//         // ✅ Reset the correct section fields
//         console.log("type is", type);
//         if (type === "from") {
//           setFromSection(""); // Reset From Section
//           setToSection(""); // Reset To Section as well
//         } else if (type === "to") {
//           setToSection(""); // Reset only To Section
//         }
//       }
//     } catch (error) {
//       toast.error("Failed to fetch sections");
//     }
//   };

//   // Handle Promote Students
//   const handlePromoteStudents = async () => {
//     console.log("fromclass", fromClass, "from section", fromSection);
//     console.log("current academic id", acid);
//     console.log("branchdet", branchdet);
//     if (!fromClass || !fromSection || !toClass || !toSection) {
//       toast.error("Please select all fields before promoting students.");
//       return;
//     }

//     try {
//       const response = await fetch(Allapi.promoteStudents.url(), {
//         method: Allapi.promoteStudents.method,
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           fromClass,
//           fromSection,
//           toClass,
//           toSection,
//           newacid: acid,
//         }),
//       });

//       const result = await response.json();
//       if (result.success) {
//         toast.success("Students promoted successfully!");
//       } else {
//         toast.error(result.message || "Failed to promote students.");
//       }
//     } catch (error) {
//       toast.error("Error promoting students.");
//     }
//   };

//   return (
//     <div className="min-h-screen p-6 text-black bg-gray-100">
//       <ToastContainer />
//       <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-md">
//         <h2 className="mb-6 text-2xl font-bold text-center">
//           Upgrade Students
//         </h2>

//         <div className="grid grid-cols-2 gap-6">
//           {/* From Column */}
//           <div>
//             <h3 className="mb-3 text-lg font-semibold text-center">From</h3>

//             {/* From Class Selection */}
//             <div>
//               <label className="block mb-2 text-sm font-medium">Class</label>
//               <select
//                 value={fromClass}
//                 onChange={(e) => {
//                   setFromClass(e.target.value);
//                   setFromSection(""); // ✅ Reset From Section
//                   setToSection(""); // ✅ Reset To Section
//                   fetchSections(e.target.value, "from");
//                 }}
//                 className="w-full p-2 border rounded-md"
//               >
//                 <option value="">Select Class</option>
//                 {classes.map((cls) => (
//                   <option key={cls._id} value={cls._id}>
//                     {cls.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* From Section Selection */}
//             {fromClass && (
//               <div className="mt-4">
//                 <label className="block mb-2 text-sm font-medium">
//                   Section
//                 </label>
//                 <select
//                   value={fromSection}
//                   onChange={(e) => setFromSection(e.target.value)}
//                   className="w-full p-2 border rounded-md"
//                 >
//                   <option value="">Select Section</option>
//                   {sections.map((section) => (
//                     <option key={section._id} value={section._id}>
//                       {section.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}
//           </div>

//           {/* To Column */}
//           <div>
//             <h3 className="mb-3 text-lg font-semibold text-center">To</h3>

//             {/* To Class Selection */}
//             <div>
//               <label className="block mb-2 text-sm font-medium">Class</label>
//               <select
//                 value={toClass}
//                 onChange={(e) => {
//                   setToClass(e.target.value);
//                   setToSection(""); // ✅ Reset To Section
//                   fetchSections(e.target.value, "to");
//                 }}
//                 className="w-full p-2 border rounded-md"
//               >
//                 <option value="">Select Class</option>
//                 {classes.map((cls) => (
//                   <option key={cls._id} value={cls._id}>
//                     {cls.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* To Section Selection */}
//             {toClass && (
//               <div className="mt-4">
//                 <label className="block mb-2 text-sm font-medium">
//                   Section
//                 </label>
//                 <select
//                   value={toSection}
//                   onChange={(e) => setToSection(e.target.value)}
//                   className="w-full p-2 border rounded-md"
//                 >
//                   <option value="">Select Section</option>
//                   {sections.map((section) => (
//                     <option key={section._id} value={section._id}>
//                       {section.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Promote Students Button */}
//         <button
//           onClick={handlePromoteStudents}
//           className="w-full px-4 py-2 mt-6 text-white bg-blue-600 rounded-md hover:bg-blue-700"
//         >
//           Promote Students
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Upgrade;

import React, { useState, useEffect, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Allapi from "../../../common";
import { mycon } from "../../../store/Mycontext";

const Upgrade = () => {
  const { branchdet } = useContext(mycon);

  const [academicYears, setAcademicYears] = useState([]);
  const [fromAcademicYear, setFromAcademicYear] = useState("");
  const [toAcademicYear, setToAcademicYear] = useState("");

  // Separate states for from/to classes and sections
  const [fromClasses, setFromClasses] = useState([]);
  const [toClasses, setToClasses] = useState([]);
  const [fromClass, setFromClass] = useState("");
  const [toClass, setToClass] = useState("");

  const [fromSections, setFromSections] = useState([]);
  const [toSections, setToSections] = useState([]);
  const [fromSection, setFromSection] = useState("");
  const [toSection, setToSection] = useState("");

  useEffect(() => {
    if (branchdet?._id) {
      fetchAcademicYears();
    }
  }, [branchdet]);

  // Fetch classes when academic years change
  useEffect(() => {
    if (fromAcademicYear) {
      fetchClasses(fromAcademicYear, setFromClasses);
      setFromClass("");
      setFromSection("");
    }
  }, [fromAcademicYear]);

  useEffect(() => {
    if (toAcademicYear) {
      fetchClasses(toAcademicYear, setToClasses);
      setToClass("");
      setToSection("");
    }
  }, [toAcademicYear]);

  // Fetch Academic Years
  const fetchAcademicYears = async () => {
    try {
      const response = await fetch(Allapi.getAcademicYears.url(branchdet._id), {
        method: Allapi.getAcademicYears.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const res = await response.json();
      if (res.success) {
        setAcademicYears(res.data);

        // Select latest academic year as "To Academic Year" by default
        const sortedYears = res.data.sort((a, b) => {
          const [startA] = a.year.split("-").map(Number);
          const [startB] = b.year.split("-").map(Number);
          return startB - startA;
        });

        if (sortedYears.length > 0) {
          setToAcademicYear(sortedYears[0]._id);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch academic years");
    }
  };

  // Generic class fetcher
  const fetchClasses = async (academicYearId, setClassState) => {
    try {
      const response = await fetch(Allapi.getClasses.url(academicYearId), {
        method: Allapi.getClasses.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setClassState(result.data);
      }
    } catch (error) {
      toast.error("Failed to fetch classes");
    }
  };

  // Fetch Sections
  const fetchSections = async (classId, type) => {
    if (!classId) return;

    try {
      const response = await fetch(Allapi.getSections.url(classId), {
        method: Allapi.getSections.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        type === "from" 
          ? setFromSections(result.data) 
          : setToSections(result.data);
        
       
      }
    } catch (error) {
      toast.error("Failed to fetch sections");
    }
  };

  // Handle Promote Students (keep the same as before)
  const handlePromoteStudents = async () => {
    if (
      !fromAcademicYear ||
      !toAcademicYear ||
      !fromClass ||
      !fromSection ||
      !toClass ||
      !toSection
    ) {
      toast.error("Please select all fields before promoting students.");
      return;
    }

    try {
      const response = await fetch(Allapi.promoteStudents.url(), {
        method: Allapi.promoteStudents.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromAcademicYear,
          toAcademicYear,
          fromClass,
          fromSection,
          toClass,
          toSection,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Students promoted successfully!");
      } else {
        toast.error(result.message || "Failed to promote students.");
      }
    } catch (error) {
      toast.error("Error promoting students.");
    }
  };

  return (
    <div className="min-h-screen p-6 text-black bg-gray-100">
      <ToastContainer />
      <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center">
          Upgrade Students
        </h2>

        {/* Academic Year Selection */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium">
              From Academic Year
            </label>
            <select
              value={fromAcademicYear}
              onChange={(e) => setFromAcademicYear(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Academic Year</option>
              {academicYears.map((year) => (
                <option key={year._id} value={year._id}>
                  {year.year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              To Academic Year
            </label>
            <select
              value={toAcademicYear}
              onChange={(e) => setToAcademicYear(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Academic Year</option>
              {academicYears.map((year) => (
                <option key={year._id} value={year._id}>
                  {year.year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Class & Section Selection */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block mb-2 text-sm font-medium">From Class</label>
            <select
              value={fromClass}
              onChange={(e) => {
                setFromClass(e.target.value);
                fetchSections(e.target.value, "from");
              }}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Class</option>
              {fromClasses.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>

            <select
              value={fromSection}
              onChange={(e) => setFromSection(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md"
            >
              <option value="">Select Section</option>
              {fromSections.map((sec) => (
                <option key={sec._id} value={sec._id}>
                  {sec.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">To Class</label>
            <select
              value={toClass}
              onChange={(e) => {
                setToClass(e.target.value);
                fetchSections(e.target.value, "to");
              }}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Class</option>
              {toClasses.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>

            <select
              value={toSection}
              onChange={(e) => setToSection(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md"
            >
              <option value="">Select Section</option>
              {toSections.map((sec) => (
                <option key={sec._id} value={sec._id}>
                  {sec.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handlePromoteStudents}
          className="w-full px-4 py-2 mt-6 text-white bg-blue-600 rounded-md"
        >
          Promote Students
        </button>
      </div>
    </div>
  );
};

export default Upgrade;