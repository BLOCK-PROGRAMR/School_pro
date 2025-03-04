const Account = require('../models/Account');
const bcrypt = require('bcryptjs');
const { validateAccount } = require('../utils/validation');

exports.addAccount = async (req, res) => {
    try {
        // Validate request body
        const { error } = validateAccount(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        // Check if username already exists
        const existingUsername = await Account.findOne({ username: req.body.username });
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: 'Username already exists'
            });
        }

        // Check if Aadhar number already exists
        const existingAadhar = await Account.findOne({ aadharNumber: req.body.aadharNumber });
        if (existingAadhar) {
            return res.status(400).json({
                success: false,
                message: 'Aadhar number already registered'
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

        await account.save();

        // Remove password from response
        const accountResponse = account.toObject();
        delete accountResponse.password;

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            data: accountResponse
        });
    } catch (error) {
        console.error('Error in addAccount:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

exports.getAccounts = async (req, res) => {
    try {
        const { branchId, academic_id } = req.query;
        // console.log('branchId:', branchId);
        console.log('academic_id:', academic_id);
        const query = { 
            isActive: true,
            ...(branchId && { branchId }),
            ...(academic_id && { academic_id })
        };

        const accounts = await Account.find(query)
            .select('-password')
            .populate('academic_id', 'year')
            .populate('branchId', 'name');

        res.status(200).json({
            success: true,
            data: accounts
        });
    } catch (error) {
        console.error('Error in getAccounts:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

exports.updateAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Remove password from update if it exists
        if (updateData.password) {
            delete updateData.password;
        }

        const account = await Account.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Account updated successfully',
            data: account
        });
    } catch (error) {
        console.error('Error in updateAccount:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const { id } = req.params;

        // Soft delete by setting isActive to false
        const account = await Account.findByIdAndUpdate(
            id,
            { $set: { isActive: false } },
            { new: true }
        );

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteAccount:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};