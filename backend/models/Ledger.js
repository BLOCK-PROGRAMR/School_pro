const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
    groupLedgerName: {
        type: String,
        required: true,
        trim: true
    },
    ledgerType: {
        type: String,
        required: true,
        enum: ['Expenses', 'Income', 'Loans', 'Bank']
    },
    subLedgers: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Ledger', ledgerSchema);
