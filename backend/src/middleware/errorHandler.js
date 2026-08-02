const { errorResponse } = require('../utils/apiResponse');

/**
 * Global Express Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('❌ Express Error Stack:', err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Handle Multer upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return errorResponse(res, 400, 'File size exceeds maximum limit of 5MB');
  }

  // Handle Prisma Database Errors
  if (err.code === 'P2002') {
    const target = err.meta?.target ? err.meta.target.join(', ') : 'field';
    return errorResponse(res, 409, `Duplicate entry error: A record with this ${target} already exists`);
  }

  return errorResponse(res, statusCode, message, err.errors || null);
};

module.exports = errorHandler;
