const express = require('express');
const router = express.Router();
const { createVoucher, getLatestVoucherNumber, getVouchers } = require('../controller/VoucherController');
const { authMiddleware } = require('../middleware/Authtoken');

// Get latest voucher number
router.get('/latest/:voucherType', authMiddleware, getLatestVoucherNumber);

// Create a new voucher
router.post('/create', authMiddleware, createVoucher);

// Get all vouchers
router.get('/all', authMiddleware, getVouchers);

module.exports = router;
