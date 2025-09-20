const request = require('supertest');
const app = require('../src/app');

describe('API Integration Tests', () => {
  describe('Health and Info Routes', () => {
    describe('GET /health', () => {
      it('should return health status', async () => {
        const response = await request(app)
          .get('/health')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Server is running');
        expect(response.body.timestamp).toBeDefined();
        expect(response.body.uptime).toBeDefined();
      });
    });

    describe('GET /info', () => {
      it('should return API information', async () => {
        const response = await request(app)
          .get('/info')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe('Express CRUD API');
        expect(response.body.data.version).toBe('1.0.0');
        expect(response.body.data.endpoints).toBeDefined();
      });
    });
  });

  describe('Post API Routes', () => {
    describe('GET /api/posts', () => {
      it('should return all posts with pagination', async () => {
        const response = await request(app)
          .get('/api/posts')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.pagination).toBeDefined();
        expect(response.body.pagination.currentPage).toBe(1);
        expect(response.body.pagination.limit).toBe(10);
      });

      it('should support pagination parameters', async () => {
        const response = await request(app)
          .get('/api/posts?page=1&limit=2')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.pagination.currentPage).toBe(1);
        expect(response.body.pagination.limit).toBe(2);
      });

      it('should support search functionality', async () => {
        const response = await request(app)
          .get('/api/posts?search=blog')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeInstanceOf(Array);
      });

      it('should support author filtering', async () => {
        const response = await request(app)
          .get('/api/posts?authorId=1')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeInstanceOf(Array);
      });

      it('should support status filtering', async () => {
        const response = await request(app)
          .get('/api/posts?status=published')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeInstanceOf(Array);
      });

      it('should return 400 for invalid pagination parameters', async () => {
        const response = await request(app)
          .get('/api/posts?page=0')
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('Page must be a positive number');
      });
    });

    describe('GET /api/posts/stats', () => {
      it('should return post statistics', async () => {
        const response = await request(app)
          .get('/api/posts/stats')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.totalPosts).toBeDefined();
        expect(response.body.data.timestamp).toBeDefined();
      });
    });

    describe('GET /api/posts/:id', () => {
      it('should return post by ID', async () => {
        const response = await request(app)
          .get('/api/posts/1')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(1);
        expect(response.body.data.title).toBeDefined();
        expect(response.body.data.content).toBeDefined();
      });

      it('should return 404 for non-existent post', async () => {
        const response = await request(app)
          .get('/api/posts/999')
          .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('Post with ID 999 not found');
      });

      it('should return 400 for invalid post ID', async () => {
        const response = await request(app)
          .get('/api/posts/invalid')
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('Valid post ID is required');
      });
    });

    describe('POST /api/posts', () => {
      it('should create a new post with valid data', async () => {
        const postData = {
          title: 'Test Post',
          content: 'This is test content for the new post.',
          authorId: 1,
          status: 'draft'
        };

        const response = await request(app)
          .post('/api/posts')
          .send(postData)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Post created successfully');
        expect(response.body.data.title).toBe('Test Post');
        expect(response.body.data.content).toBe('This is test content for the new post.');
        expect(response.body.data.authorId).toBe(1);
        expect(response.body.data.status).toBe('draft');
        expect(response.body.data.id).toBeDefined();
      });

      it('should return 400 for missing required fields', async () => {
        const postData = {
          title: '',
          content: 'Valid content'
          // authorId missing
        };

        const response = await request(app)
          .post('/api/posts')
          .send(postData)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('required');
      });

      it('should return 400 for invalid status', async () => {
        const postData = {
          title: 'Test Post',
          content: 'Valid content',
          authorId: 1,
          status: 'invalid-status'
        };

        const response = await request(app)
          .post('/api/posts')
          .send(postData)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('Status must be either "draft" or "published"');
      });
    });

    describe('PUT /api/posts/:id', () => {
      it('should update post with valid data', async () => {
        const postData = {
          title: 'Updated Post Title',
          content: 'Updated post content',
          status: 'published',
          requestingUserId: 1
        };

        const response = await request(app)
          .put('/api/posts/1')
          .send(postData)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Post updated successfully');
        expect(response.body.data.title).toBe('Updated Post Title');
      });

      it('should return 404 for non-existent post', async () => {
        const postData = {
          title: 'Updated Title',
          content: 'Updated content',
          requestingUserId: 1
        };

        const response = await request(app)
          .put('/api/posts/999')
          .send(postData)
          .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('Post with ID 999 not found');
      });

      it('should return 400 for invalid post ID', async () => {
        const postData = {
          title: 'Updated Title',
          content: 'Updated content'
        };

        const response = await request(app)
          .put('/api/posts/invalid')
          .send(postData)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('Valid post ID is required');
      });
    });

    describe('DELETE /api/posts/:id', () => {
      it('should delete existing post', async () => {
        const response = await request(app)
          .delete('/api/posts/2')
          .send({ requestingUserId: 2 })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Post deleted successfully');
        expect(response.body.data.id).toBe(2);
      });

      it('should return 404 for non-existent post', async () => {
        const response = await request(app)
          .delete('/api/posts/999')
          .send({ requestingUserId: 1 })
          .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('Post with ID 999 not found');
      });

      it('should return 400 for invalid post ID', async () => {
        const response = await request(app)
          .delete('/api/posts/invalid')
          .send({ requestingUserId: 1 })
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('Valid post ID is required');
      });
    });
  });

  describe('User API Routes', () => {
    describe('GET /api/users', () => {
      it('should return all users with pagination', async () => {
        const response = await request(app)
          .get('/api/users')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.pagination).toBeDefined();
        expect(response.body.pagination.currentPage).toBe(1);
        expect(response.body.pagination.totalUsers).toBeGreaterThan(0);
      });

      it('should support pagination parameters', async () => {
        const response = await request(app)
          .get('/api/users?page=1&limit=2')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.length).toBeLessThanOrEqual(2);
        expect(response.body.pagination.limit).toBe(2);
        expect(response.body.pagination.currentPage).toBe(1);
      });

      it('should support search functionality', async () => {
        const response = await request(app)
          .get('/api/users?search=john')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeInstanceOf(Array);
        // Should contain users with 'john' in name or email
      });

      it('should return error for invalid pagination parameters', async () => {
        const response = await request(app)
          .get('/api/users?page=0&limit=101')
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('Page must be a positive number');
      });
    });

    describe('GET /api/users/stats', () => {
      it('should return user statistics', async () => {
        const response = await request(app)
          .get('/api/users/stats')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.totalUsers).toBeDefined();
        expect(response.body.data.timestamp).toBeDefined();
      });
    });

    describe('GET /api/users/:id', () => {
      it('should return user by valid ID', async () => {
        const response = await request(app)
          .get('/api/users/1')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(1);
        expect(response.body.data.name).toBeDefined();
        expect(response.body.data.email).toBeDefined();
      });

      it('should return 404 for non-existent user', async () => {
        const response = await request(app)
          .get('/api/users/999')
          .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('User with ID 999 not found');
      });

      it('should return 400 for invalid user ID', async () => {
        const response = await request(app)
          .get('/api/users/invalid')
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('Valid user ID is required');
      });
    });

    describe('POST /api/users', () => {
      it('should create a new user with valid data', async () => {
        const userData = {
          name: 'Test User',
          email: 'test@example.com',
          age: 25
        };

        const response = await request(app)
          .post('/api/users')
          .send(userData)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('User created successfully');
        expect(response.body.data.name).toBe('Test User');
        expect(response.body.data.email).toBe('test@example.com');
        expect(response.body.data.age).toBe(25);
        expect(response.body.data.id).toBeDefined();
      });

      it('should return 400 for missing required fields', async () => {
        const userData = {
          name: '',
          email: 'test@example.com'
          // age missing
        };

        const response = await request(app)
          .post('/api/users')
          .send(userData)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('required');
      });

      it('should return 400 for invalid email format', async () => {
        const userData = {
          name: 'Test User',
          email: 'invalid-email',
          age: 25
        };

        const response = await request(app)
          .post('/api/users')
          .send(userData)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.errors).toContain('Email format is invalid');
      });

      it('should return 409 for duplicate email', async () => {
        const userData = {
          name: 'Duplicate User',
          email: 'john@example.com', // Already exists
          age: 30
        };

        const response = await request(app)
          .post('/api/users')
          .send(userData)
          .expect(409);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('already exists');
      });
    });

    describe('PUT /api/users/:id', () => {
      it('should update user with valid data', async () => {
        const userData = {
          name: 'Updated User',
          email: 'updated@example.com',
          age: 35
        };

        const response = await request(app)
          .put('/api/users/1')
          .send(userData)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('User updated successfully');
        expect(response.body.data.name).toBe('Updated User');
        expect(response.body.data.email).toBe('updated@example.com');
      });

      it('should return 404 for non-existent user', async () => {
        const userData = {
          name: 'Test',
          email: 'test@example.com',
          age: 25
        };

        const response = await request(app)
          .put('/api/users/999')
          .send(userData)
          .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('not found');
      });

      it('should return 400 for invalid data', async () => {
        const userData = {
          name: '',
          email: 'invalid-email',
          age: 'not-a-number'
        };

        const response = await request(app)
          .put('/api/users/1')
          .send(userData)
          .expect(400);

        expect(response.body.success).toBe(false);
      });
    });

    describe('DELETE /api/users/:id', () => {
      it('should delete existing user', async () => {
        const response = await request(app)
          .delete('/api/users/2')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('User deleted successfully');
        expect(response.body.data.id).toBe(2);
      });

      it('should return 404 for non-existent user', async () => {
        const response = await request(app)
          .delete('/api/users/999')
          .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('not found');
      });
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for undefined routes', async () => {
      const response = await request(app)
        .get('/nonexistent-route')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Route GET');
      expect(response.body.message).toContain('not found');
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid JSON format');
    });
  });
});
