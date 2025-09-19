const User = require('../models/User');

class UserService {
  constructor() {
    // In-memory storage (replace with database in production)
    this.users = [
      new User(1, 'John Doe', 'john@example.com', 30),
      new User(2, 'Jane Smith', 'jane@example.com', 25),
      new User(3, 'Bob Johnson', 'bob@example.com', 35)
    ];
    this.nextId = 4;
  }

  // Get all users with optional filtering and pagination
  async getAllUsers(options = {}) {
    const { page = 1, limit = 10, search } = options;
    
    let filteredUsers = [...this.users];
    
    // Search functionality
    if (search) {
      filteredUsers = this.users.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    return {
      users: paginatedUsers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredUsers.length / limit),
        totalUsers: filteredUsers.length,
        limit: parseInt(limit)
      }
    };
  }

  // Get user by ID
  async getUserById(id) {
    const user = this.users.find(user => user.id === parseInt(id));
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    return user;
  }

  // Create new user
  async createUser(userData) {
    const user = User.create(userData);
    
    // Validate user data
    const validationErrors = user.validate();
    if (validationErrors.length > 0) {
      const error = new Error('Validation failed');
      error.validationErrors = validationErrors;
      throw error;
    }
    
    // Check if email already exists
    const existingUser = this.users.find(u => u.email === user.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Assign ID and add to storage
    user.id = this.nextId++;
    this.users.push(user);
    
    return user;
  }

  // Update user
  async updateUser(id, userData) {
    const user = await this.getUserById(id);
    
    // Create updated user instance
    const updatedUser = user.update(userData);
    
    // Validate updated data
    const validationErrors = updatedUser.validate();
    if (validationErrors.length > 0) {
      const error = new Error('Validation failed');
      error.validationErrors = validationErrors;
      throw error;
    }
    
    // Check if email already exists for another user
    const existingUser = this.users.find(u => 
      u.email === updatedUser.email && u.id !== parseInt(id)
    );
    if (existingUser) {
      throw new Error('Email already exists for another user');
    }
    
    return updatedUser;
  }

  // Delete user
  async deleteUser(id) {
    const userIndex = this.users.findIndex(user => user.id === parseInt(id));
    if (userIndex === -1) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    const deletedUser = this.users.splice(userIndex, 1)[0];
    return deletedUser;
  }

  // Check if email exists
  async emailExists(email, excludeId = null) {
    return this.users.some(user => 
      user.email === email.toLowerCase() && 
      (excludeId ? user.id !== parseInt(excludeId) : true)
    );
  }

  // Get user count
  async getUserCount() {
    return this.users.length;
  }
}

// Export singleton instance
module.exports = new UserService();
