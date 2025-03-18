import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, Plus, Trash2, Calendar, ExternalLink, Loader } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { mycon } from '../../../store/Mycontext';

const backendUrl = "http://localhost:3490";

const AddLink = () => {
    const [title, setTitle] = useState('');
    const [links, setLinks] = useState([{ url: '', description: '' }]);
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const { branchdet } = useContext(mycon);

    const handleLinkChange = (index, field, value) => {
        const updatedLinks = [...links];
        updatedLinks[index][field] = value;
        setLinks(updatedLinks);
    };

    const addLinkField = () => {
        setLinks([...links, { url: '', description: '' }]);
    };

    const removeLinkField = (index) => {
        if (links.length === 1) {
            toast.error('You need at least one link');
            return;
        }

        const updatedLinks = [...links];
        updatedLinks.splice(index, 1);
        setLinks(updatedLinks);
    };

    const validateUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!title.trim()) {
            toast.error('Please enter a title');
            return;
        }

        if (!date) {
            toast.error('Please select a date');
            return;
        }

        // Validate all links
        const invalidLinks = links.filter(link => !validateUrl(link.url));
        if (invalidLinks.length > 0) {
            toast.error('Please enter valid URLs for all links');
            return;
        }

        // Check for empty descriptions
        const emptyDescriptions = links.filter(link => !link.description.trim());
        if (emptyDescriptions.length > 0) {
            toast.error('Please provide descriptions for all links');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${backendUrl}/api/links`, {
                title,
                date,
                branchId: branchdet._id,
                links
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {
                toast.success('Links added successfully!');
                // Reset form
                setTitle('');
                setDate('');
                setLinks([{ url: '', description: '' }]);
            } else {
                toast.error(response.data.message || 'Failed to add links');
            }
        } catch (error) {
            console.error('Error adding links:', error);
            toast.error(error.response?.data?.message || 'Error adding links');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Important Links</h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Collection Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter a title for this link collection"
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
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Links *
                            </label>
                            <button
                                type="button"
                                onClick={addLinkField}
                                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                            >
                                <Plus size={16} className="mr-1" />
                                Add Another Link
                            </button>
                        </div>

                        {links.map((link, index) => (
                            <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-sm font-medium text-gray-700">Link #{index + 1}</h3>
                                    <button
                                        type="button"
                                        onClick={() => removeLinkField(index)}
                                        className="text-red-500 hover:text-red-700"
                                        title="Remove link"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor={`url-${index}`} className="block text-xs font-medium text-gray-700 mb-1">
                                        URL *
                                    </label>
                                    <div className="relative">
                                        <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="url"
                                            id={`url-${index}`}
                                            value={link.url}
                                            onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="https://example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor={`description-${index}`} className="block text-xs font-medium text-gray-700 mb-1">
                                        Description *
                                    </label>
                                    <input
                                        type="text"
                                        id={`description-${index}`}
                                        value={link.description}
                                        onChange={(e) => handleLinkChange(index, 'description', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Brief description of the link"
                                        required
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <Loader className="animate-spin mr-2" size={18} />
                                    Saving...
                                </span>
                            ) : (
                                "Save Links"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddLink;