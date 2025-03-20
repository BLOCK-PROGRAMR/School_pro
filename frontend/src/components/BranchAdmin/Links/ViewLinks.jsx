import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link as LinkIcon, Trash2, Calendar, ExternalLink, Loader, Search, Filter } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';
import { jwtDecode } from "jwt-decode";

const backendUrl = "http://localhost:3490";

const ViewLinks = () => {
    const [linkCollections, setLinkCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [sortBy, setSortBy] = useState('date'); // 'date' or 'title'
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

    useEffect(() => {
        fetchLinkCollections();
    }, []);

    const fetchLinkCollections = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const decoded = jwtDecode(token);
            const branchId = decoded.branch;
            console.log("branchid", branchId);
            const response = await axios.get(`${backendUrl}/api/links/branch/${branchId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {
                setLinkCollections(response.data.data);
            } else {
                toast.error('Failed to fetch link collections');
            }
        } catch (error) {
            console.error('Error fetching link collections:', error);
            toast.error('Error fetching link collections');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (collectionId) => {
        try {
            const response = await axios.delete(`${backendUrl}/api/links/${collectionId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {
                toast.success('Link collection deleted successfully');
                setLinkCollections(linkCollections.filter(collection => collection._id !== collectionId));
                setConfirmDelete(null);
            } else {
                toast.error(response.data.message || 'Failed to delete link collection');
            }
        } catch (error) {
            console.error('Error deleting link collection:', error);
            toast.error(error.response?.data?.message || 'Error deleting link collection');
        }
    };

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const changeSortBy = (field) => {
        if (sortBy === field) {
            toggleSortOrder();
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    // Filter and sort the link collections
    const filteredAndSortedCollections = linkCollections
        .filter(collection =>
            collection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            collection.links.some(link =>
                link.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                link.url.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
        .sort((a, b) => {
            if (sortBy === 'date') {
                return sortOrder === 'asc'
                    ? new Date(a.date) - new Date(b.date)
                    : new Date(b.date) - new Date(a.date);
            } else if (sortBy === 'title') {
                return sortOrder === 'asc'
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title);
            }
            return 0;
        });

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Important Links</h1>
                        <div className="w-full md:w-64 relative">
                            <input
                                type="text"
                                placeholder="Search links..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                    </div>

                    <div className="mb-4 flex flex-wrap gap-2">
                        <button
                            onClick={() => changeSortBy('date')}
                            className={`flex items-center px-3 py-1 rounded-md text-sm ${sortBy === 'date'
                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                : 'bg-gray-100 text-gray-700 border border-gray-200'
                                }`}
                        >
                            <Calendar size={14} className="mr-1" />
                            Date
                            {sortBy === 'date' && (
                                <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                            )}
                        </button>
                        <button
                            onClick={() => changeSortBy('title')}
                            className={`flex items-center px-3 py-1 rounded-md text-sm ${sortBy === 'title'
                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                : 'bg-gray-100 text-gray-700 border border-gray-200'
                                }`}
                        >
                            <Filter size={14} className="mr-1" />
                            Title
                            {sortBy === 'title' && (
                                <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                            )}
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader className="animate-spin text-blue-500 mr-2" size={24} />
                            <span className="text-gray-600">Loading links...</span>
                        </div>
                    ) : filteredAndSortedCollections.length === 0 ? (
                        <div className="text-center py-20">
                            <LinkIcon className="mx-auto text-gray-400 mb-4" size={48} />
                            <p className="text-gray-500">No link collections found</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredAndSortedCollections.map((collection) => (
                                <div key={collection._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-800">{collection.title}</h2>
                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <Calendar size={14} className="mr-1" />
                                                {format(new Date(collection.date), 'MMMM d, yyyy')}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setConfirmDelete(collection._id)}
                                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                            title="Delete collection"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div className="p-4">
                                        <ul className="space-y-3">
                                            {collection.links.map((link, index) => (
                                                <li key={index} className="flex items-start">
                                                    <ExternalLink size={18} className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                                                    <div>
                                                        <a
                                                            href={link.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                                        >
                                                            {link.description}
                                                        </a>
                                                        <p className="text-xs text-gray-500 mt-0.5 break-all">{link.url}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Confirm Deletion</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this link collection? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(confirmDelete)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewLinks;