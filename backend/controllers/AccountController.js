const Account = require('../models/Account');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validateAccount } = require('../utils/validation');

// Add a new account
exports.addAccount = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        
        // Validate request data
        const { error } = validateAccount(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                error: true,
                message: error.details[0].message
            });
        }

        // Check if username already exists
        const existingUser = await Account.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: true,
                message: 'Username already exists'
            });
        }

        // Check if Aadhar number already exists
        const existingAadhar = await Account.findOne({ aadharNumber: req.body.aadharNumber });
        if (existingAadhar) {
            return res.status(400).json({
                success: false,
                error: true,
                message: 'Aadhar number already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create new account
        const account = new Account({
            ...req.body,
            password: hashedPassword
        });

        // Save account
        await account.save();

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            data: {
                _id: account._id,
                name: account.name,
                username: account.username
            }
        });

    } catch (error) {
        console.error('Error in addAccount:', error);
        res.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Internal server error'
        });
    }
};

// Get all accounts
exports.getAccounts = async (req, res) => {
    try {
        const { branchId, academic_id } = req.query;
        const query = {};
        
        if (branchId) query.branchId = branchId;
        if (academic_id) query.academic_id = academic_id;
        
        const accounts = await Account.find(query)
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            error: false,
            data: accounts
        });
    } catch (error) {
        console.error('Error in getAccounts:', error);
        res.status(500).json({
            success: false,
            error: true,
            message: 'Internal server error'
        });
    }
};

// Update account
exports.updateAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        const account = await Account.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!account) {
            return res.status(404).json({
                success: false,
                error: true,
                message: 'Account not found'
            });
        }

        res.status(200).json({
            success: true,
            error: false,
            data: account
        });
    } catch (error) {
        console.error('Error in updateAccount:', error);
        res.status(500).json({
            success: false,
            error: true,
            message: 'Internal server error'
        });
    }
};

// Delete account
exports.deleteAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const account = await Account.findByIdAndDelete(id);

        if (!account) {
            return res.status(404).json({
                success: false,
                error: true,
                message: 'Account not found'
            });
        }

        res.status(200).json({
            success: true,
            error: false,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteAccount:', error);
        res.status(500).json({
            success: false,
            error: true,
            message: 'Internal server error'
        });
    }
};
