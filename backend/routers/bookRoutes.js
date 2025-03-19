const express = require('express');
const router = express.Router();
const { getCashBookEntries, getBankBookEntries, getBankBookEntriesByBranchId, getCashBookEntriesByBranchId } = require('../controller/BookController');
const { authMiddleware } = require('../middleware/Authtoken');

// Get cash book entries
router.get('/cash', authMiddleware, getCashBookEntries);

// Get bank book entries
router.get('/bank', authMiddleware, getBankBookEntries);
router.get('/bank/:branchId', getBankBookEntriesByBranchId);
router.get('/cash/:branchId', getCashBookEntriesByBranchId);

module.exports = router;
