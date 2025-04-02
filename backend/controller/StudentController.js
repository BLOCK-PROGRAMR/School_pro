const Student = require("../models/student");
// const cloudinary = require('cloudinary').v2;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Trash = require("../models/trash");
const bus = require("../models/Bus");

// Add a new student
exports.addStudent = async (req, res) => {
  try {
    const { idNo, aadharNo, name } = req.body;
    console.log("aadhar no", aadharNo)
    // Check if a student with the same idNo already exists
    const existingStudent = await Student.findOne({ aadharNo });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: `Aadhar number already exists-* `,
      });
    }

    // Create new student
    const newStudent = new Student(req.body);
    await newStudent.save();

    // Hash the Aadhar number for password
    const hashedpsd = await bcrypt.hash(aadharNo, 10);

    // Create new user object
    const newUser = {
      name,
      username: idNo,
      password: hashedpsd,
      role: "Student",
    };

    // Save the new user
    await mongoose.model("User").create(newUser);

    res.status(201).json({
      success: true,
      message: "Student and User added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding student or user",
      error: error.message,
    });
  }
};

// Get students based on section ID
exports.getStudentsBySection = async (req, res) => {
  try {
    console.log("hi");
    const { sectionId } = req.params; // Extract sectionId from request parameters

    // Find students with the matching section ID
    const students = await Student.find({
      "section.id": new mongoose.Types.ObjectId(sectionId), // Query the 'section.id' field
    }); // Optionally populate 'class' and 'section' fields if you need them populated

    if (!students || students.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No students found for this section",
        data: students,
      });
    }

    res.status(200).json({ success: true, data: students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching students", error });
  }
};



// Edit student information
exports.updateStudent = async (req, res) => {
  try {
    const { sid } = req.params; // Get the student ID from URL parameters
    const updatedData = req.body; // Get the data to update from the request body

    // Find student by ID and update the data
    const student = await Student.findByIdAndUpdate(sid, updatedData, {
      new: true, // Return the updated student document
      runValidators: true, // Run validators on the updated fields
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({
      success: false,
      message: "Error updating student",
      error: error.message,
    });
  }
};

// Delete student by ID - Modified to move to trash
exports.deleteStudent = async (req, res) => {
  try {
    const { sid } = req.params; // Get the student ID from URL parameters

    // Find the student by ID
    const student = await Student.findById(sid);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Create a new trash entry with the student data
    const trashEntry = new Trash(student.toObject());
    await trashEntry.save();

    // Delete the student from the Student collection
    await Student.findByIdAndDelete(sid);

    // Delete the associated user from the User model
    await mongoose.model("User").deleteOne({ username: student.idNo });

    res.status(200).json({
      success: true,
      message: "Student moved to trash successfully",
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting student",
      error: error.message,
    });
  }
};

exports.updateFeeDetails = async (req, res) => {
  try {
    const { sid } = req.params; // Student ID from the request parameters
    const { feeDetails } = req.body; // Fee details array from the request body

    if (!feeDetails || !Array.isArray(feeDetails)) {
      return res.status(400).json({
        success: false,
        message: "Invalid fee details provided",
      });
    }

    // Update the feeDetails array for the specific student
    const student = await Student.findByIdAndUpdate(
      sid,
      { feeDetails }, // Replace the feeDetails array
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fee details updated successfully",
      data: student,
    });
  } catch (error) {
    console.error("Error updating fee details:", error);
    res.status(500).json({
      success: false,
      message: "Error updating fee details",
      error: error.message,
    });
  }
};
exports.getStudentById = async (req, res) => {
  try {
    console.log("hellow worldl")
    const { sid } = req.params; // Extract student ID from request parameters

    // Convert string id into ObjectId
    const SId = new mongoose.Types.ObjectId(sid);

    const student = await Student.findById(sid);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Error fetching student by ID:", error);

    // Handle invalid ObjectId error
    if (error.name === "BSONTypeError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error fetching student",
      error: error.message,
    });
  }
};
exports.getStudentIdByBranchId = async (req, res) => {

  try {
    console.log("hello worldl kskndkmslmdknknk");
    const { branch, idNo } = req.params;
    const students = await Student.find({ idNo });
    console.log("students", students);
    if (!students || students.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No students found for this branch",
        data: students,
      });
    }
    res.status(200).json({
      success: true,
      data: students,
    });
  }
  catch (error) {
    console.error("Error fetching students by branchId:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching students by BranchId", error });

  }
}
exports.getStudentIdByBranch = async (req, res) => {

  try {
    const { branchId, studentId } = req.params;
    const students = await Student.find
      ({ branch });
    if (!students || students.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No students found for this branch",
        data: students,
      });
    }
    res.status(200).json({
      success: true,
      data: students,
    });

  }
  catch (error) {

  }
}
// Get student details by idNo
exports.getStudentByIdNo = async (req, res) => {
  try {
    const { idNo } = req.params; // Extract idNo from request parameters
    console.log("idNO", idNo);
    // Find student with the matching idNo
    const student = await Student.findOne({ idNo });
    console.log("student is", student);

    console.log("student is", student.transportDetails.bus);
    const busDetails = await bus.findById(student.transportDetails.bus);
    console.log("bus details is", busDetails);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
      bus: busDetails,
    });
  } catch (error) {
    console.error("Error fetching student by idNo:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching student",
      error: error.message,
    });
  }
};