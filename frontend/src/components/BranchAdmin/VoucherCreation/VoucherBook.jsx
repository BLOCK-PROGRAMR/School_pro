
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:3490';

const VoucherBook = () => {
    const [voucherType, setVoucherType] = useState('');
    const [ledgerType, setLedgerType] = useState('');
    const [groupLedgers, setGroupLedgers] = useState([]);
    const [selectedLedger, setSelectedLedger] = useState('');
    const [subLedgers, setSubLedgers] = useState([]);
    const [selectedSubLedger, setSelectedSubLedger] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [bankLedgers, setBankLedgers] = useState([]);
    const [selectedBankLedger, setSelectedBankLedger] = useState('');
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
        amount: ''
    });
    const [loading, setLoading] = useState(false);
    const [availableLedgerTypes, setAvailableLedgerTypes] = useState([]);

    const generateVoucherNumber = () => {
        const prefix = voucherType === 'paid' ? 'VCB' : 'VRB';
        const currentNumber = lastVoucherNumbers[prefix] + 1;
        setLastVoucherNumbers(prev => ({
            ...prev,
            [prefix]: currentNumber
        }));
        const paddedNumber = String(currentNumber).padStart(5, '0');
        const newVoucherNumber = `${prefix}${paddedNumber}`;
        setVoucherNumber(newVoucherNumber);
        setVoucherData(prev => ({
            ...prev,
            voucherTxId: newVoucherNumber
        }));
    };

    useEffect(() => {
        if (voucherType) {
            generateVoucherNumber();
            if (voucherType === 'paid') {
                setAvailableLedgerTypes(['Expenses', 'Loans']);
            } else if (voucherType === 'received') {
                setAvailableLedgerTypes(['Income', 'Loans']);
            }
            setLedgerType('');
            setSelectedLedger('');
            setSelectedSubLedger('');
            setPaymentMethod('');
            setSelectedBankLedger('');
            setSelectedBankSubLedger('');
        }
    }, [voucherType]);

    const fetchBankLedgers = async () => {
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
                setBankLedgers(bankLedgers);
            }
        } catch (error) {
            console.error('Error fetching bank ledgers:', error);
            toast.error('Failed to fetch bank ledgers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBankLedgers();
    }, [paymentMethod]);

    useEffect(() => {
        if (selectedBankLedger) {
            const bankLedger = bankLedgers.find(l => l._id === selectedBankLedger);
            if (bankLedger) {
                setBankSubLedgers(bankLedger.subLedgers);
            }
        } else {
            setBankSubLedgers([]);
        }
        setSelectedBankSubLedger('');
    }, [selectedBankLedger, bankLedgers]);

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
                    ledger => ledger.ledgerType === ledgerType
                );
                setGroupLedgers(filteredLedgers);
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
            (paymentMethod === 'bank' && (!selectedBankLedger || !selectedBankSubLedger))) {
            toast.error('Please fill all required fields');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...voucherData,
                voucherType,
                ledgerType,
                ledgerId: selectedLedger,
                subLedgerId: selectedSubLedger,
                paymentMethod,
                bankLedgerId: paymentMethod === 'bank' ? selectedBankLedger : null,
                bankSubLedgerId: paymentMethod === 'bank' ? selectedBankSubLedger : null,
                voucherNumber
            };

            const response = await axios.post(
                `${BASE_URL}/api/vouchers/create`, // Updated endpoint
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
                // Reset form
                setVoucherType('');
                setLedgerType('');
                setSelectedLedger('');
                setSelectedSubLedger('');
                setPaymentMethod('');
                setSelectedBankLedger('');
                setSelectedBankSubLedger('');
                setVoucherData({
                    voucherTxId: '',
                    date: new Date().toISOString().split('T')[0],
                    description: '',
                    amount: ''
                });
            }
        } catch (error) {
            console.error('Error creating voucher:', error);
            toast.error(error.response?.data?.message || 'Failed to create voucher');
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
                                className={`px-4 py-2 rounded-lg ${voucherType === 'paid'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                            >
                                Paid
                            </button>
                            <button
                                type="button"
                                onClick={() => setVoucherType('received')}
                                className={`px-4 py-2 rounded-lg ${voucherType === 'received'
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
                                        value={voucherNumber}
                                        readOnly
                                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
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
                                                <>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Bank
                                                        </label>
                                                        <select
                                                            value={selectedBankLedger}
                                                            onChange={(e) => setSelectedBankLedger(e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        >
                                                            <option value="">Select Bank</option>
                                                            {bankLedgers.map((bank) => (
                                                                <option key={bank._id} value={bank._id}>
                                                                    {bank.groupLedgerName}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {selectedBankLedger && (
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
                                                                        {branch.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}
                                                </>
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
// import React, { useState, useEffect, useContext } from 'react';
// import { toast } from 'react-toastify';
// import { mycon } from '../../../store/Mycontext';
// import Allapi from '../../../common';
// import 'react-toastify/dist/ReactToastify.css';

// const VoucherBook = () => {
//     const { branchdet } = useContext(mycon);
//     const [voucherType, setVoucherType] = useState('');
//     const [ledgerType, setLedgerType] = useState('');
//     const [groupLedgers, setGroupLedgers] = useState([]);
//     const [selectedLedger, setSelectedLedger] = useState('');
//     const [subLedgers, setSubLedgers] = useState([]);
//     const [selectedSubLedger, setSelectedSubLedger] = useState('');
//     const [paymentMethod, setPaymentMethod] = useState('');
//     const [bankLedgers, setBankLedgers] = useState([]);
//     const [selectedBankLedger, setSelectedBankLedger] = useState('');
//     const [bankSubLedgers, setBankSubLedgers] = useState([]);
//     const [selectedBankSubLedger, setSelectedBankSubLedger] = useState('');
//     const [voucherNumber, setVoucherNumber] = useState('');
//     const [lastVoucherNumbers, setLastVoucherNumbers] = useState({
//         VCB: 0,
//         VRB: 0
//     });
//     const [voucherData, setVoucherData] = useState({
//         voucherTxId: '',
//         date: new Date().toISOString().split('T')[0],
//         description: '',
//         amount: ''
//     });
//     const [loading, setLoading] = useState(false);
//     const [availableLedgerTypes, setAvailableLedgerTypes] = useState([]);

//     const fetchLatestVoucherNumber = async (type) => {
//         try {
//             const response = await fetch(`${Allapi.backapi}/api/vouchers/latest/${type}`, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                     'Content-Type': 'application/json'
//                 }
//             });
//             const result = await response.json();
//             if (result.success) {
//                 return result.data.latestNumber;
//             }
//             return 0;
//         } catch (error) {
//             console.error('Error fetching latest voucher number:', error);
//             return 0;
//         }
//     };

//     const generateVoucherNumber = async () => {
//         const prefix = voucherType === 'paid' ? 'VCB' : 'VRB';
//         const latestNumber = await fetchLatestVoucherNumber(voucherType);
//         const currentNumber = latestNumber + 1;
//         setLastVoucherNumbers(prev => ({
//             ...prev,
//             [prefix]: currentNumber
//         }));
//         const paddedNumber = String(currentNumber).padStart(5, '0');
//         const newVoucherNumber = `${prefix}${paddedNumber}`;
//         setVoucherNumber(newVoucherNumber);
//         setVoucherData(prev => ({
//             ...prev,
//             voucherTxId: newVoucherNumber
//         }));
//     };

//     useEffect(() => {
//         if (voucherType) {
//             generateVoucherNumber();
//             if (voucherType === 'paid') {
//                 setAvailableLedgerTypes(['Expenses', 'Loans']);
//             } else if (voucherType === 'received') {
//                 setAvailableLedgerTypes(['Income', 'Loans']);
//             }
//             setLedgerType('');
//             setSelectedLedger('');
//             setSelectedSubLedger('');
//             setPaymentMethod('');
//             setSelectedBankLedger('');
//             setSelectedBankSubLedger('');
//         }
//     }, [voucherType]);

//     const fetchBankLedgers = async () => {
//         if (paymentMethod !== 'bank') return;

//         setLoading(true);
//         try {
//             const response = await fetch(`${Allapi.backapi}/api/ledger/all`, {
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                     'Content-Type': 'application/json'
//                 }
//             });
//             const result = await response.json();

//             if (result.success) {
//                 const bankLedgers = result.data.filter(
//                     ledger => ledger.ledgerType === 'Bank'
//                 );
//                 setBankLedgers(bankLedgers);
//             }
//         } catch (error) {
//             console.error('Error fetching bank ledgers:', error);
//             toast.error('Failed to fetch bank ledgers');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchBankLedgers();
//     }, [paymentMethod]);

//     useEffect(() => {
//         if (selectedBankLedger) {
//             const bankLedger = bankLedgers.find(l => l._id === selectedBankLedger);
//             if (bankLedger) {
//                 setBankSubLedgers(bankLedger.subLedgers);
//             }
//         } else {
//             setBankSubLedgers([]);
//         }
//         setSelectedBankSubLedger('');
//     }, [selectedBankLedger, bankLedgers]);

//     const fetchLedgers = async () => {
//         if (!ledgerType) return;

//         setLoading(true);
//         try {
//             const response = await fetch(`${Allapi.backapi}/api/ledger/all`, {
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                     'Content-Type': 'application/json'
//                 }
//             });
//             const result = await response.json();

//             if (result.success) {
//                 const filteredLedgers = result.data.filter(
//                     ledger => ledger.ledgerType === ledgerType
//                 );
//                 setGroupLedgers(filteredLedgers);
//             }
//         } catch (error) {
//             console.error('Error fetching ledgers:', error);
//             toast.error('Failed to fetch ledgers');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchLedgers();
//     }, [ledgerType]);

//     useEffect(() => {
//         if (selectedLedger) {
//             const ledger = groupLedgers.find(l => l._id === selectedLedger);
//             if (ledger) {
//                 setSubLedgers(ledger.subLedgers);
//             }
//         } else {
//             setSubLedgers([]);
//         }
//         setSelectedSubLedger('');
//     }, [selectedLedger, groupLedgers]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!voucherType || !ledgerType || !selectedLedger || !selectedSubLedger ||
//             !voucherData.description || !voucherData.amount || !paymentMethod ||
//             (paymentMethod === 'bank' && (!selectedBankLedger || !selectedBankSubLedger))) {
//             toast.error('Please fill all required fields');
//             return;
//         }

//         setLoading(true);
//         try {
//             const payload = {
//                 ...voucherData,
//                 voucherType,
//                 ledgerType,
//                 ledgerId: selectedLedger,
//                 subLedgerId: selectedSubLedger,
//                 paymentMethod,
//                 bankLedgerId: paymentMethod === 'bank' ? selectedBankLedger : null,
//                 bankSubLedgerId: paymentMethod === 'bank' ? selectedBankSubLedger : null,
//                 voucherNumber
//             };

//             const response = await fetch(`${Allapi.backapi}/api/vouchers/create`, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(payload)
//             });

//             const result = await response.json();

//             if (result.success) {
//                 toast.success('Voucher created successfully');
//                 // Reset form
//                 setVoucherType('');
//                 setLedgerType('');
//                 setSelectedLedger('');
//                 setSelectedSubLedger('');
//                 setPaymentMethod('');
//                 setSelectedBankLedger('');
//                 setSelectedBankSubLedger('');
//                 setVoucherData({
//                     voucherTxId: '',
//                     date: new Date().toISOString().split('T')[0],
//                     description: '',
//                     amount: ''
//                 });
//             } else {
//                 toast.error(result.message || 'Failed to create voucher');
//             }
//         } catch (error) {
//             console.error('Error creating voucher:', error);
//             toast.error('Failed to create voucher');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <h2 className="text-2xl font-bold mb-6">Voucher Book</h2>
//             <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Voucher Type</label>
//                         <select
//                             value={voucherType}
//                             onChange={(e) => setVoucherType(e.target.value)}
//                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                         >
//                             <option value="">Select Type</option>
//                             <option value="paid">Paid</option>
//                             <option value="received">Received</option>
//                         </select>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Voucher Number</label>
//                         <input
//                             type="text"
//                             value={voucherNumber}
//                             readOnly
//                             className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Date</label>
//                         <input
//                             type="date"
//                             value={voucherData.date}
//                             onChange={(e) => setVoucherData(prev => ({ ...prev, date: e.target.value }))}
//                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Ledger Type</label>
//                         <select
//                             value={ledgerType}
//                             onChange={(e) => setLedgerType(e.target.value)}
//                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                         >
//                             <option value="">Select Ledger Type</option>
//                             {availableLedgerTypes.map((type) => (
//                                 <option key={type} value={type}>{type}</option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Ledger</label>
//                         <select
//                             value={selectedLedger}
//                             onChange={(e) => setSelectedLedger(e.target.value)}
//                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                         >
//                             <option value="">Select Ledger</option>
//                             {groupLedgers.map((ledger) => (
//                                 <option key={ledger._id} value={ledger._id}>{ledger.name}</option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Sub Ledger</label>
//                         <select
//                             value={selectedSubLedger}
//                             onChange={(e) => setSelectedSubLedger(e.target.value)}
//                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                         >
//                             <option value="">Select Sub Ledger</option>
//                             {subLedgers.map((subLedger) => (
//                                 <option key={subLedger._id} value={subLedger._id}>{subLedger.name}</option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Payment Method</label>
//                         <select
//                             value={paymentMethod}
//                             onChange={(e) => setPaymentMethod(e.target.value)}
//                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                         >
//                             <option value="">Select Payment Method</option>
//                             <option value="cash">Cash</option>
//                             <option value="bank">Bank</option>
//                         </select>
//                     </div>

//                     {paymentMethod === 'bank' && (
//                         <>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Bank Ledger</label>
//                                 <select
//                                     value={selectedBankLedger}
//                                     onChange={(e) => setSelectedBankLedger(e.target.value)}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                                 >
//                                     <option value="">Select Bank Ledger</option>
//                                     {bankLedgers.map((ledger) => (
//                                         <option key={ledger._id} value={ledger._id}>{ledger.name}</option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Bank Sub Ledger</label>
//                                 <select
//                                     value={selectedBankSubLedger}
//                                     onChange={(e) => setSelectedBankSubLedger(e.target.value)}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                                 >
//                                     <option value="">Select Bank Sub Ledger</option>
//                                     {bankSubLedgers.map((subLedger) => (
//                                         <option key={subLedger._id} value={subLedger._id}>{subLedger.name}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </>
//                     )}

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Amount</label>
//                         <input
//                             type="number"
//                             value={voucherData.amount}
//                             onChange={(e) => setVoucherData(prev => ({ ...prev, amount: e.target.value }))}
//                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                         />
//                     </div>

//                     <div className="col-span-full">
//                         <label className="block text-sm font-medium text-gray-700">Description</label>
//                         <textarea
//                             value={voucherData.description}
//                             onChange={(e) => setVoucherData(prev => ({ ...prev, description: e.target.value }))}
//                             rows={3}
//                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                         />
//                     </div>
//                 </div>

//                 <div className="flex justify-end">
//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                     >
//                         {loading ? 'Creating...' : 'Create Voucher'}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default VoucherBook;