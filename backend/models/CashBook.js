const mongoose = require('mongoose');

const cashBookSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    rcNo: {
        type: String,
        required: true,
        unique: true
    },
    ledgerType: {
        type: String,
        required: true,
        enum: ['Expenses', 'Income', 'Loans', 'studentfee', 'Bank']
    },
    // Add fields for group ledger info
    groupLedger: {
        id: {
            type: mongoose.Schema.Types.ObjectId,

            ref: 'Ledger'
        },
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true,
            enum: ['Expenses', 'Income', 'Loans', 'Bank']
        }
    },
    // Add fields for sub-ledger info
    subLedger: {
        id: {
            type: mongoose.Schema.Types.ObjectId,

        },
        name: {
            type: String,
            required: true
        }
    },
    amount: {
        type: Number,
        required: true
    },
    transactionType: {
        type: String,
        enum: ['paid', 'received'],
        required: true
    },
    voucherRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Voucher',

    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Create index on rcNo to ensure uniqueness
cashBookSchema.index({ rcNo: 1 }, { unique: true });

module.exports = mongoose.model('CashBook', cashBookSchema);
