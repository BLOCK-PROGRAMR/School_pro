
const Student = require('../models/student'); // Assuming you have a Student model
const Account= require("../models/Account");

const mongoose = require("mongoose");
const AcademicYear = require("../models/Acyear");
const Branch = require("../models/Branches");
const ClassModel = require("../models/Classes");
const Section = require("../models/sections");
const FeeType = require("../models/Feetypes");
const Bus =require("../models/Bus");
const Teacher =require("../models/Teachers")
const Town=require("../models/Towns");

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
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res.status(404).json({ success: false, message: "Branch not found" });
    }

    const existingAcademicYear = await AcademicYear.findOne({ year, branch: branchId });
    if (existingAcademicYear) {
      return res.status(400).json({ 
        success: false, 
        message: "Academic year already exists for this branch" 
      });
    }

    // Create new academic year
    const academicYear = new AcademicYear({
      year,
      startDate,
      endDate,
      branch: branchId,
    });
    await academicYear.save();

    // Update branch's academicYears array
    branch.academicYears.push(academicYear._id);
    const academicYearDocs = await AcademicYear.find({ _id: { $in: branch.academicYears } });
    academicYearDocs.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    branch.academicYears = academicYearDocs.map(doc => doc._id);
    await branch.save();

    // Find previous academic year (most recent before new startDate)
    const previousAcademicYear =branch.academicYears[1];
    console.log(previousAcademicYear);
    if (previousAcademicYear) {
      try {
        // Copy Fee Types
        const previousFeeTypes = await FeeType.find({ academicYear: previousAcademicYear._id });
        const newFeeTypes = previousFeeTypes.map(ft => ({
          
          type: ft.type,
          terms: ft.terms,
          academicYear: academicYear._id
        }));
        {console.log(previousFeeTypes)}
        console.log(newFeeTypes,"copy")
        await FeeType.insertMany(newFeeTypes);

        // Copy Classes and Sections
        const previousClasses = await ClassModel.find({ academicYear: previousAcademicYear._id })
          .populate('sections');

        for (const prevClass of previousClasses) {
          // Create new class
          
          const newClass = new ClassModel({
            name: prevClass.name,
            academicYear: academicYear._id,
            subjects: prevClass.subjects,
            sections: []
          });
          console.log("class",newClass);
          await newClass.save();

          // Copy sections
          for (const prevSection of prevClass.sections) {
            const newSection = new Section({
              name: prevSection.name,
              classId: newClass._id,
              fees: prevSection.fees
            });
          console.log("sec",newSection);

            await newSection.save();
            newClass.sections.push(newSection._id);
          }
          await newClass.save();
          academicYear.classes.push(newClass._id);
        }


        const previousTeachers = await Teacher.find({ academic_id: previousAcademicYear._id });
        const newTeachers = previousTeachers.map(teacher => ({
          name: teacher.name,
          username: teacher.username,
          phone: teacher.phone,
          address: teacher.address,
          qualification: teacher.qualification,
          experience: teacher.experience,
          teachingSubjects: teacher.teachingSubjects,
          joiningDate: teacher.joiningDate,
          aadharNumber: teacher.aadharNumber,
          branchId: teacher.branchId,
          academic_id: academicYear._id,
          role: teacher.role
        }));
        await Teacher.insertMany(newTeachers);

        const previousTowns = await Town.find({ academicId: previousAcademicYear._id });
        const newTowns = previousTowns.map(town => ({
          townName: town.townName,
          amount: town.amount,
          halts: town.halts,
          academicId: academicYear._id,
          Terms: town.Terms
        }));
        const insertedTowns = await Town.insertMany(newTowns);

        const previousBuses = await Bus.find({ academicId: previousAcademicYear._id });
        await academicYear.save();
        const newBuses = previousBuses.map((bus) => ({
          busNo: bus.busNo,
          vehicleNo: bus.vehicleNo,
          driverName: bus.driverName,
          driverPhone: bus.driverPhone,
          destination: bus.destination,
          viaTowns: bus.viaTowns,
          academicId: academicYear._id, // Assign new academic year
        }));
    
        // Insert new buses into the database
        const insertedBuses = await Bus.insertMany(newBuses);
        // Copy Accountants
const previousAccountants = await Account.find({ academic_id: previousAcademicYear._id });
const newAccountants = previousAccountants.map(accountant => ({
  name: accountant.name,
  username: accountant.username,
  password: accountant.password, // Assuming passwords are hashed already
  phone: accountant.phone,
  address: accountant.address,
  qualification: accountant.qualification,
  experience: accountant.experience,
  joiningDate: accountant.joiningDate,
  aadharNumber: accountant.aadharNumber,
  branchId: accountant.branchId,
  academic_id: academicYear._id, // Assign new academic year
  role: accountant.role,
  isActive: accountant.isActive
}));

await Account.insertMany(newAccountants);


       academicYear.towns.push(...insertedTowns.map(town=>town._id) );
       academicYear.buses.push(...insertedBuses.map(bus => bus._id));
        await academicYear.save();
 
        
    

      } catch (error) {
        // Cleanup on error (optional)
        await AcademicYear.findByIdAndDelete(academicYear._id);
        await FeeType.deleteMany({ academicYear: academicYear._id });
        return res.status(500).json({
          success: false,
          message: `Error copying data: ${error.message}`
        });
      }
    }

    const sortedAcademicYears = await AcademicYear.find({ branch: branchId })
      .sort({ startDate: -1 });

    res.status(201).json({
      success: true,
      message: `Academic Year created ${previousAcademicYear ? 'with data copied' : ''}`,
      academicYear,
      sortedAcademicYears,
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
