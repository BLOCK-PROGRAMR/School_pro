const express = require("express");
const mongoose = require("mongoose");
const Student = require("../models/student");
const FeeType = require("../models/Feetypes"); // Assuming Fee details are stored here

const Class = require("../models/Classes");
const Section = require("../models/sections");

const promoteStudent = async (req, res) => {
  try {
    const {
      fromAcademicYear,
      toAcademicYear,
      fromClass,
      fromSection,
      toClass,
      toSection,
    } = req.body;

    // Fetch all students in the selected class & section
    console.log("section id back", toSection);

    const students = await Student.find({
      "class.name": await getClassNameById(fromClass),
      "section.name": await getSectionNameById(fromSection),
      academic_id: fromAcademicYear,
    });
    if (!students.length) {
      return res
        .status(404)
        .json({ success: false, message: "No students found." });
    }
    console.log("students are", students);

    for (let student of students) {
      student.oldfeeDetails = student.feeDetails;
      const feeUpdateResult = await processNewFees(
        student,
        toSection,
        toAcademicYear
      );

      if (!feeUpdateResult.success) {
        console.error(
          `Failed to update fees for student ${student._id}: ${feeUpdateResult.message}`
        );
        continue; // Skip to the next student if there's an error
      }

      // Save student details
      await student.save();
    }

    // Fetch the new class and section fees

    // Update each student
    for (let student of students) {
      // Calculate due amount
      let totalPaid = student.feeDetails.reduce(
        (sum, fee) => sum + fee.paidFee,
        0
      );
      let totalFinalAmount = student.feeDetails.reduce(
        (sum, fee) => sum + fee.finalAmount,
        0
      );
      let dueAmount = totalFinalAmount - totalPaid;

      // Remove all fees except transport & hostel
      let transportHostelFees = student.feeDetails.filter(
        (fee) => fee.name === "Transport-fee" || fee.name === "hostel-fee"
      );

      // Assign new class, section & reset fees
      student.academic_id = toAcademicYear;
      student.class.id = toClass;
      student.class.name = await getClassNameById(toClass); // Function to get class name
      student.section.id = toSection;
      student.section.name = await getSectionNameById(toSection); // Function to get section name
      student.olddue = dueAmount;

      // Reset paid fees to 0 for the new academic year
      student.feeDetails.forEach((fee) => (fee.paidFee = 0));

      await student.save();
    }

    return res.json({
      success: true,
      message: "Students promoted successfully!",
    });
  } catch (error) {
    console.error("Promotion Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// Function to get class name by ID
async function getClassNameById(classId) {
  const classObj = await Class.findById(classId);
  return classObj ? classObj.name : "";
}

// Function to get section name by ID
async function getSectionNameById(sectionId) {
  const sectionObj = await Section.findById(sectionId);
  return sectionObj ? sectionObj.name : "";
}
async function getFeeTerms(feeType, academicYear) {
  try {
    const feeTypeData = await FeeType.findOne({
      type: feeType,
      academicYear: academicYear,
    });

    return feeTypeData ? feeTypeData.terms : 1; // Default to 1 if not found
  } catch (error) {
    console.error("Error fetching fee terms:", error);
    return 1; // Fallback in case of error
  }
}

// Function to process new fee structure
async function processNewFees(student, toSection, toAcademicYear) {
  try {
    let totalPaid = student.feeDetails.reduce(
      (sum, fee) => sum + fee.paidFee,
      0
    );
    let totalFinalAmount = student.feeDetails.reduce(
      (sum, fee) => sum + fee.finalAmount,
      0
    );
    let dueAmount = totalFinalAmount - totalPaid;

    // Set due amount in student record
    student.due = dueAmount;
    // Fetch section fees
    const sectionData = await Section.findOne({ _id: toSection });

    if (!sectionData || !sectionData.fees) {
      return {
        success: false,
        message: "No fees found for the selected section.",
      };
    }

    // Process new fee structure asynchronously
    const newFeeStructure = await Promise.all(
      sectionData.fees.map(async (fee) => ({
        name: fee.feeType, // Use feeType as name
        amount: fee.amount,
        terms: await getFeeTerms(fee.feeType, toAcademicYear), // Fetch terms dynamically
        concession: 0, // Default concession to 0
        finalAmount: fee.amount, // Final amount same as amount
        paidFee: 0, // Reset paid fee
      }))
    );

    // Filter transport and hostel fees from student's existing fee details
    const transportHostelFees = student.feeDetails.filter(
      (fee) => fee.name === "Transport-fee" || fee.name === "hostel-fee"
    );

    // Combine new fees with transport & hostel fees
    student.feeDetails = [...newFeeStructure, ...transportHostelFees];

    // Save student record
    await student.save();

    return { success: true, message: "Fees updated successfully." };
  } catch (error) {
    console.error("Error processing new fees:", error);
    return { success: false, message: "Failed to update fees." };
  }
}
module.exports = {
  promoteStudent,
};
