const mongoose = require('mongoose');

// Validate MongoDB ObjectId
exports.validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Validate Account Data
exports.validateAccount = (data) => {
  const errors = [];

  // Required fields
  if (!data.name || !data.name.trim()) {
    errors.push('Name is required');
  }

  if (!data.username || !data.username.trim()) {
    errors.push('Username is required');
  }

  if (!data.password || !data.password.trim()) {
    errors.push('Password is required');
  }

  if (!data.phone || !/^\d{10}$/.test(data.phone)) {
    errors.push('Valid 10-digit phone number is required');
  }

  if (!data.aadharNumber || !/^\d{12}$/.test(data.aadharNumber)) {
    errors.push('Valid 12-digit Aadhar number is required');
  }

  if (!data.academic_id || !mongoose.Types.ObjectId.isValid(data.academic_id)) {
    errors.push('Valid academic year ID is required');
  }

  if (!data.branchId || !mongoose.Types.ObjectId.isValid(data.branchId)) {
    errors.push('Valid branch ID is required');
  }

  // Address validation
  if (data.address) {
    if (data.address.pincode && !/^\d{6}$/.test(data.address.pincode)) {
      errors.push('Valid 6-digit pincode is required');
    }
  }

  return {
    error: errors.length > 0 ? { details: [{ message: errors.join(', ') }] } : null
  };
};