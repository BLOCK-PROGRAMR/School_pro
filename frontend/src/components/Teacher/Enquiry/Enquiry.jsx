// import React, { useState, useEffect } from 'react';
// import { jwtDecode } from 'jwt-decode';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { UserRound, School, BookOpen, Users, Phone, MapPin, Home } from 'lucide-react';

// const Enquiry = () => {
//     const token = localStorage.getItem("token");
//     const decoded = token ? jwtDecode(token) : null;

//     const [loading, setLoading] = useState(false);
//     const [teacherAssignment, setTeacherAssignment] = useState(null);
//     const [students, setStudents] = useState([]);
//     const [teachers, setTeachers] = useState([]);
//     const [studentDetails, setStudentDetails] = useState(null);

//     const [formData, setFormData] = useState({
//         className: '',
//         sectionName: '',
//         student: '',
//         reference: ''
//     });

//     // Fetch teacher assignments when component mounts
//     useEffect(() => {
//         if (!token || !decoded?.teacherData) return;

//         const fetchTeacherAssignments = async () => {
//             try {
//                 setLoading(true);
//                 const response = await fetch(`/api/teacher/assignments/${decoded.teacherData.academic_id}`, {
//                     method: 'GET',
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json'
//                     }
//                 });

//                 const result = await response.json();
//                 if (result.success) {
//                     const currentTeacherAssignment = result.data.find(
//                         (assignment) => assignment.teacherId === decoded.teacherData._id
//                     );
//                     setTeacherAssignment(currentTeacherAssignment);
//                 } else {
//                     toast.error("Failed to fetch teacher assignments");
//                 }
//             } catch (error) {
//                 toast.error("Error loading teacher assignments");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchTeacherAssignments();
//     }, [token, decoded]);

//     // Fetch teachers for reference dropdown
//     useEffect(() => {
//         if (!token || !decoded?.teacherData?.academic_id) return;

//         const fetchTeachers = async () => {
//             try {
//                 setLoading(true);
//                 const response = await fetch(`/api/teachers/${decoded.teacherData.academic_id}`, {
//                     method: 'GET',
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json'
//                     }
//                 });

//                 const result = await response.json();
//                 if (result.success) {
//                     setTeachers(result.data.sort((a, b) => a.name.localeCompare(b.name)));
//                 } else {
//                     toast.error("Failed to fetch teachers");
//                 }
//             } catch (error) {
//                 toast.error("Error loading teachers");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchTeachers();
//     }, [token, decoded]);

//     // Get available class sections for the teacher
//     const getAvailableClassSections = () => {
//         if (!teacherAssignment) return [];

//         const classSections = [];
//         teacherAssignment.classAssignments.forEach(classAssignment => {
//             classAssignment.sections.forEach(section => {
//                 classSections.push({
//                     className: classAssignment.className,
//                     sectionName: section.sectionName
//                 });
//             });
//         });

//         // Remove duplicates
//         return classSections.filter((value, index, self) =>
//             index === self.findIndex((t) => (
//                 t.className === value.className && t.sectionName === value.sectionName
//             ))
//         );
//     };

//     // Fetch students when section changes
//     useEffect(() => {
//         if (!formData.className || !formData.sectionName || !decoded?.teacherData) return;

//         const fetchStudents = async () => {
//             try {
//                 setLoading(true);

//                 // First get the class and section IDs
//                 const classResponse = await fetch(`/api/classes/${decoded.teacherData.academic_id}`, {
//                     method: 'GET',
//                     headers: {
//                         'Authorization': `Bearer ${token}`
//                     }
//                 });

//                 const classResult = await classResponse.json();
//                 if (!classResult.success) {
//                     toast.error("Failed to fetch classes");
//                     return;
//                 }

//                 const selectedClass = classResult.data.find(c => c.name === formData.className);
//                 if (!selectedClass) {
//                     toast.error("Class not found");
//                     return;
//                 }

//                 const sectionResponse = await fetch(
//                     `/api/sections/byClass/${formData.className}/${decoded.teacherData.academic_id}`,
//                     {
//                         method: 'GET',
//                         headers: {
//                             'Authorization': `Bearer ${token}`
//                         }
//                     }
//                 );

//                 const sectionResult = await sectionResponse.json();
//                 if (!sectionResult.success) {
//                     toast.error("Failed to fetch sections");
//                     return;
//                 }

//                 const selectedSection = sectionResult.data.find(s => s.name === formData.sectionName);
//                 if (!selectedSection) {
//                     toast.error("Section not found");
//                     return;
//                 }

//                 // Now fetch students by section
//                 const response = await fetch(`/api/students/bySection/${selectedSection._id}`, {
//                     method: 'POST',
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({ classId: selectedClass._id })
//                 });

