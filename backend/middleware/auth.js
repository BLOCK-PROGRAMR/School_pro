const jwt = require('jsonwebtoken');

// Authentication middleware
exports.auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log('Auth header:', req.header('Authorization'));
        console.log('Token:', token);
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No authentication token provided'
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded token:', decoded);
            req.user = decoded;
            next();
        } catch (error) {
            console.error('Token verification error:', error);
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};

// Role-based access control middleware
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
