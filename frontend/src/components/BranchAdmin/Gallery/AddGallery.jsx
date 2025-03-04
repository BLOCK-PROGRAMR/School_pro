import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Image, Upload, X, Loader } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const backendUrl = "http://localhost:3490";

const AddGallery = () => {
    const [images, setImages] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const onDrop = useCallback(acceptedFiles => {
        // Limit to 5 images
        if (images.length + acceptedFiles.length > 5) {
            toast.error('You can only upload a maximum of 5 images');
            const allowedFiles = acceptedFiles.slice(0, 5 - images.length);

            // Add preview URLs for the allowed files
            const newImages = allowedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            }));

            setImages(prevImages => [...prevImages, ...newImages]);
        } else {
            // Add preview URLs
            const newImages = acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            }));

            setImages(prevImages => [...prevImages, ...newImages]);
        }
    }, [images]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif']
        },
        maxSize: 5242880, // 5MB
    });

    const removeImage = (index) => {
        const newImages = [...images];
        // Revoke the object URL to avoid memory leaks
        URL.revokeObjectURL(newImages[index].preview);
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (images.length === 0) {
            toast.error('Please upload at least one image');
            return;
        }

        if (!title.trim()) {
            toast.error('Please enter a title');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);

            images.forEach((image, index) => {
                formData.append('images', image);
            });

            const response = await axios.post(`${backendUrl}/api/gallery`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {
                toast.success('Gallery images uploaded successfully!');
                // Clear form
                setImages([]);
                setTitle('');
                setDescription('');
            } else {
                toast.error(response.data.message || 'Failed to upload images');
            }
        } catch (error) {
            console.error('Error uploading images:', error);
            toast.error(error.response?.data?.message || 'Error uploading images');
        } finally {
            setLoading(false);
        }
    };

    // Clean up object URLs when component unmounts
    React.useEffect(() => {
        return () => {
            images.forEach(image => URL.revokeObjectURL(image.preview));
        };
    }, [images]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Gallery Images</h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Gallery Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter gallery title"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter gallery description"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Upload Images (Max 5) *
                        </label>
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'} rounded-md p-8 text-center cursor-pointer transition-colors`}
                        >
                            <input {...getInputProps()} />
                            <div className="flex flex-col items-center justify-center">
                                <Upload className="text-blue-500 mb-2" size={32} />
                                {isDragActive ? (
                                    <p className="text-sm text-blue-500">Drop the images here...</p>
                                ) : (
                                    <>
                                        <p className="text-sm text-gray-600">Drag & drop images here, or click to select files</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Supports JPG, PNG, GIF (Max: 5MB per image)
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {images.length}/5 images selected
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {images.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Images:</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {images.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <div className="aspect-square overflow-hidden rounded-md border border-gray-200">
                                            <img
                                                src={image.preview}
                                                alt={`Preview ${index}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                        <p className="text-xs text-gray-500 mt-1 truncate">
                                            {image.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <Loader className="animate-spin mr-2" size={18} />
                                    Uploading...
                                </span>
                            ) : (
                                "Upload Gallery"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddGallery;