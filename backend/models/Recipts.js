const mongoose = require("mongoose");

const Reciepts = new mongoose.Schema({
  studentID: {
    type: String,
    required: true,
  },
  academicYearID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AcademicYear", // Reference to the AcademicYear model
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  rcNo: {
    type: String,
    required: true,
  },
  feeLedger: {
    type: [
      {
        name: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
});

// Model creation
const Receipts = mongoose.model("StudentFeeReceipt", Reciepts);

module.exports = Receipts;
