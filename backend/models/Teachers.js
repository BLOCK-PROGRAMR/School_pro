const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },    
    username: {
        type: String,
        required: true,
      },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v);
            },
            message: 'Phone number must be 10 digits'
        }
    },
    address: {
        doorNo: String,
        street: String,
        city: String,
        pincode: {
            type: String,
            validate: {
                validator: function (v) {
                    return /^\d{6}$/.test(v);
                },
                message: 'Pincode must be 6 digits'
            }
        }
    },
    qualification: String,
    experience: {
        type: Number,
        min: 0
    },
    teachingSubjects: [{
        name: String
    }],
    joiningDate: Date,
    aadharNumber: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\d{12}$/.test(v);
            },
            message: 'Aadhar number must be 12 digits'
        }
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    },
    academic_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AcademicYear',
        required: true
    },
    role: {
        type: String,
        enum: ['Teacher'],
        default: 'Teacher'
    }
}, {
    timestamps: true
});
teacherSchema.index({ aadharNumber: 1, academic_id: 1 }, { unique: true });

module.exports = mongoose.model('Teacher', teacherSchema);