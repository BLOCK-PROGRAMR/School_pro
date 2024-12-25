const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
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
  },
  hostel: Boolean,
  hostelDetails: {
    hostelFee: String,
    terms: String,
  },
  feeDetails: [
    {
      name: String,
      amount: Number,
      terms: String,
      concession: Number,
      finalAmount: Number,
    },
  ],
  paidFee: [
    {
      name: { type: String }, // e.g., "Bus", "ID Card"
      terms: {
        // Use Map to allow dynamic keys (e.g., "Term 1", "Term 2", etc.)
        type: Map,
        of: [
          {
            amountPaid: { type: Number },
            dueAmount: { type: Number },
            paidDate: { type: Date },
          },
        ],
      },
    },
  ],
});

module.exports = mongoose.model("Student", studentSchema);
