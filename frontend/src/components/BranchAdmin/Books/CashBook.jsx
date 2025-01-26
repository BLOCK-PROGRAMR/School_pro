import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:3490';

const CashBook = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalReceived, setTotalReceived] = useState(0);
    const [totalPaid, setTotalPaid] = useState(0);

    useEffect(() => {
        fetchCashBookEntries();
    }, []);

    const fetchCashBookEntries = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/api/books/cash`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setEntries(response.data.data);
                calculateTotals(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching cash book entries:', error);
            toast.error('Failed to fetch cash book entries');
        } finally {
            setLoading(false);
        }
    };

    const calculateTotals = (entries) => {
        const received = entries
            .filter(entry => entry.transactionType === 'received')
            .reduce((sum, entry) => sum + entry.amount, 0);
        
        const paid = entries
            .filter(entry => entry.transactionType === 'paid')
            .reduce((sum, entry) => sum + entry.amount, 0);

        setTotalReceived(received);
        setTotalPaid(paid);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Cash Book</h2>
            
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <div className="mb-4 flex justify-between">
                        <div className="text-green-600">
                            Total Received: ₹{totalReceived.toFixed(2)}
                        </div>
                        <div className="text-red-600">
                            Total Paid: ₹{totalPaid.toFixed(2)}
                        </div>
                        <div className="text-blue-600">
                            Balance: ₹{(totalReceived - totalPaid).toFixed(2)}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2">Date</th>
                                    <th className="px-4 py-2">RC No</th>
                                    <th className="px-4 py-2">Ledger Type</th>
                                    <th className="px-4 py-2">Description</th>
                                    <th className="px-4 py-2">Received (₹)</th>
                                    <th className="px-4 py-2">Paid (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.map((entry) => (
                                    <tr key={entry._id} className="border-b">
                                        <td className="px-4 py-2">
                                            {new Date(entry.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-2">{entry.rcNo}</td>
                                        <td className="px-4 py-2">{entry.ledgerType}</td>
                                        <td className="px-4 py-2">{entry.description}</td>
                                        <td className="px-4 py-2 text-right">
                                            {entry.transactionType === 'received' ? 
                                                entry.amount.toFixed(2) : '-'}
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            {entry.transactionType === 'paid' ? 
                                                entry.amount.toFixed(2) : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default CashBook;
