// Request validation middleware
const validateUserInput = (req, res, next) => {
  const { name, email, age } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Name is required and must be a non-empty string'
    });
  }

  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Email is required and must be a non-empty string'
    });
  }

  if (!age || isNaN(age)) {
    return res.status(400).json({
      success: false,
      message: 'Age is required and must be a number'
    });
  }

  next();
};

// Validate user ID parameter
const validateUserId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || isNaN(id) || parseInt(id) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Valid user ID is required'
    });
  }

  next();
};

// Validate query parameters for filtering
const validateQueryParams = (req, res, next) => {
  const { page, limit } = req.query;

  if (page && (isNaN(page) || parseInt(page) <= 0)) {
    return res.status(400).json({
      success: false,
      message: 'Page must be a positive number'
    });
  }

  if (limit && (isNaN(limit) || parseInt(limit) <= 0 || parseInt(limit) > 100)) {
    return res.status(400).json({
      success: false,
      message: 'Limit must be a positive number and not exceed 100'
    });
  }

  next();
};

// Request validation middleware for posts
const validatePostInput = (req, res, next) => {
  const { title, content, status } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Title is required and must be a non-empty string'
    });
  }

  if (title.trim().length > 200) {
    return res.status(400).json({
      success: false,
      message: 'Title must not exceed 200 characters'
    });
  }

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Content is required and must be a non-empty string'
    });
  }

  if (content.trim().length > 10000) {
    return res.status(400).json({
      success: false,
      message: 'Content must not exceed 10000 characters'
    });
  }

  if (status && !['draft', 'published'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Status must be either "draft" or "published"'
    });
  }

  next();
};

// Validate post ID parameter
const validatePostId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || isNaN(id) || parseInt(id) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Valid post ID is required'
    });
  }

  next();
};

module.exports = {
  validateUserInput,
  validateUserId,
  validateQueryParams,
  validatePostInput,
  validatePostId
};
