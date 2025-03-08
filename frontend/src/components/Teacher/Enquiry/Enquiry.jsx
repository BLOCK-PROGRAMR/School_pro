

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Allapi from '../../../common';

const Enquiry = () => {
    const [loading, setLoading] = useState(false);
    const [teacherData, setTeacherData] = useState(null);

    const [formData, setFormData] = useState({
        academicYear: '',
        studentName: '',
        age: '',
        address: '',
        class: '',
        reference: 'None'
    });

    useEffect(() => {
        // Get teacher data from token
        const token = localStorage.getItem('token');
        if (token) {
            const tokenData = parseJwt(token);
            if (tokenData.teacherData) {
                setTeacherData(tokenData.teacherData);
                setFormData(prev => ({
                    ...prev,
                    reference: tokenData.teacherData.name
                }));
            }
        }
    }, []);

    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                    branchId: teacherData?.branchId
                }),
            });

            const result = await response.json();
            if (result.success) {
                toast.success('Enquiry submitted successfully!');
                setFormData(prev => ({
                    ...prev,
                    academicYear: '',
                    studentName: '',
                    age: '',
                    address: '',
                    class: '',
                }));
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
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Enquiry Form</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Academic Year
                            </label>
                            <input
                                type="text"
                                name="academicYear"
                                value={formData.academicYear}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                                placeholder="e.g., 2024-2025"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Student Name
                            </label>
                            <input
                                type="text"
                                name="studentName"
                                value={formData.studentName}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Age
                            </label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                                min="1"
                                max="100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Class
                            </label>
                            <input
                                type="text"
                                name="class"
                                value={formData.class}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                                placeholder="Enter class (e.g., 10th)"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Address
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        {/* <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Reference Teacher
                            </label>
                            <input
                                type="text"
                                name="reference"
                                value={formData.reference}
                                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                disabled
                            />
                        </div> */}

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Reference Teacher
                            </label>
                            <select
                                name="reference"
                                value={formData.reference}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="None">None</option>
                                {teacherData?.name && <option value={teacherData.name}>{teacherData.name}</option>}
                            </select>
                        </div>

                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
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