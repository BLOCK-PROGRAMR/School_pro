// controllers/feeTypeController.js
const FeeType = require("../models/Feetypes");
const Section = require("../models/sections");

// Add a new fee type
exports.addFeeType = async (req, res) => {
  const { type, terms, academicYear } = req.body;

  try {
    const newFeeType = new FeeType({ type, terms, academicYear });
    await newFeeType.save();
    return res.status(201).json({ success: true, feeType: newFeeType });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to add fee type", error });
  }
};

// Add a new fee to a section
// Assuming Section is already import

exports.addFeeToSection = async (req, res) => {
  const { sectionId } = req.params;
  const { fees } = req.body; // Expecting fees to be an array
  console.log(fees);
  // Check if fees are provided
  if (!Array.isArray(fees) || fees.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No fees provided" });
  }

  try {
    const section = await Section.findById(sectionId);
    if (!section)
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });

    fees.forEach(({ feeType, amount }) => {
      if (!feeType || !amount) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Fee name and amount are required",
          });
      }

      const existingFee = section.fees.find((fee) => fee.feeType === feeType);
      if (existingFee) {
        existingFee.amount = amount; // Update existing fee amount
      } else {
        section.fees.push({ feeType: feeType, amount }); // Add new fee
      }
    });

    await section.save();
    return res.status(200).json({ success: true, section });
  } catch (error) {
    console.error("Error adding fee:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error adding fee" });
  }
};

exports.updateFeeInSection = async (req, res) => {
  const { sectionId } = req.params;
  const { fees } = req.body; // Expecting an array of fees

  console.log("Received fees for update:", fees);

  if (!Array.isArray(fees) || fees.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No fees provided" });
  }

  try {
    const section = await Section.findById(sectionId);
    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }

    // Update or add fees
    fees.forEach(({ feeType, amount }) => {
      if (!feeType || !amount) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Fee type and amount are required",
          });
      }

      const existingFee = section.fees.find((fee) => fee.feeType === feeType);
      if (existingFee) {
        existingFee.amount = amount; // Update existing fee amount
      } else {
        section.fees.push({ feeType, amount }); // Add new fee if it doesn't exist
      }
    });

    await section.save();
    return res.status(200).json({ success: true, section });
  } catch (error) {
    console.error("Error updating fee:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error updating fee" });
  }
};

exports.removeFeeFromSection = async (req, res) => {
  const { sectionId, feeId } = req.params; // Get sectionId and feeId from the request parameters

  try {
    const section = await Section.findById(sectionId);

    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }

    // Convert feeId to string for comparison and remove the fee from the fees array
    const initialFeesLength = section.fees.length;
    section.fees = section.fees.filter(
      (fee, index) => fee._id.toString() !== feeId
    );

    // If no fee was removed, return a 404 error
    if (section.fees.length === initialFeesLength) {
      return res
        .status(404)
        .json({ success: false, message: "Fee not found in section" });
    }

    // Save the updated section
    await section.save();

    return res.status(200).json({
      success: true,
      message: "Fee removed successfully",
      section, // Optionally return the updated section
    });
  } catch (error) {
    console.error("Error removing fee:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all fee types
exports.getAllFeeTypes = async (req, res) => {
  try {
    const { acyearid } = req.params;
    console.log(acyearid);
    const feeTypes = await FeeType.find({ academicYear: acyearid });
    return res.status(200).json({ success: true, feeTypes });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to retrieve fee types", error });
  }
};

// Update a fee type
exports.updateFeeType = async (req, res) => {
  const { feeTypeId } = req.params;
  const { type, terms } = req.body;
  console.log(type, terms, feeTypeId);
  try {
    const updatedFeeType = await FeeType.findByIdAndUpdate(
      feeTypeId,
      { type, terms },
      { new: true }
    );
    if (!updatedFeeType) {
      return res
        .status(404)
        .json({ success: false, message: "Fee type not found" });
    }
    return res.status(200).json({ success: true, feeType: updatedFeeType });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to update fee type", error });
  }
};

// Delete a fee type
exports.deleteFeeType = async (req, res) => {
  const { feeTypeId } = req.params;

  try {
    const deletedFeeType = await FeeType.findByIdAndDelete(feeTypeId);
    if (!deletedFeeType) {
      return res
        .status(404)
        .json({ success: false, message: "Fee type not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Fee type deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete fee type", error });
  }
};
