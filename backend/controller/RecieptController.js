const StudentFeeReceipt = require("../models/Recipts");

// Create a new receipt
const createReceipt = async (req, res) => {
  try {
    const { studentID, academicYearID, date, rcNo, feeLedger,terms } = req.body;

    // Ensure all required fields are provided
    if (!studentID || !academicYearID || !date || !rcNo || !feeLedger) {
      return res.status(400).json({
        success: false,
        message: "All fields (studentID, academicYearID, date, rcNo, feeLedger) are required",
      });
    }

    // Calculate total amount from feeLedger array
    const totalAmount = feeLedger.reduce((sum, entry) => sum + entry.amount, 0);

    // Create the receipt
    const newReceipt = new StudentFeeReceipt({
      studentID,
      academicYearID,
      date,
      terms,
      rcNo,
      feeLedger,
      totalAmount,
    });

    await newReceipt.save();

    return res.status(201).json({
      success: true,
      message: "Receipt created successfully",
      receipt: newReceipt,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating receipt",
      error: error.message,
    });
  }
};

// Get count of receipts where rcNo starts with a specific prefix
const getReceiptCountByPrefix = async (req, res) => {
  try {
    const { prefix } = req.params;

    if (!prefix) {
      return res.status(400).json({
        success: false,
        message: "Prefix parameter is required",
      });
    }

    // Use regex to find rcNo starting with the prefix
    const count = await StudentFeeReceipt.countDocuments({
      rcNo: { $regex: `^${prefix}` },
    });

    return res.status(200).json({
      success: true,
      message: `Count of receipts starting with "${prefix}" retrieved successfully`,
      count,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving count",
      error: error.message,
    });
  }
};
// Fetch receipts by academicYearID and studentID
// Fetch receipts by academicYearID and optionally by studentID
const getReceiptsByStudentAndYear = async (req, res) => {
  try {
    const { academicYearID } = req.params; // Get academicYearID from URL params
    const { studentID } = req.query; // Get studentID from query parameters

    // Check if academicYearID is provided
    if (!academicYearID) {
      return res.status(400).json({
        success: false,
        message: "academicYearID is required",
      });
    }

    // Build query based on the presence of studentID
    let query = { academicYearID };

    if (studentID) {
      query.studentID = studentID; // Add studentID to the query if provided
    }

    // Fetch receipts based on the built query
    const receipts = await StudentFeeReceipt.find(query);

    if (receipts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No receipts found for the given criteria",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Receipts retrieved successfully",
      receipts,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving receipts",
      error: error.message,
    });
  }
};





module.exports = {
  createReceipt,
  getReceiptCountByPrefix,
  getReceiptsByStudentAndYear,
};