//                 const result = await response.json();
//                 if (result.success) {
//                     setStudents(result.data.sort((a, b) => a.name.localeCompare(b.name)));
//                 } else {
//                     toast.error("Failed to fetch students");
//                 }
//             } catch (error) {
//                 toast.error("Error loading students");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchStudents();
//     }, [formData.className, formData.sectionName, token, decoded]);

//     // Fetch student details when student is selected
//     useEffect(() => {
//         if (!formData.student) {
//             setStudentDetails(null);
//             return;
//         }

//         const fetchStudentDetails = async () => {
//             try {
//                 setLoading(true);
//                 const response = await fetch(`/api/student/${formData.student}`, {
//                     method: 'GET',
//                     headers: {
//                         'Authorization': `Bearer ${token}`
//                     }
//                 });

//                 const result = await response.json();
//                 if (result.success) {
//                     const { name, fatherName, whatsappNo, address } = result.data;
//                     setStudentDetails({
//                         name,
//                         fatherName,
//                         phoneNo: whatsappNo,
//                         town: address?.city || 'N/A',
//                         street: address?.street || 'N/A',
//                         street2: address?.doorNo || 'N/A'
//                     });
//                 } else {
//                     toast.error("Failed to fetch student details");
//                     setStudentDetails(null);
//                 }
//             } catch (error) {
//                 toast.error("Error loading student details");
//                 setStudentDetails(null);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchStudentDetails();
//     }, [formData.student, token]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => {
//             const newData = { ...prev, [name]: value };

//             if (name === 'className') {
//                 newData.sectionName = '';
//                 newData.student = '';
//             } else if (name === 'sectionName') {
//                 newData.student = '';
//             }

//             return newData;
//         });
//     };

