const express = require('express');
const router = express.Router();
const { createTransaction, getTransactions } = require('../controller/BankController');
const { authMiddleware } = require('../middleware/Authtoken');

// Create a new transaction
router.post('/transaction', authMiddleware, createTransaction);

// Get all transactions
router.get('/transactions', authMiddleware, getTransactions);

module.exports = router;