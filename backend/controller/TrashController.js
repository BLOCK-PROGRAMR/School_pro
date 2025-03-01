const Trash = require("../models/trash");
const Student = require("../models/student");
const mongoose = require("mongoose");

// Move student to trash
exports.moveToTrash = async (req, res) => {
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

    // Optionally, delete the associated user from the User model if needed
    await mongoose.model("User").deleteOne({ username: student.idNo });

    res.status(200).json({
      success: true,
      message: "Student moved to trash successfully",
    });
  } catch (error) {
    console.error("Error moving student to trash:", error);
    res.status(500).json({
      success: false,
      message: "Error moving student to trash",
      error: error.message,
    });
  }
};

// Get all trashed students
exports.getTrashedStudents = async (req, res) => {
  try {
    const trashedStudents = await Trash.find();
    
    res.status(200).json({
      success: true,
      data: trashedStudents,
    });
  } catch (error) {
    console.error("Error fetching trashed students:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching trashed students",
      error: error.message,
    });
  }
};

// Restore student from trash
exports.restoreFromTrash = async (req, res) => {
  try {
    const { sid } = req.params; // Get the trash entry ID from URL parameters

    // Find the trash entry by ID
    const trashEntry = await Trash.findById(sid);

    if (!trashEntry) {
      return res.status(404).json({
        success: false,
        message: "Trashed student not found",
      });
    }

    // Convert to plain object and remove trash-specific fields
    const studentData = trashEntry.toObject();
    delete studentData._id;
    delete studentData.deletedAt;
    delete studentData.__v;

    // Create a new student with the trash entry data
    const newStudent = new Student(studentData);
    await newStudent.save();

    // Create new user object if needed
    const hashedpsd = await require("bcryptjs").hash(trashEntry.aadharNo, 10);
    const newUser = {
      name: trashEntry.name,
      username: trashEntry.idNo,
      password: hashedpsd,
      role: "Student",
    };

    // Save the new user
    await mongoose.model("User").create(newUser);

    // Delete the trash entry
    await Trash.findByIdAndDelete(sid);

    res.status(200).json({
      success: true,
      message: "Student restored successfully",
      data: newStudent,
    });
  } catch (error) {
    console.error("Error restoring student from trash:", error);
    res.status(500).json({
      success: false,
      message: "Error restoring student from trash",
      error: error.message,
    });
  }
};

// Permanently delete student from trash
exports.permanentlyDeleteStudent = async (req, res) => {
  try {
    const { sid } = req.params; // Get the trash entry ID from URL parameters

    // Find and delete the trash entry by ID
    const trashEntry = await Trash.findByIdAndDelete(sid);

    if (!trashEntry) {
      return res.status(404).json({
        success: false,
        message: "Trashed student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student permanently deleted",
    });
  } catch (error) {
    console.error("Error permanently deleting student:", error);
    res.status(500).json({
      success: false,
      message: "Error permanently deleting student",
      error: error.message,
    });
  }
};