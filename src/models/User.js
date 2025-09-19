class User {
  constructor(id, name, email, age) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.age = age;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Static method to create a new user
  static create(userData) {
    const { name, email, age } = userData;
    return new User(null, name.trim(), email.trim().toLowerCase(), parseInt(age));
  }

  // Update user data
  update(userData) {
    const { name, email, age } = userData;
    this.name = name.trim();
    this.email = email.trim().toLowerCase();
    this.age = parseInt(age);
    this.updatedAt = new Date();
    return this;
  }

  // Convert to JSON (remove sensitive data if needed)
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      age: this.age,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Validation method
  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim().length === 0) {
      errors.push('Name is required');
    }
    
    if (!this.email || this.email.trim().length === 0) {
      errors.push('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(this.email)) {
      errors.push('Email format is invalid');
    }
    
    if (!this.age || isNaN(this.age) || this.age < 0 || this.age > 150) {
      errors.push('Age must be a valid number between 0 and 150');
    }
    
    return errors;
  }
}

module.exports = User;
