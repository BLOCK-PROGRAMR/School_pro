const express = require('express');
const router = express.Router();
const {
    createVoucher,
    getLatestVoucherNumber,
    getVouchers
} = require('../controllers/voucherController');

router.post('/create', createVoucher);
router.get('/latest/:voucherType', getLatestVoucherNumber);
router.get('/all', getVouchers);

module.exports = router;