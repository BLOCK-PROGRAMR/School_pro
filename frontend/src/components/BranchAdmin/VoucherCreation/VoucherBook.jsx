import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:3490';

const LEDGER_TYPES = {
    paid: ['Expenses', 'Loans'],
    received: ['Income', 'Loans']
};

const VoucherBook = () => {
    const [voucherType, setVoucherType] = useState('');
    const [ledgerType, setLedgerType] = useState('');
    const [groupLedgers, setGroupLedgers] = useState([]);
    const [selectedLedger, setSelectedLedger] = useState('');
    const [subLedgers, setSubLedgers] = useState([]);
    const [selectedSubLedger, setSelectedSubLedger] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [bankSubLedgers, setBankSubLedgers] = useState([]);
    const [selectedBankSubLedger, setSelectedBankSubLedger] = useState('');
    const [voucherNumber, setVoucherNumber] = useState('');
    const [lastVoucherNumbers, setLastVoucherNumbers] = useState({
        VCB: 0,
        VRB: 0
    });
    const [voucherData, setVoucherData] = useState({
        voucherTxId: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: '',
        voucherNumber: 0
    });
    const [loading, setLoading] = useState(false);
    const [availableLedgerTypes, setAvailableLedgerTypes] = useState([]);

    const fetchLatestVoucherNumber = async () => {
        if (!voucherType) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/api/vouchers/latest/${voucherType}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                const voucherNumber = response.data.data.voucherNumber;
                const prefix = voucherType === 'paid' ? 'VCB' : 'VRB';
                const voucherTxId = `${prefix}${String(voucherNumber).padStart(5, '0')}`;

                setVoucherData(prev => ({
                    ...prev,
                    voucherNumber,
                    voucherTxId
                }));
            }
        } catch (error) {
            console.error('Error fetching latest voucher number:', error);
            toast.error(error.response?.data?.message || 'Failed to get voucher number');
        }
    };

    useEffect(() => {
        if (voucherType) {
            setAvailableLedgerTypes(LEDGER_TYPES[voucherType] || []);
            fetchLatestVoucherNumber();
            setLedgerType('');
            setSelectedLedger('');
            setSelectedSubLedger('');
            setPaymentMethod('');
            setSelectedBankSubLedger('');
        } else {
            setVoucherData(prev => ({
                ...prev,
                voucherNumber: 0,
                voucherTxId: ''
            }));
        }
    }, [voucherType]);

    const fetchBankBranches = async () => {
        if (paymentMethod !== 'bank') return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/api/ledger/all`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                const bankLedgers = response.data.data.filter(
                    ledger => ledger.ledgerType === 'Bank'
                );
                const allBranches = bankLedgers.reduce((acc, bank) => {
                    return [...acc, ...bank.subLedgers.map(branch => ({
                        ...branch,
                        bankId: bank._id,
                        bankName: bank.groupLedgerName
                    }))];
                }, []);
                setBankSubLedgers(allBranches);
            }
        } catch (error) {
            console.error('Error fetching bank branches:', error);
            toast.error('Failed to fetch bank branches');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBankBranches();
    }, [paymentMethod]);

    const fetchLedgers = async () => {
        if (!ledgerType) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/api/ledger/all`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                const filteredLedgers = response.data.data.filter(
                    ledger => ledger.ledgerType === ledgerType && 
                             LEDGER_TYPES[voucherType].includes(ledger.ledgerType)
                );
                setGroupLedgers(filteredLedgers);
                setSelectedLedger('');
                setSelectedSubLedger('');
            }
        } catch (error) {
            console.error('Error fetching ledgers:', error);
            toast.error('Failed to fetch ledgers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLedgers();
    }, [ledgerType]);

    useEffect(() => {
        if (selectedLedger) {
            const ledger = groupLedgers.find(l => l._id === selectedLedger);
            if (ledger) {
                setSubLedgers(ledger.subLedgers);
            }
        } else {
            setSubLedgers([]);
        }
        setSelectedSubLedger('');
    }, [selectedLedger, groupLedgers]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!voucherType || !ledgerType || !selectedLedger || !selectedSubLedger ||
            !voucherData.description || !voucherData.amount || !paymentMethod ||
            !voucherData.date) {
            toast.error('Please fill all required fields');
            return;
        }

        if (paymentMethod === 'bank' && !selectedBankSubLedger) {
            toast.error('Please select a bank branch');
            return;
        }

        const amount = parseFloat(voucherData.amount);
        if (isNaN(amount) || amount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        if (!voucherData.voucherNumber || !voucherData.voucherTxId) {
            toast.error('Invalid voucher number or transaction ID');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const selectedBranch = bankSubLedgers.find(b => b._id === selectedBankSubLedger);
            
            // Get the selected ledger and sub-ledger details
            const selectedGroupLedger = groupLedgers.find(l => l._id === selectedLedger);
            const selectedSubLedgerData = subLedgers.find(sl => sl._id === selectedSubLedger);

            if (!selectedGroupLedger || !selectedSubLedgerData) {
                toast.error('Selected ledger information not found');
                return;
            }

            const payload = {
                voucherType,
                ledgerType,
                ledgerId: selectedLedger,
                subLedgerId: selectedSubLedger,
                // Add group ledger and sub-ledger info for the books
                groupLedgerInfo: {
                    groupLedgerName: selectedGroupLedger.groupLedgerName,
                    ledgerType: selectedGroupLedger.ledgerType
                },
                subLedgerInfo: {
                    name: selectedSubLedgerData.name
                },
                date: new Date(voucherData.date).toISOString(),
                description: voucherData.description.trim(),
                amount: parseFloat(voucherData.amount),
                paymentMethod,
                bankLedgerId: paymentMethod === 'bank' && selectedBranch ? selectedBranch.bankId : undefined,
                bankSubLedgerId: paymentMethod === 'bank' && selectedBranch ? selectedBranch._id : undefined,
                // Add bank info for bank book if payment method is bank
                bankBranch: paymentMethod === 'bank' && selectedBranch ? {
                    bankId: selectedBranch.bankId,
                    bankName: selectedBranch.bankName,
                    branchId: selectedBranch._id,
                    branchName: selectedBranch.name
                } : undefined,
                voucherNumber: parseInt(voucherData.voucherNumber),
                voucherTxId: voucherData.voucherTxId
            };

            console.log('Submitting payload:', payload); // Debug log

            const response = await axios.post(
                `${BASE_URL}/api/vouchers/create`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                toast.success('Voucher created successfully');
                setVoucherType('');
                setLedgerType('');
                setSelectedLedger('');
                setSelectedSubLedger('');
                setPaymentMethod('');
                setSelectedBankSubLedger('');
                setVoucherData({
                    voucherTxId: '',
                    date: new Date().toISOString().split('T')[0],
                    description: '',
                    amount: '',
                    voucherNumber: 0
                });
                await fetchLatestVoucherNumber();
            }
        } catch (error) {
            console.error('Error creating voucher:', error);
            const errorMessage = error.response?.data?.message || 'Failed to create voucher';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Voucher Receipt Book</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Voucher Type
                        </label>
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => setVoucherType('paid')}
                                className={`px-4 py-2 text-yellow-800 font-bold rounded-lg ${voucherType === 'paid'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                            >
                                Paid
                            </button>
                            <button
                                type="button"
                                onClick={() => setVoucherType('received')}
                                className={`px-4 py-2 text-yellow-800 font-bold rounded-lg ${voucherType === 'received'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                            >
                                Received
                            </button>
                        </div>
                    </div>

                    {voucherType && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ledger Type
                                </label>
                                <select
                                    value={ledgerType}
                                    onChange={(e) => setLedgerType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    disabled={!voucherType}
                                >
                                    <option value="">Select Ledger Type</option>
                                    {availableLedgerTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Voucher Number
                                    </label>
                                    <input
                                        type="text"
                                        value={voucherData.voucherTxId}
                                        readOnly
                                        className="w-full px-3 py-2 bg-gray-900 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={voucherData.date}
                                        onChange={(e) =>
                                            setVoucherData({ ...voucherData, date: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {ledgerType && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Group Ledger
                                        </label>
                                        <select
                                            value={selectedLedger}
                                            onChange={(e) => setSelectedLedger(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option value="">Select Group Ledger</option>
                                            {groupLedgers.map((ledger) => (
                                                <option key={ledger._id} value={ledger._id}>
                                                    {ledger.groupLedgerName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedLedger && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Sub Ledger
                                            </label>
                                            <select
                                                value={selectedSubLedger}
                                                onChange={(e) => setSelectedSubLedger(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            >
                                                <option value="">Select Sub Ledger</option>
                                                {subLedgers.map((subLedger) => (
                                                    <option key={subLedger._id} value={subLedger._id}>
                                                        {subLedger.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </>
                            )}

                            {selectedSubLedger && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            value={voucherData.description}
                                            onChange={(e) =>
                                                setVoucherData({ ...voucherData, description: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            rows="3"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Amount
                                        </label>
                                        <input
                                            type="number"
                                            value={voucherData.amount}
                                            onChange={(e) =>
                                                setVoucherData({ ...voucherData, amount: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>

                                    {voucherData.amount && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Payment Method
                                                </label>
                                                <select
                                                    value={paymentMethod}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                >
                                                    <option value="">Select Payment Method</option>
                                                    <option value="cash">Cash</option>
                                                    <option value="bank">Bank</option>
                                                </select>
                                            </div>

                                            {paymentMethod === 'bank' && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Bank Branch
                                                    </label>
                                                    <select
                                                        value={selectedBankSubLedger}
                                                        onChange={(e) => setSelectedBankSubLedger(e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    >
                                                        <option value="">Select Branch</option>
                                                        {bankSubLedgers.map((branch) => (
                                                            <option key={branch._id} value={branch._id}>
                                                                {branch.bankName} - {branch.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {((paymentMethod === 'cash') ||
                                        (paymentMethod === 'bank' && selectedBankSubLedger)) && (
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className={`w-full py-2 px-4 rounded-md text-white ${loading
                                                    ? 'bg-blue-400 cursor-not-allowed'
                                                    : 'bg-blue-600 hover:bg-blue-700'
                                                    }`}
                                            >
                                                {loading ? 'Creating Voucher...' : 'Create Voucher'}
                                            </button>
                                        )}
                                </>
                            )}
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default VoucherBook;