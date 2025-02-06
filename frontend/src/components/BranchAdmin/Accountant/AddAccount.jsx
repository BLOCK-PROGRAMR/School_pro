import React, { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { mycon } from '../../../store/Mycontext';
import Allapi from '../../../common';
import 'react-toastify/dist/ReactToastify.css';

const AddAccount = () => {
    const { branchdet } = useContext(mycon);

    const initialFormState = {
        name: '',
        username: '',
        password: '',
        phone: '',
        address: {
            doorNo: '',
            street: '',
            city: '',
            pincode: '',
        },
        qualification: '',
        experience: '',
        joiningDate: '',
        aadharNumber: '',
        academic_id: '',
        role: 'Account',
        branchId: ''
    };

    const [formData, setFormData] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (branchdet?.academicYears?.[0] && branchdet?._id) {
            setFormData(prev => ({
                ...prev,
                academic_id: branchdet.academicYears[0],
                branchId: branchdet._id
            }));
        }
    }, [branchdet]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            toast.error('Name is required');
            return false;
        }
        if (!formData.username.trim()) {
            toast.error('Username is required');
            return false;
        }
        if (!formData.password.trim()) {
            toast.error('Password is required');
            return false;
        }
        if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) {
            toast.error('Please enter a valid 10-digit phone number');
            return false;
        }
        if (!formData.address.pincode.trim() || !/^\d{6}$/.test(formData.address.pincode)) {
            toast.error('Please enter a valid 6-digit pincode');
            return false;
        }
        if (!formData.aadharNumber.trim() || !/^\d{12}$/.test(formData.aadharNumber)) {
            toast.error('Please enter a valid 12-digit Aadhar number');
            return false;
        }
        if (!formData.academic_id) {
            toast.error('Academic year not available');
            return false;
        }
        if (!formData.branchId) {
            toast.error('Branch information not available');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm() || isSubmitting) return;

        try {
            setIsSubmitting(true);
            const response = await fetch(Allapi.addAccount.url, {
                method: Allapi.addAccount.method,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Account added successfully!');
                setFormData(prev => ({
                    ...initialFormState,
                    academic_id: branchdet?.academicYears?.[0] || '',
                    branchId: branchdet?._id || ''
                }));
            } else {
                toast.error(result.message || 'Failed to add account');
            }
        } catch (error) {
            console.error('Error adding account:', error);
            toast.error('Failed to add account. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!branchdet?.academicYears?.[0]) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <p className="text-gray-700">Loading academic year information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 py-8 bg-gray-100">
            <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-md">
                <h2 className="mb-6 text-2xl font-bold text-gray-800">Add Accountant</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter full name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter username"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter password"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Aadhar Number
                            </label>
                            <input
                                type="text"
                                name="aadharNumber"
                                value={formData.aadharNumber}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter 12-digit Aadhar number"
                                maxLength={12}
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter 10-digit phone number"
                                maxLength={10}
                                required
                            />
                        </div>
                    </div>

                    {/* Address Fields */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Address
                        </label>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <input
                                type="text"
                                name="address.doorNo"
                                value={formData.address.doorNo}
                                onChange={handleInputChange}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Door No"
                            />
                            <input
                                type="text"
                                name="address.street"
                                value={formData.address.street}
                                onChange={handleInputChange}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Street"
                            />
                            <input
                                type="text"
                                name="address.city"
                                value={formData.address.city}
                                onChange={handleInputChange}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="City"
                            />
                            <input
                                type="text"
                                name="address.pincode"
                                value={formData.address.pincode}
                                onChange={handleInputChange}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="6-digit Pincode"
                                maxLength={6}
                                required
                            />
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Qualification
                            </label>
                            <input
                                type="text"
                                name="qualification"
                                value={formData.qualification}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter qualification"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Experience (years)
                            </label>
                            <input
                                type="number"
                                name="experience"
                                value={formData.experience}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Years of experience"
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Joining Date
                            </label>
                            <input
                                type="date"
                                name="joiningDate"
                                value={formData.joiningDate}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {isSubmitting ? 'Adding Accountant...' : 'Add Accountant'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddAccount;