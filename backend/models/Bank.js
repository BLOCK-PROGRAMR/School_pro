const mongoose = require('mongoose');

const bankTransactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    transactionType: {
        type: String,
        required: true,
        enum: ['deposit', 'received']
    },
    bankLedgerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ledger',
        required: true
    },
    bankSubLedgerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    bankBranch: {
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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BankTransaction', bankTransactionSchema);