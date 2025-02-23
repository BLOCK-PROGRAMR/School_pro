// const AcademicYear = require('../models/Acyear');
// const Class = require('../models/Classes');
// const Section = require('../models/sections');
// const Syllabus = require('../models/Syllabus');
// const acadYear = require("../models/Acyear");
// const mongoose = require('mongoose');

// exports.deletePreviousYearData = async (req, res) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//         const _acad = await acadYear.find({}, { _id: 1 }).sort({ startDate: -1 });
//         // Find all academic years except the current one
//         let current_acad;
//         if (_acad.length > 1) {
//             current_acad = _acad[1];
//         }

//         // Delete sections for classes in previous years
//         await Section.deleteMany({
//             classId: {
//                 $in: (await Class.find({ academicYear: { $in: current_acad } }).session(session))
//                     .map(cls => cls._id)
//             }
//         }).session(session);

//         // Delete classes from previous years
//         await Class.deleteMany({
//             academicYear: { $in: previousYearIds }
//         }).session(session);

//         // Delete syllabus records from previous years
//         await Syllabus.deleteMany({
//             academicId: { $in: previousYearIds }
//         }).session(session);

//         // Delete previous academic years
//         await AcademicYear.deleteMany({
//             _id: { $in: previousYearIds }
//         }).session(session);

//         await session.commitTransaction();

//         res.status(200).json({
//             success: true,
//             message: 'Previous year data deleted successfully',
//             deletedYears: previousYears.length
//         });
//     } catch (error) {
//         await session.abortTransaction();
//         console.error('Error deleting previous year data:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to delete previous year data',
//             error: error.message
//         });
//     } finally {
//         session.endSession();
//     }
// };

const AcademicYear = require('../models/Acyear');
const Class = require('../models/Classes');
const Section = require('../models/sections');
const Syllabus = require('../models/Syllabus');
const mongoose = require('mongoose');

exports.deletePreviousYearData = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Fetch all academic years sorted by startDate (most recent first)
        const _acad = await AcademicYear.find({}, { _id: 1 }).sort({ startDate: -1 });

        if (_acad.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Not enough academic years to delete previous ones'
            });
        }

        const current_acad = _acad[0]._id; // Most recent year
        const previousYearIds = _acad.slice(1).map(year => year._id); // All except the most recent

        // Delete sections for classes in previous years
        const classesToDelete = await Class.find({ academicYear: { $in: previousYearIds } }).session(session);
        await Section.deleteMany({
            classId: { $in: classesToDelete.map(cls => cls._id) }
        }).session(session);

        // Delete classes from previous years
        await Class.deleteMany({ academicYear: { $in: previousYearIds } }).session(session);

        // Delete syllabus records from previous years
        await Syllabus.deleteMany({ academicId: { $in: previousYearIds } }).session(session);

        // Delete previous academic years
        await AcademicYear.deleteMany({ _id: { $in: previousYearIds } }).session(session);

        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message: 'Previous year data deleted successfully',
            deletedYears: previousYearIds.length
        });
    } catch (error) {
        await session.abortTransaction();
        console.error('Error deleting previous year data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete previous year data',
            error: error.message
        });
    } finally {
        session.endSession();
    }
};
