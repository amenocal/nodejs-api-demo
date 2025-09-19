const UserService = require('../src/services/userService');
const User = require('../src/models/User');

describe('UserService', () => {
  let userService;

  beforeEach(() => {
    // Create a fresh instance for each test
    userService = require('../src/services/userService');
    // Reset the users array to initial state
    userService.users = [
      new User(1, 'John Doe', 'john@example.com', 30),
      new User(2, 'Jane Smith', 'jane@example.com', 25),
      new User(3, 'Bob Johnson', 'bob@example.com', 35)
    ];
    userService.nextId = 4;
  });

  describe('getAllUsers', () => {
    it('should return all users with default pagination', async () => {
      const result = await userService.getAllUsers();
      
      expect(result.users).toHaveLength(3);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.totalUsers).toBe(3);
      expect(result.pagination.limit).toBe(10);
    });

    it('should return paginated results', async () => {
      const result = await userService.getAllUsers({ page: 1, limit: 2 });
      
      expect(result.users).toHaveLength(2);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.totalPages).toBe(2);
      expect(result.pagination.limit).toBe(2);
    });

    it('should filter users by search term', async () => {
      const result = await userService.getAllUsers({ search: 'john' });
      
      expect(result.users).toHaveLength(2); // John Doe and Bob Johnson
      expect(result.users[0].name).toBe('John Doe');
      expect(result.users[1].name).toBe('Bob Johnson');
    });

    it('should search by email', async () => {
      const result = await userService.getAllUsers({ search: 'jane@example.com' });
      
      expect(result.users).toHaveLength(1);
      expect(result.users[0].email).toBe('jane@example.com');
    });
  });

  describe('getUserById', () => {
    it('should return user by valid ID', async () => {
      const user = await userService.getUserById(1);
      
      expect(user.id).toBe(1);
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
    });

    it('should throw error for non-existent user', async () => {
      await expect(userService.getUserById(999))
        .rejects
        .toThrow('User with ID 999 not found');
    });
  });

  describe('createUser', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        age: 28
      };

      const user = await userService.createUser(userData);

      expect(user.id).toBe(4);
      expect(user.name).toBe('Alice Johnson');
      expect(user.email).toBe('alice@example.com');
      expect(user.age).toBe(28);
      expect(userService.users).toHaveLength(4);
    });

    it('should throw validation error for invalid data', async () => {
      const userData = {
        name: '',
        email: 'invalid-email',
        age: 'not-a-number'
      };

      await expect(userService.createUser(userData))
        .rejects
        .toThrow('Validation failed');
    });

    it('should throw error for duplicate email', async () => {
      const userData = {
        name: 'Duplicate User',
        email: 'john@example.com', // Already exists
        age: 30
      };

      await expect(userService.createUser(userData))
        .rejects
        .toThrow('User with this email already exists');
    });

    it('should normalize email to lowercase', async () => {
      const userData = {
        name: 'Test User',
        email: 'TEST@EXAMPLE.COM',
        age: 25
      };

      const user = await userService.createUser(userData);
      expect(user.email).toBe('test@example.com');
    });
  });

  describe('updateUser', () => {
    it('should update user with valid data', async () => {
      const userData = {
        name: 'John Updated',
        email: 'john.updated@example.com',
        age: 31
      };

      const user = await userService.updateUser(1, userData);

      expect(user.name).toBe('John Updated');
      expect(user.email).toBe('john.updated@example.com');
      expect(user.age).toBe(31);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should throw error for non-existent user', async () => {
      const userData = {
        name: 'Test',
        email: 'test@example.com',
        age: 25
      };

      await expect(userService.updateUser(999, userData))
        .rejects
        .toThrow('User with ID 999 not found');
    });

    it('should throw validation error for invalid data', async () => {
      const userData = {
        name: '',
        email: 'invalid-email',
        age: -5
      };

      await expect(userService.updateUser(1, userData))
        .rejects
        .toThrow('Validation failed');
    });

    it('should throw error when email exists for another user', async () => {
      const userData = {
        name: 'Test',
        email: 'jane@example.com', // Jane's email
        age: 25
      };

      await expect(userService.updateUser(1, userData))
        .rejects
        .toThrow('Email already exists for another user');
    });
  });

  describe('deleteUser', () => {
    it('should delete existing user', async () => {
      const deletedUser = await userService.deleteUser(1);

      expect(deletedUser.id).toBe(1);
      expect(deletedUser.name).toBe('John Doe');
      expect(userService.users).toHaveLength(2);
      expect(userService.users.find(u => u.id === 1)).toBeUndefined();
    });

    it('should throw error for non-existent user', async () => {
      await expect(userService.deleteUser(999))
        .rejects
        .toThrow('User with ID 999 not found');
    });
  });

  describe('emailExists', () => {
    it('should return true for existing email', async () => {
      const exists = await userService.emailExists('john@example.com');
      expect(exists).toBe(true);
    });

    it('should return false for non-existent email', async () => {
      const exists = await userService.emailExists('nonexistent@example.com');
      expect(exists).toBe(false);
    });

    it('should exclude specific user ID when checking', async () => {
      const exists = await userService.emailExists('john@example.com', 1);
      expect(exists).toBe(false);
    });
  });

  describe('getUserCount', () => {
    it('should return correct user count', async () => {
      const count = await userService.getUserCount();
      expect(count).toBe(3);
    });
  });
});
