



// const mongoose = require('mongoose');

// const enquirySchema = new mongoose.Schema({
//   // Student Information
//   studentName: {
//     type: String,
//     required: true
//   },
//   age: {
//     type: Number,
//     required: true,
//     min: 1,
//     max: 100
//   },
//   address: {
//     type: String,
//     required: true
//   },

//   // Academic Information
//   academicYear: {
//     type: mongoose.Schema.Types.ObjectId || String,
//     ref: 'AcademicYear',
//     required: true
//   },
//   class: {
//     type: String,
//     required: true
//   },

//   // Reference Information
//   reference: {
//     type: String,
//     default: 'None'
//   },

//   // Branch Information
//   branchId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Branch',
//     required: true
//   },



//   // Timestamps
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Update timestamp on save
// enquirySchema.pre('save', function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

// module.exports = mongoose.model('Enquiry', enquirySchema);


const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  // Student Information
  studentName: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  address: {
    type: String,
    required: true
  },

  // Academic Information
  academicYear: {
    type: mongoose.Schema.Types.Mixed, // Accepts both ObjectId and String
    required: true
  },
  class: {
    type: String,
    required: true
  },

  // Reference Information
  reference: {
    type: String,
    default: 'None'
  },

  // Branch Information
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
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
