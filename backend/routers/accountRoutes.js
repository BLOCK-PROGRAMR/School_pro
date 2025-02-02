const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const {
    addAccount,
    getAccounts,
    updateAccount,
    deleteAccount
} = require('../controllers/accountController');

// All routes are protected and require authentication
router.use(auth);

// Add new account (Admin only)
router.post('/', checkRole(['admin']), addAccount);

// Get all accounts (Admin and Principal)
router.get('/', checkRole(['admin', 'principal']), getAccounts);

// Update account (Admin only)
router.put('/:id', checkRole(['admin']), updateAccount);

// Delete account (Admin only)
router.delete('/:id', checkRole(['admin']), deleteAccount);

module.exports = router;