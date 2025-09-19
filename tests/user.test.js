const User = require('../src/models/User');

describe('User Model', () => {
  describe('constructor', () => {
    it('should create a user with all properties', () => {
      const user = new User(1, 'John Doe', 'john@example.com', 30);

      expect(user.id).toBe(1);
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.age).toBe(30);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('create static method', () => {
    it('should create user from userData and normalize data', () => {
      const userData = {
        name: '  Alice Johnson  ',
        email: '  ALICE@EXAMPLE.COM  ',
        age: '28'
      };

      const user = User.create(userData);

      expect(user.name).toBe('Alice Johnson');
      expect(user.email).toBe('alice@example.com');
      expect(user.age).toBe(28);
      expect(user.id).toBeNull();
    });
  });

  describe('update method', () => {
    it('should update user properties and set updatedAt', () => {
      const user = new User(1, 'John Doe', 'john@example.com', 30);
      const originalUpdatedAt = user.updatedAt;

      // Wait a tiny bit to ensure different timestamp
      setTimeout(() => {
        const userData = {
          name: '  John Smith  ',
          email: '  JOHNSMITH@EXAMPLE.COM  ',
          age: '31'
        };

        user.update(userData);

        expect(user.name).toBe('John Smith');
        expect(user.email).toBe('johnsmith@example.com');
        expect(user.age).toBe(31);
        expect(user.updatedAt).not.toBe(originalUpdatedAt);
      }, 1);
    });
  });

  describe('toJSON method', () => {
    it('should return user data as JSON object', () => {
      const user = new User(1, 'John Doe', 'john@example.com', 30);
      const json = user.toJSON();

      expect(json).toEqual({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
    });
  });

  describe('validate method', () => {
    it('should return empty array for valid user', () => {
      const user = new User(1, 'John Doe', 'john@example.com', 30);
      const errors = user.validate();

      expect(errors).toEqual([]);
    });

    it('should return errors for invalid name', () => {
      const user = new User(1, '', 'john@example.com', 30);
      const errors = user.validate();

      expect(errors).toContain('Name is required');
    });

    it('should return errors for missing email', () => {
      const user = new User(1, 'John Doe', '', 30);
      const errors = user.validate();

      expect(errors).toContain('Email is required');
    });

    it('should return errors for invalid email format', () => {
      const user = new User(1, 'John Doe', 'invalid-email', 30);
      const errors = user.validate();

      expect(errors).toContain('Email format is invalid');
    });

    it('should return errors for invalid age', () => {
      const user = new User(1, 'John Doe', 'john@example.com', 'invalid');
      const errors = user.validate();

      expect(errors).toContain('Age must be a valid number between 0 and 150');
    });

    it('should return errors for negative age', () => {
      const user = new User(1, 'John Doe', 'john@example.com', -5);
      const errors = user.validate();

      expect(errors).toContain('Age must be a valid number between 0 and 150');
    });

    it('should return errors for age too high', () => {
      const user = new User(1, 'John Doe', 'john@example.com', 200);
      const errors = user.validate();

      expect(errors).toContain('Age must be a valid number between 0 and 150');
    });

    it('should return multiple errors for multiple invalid fields', () => {
      const user = new User(1, '', 'invalid-email', 'invalid-age');
      const errors = user.validate();

      expect(errors).toHaveLength(3);
      expect(errors).toContain('Name is required');
      expect(errors).toContain('Email format is invalid');
      expect(errors).toContain('Age must be a valid number between 0 and 150');
    });
  });
});
