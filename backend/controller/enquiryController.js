// const Enquiry = require('../models/Enquiry');
// const { validateObjectId } = require('../utils/validation');

// // Create new enquiry
// exports.createEnquiry = async (req, res) => {
//   try {
//     const enquiryData = req.body;

//     // Validate required fields
//     const requiredFields = ['studentName', 'fatherName', 'phoneNo', 'academicYear', 'class', 'section', 'student', 'reference', 'branchId'];
//     const missingFields = requiredFields.filter(field => !enquiryData[field]);

//     if (missingFields.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: `Missing required fields: ${missingFields.join(', ')}`
//       });
//     }

//     const enquiry = new Enquiry(enquiryData);
//     await enquiry.save();

//     res.status(201).json({
//       success: true,
//       message: 'Enquiry created successfully',
//       data: enquiry
//     });
//   } catch (error) {
//     console.error('Enquiry creation error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error creating enquiry',
//       error: error.message
//     });
//   }
// };

// // Other controller functions like getEnquiries, updateEnquiryStatus, etc., stay the same.


// // Get all enquiries for a branch
// exports.getEnquiries = async (req, res) => {
//   try {
//     const { branchId } = req.params;

//     if (!validateObjectId(branchId)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid branch ID'
//       });
//     }

//     const enquiries = await Enquiry.find({ branchId })
//       .populate('academicYear', 'year')
//       .populate('class', 'name')
//       .populate('section', 'name')
//       .populate('student', 'name')
//       .sort('-createdAt');

//     res.status(200).json({
//       success: true,
//       data: enquiries
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching enquiries',
//       error: error.message
//     });
//   }
// };

// // Update enquiry status
// exports.updateEnquiryStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     if (!validateObjectId(id)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid enquiry ID'
//       });
//     }

//     const enquiry = await Enquiry.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true }
//     );

//     if (!enquiry) {
//       return res.status(404).json({
//         success: false,
//         message: 'Enquiry not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Enquiry status updated successfully',
//       data: enquiry
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error updating enquiry status',
//       error: error.message
//     });
//   }
// };

// // Get single enquiry
// exports.getEnquiry = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!validateObjectId(id)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid enquiry ID'
//       });
//     }

//     const enquiry = await Enquiry.findById(id)
//       .populate('academicYear', 'year')
//       .populate('class', 'name')
//       .populate('section', 'name')
//       .populate('student', 'name');

//     if (!enquiry) {
//       return res.status(404).json({
//         success: false,
//         message: 'Enquiry not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: enquiry
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching enquiry',
//       error: error.message
//     });
//   }
// };


// // controllers/enquiryController.js
// exports.createEnquiry = async (req, res) => {
//     try {
//       const enquiryData = req.body;

//       // Validate required fields
//       const requiredFields = ['studentName', 'fatherName', 'phoneNo', 'academicYear', 'class', 'section', 'student', 'reference', 'branchId'];
//       const missingFields = requiredFields.filter(field => !enquiryData[field]);

//       if (missingFields.length > 0) {
//         return res.status(400).json({
//           success: false,
//           message: `Missing required fields: ${missingFields.join(', ')}`
//         });
//       }

//       const enquiry = new Enquiry(enquiryData);
//       await enquiry.save();

//       res.status(201).json({
//         success: true,
//         message: 'Enquiry created successfully',
//         data: enquiry
//       });
//     } catch (error) {
//       console.error('Enquiry creation error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Error creating enquiry',
//         error: error.message
//       });
//     }
//   };


const Enquiry = require('../models/Enquiry');
const { validateObjectId } = require('../utils/validation');

// Create new enquiry
exports.createEnquiry = async (req, res) => {
  try {
    const enquiryData = req.body;

    // Validate required fields
    const requiredFields = ['studentName', 'age', 'address', 'academicYear', 'class', 'branchId'];
    const missingFields = requiredFields.filter(field => !enquiryData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Set default reference if not provided
    if (!enquiryData.reference) {
      enquiryData.reference = 'None';
    }

    const enquiry = new Enquiry(enquiryData);
    await enquiry.save();

    res.status(201).json({
      success: true,
      message: 'Enquiry created successfully',
      data: enquiry
    });
  } catch (error) {
    console.error('Enquiry creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating enquiry',
      error: error.message
    });
  }
};

// Get all enquiries for a branch
exports.getEnquiries = async (req, res) => {
  try {
    const { branchId } = req.params;

    if (!validateObjectId(branchId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid branch ID'
      });
    }

    const enquiries = await Enquiry.find({ branchId })
      .populate('academicYear', 'year')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: enquiries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching enquiries',
      error: error.message
    });
  }
};

// Update enquiry status
exports.updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!validateObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid enquiry ID'
      });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Enquiry status updated successfully',
      data: enquiry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating enquiry status',
      error: error.message
    });
  }
};

// Get single enquiry
exports.getEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid enquiry ID'
      });
    }

    const enquiry = await Enquiry.findById(id)
      .populate('academicYear', 'year');

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: enquiry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching enquiry',
      error: error.message
    });
  }
};