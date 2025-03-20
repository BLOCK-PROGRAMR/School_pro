// models/Bus.js

const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    busNo: {
      type: String,
      required: true,
      unique: true,
    },
    vehicleNo: {
      type: String,
      required: true,
    },
    driverName: {
      type: String,
      required: true,
    },
    driverPhone: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      // required: true,
    },
    viaTowns: {
      type: [String],
      required: true,
    },
    academicId: {
      type: mongoose.Schema.Types.ObjectId, // Assuming you have an Academic model
      required: true,
      ref: "Academic",
    },
  },
  {
    timestamps: true,
  }
);

busSchema.index({ busNo: 1, academicId: 1 }, { unique: true });
busSchema.index({ vehicleNo: 1, academicId: 1 }, { unique: true });
module.exports = mongoose.model("Bus", busSchema);
