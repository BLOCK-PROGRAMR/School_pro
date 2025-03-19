const mongoose = require('mongoose');

const bankBranchSchema = new mongoose.Schema({
    bankId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    branchName: {
        type: String,
        required: true
    }
}, { _id: false });

// Schema for storing ledger info
const groupLedgerInfoSchema = new mongoose.Schema({
    groupLedgerName: {
        type: String,
        required: true
    },
    ledgerType: {
        type: String,
        required: true,
        enum: ['Expenses', 'Income', 'Loans']
    }
}, { _id: false });

const subLedgerInfoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}, { _id: false });

const voucherSchema = new mongoose.Schema({
    voucherTxId: {
        type: String,
        required: true,
        unique: true
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    voucherType: {
        type: String,
        required: true,
        enum: ['paid', 'received']
    },
    ledgerType: {
        type: String,
        required: true,
        enum: ['Expenses', 'Income', 'Loans']
    },
    ledgerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ledger',
        required: true
    },
    subLedgerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    // Add fields for storing ledger info
    groupLedgerInfo: {
        type: groupLedgerInfoSchema,
        required: true
    },
    subLedgerInfo: {
        type: subLedgerInfoSchema,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['cash', 'bank']
    },
    bankLedgerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ledger',
        required: function () {
            return this.paymentMethod === 'bank';
        }
    },
    bankSubLedgerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: function () {
            return this.paymentMethod === 'bank';
        }
    },
    bankBranch: {
        type: bankBranchSchema,
        required: function () {
            return this.paymentMethod === 'bank';
        }
    },
    voucherNumber: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

// Create compound index for voucherType and voucherNumber
voucherSchema.index({ voucherType: 1, voucherNumber: 1 }, { unique: true });

module.exports = mongoose.model('Voucher', voucherSchema);