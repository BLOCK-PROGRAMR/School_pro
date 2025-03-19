
const BankTransaction = require('../models/Bank');
const { createCashBookEntry, createBankBookEntry } = require('./BookController');

// Create a new bank transaction
const createTransaction = async (req, res) => {
    try {
        const {
            amount,
            description,
            transactionType,
            bankLedgerId,
            bankSubLedgerId,
            bankBranch,
            branchId
        } = req.body;

        // Validate required fields
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Valid amount is required'
            });
        }

        if (!description) {
            return res.status(400).json({
                success: false,
                message: 'Description is required'
            });
        }

        if (!transactionType || !['deposit', 'received'].includes(transactionType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid transaction type'
            });
        }

        if (!bankLedgerId || !bankSubLedgerId) {
            return res.status(400).json({
                success: false,
                message: 'Bank ledger and sub-ledger are required'
            });
        }

        if (!bankBranch || !bankBranch.bankId || !bankBranch.bankName ||
            !bankBranch.branchId || !bankBranch.branchName) {
            return res.status(400).json({
                success: false,
                message: 'Complete bank branch details are required'
            });
        }

        // Create new transaction
        const transaction = new BankTransaction({
            amount: parseFloat(amount),
            description,
            transactionType,
            bankLedgerId,
            bankSubLedgerId,
            bankBranch,
            branchId
        });

        await transaction.save();

        // Generate a unique reference number for the transaction
        const date = new Date();
        const refNumber = `BT${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(transaction._id).slice(-5)}`;

        if (transactionType === 'deposit') {
            // For deposit: Cash is paid (debit) and Bank receives (credit)
            const cashBookData = {
                date,
                rcNo: refNumber,
                ledgerType: 'Bank',
                groupLedger: {
                    name: 'Bank Transaction',
                    type: 'Bank'
                },
                subLedger: {
                    name: `${bankBranch.bankName} - ${bankBranch.branchName}`
                },
                amount: parseFloat(amount),
                transactionType: 'paid',
                description: description,
                voucherRef: transaction._id,
                branchId
            };

            const bankBookData = {
                date,
                rcNo: refNumber,
                ledgerType: 'Bank',
                groupLedger: {
                    name: 'Bank Transaction ',
                    type: 'Bank'
                },
                subLedger: {
                    name: 'Cash Deposit'
                },
                bankName: bankBranch.bankName,
                branchName: bankBranch.branchName,
                amount: parseFloat(amount),
                transactionType: 'received',
                description: description,
                voucherRef: transaction._id,
                branchId
            };

            await Promise.all([
                createCashBookEntry(cashBookData),
                createBankBookEntry(bankBookData)
            ]);
        } else if (transactionType === 'received') {
            // For withdrawal: Bank pays (debit) and Cash receives (credit)
            const bankBookData = {
                date,
                rcNo: refNumber,
                ledgerType: 'Bank',
                groupLedger: {
                    name: 'Bank Transaction',
                    type: 'Bank'
                },
                subLedger: {
                    name: 'Cash Withdrawal'
                },
                bankName: bankBranch.bankName,
                branchName: bankBranch.branchName,
                amount: parseFloat(amount),
                transactionType: 'paid',
                description: description,
                voucherRef: transaction._id,
                branchId
            };

            const cashBookData = {
                date,
                rcNo: refNumber,
                ledgerType: 'Bank',
                groupLedger: {
                    name: 'Bank Transaction',
                    type: 'Bank'
                },
                subLedger: {
                    name: `${bankBranch.bankName} - ${bankBranch.branchName}`
                },
                amount: parseFloat(amount),
                transactionType: 'received',
                description: description,
                voucherRef: transaction._id,
                branchId
            };

            await Promise.all([
                createBankBookEntry(bankBookData),
                createCashBookEntry(cashBookData)
            ]);
        }

        return res.status(201).json({
            success: true,
            message: 'Transaction created successfully',
            data: transaction
        });
    } catch (error) {
        console.error('Error creating transaction:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

// Get all transactions
const getTransactions = async (req, res) => {
    try {
        const transactions = await BankTransaction.find()
            .sort({ createdAt: -1 })
            .populate('bankLedgerId', 'groupLedgerName');

        res.status(200).json({
            success: true,
            data: transactions
        });
    } catch (error) {
        console.error('Error in getTransactions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching transactions',
            error: error.message
        });
    }
};

module.exports = {
    createTransaction,
    getTransactions
};