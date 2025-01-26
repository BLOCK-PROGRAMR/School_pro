const Voucher = require('../models/Voucher');

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
            bankSubLedgerId
        } = req.body;

        // Get the latest voucher number for the given type
        const latestVoucher = await Voucher.findOne({ voucherType })
            .sort({ voucherNumber: -1 })
            .select('voucherNumber');

        const voucherNumber = latestVoucher ? latestVoucher.voucherNumber + 1 : 1;
        const prefix = voucherType === 'paid' ? 'VCB' : 'VRB';
        const voucherTxId = `${prefix}${String(voucherNumber).padStart(5, '0')}`;

        const voucher = new Voucher({
            voucherTxId,
            voucherNumber,
            voucherType,
            ledgerType,
            ledgerId,
            subLedgerId,
            date,
            description,
            amount,
            paymentMethod,
            ...(paymentMethod === 'bank' && { bankLedgerId, bankSubLedgerId })
        });

        await voucher.save();

        res.status(201).json({
            success: true,
            message: 'Voucher created successfully',
            data: voucher
        });
    } catch (error) {
        console.error('Error in createVoucher:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating voucher',
            error: error.message
        });
    }
};

// Get latest voucher number
const getLatestVoucherNumber = async (req, res) => {
    try {
        const { voucherType } = req.params;

        const latestVoucher = await Voucher.findOne({ voucherType })
            .sort({ voucherNumber: -1 })
            .select('voucherNumber voucherTxId');

        res.status(200).json({
            success: true,
            data: {
                latestNumber: latestVoucher ? latestVoucher.voucherNumber : 0,
                latestId: latestVoucher ? latestVoucher.voucherTxId : null
            }
        });
    } catch (error) {
        console.error('Error in getLatestVoucherNumber:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching latest voucher number',
            error: error.message
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