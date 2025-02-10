const express = require("express");
const mongoose = require("mongoose");
const Student = require("../models/student");
const FeeStructure = require("../models/Feetypes"); // Assuming Fee details are stored here
const router = express.Router();

router.post("/promote-students", async (req, res) => {
  try {
    const { fromClass, fromSection, toClass, toSection, academicYear } =
      req.body;

    // Fetch all students in the selected class & section
    const students = await Student.find({
      "class.id": fromClass,
      "section.id": fromSection,
      academic_id: academicYear,
    });

    if (!students.length) {
      return res
        .status(404)
        .json({ success: false, message: "No students found." });
    }

    // Fetch the new class and section fees
    const newFeeStructure = await FeeStructure.findOne({
      classId: toClass,
      sectionId: toSection,
    });

    if (!newFeeStructure) {
      return res
        .status(404)
        .json({ success: false, message: "Fee structure not found." });
    }

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
        (fee) => fee.name === "Transport" || fee.name === "Hostel"
      );

      // Assign new class, section & reset fees
      student.class.id = toClass;
      student.class.name = await getClassNameById(toClass); // Function to get class name
      student.section.id = toSection;
      student.section.name = await getSectionNameById(toSection); // Function to get section name
      student.feeDetails = [...transportHostelFees, ...newFeeStructure.fees];
      student.due = dueAmount;

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
});

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

module.exports = router;

const handlePromoteStudents = async () => {
  if (!fromClass || !fromSection || !toClass || !toSection) {
    toast.error("Please select all fields before promoting students.");
    return;
  }

  try {
    const response = await fetch(Allapi.promoteStudents.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fromClass,
        fromSection,
        toClass,
        toSection,
        academicYear: acid,
      }),
    });

    const result = await response.json();
    if (result.success) {
      toast.success("Students promoted successfully!");
    } else {
      toast.error(result.message || "Failed to promote students.");
    }
  } catch (error) {
    toast.error("Error promoting students.");
  }
};
