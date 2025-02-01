const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    address: {
        doorNo: String,
        street: String,
        city: String,
        pincode: {
            type: String,
            validate: {
                validator: function(v) {
                    return /^\d{6}$/.test(v);
                },
                message: props => `${props.value} is not a valid pincode!`
            }
        }
    },
    qualification: String,
    experience: {
        type: Number,
        min: 0
    },
    joiningDate: Date,
    aadharNumber: {
        type: String,
        required: [true, 'Aadhar number is required'],
        unique: true,
        validate: {
            validator: function(v) {
                return /^\d{12}$/.test(v);
            },
            message: props => `${props.value} is not a valid Aadhar number!`
        }
    },
    academic_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AcademicYear',
        required: true
    },
    role: {
        type: String,
        default: 'Account'
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for faster queries
accountSchema.index({ branchId: 1, academic_id: 1 });
accountSchema.index({ username: 1 }, { unique: true });
accountSchema.index({ aadharNumber: 1 }, { unique: true });

module.exports = mongoose.model('Account', accountSchema);