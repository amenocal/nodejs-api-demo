// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Validation errors
  if (err.validationErrors) {
    return res.status(400).json({
      success: false,
      message: err.message,
      errors: err.validationErrors
    });
  }

  // User not found or similar business logic errors
  if (err.message.includes('not found') || err.message.includes('does not exist')) {
    return res.status(404).json({
      success: false,
      message: err.message
    });
  }

  // Conflict errors (duplicate email, etc.)
  if (err.message.includes('already exists') || err.message.includes('duplicate')) {
    return res.status(409).json({
      success: false,
      message: err.message
    });
  }

  // Default server error
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 404 handler for undefined routes
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`
  });
};

module.exports = {
  errorHandler,
  asyncHandler,
  notFoundHandler
};
