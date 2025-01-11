const express = require("express");
const router = express.Router();
const {
  createReceipt,
  getReceiptCountByPrefix,
  getReceiptsByStudentAndYear
} = require("../controller/RecieptController");

// Route to create a new receipt
router.post("/create", createReceipt);
router.get("/get-reciepts/:academicYearID",getReceiptsByStudentAndYear);

// Route to get the count of receipts by rcNo prefix
router.get("/count/:prefix", getReceiptCountByPrefix);

module.exports = router;
