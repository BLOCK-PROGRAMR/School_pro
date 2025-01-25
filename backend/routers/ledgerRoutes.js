const express = require('express');
const router = express.Router();
const { createLedger, getLedgers, updateLedger, deleteLedger } = require('../controller/ledgerController');

router.post('/create', createLedger);
router.get('/all', getLedgers);
router.put('/update/:id', updateLedger);
router.delete('/delete/:id', deleteLedger);

module.exports = router;
