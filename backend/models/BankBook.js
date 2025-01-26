const mongoose = require('mongoose');

const bankBookSchema = new mongoose.Schema({
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
        enum: ['Expenses', 'Income', 'Loans', 'Assets', 'Liabilities', 'Equity']
    },
    bankName: {
        type: String
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
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BankBook', bankBookSchema);
