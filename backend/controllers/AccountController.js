const Account = require('../models/Account');
const Academic = require("../models/Acyear");
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
        console.log("account", req.body);
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
        //not fetching academic id
        const { branchId, academic_id } = req.query;
        console.log("branchId", branchId);
        console.log("academic_id", academic_id);
        // const _acad = await Academic.find({});

        // console.log("data", _acad);

        // console.log("academic id", academic_id)
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
// exports.getAccounts = async (req, res) => {
//     try {
//         const { branchId, academic_id } = req.query;
//         console.log("branchId", branchId);

//         // Fetch and sort academic records in descending order
//         // const _acad = await Academic.find({}, { _id: 1 }).sort({ startDate: -1 });
//         const _acad = await Academic.find({}, { _id: 1 }).sort({ startDate: -1 });


//         console.log("All academic records:", _acad);

//         // Get the second most recent academic_id
//         let recentAcademicId = academic_id;
//         if (!recentAcademicId && _acad.length > 1) {
//             recentAcademicId = _acad[1]._id; // Second most recent
//         }

//         console.log("Using academic id:", recentAcademicId);

//         // Prepare query
//         const query = {};
//         if (branchId) query.branchId = branchId;
//         if (recentAcademicId) query.academic_id = recentAcademicId;

//         // Fetch accounts
//         const accounts = await Account.find(query)
//             .select('-password')
//             .sort({ createdAt: -1 });

//         res.status(200).json({
//             success: true,
//             error: false,
//             data: accounts
//         });
//     } catch (error) {
//         console.error('Error in getAccounts:', error);
//         res.status(500).json({
//             success: false,
//             error: true,
//             message: 'Internal server error'
//         });
//     }
// };


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
