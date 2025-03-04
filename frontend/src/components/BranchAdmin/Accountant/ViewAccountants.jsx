
import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { Users, Pencil, Trash2 } from 'lucide-react';
import { mycon } from '../../../store/Mycontext';
import Allapi from '../../../common';

const ViewAccountants = () => {
    const { branchdet } = useContext(mycon);
    const [accountants, setAccountants] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingAccountant, setEditingAccountant] = useState(null);
    const [editFormData, setEditFormData] = useState({
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
        joiningDate: ''
    });

    useEffect(() => {
        if (branchdet?.academicYears?.[0]) {
            fetchAccountants();
        }
    }, [branchdet]);

    const fetchAccountants = async () => {
        try {
            console.log("console.log", branchdet.academicYears[0]);
            alert(branchdet.academicYears[0]);
            const response = await fetch(
                `${Allapi.getAccounts.url(branchdet._id, branchdet.academicYears[0])}`,
                {
                    method: Allapi.getAccounts.method,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                setAccountants(result.data);
            } else {
                toast.error(result.message || 'Failed to fetch accountants');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            if (!navigator.onLine) {
                toast.error('Network error: Please check your internet connection');
            } else {
                toast.error('Error fetching accountants. Please try again later.');
            }
        }
    };

    const handleDeleteAccountant = async (accountantId) => {
        if (!window.confirm('Are you sure you want to delete this accountant?')) return;

        try {
            const response = await fetch(
                Allapi.deleteAccount.url(accountantId),
                {
                    method: Allapi.deleteAccount.method,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.success) {
                toast.success('Accountant deleted successfully');
                fetchAccountants();
            } else {
                toast.error(result.message || 'Failed to delete accountant');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Error deleting accountant. Please try again.');
        }
    };

    const handleEdit = (accountant) => {
        setEditingAccountant(accountant);
        setEditFormData({
            username: accountant.username || '',
            password: '',
            phone: accountant.phone,
            address: { ...accountant.address },
            qualification: accountant.qualification,
            experience: accountant.experience,
            joiningDate: accountant.joiningDate ? accountant.joiningDate.split('T')[0] : ''
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updateData = {
                ...editFormData,
                academic_id: branchdet.academicYears[0]
            };

            if (!updateData.password) {
                delete updateData.password;
            }

            const response = await fetch(
                Allapi.updateAccount.url(editingAccountant._id),
                {
                    method: Allapi.updateAccount.method,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updateData)
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.success) {
                toast.success('Accountant updated successfully');
                setIsEditModalOpen(false);
                fetchAccountants();
            } else {
                toast.error(result.message || 'Failed to update accountant');
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error('Error updating accountant. Please try again.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setEditFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setEditFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    if (!branchdet?.academicYears?.[0]) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <p className="text-gray-700">Please add an academic year first.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Users className="w-6 h-6 text-blue-600" />
                        <h2 className="text-2xl font-bold text-gray-800">View Accountants</h2>
                    </div>

                    <div className="space-y-4">
                        {accountants.map((accountant) => (
                            <div key={accountant._id} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold text-black">{accountant.name}</h3>
                                        <div className="mt-2 space-y-1">
                                            <p className="text-gray-600">
                                                <span className="font-medium">Phone:</span> {accountant.phone}
                                            </p>
                                            <p className="text-gray-600">
                                                <span className="font-medium">Email:</span> {accountant.email}
                                            </p>
                                            <p className="text-gray-600">
                                                <span className="font-medium">Qualification:</span> {accountant.qualification}
                                            </p>
                                            <p className="text-gray-600">
                                                <span className="font-medium">Experience:</span> {accountant.experience} years
                                            </p>
                                            <div className="mt-2">
                                                <p className="text-sm font-medium text-gray-700">Address:</p>
                                                <p className="text-gray-600">
                                                    {accountant.address.doorNo}, {accountant.address.street},
                                                    {accountant.address.city} - {accountant.address.pincode}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(accountant)}
                                            className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAccountant(accountant._id)}
                                            className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {accountants.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No accountants found.</p>
                            </div>
                        )}
                    </div>

                    {isEditModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                <h3 className="text-xl font-bold mb-4">Edit Accountant</h3>
                                <form onSubmit={handleUpdate} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Name (Non-editable)
                                            </label>
                                            <input
                                                type="text"
                                                value={editingAccountant?.name || ''}
                                                disabled
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Username
                                            </label>
                                            <input
                                                type="text"
                                                name="username"
                                                value={editFormData.username}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                New Password (leave blank to keep current)
                                            </label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={editFormData.password}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter new password"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone (Non-editable)
                                            </label>
                                            <input
                                                type="text"
                                                value={editFormData.phone}
                                                disabled
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Qualification
                                            </label>
                                            <input
                                                type="text"
                                                name="qualification"
                                                value={editFormData.qualification}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Experience (years)
                                            </label>
                                            <input
                                                type="number"
                                                name="experience"
                                                value={editFormData.experience}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Joining Date
                                            </label>
                                            <input
                                                type="date"
                                                name="joiningDate"
                                                value={editFormData.joiningDate}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-gray-700">Address</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                name="address.doorNo"
                                                value={editFormData.address.doorNo}
                                                onChange={handleInputChange}
                                                placeholder="Door No"
                                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                type="text"
                                                name="address.street"
                                                value={editFormData.address.street}
                                                onChange={handleInputChange}
                                                placeholder="Street"
                                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                type="text"
                                                name="address.city"
                                                value={editFormData.address.city}
                                                onChange={handleInputChange}
                                                placeholder="City"
                                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                type="text"
                                                name="address.pincode"
                                                value={editFormData.address.pincode}
                                                onChange={handleInputChange}
                                                placeholder="Pincode"
                                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 mt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditModalOpen(false)}
                                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewAccountants;