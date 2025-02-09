const CashBook = require('../models/CashBook');
const BankBook = require('../models/BankBook');

// Create cash book entry
const createCashBookEntry = async (voucherData) => {
    try {
        // Check if entry with this rcNo already exists
        const existingEntry = await CashBook.findOne({ rcNo: voucherData.voucherTxId });
        if (existingEntry) {
            throw new Error('Cash book entry with this reference number already exists');
        }

        const cashBookEntry = new CashBook({
            date: voucherData.date,
            rcNo: voucherData.voucherTxId ? voucherData.voucherTxId : voucherData.rcNo,

            ledgerType: voucherData.ledgerType,
            groupLedger: {
                ...(voucherData.ledgerId && { id: voucherData.ledgerId }), // Only add if present
                name: voucherData.groupLedgerInfo?.groupLedgerName || voucherData.groupLedger?.name,
                type: voucherData.groupLedgerInfo?.ledgerType || voucherData.groupLedger?.type,
            },
            subLedger: {
                ...(voucherData.subLedgerId && { id: voucherData.subLedgerId }), // Only add if present
                name: voucherData.subLedgerInfo?.name || voucherData.subLedger?.name
            },
            amount: voucherData.amount,
            transactionType: voucherData.voucherType || voucherData.transactionType,
            ...(voucherData._id && { voucherRef: voucherData._id }), // Only add if present
            description: voucherData.description
        });


        await cashBookEntry.save();
        console.log('Cash book entry created:', cashBookEntry);
        return cashBookEntry;
    } catch (error) {
        console.error('Error creating cash book entry:', error);
        throw error;
    }
};

// Create bank book entry
const createBankBookEntry = async (voucherData) => {
    try {
        console.log(voucherData)

        // Check if entry with this rcNo already exists
        const existingEntry = await BankBook.findOne({ rcNo: voucherData.voucherTxId });
        if (existingEntry) {
            throw new Error('Bank book entry with this reference number already exists');
        }
        const bankBookEntry = new BankBook({
            date: voucherData.date,
            rcNo: voucherData.voucherTxId ? voucherData.voucherTxId : voucherData.rcNo,

            ledgerType: voucherData.ledgerType,
            // Add group ledger info
            groupLedger: {
                ...(voucherData.ledgerId && { id: voucherData.ledgerId }), // Only add if present
                name: voucherData.groupLedgerInfo?.groupLedgerName || voucherData.groupLedger?.name,
                type: voucherData.groupLedgerInfo?.ledgerType || voucherData.groupLedger?.type
            },
            // Add sub-ledger info
            subLedger: {
                ...(voucherData.subLedgerId && { id: voucherData.subLedgerId }), // Only add if present
                name: voucherData.subLedgerInfo?.name || voucherData.subLedger?.name
            },
            bankName: voucherData.bankBranch?.bankName || voucherData.bankName,
            branchName: voucherData.bankBranch?.branchName || voucherData.branchName,
            amount: voucherData.amount,
            transactionType: voucherData.voucherType || voucherData.transactionType,
            ...(voucherData._id && { voucherRef: voucherData._id }), // Only add if present
            description: voucherData.description
        });


        await bankBookEntry.save();
        console.log('Bank book entry created:', bankBookEntry);
        return bankBookEntry;
    } catch (error) {
        console.error('Error creating bank book entry:', error);
        throw error;
    }
};

// Get cash book entries
const getCashBookEntries = async (req, res) => {
    try {
        const entries = await CashBook.find()
            .sort({ date: -1 })
            .populate({
                path: 'voucherRef',
                select: 'voucherTxId voucherType ledgerType amount description'
            })
            .populate('groupLedger.id', 'groupLedgerName ledgerType');

        return res.status(200).json({
            success: true,
            data: entries
        });
    } catch (error) {
        console.error('Error getting cash book entries:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

// Get bank book entries
const getBankBookEntries = async (req, res) => {
    try {
        const entries = await BankBook.find()
            .sort({ date: -1 })
            .populate({
                path: 'voucherRef',
                select: 'voucherTxId voucherType ledgerType amount description bankBranch'
            })
            .populate('groupLedger.id', 'groupLedgerName ledgerType');

        return res.status(200).json({
            success: true,
            data: entries
        });
    } catch (error) {
        console.error('Error getting bank book entries:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

module.exports = {
    createCashBookEntry,
    createBankBookEntry,
    getCashBookEntries,
    getBankBookEntries
};
