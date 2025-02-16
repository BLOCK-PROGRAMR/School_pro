// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Bank = () => {
//     const [formData, setFormData] = useState({
//         amount: '',
//         branch: '',
//         type: '',
//         description: ''
//     });
//     const [branches, setBranches] = useState([]);
//     const [loading, setLoading] = useState(false);

//     // Fetch branches from backend
//     useEffect(() => {
//         const fetchBranches = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get('http://localhost:3490/api/ledger/all', {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem('token')}`
//                     }
//                 });

//                 if (response.data.success) {
//                     const bankLedgers = response.data.data.filter(
//                         ledger => ledger.ledgerType === 'Bank'
//                     );
//                     const allBranches = bankLedgers.reduce((acc, bank) => {
//                         return [...acc, ...bank.subLedgers.map(branch => ({
//                             ...branch,
//                             bankId: bank._id,
//                             bankName: bank.groupLedgerName
//                         }))];
//                     }, []);
//                     setBranches(allBranches);
//                 }
//             } catch (error) {
//                 console.error('Error fetching branches:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchBranches();
//     }, []);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log('Form submitted:', formData);
//         // Add your submit logic here
//     };

//     return (
//         <div className="p-6 bg-gray-100 min-h-screen">
//             <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
//                 <h1 className="text-2xl font-bold text-gray-800 mb-6">Bank Transaction</h1>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {/* Amount Field */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Amount
//                         </label>
//                         <input
//                             type="number"
//                             name="amount"
//                             value={formData.amount}
//                             onChange={handleChange}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                             min="0"
//                             step="0.01"
//                             required
//                         />
//                     </div>

//                     {/* Branch Selection */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Branch
//                         </label>
//                         <select
//                             name="branch"
//                             value={formData.branch}
//                             onChange={handleChange}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                             required
//                         >
//                             <option value="">Select Branch</option>
//                             {branches.map((branch) => (
//                                 <option key={branch._id} value={branch._id}>
//                                     {branch.bankName} - {branch.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     {/* Transaction Type */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Type
//                         </label>
//                         <select
//                             name="type"
//                             value={formData.type}
//                             onChange={handleChange}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                             required
//                         >
//                             <option value="">Select Type</option>
//                             <option value="deposit">Deposit</option>
//                             <option value="received">Received</option>
//                         </select>
//                     </div>

//                     {/* Description Field */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Description
//                         </label>
//                         <textarea
//                             name="description"
//                             value={formData.description}
//                             onChange={handleChange}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                             rows="3"
//                             required
//                         />
//                     </div>

//                     {/* Submit Button */}
//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className={`w-full py-2 px-4 rounded-md text-white ${loading
//                                 ? 'bg-blue-400 cursor-not-allowed'
//                                 : 'bg-blue-600 hover:bg-blue-700'
//                             }`}
//                     >
//                         {loading ? 'Processing...' : 'Submit'}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Bank;


import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Bank = () => {
    const [formData, setFormData] = useState({
        amount: '',
        branch: '',
        type: '',
        description: ''
    });
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch branches from backend
    useEffect(() => {
        const fetchBranches = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:3490/api/ledger/all', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
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
                    setBranches(allBranches);
                }
            } catch (error) {
                console.error('Error fetching branches:', error);
                alert('Failed to fetch branches');
            } finally {
                setLoading(false);
            }
        };

        fetchBranches();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const selectedBranch = branches.find(b => b._id === formData.branch);
            if (!selectedBranch) {
                throw new Error('Selected branch not found');
            }

            const payload = {
                amount: parseFloat(formData.amount),
                description: formData.description.trim(),
                transactionType: formData.type,
                bankLedgerId: selectedBranch.bankId,
                bankSubLedgerId: selectedBranch._id,
                bankBranch: {
                    bankId: selectedBranch.bankId,
                    bankName: selectedBranch.bankName,
                    branchId: selectedBranch._id,
                    branchName: selectedBranch.name
                }
            };

            const response = await axios.post(
                'http://localhost:3490/api/bank/transaction',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                alert('Transaction created successfully');
                setFormData({
                    amount: '',
                    branch: '',
                    type: '',
                    description: ''
                });
            }
        } catch (error) {
            console.error('Error creating transaction:', error);
            alert(error.response?.data?.message || 'Failed to create transaction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Bank Transaction</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Amount Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount
                        </label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    {/* Branch Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Branch
                        </label>
                        <select
                            name="branch"
                            value={formData.branch}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select Branch</option>
                            {branches.map((branch) => (
                                <option key={branch._id} value={branch._id}>
                                    {branch.bankName} - {branch.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Transaction Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                        </label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select Type</option>
                            <option value="deposit">Deposit</option>
                            <option value="received">Received</option>
                        </select>
                    </div>

                    {/* Description Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            rows="3"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 rounded-md text-white ${loading
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {loading ? 'Processing...' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Bank;