const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    sections: [
      {
        type: mongoose.Schema.Types.ObjectId, // Reference to Section model
        ref: "Section", // The name of the Section model
      },
    ],
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
    },
    subjects: {
      mainSubjects: [
        {
          type: String, // Array of main subject names as strings
          required:true,
        },
      ],
      additionalSubjects: [
        {
          type: String, // Array of additional subject names as strings
          required: false, // Additional subjects are optional
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema);
