const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  // Student Information
  studentName: {
    type: String,
    required: true
  },
  fatherName: {
    type: String,
    required: true
  },
  phoneNo: {
    type: String,
    required: true
  },

  // Address Information
  town: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: false
  },
  street2: {
    type: String,
    required: false
  },

  // Academic Information
  academicYear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicYear',
    required: true
  },
  class: {

    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },

  // Reference Information
  reference: {
    type: String,
    required: true
  },

  // Branch Information
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },

  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'inProgress', 'completed', 'cancelled'],
    default: 'pending'
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
enquirySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Enquiry', enquirySchema);