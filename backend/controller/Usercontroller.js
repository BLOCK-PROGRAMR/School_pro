const User = require("../models/users");
const Branch = require("../models/Branches");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teachers")
// Register Main Admin
exports.registerMainAdmin = async (req, res) => {
  try {
    const { name, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      username,
      password: hashedPassword,
      role: "MainAdmin",
    });
    await user.save();
    res
      .status(201)
      .json({ success: true, message: "Main Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login
// exports.login = async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });
//     if (!user)
//       return res
//         .status(400)
//         .json({ success: false, message: "user not exist" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res
//         .status(400)
//         .json({ success: false, error: true, message: "password mismatch" });

//     const token = jwt.sign(
//       {
//         id: user._id,
//         role: user.role,
//         name: user.name,
//         branch: user.branch ? user.branch : null,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "2h" }
//     );
//     res.json({
//       data: user,
//       success: true,
//       message: "Logged in successfully",
//       token,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("username is: ",username);
    console.log("password is: ",password);
    const user = await User.findOne({ username });
      if(user){
    console.log("user is: ",user);

      }
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("isMatch is: ",isMatch);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, error: true, message: "Password mismatch" });
    }

    let teacherData = null;

    // Fetch teacher data if the user's role is Teacher
    if (user.role === "Teacher") {
      teacherData = await Teacher.findOne({ username:username }).select(
        "-password"
      ); // Exclude sensitive fields like `password`
    }

    // Generate JWT token with teacher data if applicable
    const tokenPayload = {
      id: user._id,
      role: user.role,
      name: user.name,
      branch: user.branch ? user.branch : null,
      ...(teacherData && { teacherData }), // Include teacher data if present
    };
    console.log("token payload: ",tokenPayload)
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({
      data: user,
      teacherData, // Include teacher data in the response
      success: true,
      message: "Logged in successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Delete Branch Admin
exports.deleteBranchAdmin = async (req, res) => {
  const adminId = req.params.adminId;

  try {
    // Find and delete the admin by ID
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "BranchAdmin") {
      return res.status(404).json({
        success: false,
        message: "Admin not found or is not a branch admin",
      });
    }

    // Remove the branchAdmin reference from the branch
    if (admin.branch) {
      await Branch.findByIdAndUpdate(admin.branch, {
        $unset: { branchAdmin: "" },
      });
    }

    // Delete the admin
    await User.findByIdAndDelete(adminId);

    res
      .status(200)
      .json({ success: true, message: "Branch admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting branch admin:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting branch admin",
    });
  }
};

// Update Main Admin
exports.updateMainAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, password } = req.body;

    const updatedData = { name, username };
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(id, updatedData, { new: true });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Main Admin not found" });
    }

    res.json({
      success: true,
      message: "Main Admin updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Branch Admin
exports.updateBranchAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, password, branchId } = req.body;

    const updatedData = { name, username, branch: branchId };
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(id, updatedData, { new: true });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Branch Admin not found" });
    }

    res.json({
      success: true,
      message: "Branch Admin updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.assignBranchAdmin = async (req, res) => {
  const { name, username, password, branchId } = req.body;

  try {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new branch admin
    const branchAdmin = await User.create({
      name,
      username,
      password: hashedPassword,
      role: "BranchAdmin",
      branch: branchId,
    });

    // Update branch with admin reference
    await Branch.findByIdAndUpdate(branchId, { branchAdmin: branchAdmin._id });

    res.status(201).json({
      success: true,
      message: "Branch admin assigned successfully",
      data: branchAdmin,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all branch admins
exports.getAllBranchAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "BranchAdmin" }).populate("branch");
    res.status(200).json({ success: true, admins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.editBranchAdmin = async (req, res) => {
  const { adminId } = req.params; // The ID of the branch admin to be edited
  const { name, username, password, branchId } = req.body;

  try {
    // Find the branch admin by ID
    const branchAdmin = await User.findById(adminId);

    if (!branchAdmin || branchAdmin.role !== "BranchAdmin") {
      return res.status(404).json({
        success: false,
        message: "Branch admin not found",
      });
    }

    // If password is provided, hash the new password
    let updatedFields = { name, username };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedFields.password = hashedPassword;
    }

    // Update the branch admin's details
    const updatedAdmin = await User.findByIdAndUpdate(
      adminId,
      { $set: updatedFields },
      { new: true }
    );

    // If the branch ID has changed, update the branch association
    if (branchId && branchId !== branchAdmin.branch.toString()) {
      // Remove admin from the previous branch
      await Branch.findByIdAndUpdate(branchAdmin.branch, {
        $unset: { branchAdmin: "" },
      });

      // Add admin to the new branch
      await Branch.findByIdAndUpdate(branchId, { branchAdmin: adminId });

      updatedAdmin.branch = branchId;
      await updatedAdmin.save();
    }

    res.status(200).json({
      success: true,
      message: "Branch admin updated successfully",
      data: updatedAdmin,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBranchAdmin = async (req, res) => {
  const { adminId } = req.params; // Retrieve branchId from the URL parameters

  try {
    // Find the user where the role is 'BranchAdmin' and the branch matches the branchId
    const branchAdmin = await User.findOne({
      role: "BranchAdmin",
      _id: adminId,
    });

    if (!branchAdmin) {
      return res.status(404).json({
        success: false,
        message: "Branch admin not found for this branch",
      });
    }

    res.status(200).json({
      success: true,
      message: "Branch admin fetched successfully",
      data: branchAdmin,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