//     const handleClassSectionChange = (e) => {
//         const [className, sectionName] = e.target.value.split('-');
//         setFormData(prev => ({
//             ...prev,
//             className,
//             sectionName,
//             student: ''
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!studentDetails) {
//             toast.error('Please select a student');
//             return;
//         }

//         try {
//             setLoading(true);
//             const response = await fetch('/api/enquiry/add', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: JSON.stringify({
//                     ...formData,
//                     academicYear: decoded.teacherData.academic_id,
//                     studentName: studentDetails.name,
//                     fatherName: studentDetails.fatherName,
//                     phoneNo: studentDetails.phoneNo,
//                     town: studentDetails.town,
//                     street: studentDetails.street,
//                     street2: studentDetails.street2,
//                     branchId: decoded.teacherData.branchId
//                 })
//             });

//             const result = await response.json();
//             if (result.success) {
//                 toast.success('Enquiry submitted successfully!');
//                 setFormData(prev => ({
//                     className: prev.className,
//                     sectionName: prev.sectionName,
//                     student: '',
//                     reference: ''
//                 }));
//                 setStudentDetails(null);
//             } else {
//                 toast.error(result.message || 'Failed to submit enquiry');
//             }
//         } catch (error) {
//             toast.error('Error submitting enquiry');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
//                 <div className="flex items-center mb-8 space-x-3">
//                     <School className="h-8 w-8 text-indigo-600" />
//                     <h1 className="text-3xl font-bold text-gray-900">Teacher Enquiry Form</h1>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <div className="grid grid-cols-1 gap-6">
//                         <div>
//                             <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
//                                 <BookOpen className="h-5 w-5 text-indigo-500" />
//                                 <span>Class & Section</span>
//                             </label>
//                             <select
//                                 value={`${formData.className}-${formData.sectionName}`}
//                                 onChange={handleClassSectionChange}
//                                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
//                                 required
//                             >
//                                 <option value="">Select Class & Section</option>
//                                 {getAvailableClassSections().map((cs, index) => (
//                                     <option
//                                         key={index}
//                                         value={`${cs.className}-${cs.sectionName}`}
//                                     >
//                                         {cs.className} - {cs.sectionName}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
//                                 <UserRound className="h-5 w-5 text-indigo-500" />
//                                 <span>Select Student</span>
//                             </label>
//                             <select
//                                 name="student"
//                                 value={formData.student}
//                                 onChange={handleChange}
//                                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
//                                 disabled={!formData.className || !formData.sectionName}
//                                 required
//                             >
//                                 <option value="">Select Student</option>
//                                 {students.map((student) => (
//                                     <option key={student._id} value={student._id}>
//                                         {student.name}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>

//                     {studentDetails && (
//                         <div className="mt-6 space-y-6 border-t border-gray-200 pt-6">
//                             <div className="flex items-center space-x-2">
//                                 <Users className="h-5 w-5 text-indigo-500" />
//                                 <h2 className="text-lg font-medium text-gray-900">Student Details</h2>
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Student Name</label>
//                                     <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
//                                         {studentDetails.name}
//                                     </p>
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Father's Name</label>
//                                     <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
//                                         {studentDetails.fatherName}
//                                     </p>
//                                 </div>

//                                 <div>
//                                     <label className="flex items-center space-x-1 text-sm font-medium text-gray-700">
//                                         <Phone className="h-4 w-4 text-indigo-500" />
//                                         <span>Phone Number</span>
//                                     </label>
//                                     <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
//                                         {studentDetails.phoneNo}
//                                     </p>
//                                 </div>

//                                 <div>
//                                     <label className="flex items-center space-x-1 text-sm font-medium text-gray-700">
//                                         <MapPin className="h-4 w-4 text-indigo-500" />
//                                         <span>Town</span>
//                                     </label>
//                                     <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
//                                         {studentDetails.town}
//                                     </p>
//                                 </div>

//                                 <div>
//                                     <label className="flex items-center space-x-1 text-sm font-medium text-gray-700">
//                                         <Home className="h-4 w-4 text-indigo-500" />
//                                         <span>Street</span>
//                                     </label>
//                                     <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
//                                         {studentDetails.street}
//                                     </p>
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Street 2</label>
//                                     <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
//                                         {studentDetails.street2}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                             Reference Teacher
//                         </label>
//                         <select
//                             name="reference"
//                             value={formData.reference}
//                             onChange={handleChange}
//                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
//                         >
//                             <option value="">Select Reference Teacher</option>
//                             {teachers.map((teacher) => (
//                                 <option key={teacher._id} value={teacher.name}>
//                                     {teacher.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div className="flex justify-end">
//                         <button
//                             type="submit"
//                             disabled={loading || !studentDetails}
//                             className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 flex items-center space-x-2"
//                         >
//                             {loading ? (
//                                 <span>Submitting...</span>
//                             ) : (
//                                 <>
//                                     <span>Submit Enquiry</span>
//                                 </>
//                             )}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//             <ToastContainer />
//         </div>
//     );
// };

// export default Enquiry;


import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { mycon } from '../../../store/Mycontext';
import Allapi from '../../../common';

const Enquiry = () => {
    const { branchdet } = useContext(mycon);
    const [loading, setLoading] = useState(false);
    const [academicYears, setAcademicYears] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]); // New state for teachers
    const [studentDetails, setStudentDetails] = useState(null);

    const [formData, setFormData] = useState({
        academicYear: '',
        class: '',
        section: '',
        student: '',
        reference: ''
    });

    // Fetch teachers when component mounts
    useEffect(() => {
        const fetchTeachers = async () => {
            if (!branchdet?.academicYears?.[0]) return;

            try {
                const response = await fetch(
                    Allapi.getTeachers.url(branchdet.academicYears[0]),
                    {
                        method: Allapi.getTeachers.method,
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                const result = await response.json();
                if (result.success) {
                    setTeachers(result.data.sort((a, b) => a.name.localeCompare(b.name)));
                }
            } catch (error) {
                toast.error('Error fetching teachers');
            }
        };

        fetchTeachers();
    }, [branchdet]);

    // Fetch academic years on component mount
    useEffect(() => {
        const fetchAcademicYears = async () => {
            if (!branchdet?._id) return;

            try {
                setLoading(true);
                const response = await fetch(Allapi.getAcademicYears.url(branchdet._id), {
                    method: Allapi.getAcademicYears.method,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                const result = await response.json();
                if (result.success) {
                    const sortedYears = result.data.sort((a, b) => {
                        const [startA] = a.year.split("-").map(Number);
                        const [startB] = b.year.split("-").map(Number);
                        return startB - startA;
                    });
                    setAcademicYears(sortedYears);

                    if (sortedYears.length > 0) {
                        setFormData(prev => ({
                            ...prev,
                            academicYear: sortedYears[0]._id
                        }));
                    }
                }
            } catch (error) {
                toast.error("Failed to fetch academic years");
            } finally {
                setLoading(false);
            }
        };

        fetchAcademicYears();
    }, [branchdet]);

    // Fetch classes when academic year changes
    useEffect(() => {
        const fetchClasses = async () => {
            if (!formData.academicYear) return;

            try {
                setLoading(true);
                const response = await fetch(Allapi.getClasses.url(formData.academicYear), {
                    method: Allapi.getClasses.method,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                const result = await response.json();
                if (result.success) {
                    setClasses(result.data);
                }
            } catch (error) {
                toast.error("Failed to fetch classes");
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, [formData.academicYear]);

    // Fetch sections when class changes
    useEffect(() => {
        const fetchSections = async () => {
            if (!formData.class) return;

            try {
                setLoading(true);
                const selectedClass = classes.find(c => c._id === formData.class);
                const response = await fetch(
                    Allapi.getSectionsByClass.url(selectedClass.name, formData.academicYear),
                    {
                        method: Allapi.getSectionsByClass.method,
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                const result = await response.json();
                if (result.success) {
                    setSections(result.data);
                }
            } catch (error) {
                toast.error("Failed to fetch sections");
            } finally {
                setLoading(false);
            }
        };

        fetchSections();
    }, [formData.class, formData.academicYear, classes]);

    // Fetch students when section changes
    useEffect(() => {
        const fetchStudents = async () => {
            if (!formData.section || !formData.class) return;

            try {
                setLoading(true);
                const response = await fetch(
                    Allapi.getStudentsBySection.url(formData.section),
                    {
                        method: Allapi.getStudentsBySection.method,
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ classId: formData.class })
                    }
                );

                const result = await response.json();
                if (result.success) {
                    setStudents(result.data.sort((a, b) => a.name.localeCompare(b.name)));
                }
            } catch (error) {
                toast.error("Failed to fetch students");
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [formData.section, formData.class]);

    // Fetch student details when student is selected
    useEffect(() => {
        const fetchStudentDetails = async () => {
            if (!formData.student) {
                setStudentDetails(null);
                return;
            }

            try {
                setLoading(true);
                const response = await fetch(
                    Allapi.getstudentbyId.url(formData.student),
                    {
                        method: Allapi.getstudentbyId.method,
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                const result = await response.json();
                if (result.success) {
                    const { name, fatherName, whatsappNo, address } = result.data;
                    setStudentDetails({
                        name,
                        fatherName,
                        phoneNo: whatsappNo,
                        town: address?.city || 'N/A',
                        street: address?.street || 'N/A',
                        street2: address?.doorNo || 'N/A'
                    });
                }
            } catch (error) {
                toast.error("Failed to fetch student details");
                setStudentDetails(null);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentDetails();
    }, [formData.student]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };

            if (name === 'academicYear') {
                newData.class = '';
                newData.section = '';
                newData.student = '';
            } else if (name === 'class') {
                newData.section = '';
                newData.student = '';
            } else if (name === 'section') {
                newData.student = '';
            }

            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!studentDetails) {
            toast.error('Please select a student');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(Allapi.addEnquiry.url, {
                method: Allapi.addEnquiry.method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    ...formData,
                    studentName: studentDetails.name,
                    fatherName: studentDetails.fatherName,
                    phoneNo: studentDetails.phoneNo,
                    town: studentDetails.town,
                    street: studentDetails.street,
                    street2: studentDetails.street2,
                    branchId: branchdet._id
                }),
            });

            const result = await response.json();
            if (result.success) {
                toast.success('Enquiry submitted successfully!');
                setFormData(prev => ({
                    academicYear: prev.academicYear,
                    class: '',
                    section: '',
                    student: '',
                    reference: ''
                }));
                setStudentDetails(null);
            } else {
                toast.error(result.message || 'Failed to submit enquiry');
            }
        } catch (error) {
            toast.error('Error submitting enquiry');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Students Enquiry Form</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Academic Year
                            </label>
                            <select
                                name="academicYear"
                                value={formData.academicYear}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
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
                            <label className="block text-sm font-medium text-gray-700">
                                Class
                            </label>
                            <select
                                name="class"
                                value={formData.class}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                                disabled={!formData.academicYear}
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
                            <label className="block text-sm font-medium text-gray-700">
                                Section
                            </label>
                            <select
                                name="section"
                                value={formData.section}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                disabled={!formData.class}
                            >
                                <option value="">Select Section</option>
                                {sections.map((section) => (
                                    <option key={section._id} value={section._id}>
                                        {section.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Select Student
                            </label>
                            <select
                                name="student"
                                value={formData.student}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                disabled={!formData.section}
                            >
                                <option value="">Select Student</option>
                                {students.map((student) => (
                                    <option key={student._id} value={student._id}>
                                        {student.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {studentDetails && (
                        <div className="mt-6 space-y-6 border-t border-gray-200 pt-6">
                            <h2 className="text-lg font-medium text-gray-900">Student Details</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Student Name</label>
                                    <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
                                        {studentDetails.name}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Father's Name</label>
                                    <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
                                        {studentDetails.fatherName}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                    <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
                                        {studentDetails.phoneNo}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Town</label>
                                    <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
                                        {studentDetails.town}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Street</label>
                                    <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
                                        {studentDetails.street}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Street 2</label>
                                    <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
                                        {studentDetails.street2}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Reference Teacher
                        </label>
                        <select
                            name="reference"
                            value={formData.reference}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="">Select Reference Teacher</option>
                            {teachers.map((teacher) => (
                                <option key={teacher._id} value={teacher.name}>
                                    {teacher.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading || !studentDetails}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : 'Submit Enquiry'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Enquiry;