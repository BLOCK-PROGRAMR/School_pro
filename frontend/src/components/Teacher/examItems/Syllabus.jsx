// import React, { useState, useEffect } from 'react';
// import { jwtDecode } from "jwt-decode";
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Allapi from '../../../common';

// const Syllabus = () => {
//     const token = localStorage.getItem("token");
//     const decoded = jwtDecode(token);

//     // States for teacher data
//     const [teacherAssignments, setTeacherAssignments] = useState([]);
//     const [assignedClasses, setAssignedClasses] = useState([]);
//     const [assignedSections, setAssignedSections] = useState([]);
//     const [examList, setExamList] = useState([]);
//     const [syllabusData, setSyllabusData] = useState(null);
//     const [loading, setLoading] = useState(false);

//     // Form states
//     const [selectedClass, setSelectedClass] = useState('');
//     const [selectedSection, setSelectedSection] = useState('');
//     const [selectedExam, setSelectedExam] = useState('');

//     // Fetch teacher assignments
//     useEffect(() => {
//         const fetchTeacherAssignments = async () => {
//             try {
//                 const response = await fetch(Allapi.getTeacherAssignments.url(decoded.teacherData.academic_id), {
//                     method: Allapi.getTeacherAssignments.method,
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json'
//                     }
//                 });

//                 const result = await response.json();
//                 if (result.success) {
//                     const teacherData = result.data.find(t => t.teacherId === decoded.teacherData._id);
//                     setTeacherAssignments(teacherData?.classAssignments || []);

//                     // Extract unique classes
//                     const classes = [...new Set(teacherData?.classAssignments.map(ca => ca.className))];
//                     setAssignedClasses(classes);
//                 }
//             } catch (error) {
//                 toast.error("Failed to fetch teacher assignments");
//             }
//         };

//         if (token) {
//             fetchTeacherAssignments();
//         }
//     }, [token]);

//     // Update sections when class is selected
//     useEffect(() => {
//         if (selectedClass) {
//             const classData = teacherAssignments.find(ca => ca.className === selectedClass);
//             const sections = [...new Set(classData?.sections.map(s => s.sectionName))];
//             setAssignedSections(sections);
//             setSelectedSection('');
//             setSelectedExam('');
//             setSyllabusData(null);
//         }
//     }, [selectedClass]);

//     // Fetch exams when section is selected
//     useEffect(() => {
//         const fetchExams = async () => {
//             if (!selectedClass || !selectedSection) return;

//             try {
//                 setLoading(true);
//                 const response = await fetch(Allapi.getEveryExam.url(decoded.teacherData.branchId), {
//                     method: Allapi.getEveryExam.method,
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });

//                 const result = await response.json();
//                 if (result.success) {
//                     // Filter exams for selected class and section
//                     const relevantExams = result.data.filter(exam =>
//                         exam.classId.name === selectedClass &&
//                         exam.sectionId.name === selectedSection
//                     );
//                     setExamList(relevantExams);
//                 }
//             } catch (error) {
//                 toast.error("Failed to fetch exams");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchExams();
//     }, [selectedClass, selectedSection]);

//     // Fetch syllabus when exam is selected
//     useEffect(() => {
//         const fetchSyllabus = async () => {
//             if (!selectedExam) return;

//             try {
//                 setLoading(true);
//                 const response = await fetch(
//                     Allapi.getAllSyllabus.url(decoded.teacherData.branchId, decoded.teacherData.academic_id),
//                     {
//                         method: Allapi.getAllSyllabus.method,
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                         },
//                     }
//                 );

//                 const result = await response.json();
//                 if (result.success) {
//                     const exam = examList.find(e => e._id === selectedExam);
//                     const relevantSyllabus = result.data.find(
//                         s =>
//                             s.classId === exam.classId._id &&
//                             s.sectionId === exam.sectionId._id &&
//                             s.examName === exam.examName
//                     );
//                     setSyllabusData(relevantSyllabus);
//                 }
//             } catch (error) {
//                 toast.error("Failed to fetch syllabus");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (selectedExam) {
//             fetchSyllabus();
//         }
//     }, [selectedExam]);

