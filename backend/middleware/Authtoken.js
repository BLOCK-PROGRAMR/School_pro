const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({
        error: true,
        success: false,
        message: "Authorization header missing",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    try {
      console.log("Verifying token");
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
      
      // Log user information for debugging
      console.log("Authenticated user:", {
        id: req.user.id,
        role: req.user.role,
        name: req.user.name,
        isAccountant: req.user.isAccountant
      });
      
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      return res
        .status(401)
        .json({ 
          error: true, 
          success: false, 
          message: "Invalid or expired token" 
        });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      error: true,
      success: false,
      message: "Authentication failed"
    });
  }
};

// Add role-based access control middleware for consistency
exports.checkRole = (roles) => {
  return (req, res, next) => {
    console.log('User role:', req.user.role);
    console.log('Allowed roles:', roles);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: insufficient permissions'
      });
    }
    next();
  };
};
