//  // routers/enquiryRoutes.js
// const express = require('express');
// const router = express.Router();

// // Directly import authMiddleware
// const { authMiddleware } = require('../middleware/Authtoken');
// const {
//   createEnquiry,
//   getEnquiries,
//   updateEnquiryStatus,
//   getEnquiry
// } = require('../controller/enquiryController');

// // Protected routes
// router.post('/', authMiddleware, createEnquiry); // Use authMiddleware directly
// router.get('/branch/:branchId', authMiddleware, getEnquiries);
// router.get('/:id', authMiddleware, getEnquiry);
// router.patch('/:id/status', authMiddleware, updateEnquiryStatus);

// module.exports = router;

const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/Authtoken');
const {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  getEnquiry
} = require('../controller/enquiryController');

// Protected routes
router.post('/', authMiddleware, createEnquiry);
router.get('/branch/:branchId', authMiddleware, getEnquiries);
router.get('/:id', authMiddleware, getEnquiry);
router.patch('/:id/status', authMiddleware, updateEnquiryStatus);

module.exports = router;