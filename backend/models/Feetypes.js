const mongoose = require("mongoose");

const FeeTypeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },
    terms: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4], // Valid values: 1, 2, 3, 4
    },

    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicYear", // Assuming you have an AcademicYear model
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("FeeType", FeeTypeSchema);
