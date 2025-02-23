import React, { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

const Delete = () => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            setError(null);

            const response = await fetch('/api/academic/delete-previous-year', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete data');
            }

            setSuccess('Previous year data has been successfully deleted');
            setShowConfirmation(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Delete Previous Year Data</h1>

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                        <div className="flex items-start">
                            <AlertTriangle className="h-6 w-6 text-yellow-400 mr-3" />
                            <div>
                                <h3 className="text-sm font-medium text-yellow-800">Important Note</h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                    <p>This action will delete:</p>
                                    <ul className="list-disc ml-5 mt-2">
                                        <li>Previous year classes</li>
                                        <li>Section information</li>
                                        <li>Academic year data</li>
                                        <li>Syllabus records</li>
                                    </ul>
                                    <p className="mt-2 font-medium">Student data will be preserved.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowConfirmation(true)}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                        <Trash2 className="w-5 h-5 mr-2" />
                        Delete Previous Year Data
                    </button>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-400 text-green-700">
                            {success}
                        </div>
                    )}

                    {showConfirmation && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h2>
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to delete all previous year data? This action cannot be undone.
                                </p>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={() => setShowConfirmation(false)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                        disabled={isDeleting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-red-400"
                                    >
                                        {isDeleting ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Delete;