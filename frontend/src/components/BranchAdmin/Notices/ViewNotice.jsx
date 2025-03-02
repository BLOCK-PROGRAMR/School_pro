import React, { useState, useEffect } from "react";
import axios from "axios";
import { FileText, Calendar, Download, Trash2, Eye, X } from "lucide-react";
import Allapi from "../../../common/index";

const ViewNotice = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedNotice, setSelectedNotice] = useState(null);

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            setLoading(true);
            const response = await axios({
                method: Allapi.getNotices.method,
                url: Allapi.getNotices.url,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.data.success) {
                setNotices(response.data.data);
            } else {
                setError(response.data.message || "Failed to fetch notices");
            }
        } catch (error) {
            console.error("Error fetching notices:", error);
            setError(error.response?.data?.message || "Error fetching notices");
        } finally {
            setLoading(false);
        }
    };

    const handleViewNotice = (notice) => {
        setSelectedNotice(notice);
    };

    const handleCloseModal = () => {
        setSelectedNotice(null);
    };

    const handleDeleteNotice = async (noticeId) => {
        if (!window.confirm("Are you sure you want to delete this notice?")) {
            return;
        }

        try {
            const response = await axios({
                method: Allapi.deleteNotice.method,
                url: Allapi.deleteNotice.url(noticeId),
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.data.success) {
                // Remove the deleted notice from the state
                setNotices(notices.filter(notice => notice._id !== noticeId));
                if (selectedNotice && selectedNotice._id === noticeId) {
                    setSelectedNotice(null);
                }
            } else {
                setError(response.data.message || "Failed to delete notice");
            }
        } catch (error) {
            console.error("Error deleting notice:", error);
            setError(error.response?.data?.message || "Error deleting notice");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Notices</h1>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
                        {error}
                    </div>
                )}

                {notices.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <p className="text-gray-600">No notices available</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {notices.map((notice) => (
                            <div key={notice._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                                        {notice.title}
                                    </h2>
                                    <div className="flex items-center text-gray-500 mb-4">
                                        <Calendar size={16} className="mr-1" />
                                        <span className="text-sm">{formatDate(notice.date)}</span>
                                    </div>
                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {notice.description}
                                    </p>

                                    {notice.files && notice.files.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-500 mb-2">
                                                {notice.files.length} attachment{notice.files.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex justify-between">
                                        <button
                                            onClick={() => handleViewNotice(notice)}
                                            className="flex items-center text-blue-600 hover:text-blue-800"
                                        >
                                            <Eye size={18} className="mr-1" />
                                            <span>View</span>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteNotice(notice._id)}
                                            className="flex items-center text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={18} className="mr-1" />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Notice Detail Modal */}
            {selectedNotice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {selectedNotice.title}
                                </h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex items-center text-gray-500 mb-6">
                                <Calendar size={18} className="mr-2" />
                                <span>{formatDate(selectedNotice.date)}</span>
                            </div>

                            <div className="prose max-w-none mb-6">
                                <p className="text-gray-700 whitespace-pre-line">
                                    {selectedNotice.description}
                                </p>
                            </div>

                            {selectedNotice.files && selectedNotice.files.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                        Attachments
                                    </h3>
                                    <ul className="space-y-2">
                                        {selectedNotice.files.map((file, index) => (
                                            <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                                                <div className="flex items-center">
                                                    <FileText className="text-gray-500 mr-2" size={18} />
                                                    <span className="text-sm text-gray-700">{file.originalname || file.name}</span>
                                                </div>
                                                <a
                                                    href={file.url}
                                                    download
                                                    className="flex items-center text-blue-600 hover:text-blue-800"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Download size={18} className="mr-1" />
                                                    <span>Download</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewNotice;