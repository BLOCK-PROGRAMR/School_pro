const AcademicYear = require("../models/Acyear");
const Branch = require("../models/Branches");
const mongoose = require("mongoose");
const Class = require("../models/Classes");
const Student = require('../models/student'); // Assuming you have a Student model



// Controller function to get student count in an academic year
exports.getStudentCountByAcademicYear = async (req, res) => {
  const { academicyearid } = req.params;

  try {
    // Count students in the given academic year
    
    // Find the maximum student idNo in the given academic year
    const maxStudent = await Student.findOne({ academic_id: academicyearid })
      .sort({ idNo: -1 }) // Sort in descending order to get the highest idNo
      .select("idNo");

    let nextIdNo = 1; // Default to 1 if no students exist

    if (maxStudent && maxStudent.idNo) {
      nextIdNo = parseInt(maxStudent.idNo) + 1; // Increment max ID
    }

    return res.status(200).json({ 
      success: true, 
      count: nextIdNo 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.createAcademicYear = async (req, res) => {
  const branchId = req.params.branchId;
  const { year, startDate, endDate } = req.body;

  try {
    // Check if the branch exists
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });
    }

    // Check if the academic year already exists for this branch
    const existingAcademicYear = await AcademicYear.findOne({
      year,
      branch: branchId, // Check the branch-specific academic year
    });

    if (existingAcademicYear) {
      return res
        .status(400)
        .json({ success: false, message: "Academic year already exists for this branch" });
    }

    // Create and save the new academic year
    const academicYear = new AcademicYear({
      year,
      startDate,
      endDate,
      branch: new mongoose.Types.ObjectId(branchId),
    });
    await academicYear.save();

    // Insert into the branch's academicYears array and sort by startDate in descending order
    branch.academicYears.push(academicYear._id);

    // Retrieve the full academic year documents from the database
    const academicYearDocs = await AcademicYear.find({
      _id: { $in: branch.academicYears },
    });

    // Sort the academic year documents by start date in descending order (latest first)
    academicYearDocs.sort(
      (a, b) => new Date(b.startDate) - new Date(a.startDate)
    );

    // Update the branch's academicYears array with sorted IDs
    branch.academicYears = academicYearDocs.map((doc) => doc._id);

    // Save the updated branch
    await branch.save();

    // Sort the AcademicYear collection by startDate in descending order
    const sortedAcademicYears = await AcademicYear.find({
      branch: branchId,
    }).sort({ startDate: -1 });

    res.status(201).json({
      success: true,
      message: "Academic Year created successfully",
      academicYear,
      sortedAcademicYears, // Return sorted academic years if needed in response
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Edit Academic Year
exports.editAcademicYear = async (req, res) => {
  const { branchId, academicYearId } = req.params;
  const { year, startDate, endDate } = req.body;

  try {
    const academicYear = await AcademicYear.findById(academicYearId);
    if (!academicYear) {
      return res.status(404).json({
        success: false,
        message: "Academic Year not found",
      });
    }

    academicYear.year = year || academicYear.year;
    academicYear.startDate = startDate || academicYear.startDate;
    academicYear.endDate = endDate || academicYear.endDate;
    await academicYear.save();

    const branch = await Branch.findById(branchId);
    if (branch && !branch.academicYears.includes(academicYearId)) {
      branch.academicYears.push(academicYearId);
      await branch.save();
    }

    res.status(200).json({
      success: true,
      message: "Academic Year updated successfully",
      academicYear,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAcademicYear = async (req, res) => {
  try {
    const { branchId, academicYearId } = req.params;

    console.log("branch id is back ", branchId);
    console.log("Academic id in back is", academicYearId);

    // Check if the academic year exists
    const academicYear = await AcademicYear.findById(academicYearId);
    if (!academicYear) {
      return res.status(404).json({
        success: false,
        message: "Academic Year not found",
      });
    }

    // Check if the classes array is empty
    if (academicYear.classes.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete academic year with associated classes.",
      });
    }

    // Delete the academic year from the AcademicYear collection
    await AcademicYear.findByIdAndDelete(academicYearId);

    // Remove the academic year from the branch's academicYears array and re-sort
    const branch = await Branch.findById(branchId);
    if (branch) {
      // Filter out the deleted academic year and then re-map the sorted ids back to ObjectIds
      branch.academicYears = branch.academicYears
        .filter((year) => year.toString() !== academicYearId)
        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

      await branch.save();
    }

    // Delete all classes associated with the deleted academic year
    await Class.deleteMany({ academicYear: academicYearId });
    const academicYears = await AcademicYear.find({ branch: branchId });
    const sortedYears = academicYears.sort(
      (a, b) => new Date(b.startDate) - new Date(a.startDate)
    );

    res.status(200).json({
      success: true,
      message: "Academic Year deleted successfully",
      sortedYears,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get All Academic Years for a Branch
exports.getAcademicYears = async (req, res) => {
  try {
    const { branchId } = req.params;

    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    const academicYears = await AcademicYear.find({ branch: branchId });
    const sortedYears = academicYears.sort(
      (a, b) => new Date(b.startDate) - new Date(a.startDate)
    );
    res.status(200).json({
      success: true,
      message: "Successfully fetched all Academic Years",
      data: sortedYears,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch academic years",
    });
  }
};
