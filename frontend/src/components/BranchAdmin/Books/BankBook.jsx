


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:3490';

const BankBook = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalReceived, setTotalReceived] = useState(0);
    const [totalPaid, setTotalPaid] = useState(0);
    const [selectedType, setSelectedType] = useState('all');
    const [filters, setFilters] = useState({
        ledgerType: '',
        dateFrom: '',
        dateTo: ''
    });

    useEffect(() => {
        fetchBankBookEntries();
    }, []);

    const fetchBankBookEntries = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/api/books/bank`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                const processedEntries = response.data.data.map(entry => ({
                    ...entry,
                    groupLedger: entry.groupLedger || { name: 'N/A' },
                    amount: Number(entry.amount) || 0,
                    voucherTxId: entry.voucherRef?.voucherTxId || 'N/A',
                    bankName: entry.voucherRef?.bankBranch?.bankName || entry.bankName || 'N/A',
                    branchName: entry.voucherRef?.bankBranch?.branchName || entry.branchName || 'N/A'
                }));
                setEntries(processedEntries);
                calculateTotals(processedEntries);
            }
        } catch (error) {
            console.error('Error fetching bank book entries:', error);
            toast.error('Failed to fetch bank book entries');
        } finally {
            setLoading(false);
        }
    };

    const calculateTotals = (entries) => {
        const received = entries
            .filter(entry => entry.transactionType === 'received')
            .reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);

        const paid = entries
            .filter(entry => entry.transactionType === 'paid')
            .reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);

        setTotalReceived(received);
        setTotalPaid(paid);
    };

    const filteredEntries = entries.filter(entry => {
        // Filter by transaction type
        if (selectedType !== 'all' && entry.transactionType !== selectedType) {
            return false;
        }

        // Filter by ledgerType
        if (filters.ledgerType && !entry.ledgerType?.toString().toLowerCase().includes(filters.ledgerType.toLowerCase())) {
            return false;
        }

        // Filter by date range
        const entryDate = new Date(entry.date).toISOString().split('T')[0];
        if (filters.dateFrom && entryDate < filters.dateFrom) {
            return false;
        }
        if (filters.dateTo && entryDate > filters.dateTo) {
            return false;
        }

        return true;
    });

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Bank Book</h2>

            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <>
                    <div className="mb-4 space-y-4">
                        {/* Transaction Type Filters */}
                        <div className="flex justify-between items-center">
                            <div className="flex space-x-4">
                                <button
                                    className={`px-4 py-2 rounded ${selectedType === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200'
                                        }`}
                                    onClick={() => setSelectedType('all')}
                                >
                                    All Transactions
                                </button>
                                <button
                                    className={`px-4 py-2 rounded ${selectedType === 'received'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-200'
                                        }`}
                                    onClick={() => setSelectedType('received')}
                                >
                                    Received
                                </button>
                                <button
                                    className={`px-4 py-2 rounded ${selectedType === 'paid'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-gray-200'
                                        }`}
                                    onClick={() => setSelectedType('paid')}
                                >
                                    Paid
                                </button>
                            </div>
                            <div className="flex space-x-6">
                                <div className="text-green-600 font-semibold">
                                    Total Received: ₹{totalReceived.toFixed(2)}
                                </div>
                                <div className="text-red-600 font-semibold">
                                    Total Paid: ₹{totalPaid.toFixed(2)}
                                </div>
                                <div className="text-blue-600 font-semibold">
                                    Balance: ₹{(totalReceived - totalPaid).toFixed(2)}
                                </div>
                            </div>
                        </div>

                        {/* Search and Date Filters */}
                        <div className="flex space-x-4 items-center bg-gray-50 p-4 rounded-lg">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Search by Ledger Type"
                                    className="w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={filters.ledgerType}
                                    onChange={(e) => handleFilterChange('ledgerType', e.target.value)}
                                />
                            </div>
                            <div className="flex space-x-4 items-center">
                                <div className="flex flex-col">
                                    <label className="text-sm text-gray-600 mb-1">From Date</label>
                                    <input
                                        type="date"
                                        className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={filters.dateFrom}
                                        onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm text-gray-600 mb-1">To Date</label>
                                    <input
                                        type="date"
                                        className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={filters.dateTo}
                                        onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">RC No</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Ledger Type</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Group Ledger</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Bank Details</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Description</th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Amount (₹)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredEntries.map((entry) => (
                                    <tr key={entry._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {new Date(entry.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {entry.rcNo || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {entry.ledgerType || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {entry.groupLedger?.name || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {entry.bankName} - {entry.branchName}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {entry.description || 'N/A'}
                                        </td>
                                        <td className={`px-4 py-3 text-sm text-right ${entry.transactionType === 'received'
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                            }`}>
                                            {Number(entry.amount).toFixed(2)}
                                            <span className="ml-1 text-xs">
                                                {entry.transactionType === 'received' ? '(CR)' : '(DR)'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredEntries.length === 0 && (
                            <div className="text-center py-4 text-gray-500">
                                No transactions found
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default BankBook;