const mongoose = require("mongoose");

// Using the same schema as Student to maintain data structure
const trashSchema = new mongoose.Schema({
  idNo: { type: String },
  admissionNo: String,
  academic_id: String,
  surname: String,
  name: String,
  gender: String,
  class: {
    name: {
      type: String,
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
  },
  section: {
    name: {
      type: String,
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  },
  dob: Date,
  admissionDate: Date,
  photo: String,
  aadharNo: String,
  studentAAPR: String,
  caste: String,
  subCaste: String,
  fatherName: String,
  fatherAadhar: String,
  fatherOccupation: String,
  motherName: String,
  motherAadhar: String,
  motherOccupation: String,
  whatsappNo: String,
  emergencyContact: String,
  address: {
    doorNo: String,
    street: String,
    city: String,
    pincode: String,
  },
  transport: Boolean,
  transportDetails: {
    town: String,
    bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: false },
    halt: String,
    terms: String,
  },
  hostel: Boolean,
  hostelDetails: {
    hostelFee: String,
    terms: String,
  },
  oldfeeDetails: [
    {
      name: String,
      amount: Number,
      terms: String,
      concession: Number,
      finalAmount: Number,
      paidFee: Number,
    },
  ],
  feeDetails: [
    {
      name: String,
      amount: Number,
      terms: String,
      concession: Number,
      finalAmount: Number,
      paidFee: Number,
    },
  ],
  olddue: {
    type: Number,
  },
  deletedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Trash", trashSchema);