const mongoose = require("mongoose");

const townSchema = new mongoose.Schema(
  {
    townName: {
      type: String,
      trim: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    halts: [
      {
        type: String,
        required: true,
      },
    ],
    academicId: {
      type: mongoose.Schema.Types.ObjectId, // Assuming you have an Academic model
      required: true,
      ref: "Academic", // Reference to the Academic model, change if your model name is different
    },
    Terms: {
      type: Number,
      default: 4, // Default value for Terms if not provided
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields
  }
);
townSchema.index({ townName: 1, academicId: 1 }, { unique: true });
const Town = mongoose.model("Town", townSchema);

module.exports = Town;
