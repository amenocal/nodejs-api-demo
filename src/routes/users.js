const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/userController');

const {
  validateUserInput,
  validateUserId,
  validateQueryParams
} = require('../middleware/validation');

const { generalLimiter, strictLimiter } = require('../middleware/rateLimiter');

// GET /api/users - Get all users with pagination and search
router.get('/', 
  generalLimiter,
  validateQueryParams,
  getAllUsers
);

// GET /api/users/stats - Get user statistics
router.get('/stats', 
  generalLimiter,
  getUserStats
);

// GET /api/users/:id - Get user by ID
router.get('/:id', 
  generalLimiter,
  validateUserId,
  getUserById
);

// POST /api/users - Create new user
router.post('/', 
  strictLimiter,
  validateUserInput,
  createUser
);

// PUT /api/users/:id - Update user
router.put('/:id', 
  strictLimiter,
  validateUserId,
  validateUserInput,
  updateUser
);

// DELETE /api/users/:id - Delete user
router.delete('/:id', 
  strictLimiter,
  validateUserId,
  deleteUser
);

module.exports = router;
