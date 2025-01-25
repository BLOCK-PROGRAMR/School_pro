import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { X, Pencil, Trash2 } from 'lucide-react';

const BASE_URL = 'http://localhost:3490';

const LEDGER_TYPES = ['Expenses', 'Income', 'Loans', 'Bank'];

const LedgerCreation = () => {
    const [formData, setFormData] = useState({
        groupLedgerName: '',
        ledgerType: '',
        currentSubLedger: ''
    });
    const [subLedgers, setSubLedgers] = useState([]);
    const [ledgers, setLedgers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingLedger, setEditingLedger] = useState(null);

    useEffect(() => {
        fetchLedgers();
    }, []);

    const getAxiosConfig = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Authentication token not found');
            return null;
        }
        return {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
    };

    const fetchLedgers = async () => {
        try {
            const config = getAxiosConfig();
            if (!config) return;

            const response = await axios.get(`${BASE_URL}/api/ledger/all`, config);
            if (response.data.success) {
                setLedgers(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching ledgers:', error);
            toast.error('Failed to fetch ledgers');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddSubLedger = () => {
        if (formData.currentSubLedger.trim()) {
            setSubLedgers(prev => [...prev, formData.currentSubLedger.trim()]);
            setFormData(prev => ({ ...prev, currentSubLedger: '' }));
        }
    };

    const handleRemoveSubLedger = (index) => {
        setSubLedgers(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.groupLedgerName || !formData.ledgerType || subLedgers.length === 0) {
            toast.error('Please fill all required fields and add at least one sub-ledger');
            return;
        }

        setLoading(true);
        try {
            const config = getAxiosConfig();
            if (!config) return;

            const payload = {
                groupLedgerName: formData.groupLedgerName,
                ledgerType: formData.ledgerType,
                subLedgers: subLedgers
            };

            console.log('Sending payload:', payload); // Debug log

            if (editingLedger) {
                const response = await axios.put(
                    `${BASE_URL}/api/ledger/update/${editingLedger._id}`,
                    payload,
                    config
                );
                
                if (response.data.success) {
                    toast.success('Ledger updated successfully');
                    resetForm();
                    fetchLedgers();
                }
            } else {
                const response = await axios.post(
                    `${BASE_URL}/api/ledger/create`,
                    payload,
                    config
                );
                
                if (response.data.success) {
                    toast.success('Ledger created successfully');
                    resetForm();
                    fetchLedgers();
                }
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               'An error occurred while processing your request';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (ledger) => {
        setEditingLedger(ledger);
        setFormData({
            groupLedgerName: ledger.groupLedgerName,
            ledgerType: ledger.ledgerType,
            currentSubLedger: ''
        });
        setSubLedgers(ledger.subLedgers.map(sl => sl.name));
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this ledger?')) {
            return;
        }

        setLoading(true);
        try {
            const config = getAxiosConfig();
            if (!config) return;

            const response = await axios.delete(
                `${BASE_URL}/api/ledger/delete/${id}`,
                config
            );
            
            if (response.data.success) {
                toast.success('Ledger deleted successfully');
                fetchLedgers();
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               'An error occurred while deleting the ledger';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            groupLedgerName: '',
            ledgerType: '',
            currentSubLedger: ''
        });
        setSubLedgers([]);
        setEditingLedger(null);
    };

    const handleError = (error) => {
        if (error.response?.status === 401) {
            toast.error('Session expired. Please login again');
        } else if (error.code === 'ERR_NETWORK') {
            toast.error('Unable to connect to server. Please check your connection');
        } else {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    return (
        <div className="p-4">
            <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {editingLedger ? 'Edit Ledger' : 'Create Ledger'}
                    </h2>
                    {editingLedger && (
                        <button
                            onClick={resetForm}
                            className="text-gray-600 hover:text-gray-800"
                            title="Cancel editing"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    )}
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Group Ledger Name
                        </label>
                        <input
                            type="text"
                            name="groupLedgerName"
                            value={formData.groupLedgerName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ledger Type
                        </label>
                        <select
                            name="ledgerType"
                            value={formData.ledgerType}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                            disabled={loading}
                        >
                            <option value="">Select Ledger Type</option>
                            {LEDGER_TYPES.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sub Ledgers
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                name="currentSubLedger"
                                value={formData.currentSubLedger}
                                onChange={handleChange}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Enter sub ledger name"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={handleAddSubLedger}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                disabled={loading || !formData.currentSubLedger.trim()}
                            >
                                Add
                            </button>
                        </div>
                        
                        {/* Display added sub-ledgers */}
                        <div className="mt-2 space-y-2">
                            {subLedgers.map((subLedger, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                                    <span className="text-sm text-gray-700">{subLedger}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSubLedger(index)}
                                        className="text-red-600 hover:text-red-800"
                                        disabled={loading}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        {subLedgers.length === 0 && (
                            <p className="text-sm text-gray-500 mt-1">No sub-ledgers added yet</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={`w-full ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2 px-4 rounded-md transition duration-200`}
                        disabled={loading || subLedgers.length === 0}
                    >
                        {loading ? 'Processing...' : editingLedger ? 'Update Ledger' : 'Create Ledger'}
                    </button>
                </form>

                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Created Ledgers</h3>
                    {loading ? (
                        <div className="text-center py-4">Loading...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="py-2 px-4 border-b">Group Ledger Name</th>
                                        <th className="py-2 px-4 border-b">Ledger Type</th>
                                        <th className="py-2 px-4 border-b">Sub Ledgers</th>
                                        <th className="py-2 px-4 border-b">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ledgers.length > 0 ? (
                                        ledgers.map((ledger) => (
                                            <tr key={ledger._id} className="hover:bg-gray-50">
                                                <td className="py-2 px-4 border-b text-center">{ledger.groupLedgerName}</td>
                                                <td className="py-2 px-4 border-b text-center">{ledger.ledgerType}</td>
                                                <td className="py-2 px-4 border-b text-center">
                                                    {ledger.subLedgers.map(sl => sl.name).join(', ')}
                                                </td>
                                                <td className="py-2 px-4 border-b text-center">
                                                    <div className="flex justify-center space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(ledger)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                            title="Edit ledger"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(ledger._id)}
                                                            className="text-red-600 hover:text-red-800"
                                                            title="Delete ledger"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-4 text-center text-gray-500">
                                                No ledgers found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LedgerCreation;
