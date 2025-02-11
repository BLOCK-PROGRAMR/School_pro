const mongoose = require("mongoose");

const academicYearSchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: true,
      match: /^\d{4}-\d{4}$/,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    classes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
    ],
    towns: [
      // Add the towns field as an array of ObjectId references to the Town model
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Town", // Reference to the Town model
      },
    ],
    buses: [
      // Add buses field as an array of ObjectId references to the Bus model
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bus",
      },
    ],
    exams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("AcademicYear", academicYearSchema);




