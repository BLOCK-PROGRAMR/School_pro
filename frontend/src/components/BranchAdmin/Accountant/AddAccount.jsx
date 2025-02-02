import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { mycon } from '../../../store/Mycontext';
import Allapi from '../../../common';
import 'react-toastify/dist/ReactToastify.css';

const AddAccount = () => {
    const { branchdet } = useContext(mycon);

    const [formData, setFormData] = useState({
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
        branchId: branchdet._id
    });

    useEffect(() => {
        if (branchdet?.academicYears?.[0]) {
            setFormData(prev => ({
                ...prev,
                academic_id: branchdet.academicYears[0]
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
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
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
                setFormData({
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
                    academic_id: branchdet.academicYears[0],
                    role: 'Account',
                    branchId: branchdet._id
                });
            } else {
                toast.error(result.message || 'Failed to add account');
            }
        } catch (error) {
            toast.error('Failed to add account. Please try again.');
            console.error('Error adding account:', error);
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
                                placeholder="Enter aadhar"
                                maxLength={12}
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
                                placeholder="10-digit phone number"
                                maxLength={10}
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
                                placeholder="Pincode"
                                maxLength={6}
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
                        className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Add Accountant
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddAccount;