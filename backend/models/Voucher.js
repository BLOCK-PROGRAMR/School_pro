const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
    voucherTxId: {
        type: String,
        required: true,
        unique: true
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
    voucherNumber: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add indexes
voucherSchema.index({ voucherTxId: 1 }, { unique: true });
voucherSchema.index({ voucherType: 1, voucherNumber: 1 });

module.exports = mongoose.model('Voucher', voucherSchema);