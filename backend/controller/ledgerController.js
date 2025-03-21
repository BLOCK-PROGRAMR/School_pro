const Ledger = require('../models/Ledger');

// Create a new ledger
const createLedger = async (req, res) => {
    try {
        console.log('Received request body:', req.body); // Debug log

        const { groupLedgerName, ledgerType, subLedgers, branchId } = req.body;

        // Validate required fields
        if (!groupLedgerName || !ledgerType || !branchId) {
            return res.status(400).json({
                success: false,
                message: 'Group ledger name and type are required'
            });
        }

        if (!Array.isArray(subLedgers) || subLedgers.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one sub-ledger is required'
            });
        }

        // Format sub-ledgers
        const formattedSubLedgers = subLedgers.map(name => ({
            name: name.trim()
        }));

        // Create new ledger
        const ledger = new Ledger({
            groupLedgerName: groupLedgerName.trim(),
            ledgerType,
            subLedgers: formattedSubLedgers,
            branchId
        });
        console.log('Created ledger:', ledger); // Debug log

        await ledger.save();

        res.status(201).json({
            success: true,
            message: 'Ledger created successfully',
            data: ledger
        });
    } catch (error) {
        console.error('Error in createLedger:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating ledger',
            error: error.message
        });
    }
};

// Get all ledgers
const getLedgers = async (req, res) => {
    try {
        const ledgers = await Ledger.find().sort({ createdAt: -1 });
        console.log('Found ledgers:', ledgers); // Debug log

        res.status(200).json({
            success: true,
            data: ledgers.map(ledger => ({
                _id: ledger._id,
                groupLedgerName: ledger.groupLedgerName,
                ledgerType: ledger.ledgerType,
                subLedgers: ledger.subLedgers.map(sub => ({
                    _id: sub._id,
                    name: sub.name
                }))
            }))
        });
    } catch (error) {
        console.error('Error in getLedgers:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching ledgers',
            error: error.message
        });
    }
};

// Update a ledger
const updateLedger = async (req, res) => {
    try {
        console.log('Update request body:', req.body); // Debug log

        const { groupLedgerName, ledgerType, subLedgers } = req.body;
        const { id } = req.params;

        // Validate required fields
        if (!groupLedgerName || !ledgerType) {
            return res.status(400).json({
                success: false,
                message: 'Group ledger name and type are required'
            });
        }

        if (!Array.isArray(subLedgers) || subLedgers.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one sub-ledger is required'
            });
        }

        // Format sub-ledgers
        const formattedSubLedgers = subLedgers.map(name => ({
            name: name.trim()
        }));

        const updatedLedger = await Ledger.findByIdAndUpdate(
            id,
            {
                groupLedgerName: groupLedgerName.trim(),
                ledgerType,
                subLedgers: formattedSubLedgers
            },
            { new: true }
        );

        if (!updatedLedger) {
            return res.status(404).json({
                success: false,
                message: 'Ledger not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Ledger updated successfully',
            data: updatedLedger
        });
    } catch (error) {
        console.error('Error in updateLedger:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating ledger',
            error: error.message
        });
    }
};

// Delete a ledger
const deleteLedger = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedLedger = await Ledger.findByIdAndDelete(id);

        if (!deletedLedger) {
            return res.status(404).json({
                success: false,
                message: 'Ledger not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Ledger deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteLedger:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting ledger',
            error: error.message
        });
    }
};
const getLedgerByBranchId = async (req, res) => {
    try {
        const { branchId } = req.params;
        const ledgers = await Ledger.find({ branchId }).sort({ createdAt: -1 });
        console.log('Found ledgers:', ledgers); // Debug 
        res.status(200).json({
            success: true,
            data: ledgers.map(ledger => ({
                _id: ledger._id,
                groupLedgerName: ledger.groupLedgerName,
                ledgerType: ledger.ledgerType,
                subLedgers: ledger.subLedgers.map(sub => ({
                    _id: sub._id,
                    name: sub.name
                }))
            }))
        });

    }
    catch (error) {
        console.error('Error in getLedgers:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching ledgers',
            error: error.message
        });
    }
}

module.exports = {
    createLedger,
    getLedgers,
    updateLedger,
    deleteLedger,
    getLedgerByBranchId
};
