const Student = require("../models/student");
// const cloudinary = require('cloudinary').v2;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Add a new student
exports.addStudent = async (req, res) => {
  try {
    const { idNo, aadharNo, name } = req.body;

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

exports.getStudentById = async (req, res) => {
  try {
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

