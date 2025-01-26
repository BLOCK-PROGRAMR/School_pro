const Voucher = require('../models/Voucher');
const { createCashBookEntry, createBankBookEntry } = require('./BookController');

// Create a new voucher
const createVoucher = async (req, res) => {
    try {
        const {
            voucherType,
            ledgerType,
            ledgerId,
            subLedgerId,
            date,
            description,
            amount,
            paymentMethod,
            bankLedgerId,
            bankSubLedgerId,
            voucherNumber,
            voucherTxId
        } = req.body;

        console.log('Received voucher data:', req.body); // Debug log

        // Validate required fields
        if (!voucherType || !['paid', 'received'].includes(voucherType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid voucher type'
            });
        }

        if (!ledgerType || !['Expenses', 'Income', 'Loans'].includes(ledgerType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ledger type'
            });
        }

        if (!ledgerId || !subLedgerId) {
            return res.status(400).json({
                success: false,
                message: 'Ledger and sub-ledger are required'
            });
        }

        if (!description || !amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Valid description and amount are required'
            });
        }

        if (!paymentMethod || !['cash', 'bank'].includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment method'
            });
        }

        if (!voucherNumber || !voucherTxId) {
            return res.status(400).json({
                success: false,
                message: 'Voucher number and transaction ID are required'
            });
        }

        // Validate bank details if payment method is bank
        if (paymentMethod === 'bank' && (!bankLedgerId || !bankSubLedgerId)) {
            return res.status(400).json({
                success: false,
                message: 'Bank details are required for bank payment method'
            });
        }

        // Validate voucher transaction ID format
        const prefix = voucherType === 'paid' ? 'VCB' : 'VRB';
        const expectedVoucherTxId = `${prefix}${String(voucherNumber).padStart(5, '0')}`;
        if (voucherTxId !== expectedVoucherTxId) {
            return res.status(400).json({
                success: false,
                message: 'Invalid voucher transaction ID format'
            });
        }

        // Check if voucher number already exists for this type
        const existingVoucher = await Voucher.findOne({
            voucherType,
            voucherNumber
        });

        if (existingVoucher) {
            return res.status(400).json({
                success: false,
                message: 'Voucher number already exists for this type'
            });
        }

        // Create new voucher
        const voucher = new Voucher({
            voucherType,
            ledgerType,
            ledgerId,
            subLedgerId,
            date: date || new Date(),
            description,
            amount: parseFloat(amount),
            paymentMethod,
            bankLedgerId: paymentMethod === 'bank' ? bankLedgerId : undefined,
            bankSubLedgerId: paymentMethod === 'bank' ? bankSubLedgerId : undefined,
            voucherNumber: parseInt(voucherNumber),
            voucherTxId
        });

        await voucher.save();

        // Create corresponding book entry
        if (paymentMethod === 'cash') {
            await createCashBookEntry(voucher);
        } else if (paymentMethod === 'bank') {
            await createBankBookEntry(voucher);
        }

        return res.status(201).json({
            success: true,
            message: 'Voucher created successfully',
            data: voucher
        });
    } catch (error) {
        console.error('Error creating voucher:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

// Get latest voucher number for a specific type
const getLatestVoucherNumber = async (req, res) => {
    try {
        const { voucherType } = req.params;

        if (!voucherType || !['paid', 'received'].includes(voucherType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid voucher type'
            });
        }

        const latestVoucher = await Voucher.findOne({ voucherType })
            .sort({ voucherNumber: -1 })
            .select('voucherNumber');

        const voucherNumber = latestVoucher ? latestVoucher.voucherNumber + 1 : 1;

        return res.status(200).json({
            success: true,
            data: { voucherNumber }
        });
    } catch (error) {
        console.error('Error getting latest voucher number:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

// Get all vouchers
const getVouchers = async (req, res) => {
    try {
        const vouchers = await Voucher.find()
            .sort({ createdAt: -1 })
            .populate('ledgerId', 'groupLedgerName')
            .populate('bankLedgerId', 'groupLedgerName');

        res.status(200).json({
            success: true,
            data: vouchers
        });
    } catch (error) {
        console.error('Error in getVouchers:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching vouchers',
            error: error.message
        });
    }
};

module.exports = {
    createVoucher,
    getLatestVoucherNumber,
    getVouchers
};