//     const handleExamChange = (examId) => {
//         setSelectedExam(examId);
//         setSyllabusData(null);
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 py-8">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="bg-white rounded-lg shadow-sm p-6">
//                     <h1 className="text-2xl font-bold text-gray-900 mb-6">Exam Syllabus</h1>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                         {/* Class Selection */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Class
//                             </label>
//                             <select
//                                 value={selectedClass}
//                                 onChange={(e) => setSelectedClass(e.target.value)}
//                                 className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                             >
//                                 <option value="">Select Class</option>
//                                 {assignedClasses.map((className) => (
//                                     <option key={className} value={className}>
//                                         {className}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         {/* Section Selection */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Section
//                             </label>
//                             <select
//                                 value={selectedSection}
//                                 onChange={(e) => setSelectedSection(e.target.value)}
//                                 className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                                 disabled={!selectedClass}
//                             >
//                                 <option value="">Select Section</option>
//                                 {assignedSections.map((section) => (
//                                     <option key={section} value={section}>
//                                         {section}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         {/* Exam Selection */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Exam
//                             </label>
//                             <select
//                                 value={selectedExam}
//                                 onChange={(e) => handleExamChange(e.target.value)}
//                                 className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                                 disabled={!selectedSection}
//                             >
//                                 <option value="">Select Exam</option>
//                                 {examList.map((exam) => (
//                                     <option key={exam._id} value={exam._id}>
//                                         {exam.examName}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>

//                     {loading ? (
//                         <div className="flex justify-center items-center py-8">
//                             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//                         </div>
//                     ) : selectedExam && syllabusData ? (
//                         <div className="mt-6">
//                             <div className="bg-white rounded-lg shadow overflow-hidden">
//                                 <div className="px-6 py-4 bg-gray-50 border-b">
//                                     <h3 className="text-xl font-semibold text-gray-900">
//                                         {examList.find(e => e._id === selectedExam)?.examName} Syllabus
//                                     </h3>
//                                     <p className="text-sm text-gray-600">
//                                         Class: {selectedClass} | Section: {selectedSection}
//                                     </p>
//                                 </div>

//                                 <div className="overflow-x-auto">
//                                     <table className="min-w-full divide-y divide-gray-200">
//                                         <thead className="bg-gray-50">
//                                             <tr>
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                     Subject
//                                                 </th>
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                     Syllabus Content
//                                                 </th>
//                                             </tr>
//                                         </thead>
//                                         <tbody className="bg-white divide-y divide-gray-200">
//                                             {examList.find(e => e._id === selectedExam)?.subjects.map((subject) => (
//                                                 <tr key={subject._id}>
//                                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                                         {subject.name}
//                                                     </td>
//                                                     <td className="px-6 py-4 text-sm text-gray-500">
//                                                         {syllabusData.syllabus[subject._id] || "No syllabus content available"}
//                                                     </td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                         </div>
//                     ) : (
//                         <div className="text-center text-gray-500 py-8">
//                             {!selectedClass ? "Please select a class" :
//                                 !selectedSection ? "Please select a section" :
//                                     examList.length === 0 ? "No exams found for the selected class and section" :
//                                         !selectedExam ? "Please select an exam to view its syllabus" :
//                                             "No syllabus found for the selected exam"}
//                         </div>
//                     )}
//                 </div>
//             </div>
//             <ToastContainer />
//         </div>
//     );
// };

// export default Syllabus;

import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Allapi from '../../../common';

