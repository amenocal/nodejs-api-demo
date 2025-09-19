const userService = require('../services/userService');
const { asyncHandler } = require('../middleware/errorHandler');

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query;
  
  const result = await userService.getAllUsers({ page, limit, search });
  
  res.json({
    success: true,
    data: result.users,
    pagination: result.pagination
  });
});

// Get user by ID
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const user = await userService.getUserById(id);
  
  res.json({
    success: true,
    data: user
  });
});

// Create new user
const createUser = asyncHandler(async (req, res) => {
  const { name, email, age } = req.body;
  
  const user = await userService.createUser({ name, email, age });
  
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: user
  });
});

// Update user
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;
  
  const user = await userService.updateUser(id, { name, email, age });
  
  res.json({
    success: true,
    message: 'User updated successfully',
    data: user
  });
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const deletedUser = await userService.deleteUser(id);
  
  res.json({
    success: true,
    message: 'User deleted successfully',
    data: deletedUser
  });
});

// Get user statistics
const getUserStats = asyncHandler(async (req, res) => {
  const totalUsers = await userService.getUserCount();
  
  res.json({
    success: true,
    data: {
      totalUsers,
      timestamp: new Date().toISOString()
    }
  });
});

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
};
