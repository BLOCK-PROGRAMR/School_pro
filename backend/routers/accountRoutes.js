const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const {
    addAccount,
    getAccounts,
    updateAccount,
    deleteAccount
} = require('../controllers/AccountController');

// All routes are protected and require authentication
router.use(auth);

// Add new account (Branch Admin and Admin)
router.post('/', checkRole(['MainAdmin', 'BranchAdmin']), addAccount);

// Get all accounts (Admin, Branch Admin and Principal)
router.get('/', checkRole(['MainAdmin', 'BranchAdmin']), getAccounts);

// Update account (Branch Admin and Admin)
router.put('/:id', checkRole(['MainAdmin', 'BranchAdmin']), updateAccount);

// Delete account (Branch Admin and Admin)
router.delete('/:id', checkRole(['MainAdmin', 'BranchAdmin']), deleteAccount);

module.exports = router;