const Syllabus = () => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);

    // States for teacher data
    const [teacherAssignments, setTeacherAssignments] = useState([]);
    const [assignedClasses, setAssignedClasses] = useState([]);
    const [assignedSections, setAssignedSections] = useState([]);
    const [examList, setExamList] = useState([]);
    const [syllabusData, setSyllabusData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Edit states
    const [isEditing, setIsEditing] = useState(false);
    const [editedSyllabus, setEditedSyllabus] = useState({});

    // Form states
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedExam, setSelectedExam] = useState('');

    // Fetch teacher assignments
    useEffect(() => {
        const fetchTeacherAssignments = async () => {
            try {
                const response = await fetch(Allapi.getTeacherAssignments.url(decoded.teacherData.academic_id), {
                    method: Allapi.getTeacherAssignments.method,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.json();
                if (result.success) {
                    const teacherData = result.data.find(t => t.teacherId === decoded.teacherData._id);
                    setTeacherAssignments(teacherData?.classAssignments || []);
                    const classes = [...new Set(teacherData?.classAssignments.map(ca => ca.className))];
                    setAssignedClasses(classes);
                }
            } catch (error) {
                toast.error("Failed to fetch teacher assignments");
            }
        };

        if (token) {
            fetchTeacherAssignments();
        }
    }, [token]);

    useEffect(() => {
        if (selectedClass) {
            const classData = teacherAssignments.find(ca => ca.className === selectedClass);
            const sections = [...new Set(classData?.sections.map(s => s.sectionName))];
            setAssignedSections(sections);
            setSelectedSection('');
            setSelectedExam('');
            setSyllabusData(null);
            setIsEditing(false);
        }
    }, [selectedClass]);

    useEffect(() => {
        const fetchExams = async () => {
            if (!selectedClass || !selectedSection) return;

            try {
                setLoading(true);
                const response = await fetch(Allapi.getEveryExam.url(decoded.teacherData.branchId), {
                    method: Allapi.getEveryExam.method,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const result = await response.json();
                if (result.success) {
                    const relevantExams = result.data.filter(exam =>
                        exam.classId.name === selectedClass &&
                        exam.sectionId.name === selectedSection
                    );
                    setExamList(relevantExams);
                }
            } catch (error) {
                toast.error("Failed to fetch exams");
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, [selectedClass, selectedSection]);

    useEffect(() => {
        const fetchSyllabus = async () => {
            if (!selectedExam) return;

            try {
                setLoading(true);
                const response = await fetch(
                    Allapi.getAllSyllabus.url(decoded.teacherData.branchId, decoded.teacherData.academic_id),
                    {
                        method: Allapi.getAllSyllabus.method,
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const result = await response.json();
                if (result.success) {
                    const exam = examList.find(e => e._id === selectedExam);
                    const relevantSyllabus = result.data.find(
                        s =>
                            s.classId === exam.classId._id &&
                            s.sectionId === exam.sectionId._id &&
                            s.examName === exam.examName
                    );
                    setSyllabusData(relevantSyllabus);
                    if (relevantSyllabus) {
                        setEditedSyllabus(relevantSyllabus.syllabus);
                    }
                }
            } catch (error) {
                toast.error("Failed to fetch syllabus");
            } finally {
                setLoading(false);
            }
        };

        if (selectedExam) {
            fetchSyllabus();
            setIsEditing(false);
        }
    }, [selectedExam]);

    const handleExamChange = (examId) => {
        setSelectedExam(examId);
        setSyllabusData(null);
        setIsEditing(false);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedSyllabus(syllabusData.syllabus);
    };

    const handleSyllabusChange = (subjectId, value) => {
        setEditedSyllabus(prev => ({
            ...prev,
            [subjectId]: value
        }));
    };

    const handleSaveChanges = async () => {
        try {
            setLoading(true);
            const exam = examList.find(e => e._id === selectedExam);

            const response = await fetch(
                Allapi.updateSyllabus.url(decoded.teacherData.branchId, syllabusData._id),
                {
                    method: Allapi.updateSyllabus.method,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        syllabus: editedSyllabus
                    })
                }
            );

            const result = await response.json();
            if (result.success) {
                toast.success("Syllabus updated successfully");
                setSyllabusData({
                    ...syllabusData,
                    syllabus: editedSyllabus
                });
                setIsEditing(false);
            } else {
                toast.error(result.message || "Failed to update syllabus");
            }
        } catch (error) {
            toast.error("Error updating syllabus");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Exam Syllabus</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Class
                            </label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                disabled={isEditing}
                            >
                                <option value="">Select Class</option>
                                {assignedClasses.map((className) => (
                                    <option key={className} value={className}>
                                        {className}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Section
                            </label>
                            <select
                                value={selectedSection}
                                onChange={(e) => setSelectedSection(e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                disabled={!selectedClass || isEditing}
                            >
                                <option value="">Select Section</option>
                                {assignedSections.map((section) => (
                                    <option key={section} value={section}>
                                        {section}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Exam
                            </label>
                            <select
                                value={selectedExam}
                                onChange={(e) => handleExamChange(e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                disabled={!selectedSection || isEditing}
                            >
                                <option value="">Select Exam</option>
                                {examList.map((exam) => (
                                    <option key={exam._id} value={exam._id}>
                                        {exam.examName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : selectedExam && syllabusData ? (
                        <div className="mt-6">
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {examList.find(e => e._id === selectedExam)?.examName} Syllabus
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Class: {selectedClass} | Section: {selectedSection}
                                        </p>
                                    </div>
                                    {!isEditing ? (
                                        <button
                                            onClick={handleEditClick}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            Edit Syllabus
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleSaveChanges}
                                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                            >
                                                Save Changes
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Subject
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Syllabus Content
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {examList.find(e => e._id === selectedExam)?.subjects.map((subject) => (
                                                <tr key={subject._id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {subject.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {isEditing ? (
                                                            <textarea
                                                                value={editedSyllabus[subject._id] || ''}
                                                                onChange={(e) => handleSyllabusChange(subject._id, e.target.value)}
                                                                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                                rows="3"
                                                                placeholder="Enter syllabus content..."
                                                            />
                                                        ) : (
                                                            syllabusData.syllabus[subject._id] || "No syllabus content available"
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            {!selectedClass ? "Please select a class" :
                                !selectedSection ? "Please select a section" :
                                    examList.length === 0 ? "No exams found for the selected class and section" :
                                        !selectedExam ? "Please select an exam to view its syllabus" :
                                            "No syllabus found for the selected exam"}
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Syllabus;