const CashBook = require('../models/CashBook');
const BankBook = require('../models/BankBook');

// Create cash book entry
const createCashBookEntry = async (voucherData) => {
    try {
        console.log('Creating cash book entry with data:', voucherData); // Debug log

        const cashBookEntry = new CashBook({
            date: voucherData.date,
            rcNo: voucherData.voucherTxId,
            ledgerType: voucherData.ledgerType,
            amount: voucherData.amount,
            transactionType: voucherData.voucherType, // Use voucherType directly as transactionType
            voucherRef: voucherData._id,
            description: voucherData.description
        });

        await cashBookEntry.save();
        console.log('Cash book entry created successfully'); // Debug log
        return cashBookEntry;
    } catch (error) {
        console.error('Error creating cash book entry:', error);
        throw error;
    }
};

// Create bank book entry
const createBankBookEntry = async (voucherData) => {
    try {
        console.log('Creating bank book entry with data:', voucherData); // Debug log

        const bankBookEntry = new BankBook({
            date: voucherData.date,
            rcNo: voucherData.voucherTxId,
            ledgerType: voucherData.ledgerType,
            amount: voucherData.amount,
            transactionType: voucherData.voucherType, // Use voucherType directly as transactionType
            voucherRef: voucherData._id,
            description: voucherData.description
        });

        await bankBookEntry.save();
        console.log('Bank book entry created successfully'); // Debug log
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
            });

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
                select: 'voucherTxId voucherType ledgerType amount description bankLedgerId bankSubLedgerId'
            });

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
