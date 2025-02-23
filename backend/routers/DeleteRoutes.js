const express = require('express');
const router = express.Router();
const DeleteController = require('../controller/DeleteController');

// Delete previous year data
router.delete('/delete-previous-year', DeleteController.deletePreviousYearData);

module.exports = router;