const jwt = require('jsonwebtoken');
const prisma = require('../utils/prismaClient');
const { errorResponse } = require('../utils/apiResponse');

/**
 * Protect routes: Verify JWT token & attach user to request object
 */
const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return errorResponse(res, 401, 'Authentication failed: Bearer token missing');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'agiconnect-dev-secret-key-change-in-production');

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        location: true,
        createdAt: true
      }
    });

    if (!user) {
      return errorResponse(res, 401, 'User associated with token no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 401, 'Invalid authentication token');
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Authentication token has expired');
    }
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Authorize roles: Restrict access based on user role ("farmer", "equipment_owner")
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(
        res,
        403,
        `Forbidden: Role '${req.user ? req.user.role : 'guest'}' is not authorized to access this resource`
      );
    }
    next();
  };
};

module.exports = {
  protect,
  verifyToken: protect,
  authorize
};
