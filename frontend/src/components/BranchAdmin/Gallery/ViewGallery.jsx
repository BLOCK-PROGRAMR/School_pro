import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Trash2, Edit, Image, Loader, Search, Calendar } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';
import { mycon } from "../../../store/Mycontext";
import { jwtDecode } from "jwt-decode";
const backendUrl = "http://localhost:3490";

const ViewGallery = () => {
    const { branchdet } = useContext(mycon);
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGallery, setSelectedGallery] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);

    useEffect(() => {
        fetchGalleries();
    }, []);

    const fetchGalleries = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const decoded = jwtDecode(token);
            const branchId = decoded.branch;
            console.log("branchid", branchId);
            const response = await axios.get(`${backendUrl}/api/gallery/branch/${branchId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {

                setGalleries(response.data.data);
            } else {
                toast.error('Failed to fetch galleries');
            }
        } catch (error) {
            console.error('Error fetching galleries:', error);
            toast.error('Error fetching galleries');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (galleryId) => {
        try {
            const response = await axios.delete(`${backendUrl}/api/gallery/${galleryId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {
                toast.success('Gallery deleted successfully');
                setGalleries(galleries.filter(gallery => gallery._id !== galleryId));
                setConfirmDelete(null);
            } else {
                toast.error(response.data.message || 'Failed to delete gallery');
            }
        } catch (error) {
            console.error('Error deleting gallery:', error);
            toast.error(error.response?.data?.message || 'Error deleting gallery');
        }
    };

    const openGalleryModal = (gallery) => {
        setSelectedGallery(gallery);
        setIsModalOpen(true);
    };

    const closeGalleryModal = () => {
        setSelectedGallery(null);
        setIsModalOpen(false);
    };

    const filteredGalleries = galleries.filter(gallery =>
        gallery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gallery.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Gallery Collections</h1>
                        <div className="relative w-full md:w-64">
                            <input
                                type="text"
                                placeholder="Search galleries..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader className="animate-spin text-blue-500 mr-2" size={24} />
                            <span className="text-gray-600">Loading galleries...</span>
                        </div>
                    ) : filteredGalleries.length === 0 ? (
                        <div className="text-center py-20">
                            <Image className="mx-auto text-gray-400 mb-4" size={48} />
                            <p className="text-gray-500">No galleries found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredGalleries.map((gallery) => (
                                <div key={gallery._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div
                                        className="aspect-video bg-gray-100 overflow-hidden cursor-pointer"
                                        onClick={() => openGalleryModal(gallery)}
                                    >
                                        {gallery.images && gallery.images.length > 0 ? (
                                            <img
                                                src={gallery.images[0].url}
                                                alt={gallery.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Image className="text-gray-400" size={48} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <div className="flex justify-between items-start">
                                            <h2 className="text-lg font-semibold text-gray-800 mb-1 truncate" title={gallery.title}>
                                                {gallery.title}
                                            </h2>
                                            <span className="text-xs text-gray-500 flex items-center">
                                                <Calendar size={12} className="mr-1" />
                                                {format(new Date(gallery.createdAt), 'MMM d, yyyy')}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2" title={gallery.description}>
                                            {gallery.description || 'No description'}
                                        </p>

                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">
                                                {gallery.images?.length || 0} image{gallery.images?.length !== 1 ? 's' : ''}
                                            </span>

                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openGalleryModal(gallery)}
                                                    className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                                    title="View gallery"
                                                >
                                                    <Image size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDelete(gallery._id)}
                                                    className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                                    title="Delete gallery"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>


            {isModalOpen && selectedGallery && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">{selectedGallery.title}</h2>
                            <button
                                onClick={closeGalleryModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✖
                            </button>
                        </div>

                        <div className="p-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
                            {selectedGallery.description && (
                                <p className="text-gray-600 mb-4">{selectedGallery.description}</p>
                            )}

                            {/* Ensure all images are displayed */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {selectedGallery.images && selectedGallery.images.map((image, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                        <img
                                            src={image.url}
                                            alt={`Gallery image ${index + 1}`}
                                            className="w-full h-auto object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={closeGalleryModal}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Confirm Deletion</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this gallery? This action cannot be undone.
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

export default ViewGallery;