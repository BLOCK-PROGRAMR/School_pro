import React, { useState } from "react";
import axios from "axios";
import { Upload, Calendar, FileText, X } from "lucide-react";
import Allapi from "../../../common/index";

const AddNotice = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles([...files, ...selectedFiles]);
    };

    const removeFile = (index) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !description || !date) {
            setError("Please fill all required fields");
            return;
        }

        try {
            setUploading(true);
            setError("");

            // Create form data to handle file uploads
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("date", date);

            // Append all files to the form data
            files.forEach((file, index) => {
                formData.append("files", file);
            });
            console.log("formadata", formData);
            // Make API request to upload notice with files

            const response = await axios({
                method: Allapi.addNotice.method,
                url: Allapi.addNotice.url,
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`, // Example for JWT token
                },
            });


            if (response.data.success) {
                setSuccess("Notice added successfully!");
                // Reset form
                setTitle("");
                setDescription("");
                setDate("");
                setFiles([]);
            } else {
                setError(response.data.message || "Failed to add notice");
            }
        } catch (error) {
            console.error("Error adding notice:", error);
            setError(error.response?.data?.message || "Error adding notice");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Notice</h1>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter notice title"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter notice description"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                            Date *
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="date"
                                id="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Attachments
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                            <input
                                type="file"
                                id="fileUpload"
                                onChange={handleFileChange}
                                className="hidden"
                                multiple
                            />
                            <label
                                htmlFor="fileUpload"
                                className="cursor-pointer flex flex-col items-center justify-center"
                            >
                                <Upload className="text-blue-500 mb-2" size={32} />
                                <span className="text-sm text-gray-600">
                                    Click to upload files or drag and drop
                                </span>
                                <span className="text-xs text-gray-500 mt-1">
                                    Supports all file formats
                                </span>
                            </label>
                        </div>
                    </div>

                    {files.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h3>
                            <ul className="space-y-2">
                                {files.map((file, index) => (
                                    <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                                        <div className="flex items-center">
                                            <FileText className="text-gray-500 mr-2" size={18} />
                                            <span className="text-sm text-gray-700">{file.name}</span>
                                            <span className="text-xs text-gray-500 ml-2">
                                                ({(file.size / 1024).toFixed(2)} KB)
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X size={18} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={uploading}
                            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${uploading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                        >
                            {uploading ? "Uploading..." : "Submit Notice"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddNotice;


// import React, { useState } from "react";
// import { Upload, Calendar, FileText, X } from "lucide-react";
// import Allapi from "../../../common/index";

// const AddNotice = () => {
//     const [title, setTitle] = useState("");
//     const [description, setDescription] = useState("");
//     const [date, setDate] = useState("");
//     const [files, setFiles] = useState([]);
//     const [uploading, setUploading] = useState(false);
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");

//     const handleFileChange = (e) => {
//         const selectedFiles = Array.from(e.target.files);
//         setFiles([...files, ...selectedFiles]);
//     };

//     const removeFile = (index) => {
//         setFiles(files.filter((_, i) => i !== index));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!title || !description || !date) {
//             setError("Please fill all required fields");
//             return;
//         }

//         try {
//             setUploading(true);
//             setError("");

//             const formData = new FormData();
//             formData.append("title", title);
//             formData.append("description", description);
//             formData.append("date", date);
//             files.forEach((file) => formData.append("files", file));

//             const response = await fetch(Allapi.addNotice.url, {
//                 method: Allapi.addNotice.method,
//                 body: formData,
//             });

//             const data = await response.json();

//             if (response.ok && data.success) {
//                 setSuccess("Notice added successfully!");
//                 setTitle("");
//                 setDescription("");
//                 setDate("");
//                 setFiles([]);
//             } else {
//                 setError(data.message || "Failed to add notice");
//             }
//         } catch (error) {
//             console.error("Error adding notice:", error);
//             setError("Error adding notice");
//         } finally {
//             setUploading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 p-6">
//             <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
//                 <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Notice</h1>

//                 {error && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{error}</div>}
//                 {success && <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6">{success}</div>}

//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-6">
//                         <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
//                             Title *
//                         </label>
//                         <input
//                             type="text"
//                             id="title"
//                             value={title}
//                             onChange={(e) => setTitle(e.target.value)}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             placeholder="Enter notice title"
//                             required
//                         />
//                     </div>

//                     <div className="mb-6">
//                         <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//                             Description *
//                         </label>
//                         <textarea
//                             id="description"
//                             value={description}
//                             onChange={(e) => setDescription(e.target.value)}
//                             rows={4}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             placeholder="Enter notice description"
//                             required
//                         />
//                     </div>

//                     <div className="mb-6">
//                         <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
//                             Date *
//                         </label>
//                         <div className="relative">
//                             <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//                             <input
//                                 type="date"
//                                 id="date"
//                                 value={date}
//                                 onChange={(e) => setDate(e.target.value)}
//                                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 required
//                             />
//                         </div>
//                     </div>

//                     <div className="mb-6">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
//                         <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
//                             <input type="file" id="fileUpload" onChange={handleFileChange} className="hidden" multiple />
//                             <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center justify-center">
//                                 <Upload className="text-blue-500 mb-2" size={32} />
//                                 <span className="text-sm text-gray-600">Click to upload files or drag and drop</span>
//                                 <span className="text-xs text-gray-500 mt-1">Supports all file formats</span>
//                             </label>
//                         </div>
//                     </div>

//                     {files.length > 0 && (
//                         <div className="mb-6">
//                             <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h3>
//                             <ul className="space-y-2">
//                                 {files.map((file, index) => (
//                                     <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
//                                         <div className="flex items-center">
//                                             <FileText className="text-gray-500 mr-2" size={18} />
//                                             <span className="text-sm text-gray-700">{file.name}</span>
//                                             <span className="text-xs text-gray-500 ml-2">
//                                                 ({(file.size / 1024).toFixed(2)} KB)
//                                             </span>
//                                         </div>
//                                         <button
//                                             type="button"
//                                             onClick={() => removeFile(index)}
//                                             className="text-red-500 hover:text-red-700"
//                                         >
//                                             <X size={18} />
//                                         </button>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>
//                     )}

//                     <div className="flex justify-end">
//                         <button
//                             type="submit"
//                             disabled={uploading}
//                             className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${uploading ? "opacity-70 cursor-not-allowed" : ""
//                                 }`}
//                         >
//                             {uploading ? "Uploading..." : "Submit Notice"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddNotice;
