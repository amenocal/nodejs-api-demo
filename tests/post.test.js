const Post = require('../src/models/Post');

describe('Post Model', () => {
  describe('constructor', () => {
    it('should create a post with all properties', () => {
      const post = new Post(1, 'Test Title', 'Test content', 2, 'published');
      
      expect(post.id).toBe(1);
      expect(post.title).toBe('Test Title');
      expect(post.content).toBe('Test content');
      expect(post.authorId).toBe(2);
      expect(post.status).toBe('published');
      expect(post.createdAt).toBeInstanceOf(Date);
      expect(post.updatedAt).toBeInstanceOf(Date);
    });

    it('should default status to draft', () => {
      const post = new Post(1, 'Test Title', 'Test content', 2);
      
      expect(post.status).toBe('draft');
    });
  });

  describe('create', () => {
    it('should create post from data object', () => {
      const postData = {
        title: ' Test Title ',
        content: ' Test content ',
        authorId: '2',
        status: 'published'
      };
      
      const post = Post.create(postData);
      
      expect(post.id).toBeNull();
      expect(post.title).toBe('Test Title');
      expect(post.content).toBe('Test content');
      expect(post.authorId).toBe(2);
      expect(post.status).toBe('published');
    });

    it('should default status to draft when not provided', () => {
      const postData = {
        title: 'Test Title',
        content: 'Test content',
        authorId: 2
      };
      
      const post = Post.create(postData);
      
      expect(post.status).toBe('draft');
    });
  });

  describe('update', () => {
    it('should update post properties', () => {
      const post = new Post(1, 'Original Title', 'Original content', 2, 'draft');
      const originalUpdatedAt = post.updatedAt;
      
      // Wait a bit to ensure updatedAt changes
      setTimeout(() => {
        post.update({
          title: ' Updated Title ',
          content: ' Updated content ',
          status: 'published'
        });
        
        expect(post.title).toBe('Updated Title');
        expect(post.content).toBe('Updated content');
        expect(post.status).toBe('published');
        expect(post.updatedAt).not.toBe(originalUpdatedAt);
      }, 1);
    });

    it('should only update provided properties', () => {
      const post = new Post(1, 'Original Title', 'Original content', 2, 'draft');
      
      post.update({ title: 'Updated Title' });
      
      expect(post.title).toBe('Updated Title');
      expect(post.content).toBe('Original content');
      expect(post.status).toBe('draft');
    });
  });

  describe('toJSON', () => {
    it('should return JSON representation', () => {
      const post = new Post(1, 'Test Title', 'Test content', 2, 'published');
      const json = post.toJSON();
      
      expect(json).toEqual({
        id: 1,
        title: 'Test Title',
        content: 'Test content',
        authorId: 2,
        status: 'published',
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
      });
    });
  });

  describe('validate', () => {
    it('should return no errors for valid post', () => {
      const post = new Post(1, 'Valid Title', 'Valid content', 2, 'published');
      const errors = post.validate();
      
      expect(errors).toHaveLength(0);
    });

    it('should return error for missing title', () => {
      const post = new Post(1, '', 'Valid content', 2, 'published');
      const errors = post.validate();
      
      expect(errors).toContain('Title is required');
    });

    it('should return error for title too long', () => {
      const longTitle = 'a'.repeat(201);
      const post = new Post(1, longTitle, 'Valid content', 2, 'published');
      const errors = post.validate();
      
      expect(errors).toContain('Title must not exceed 200 characters');
    });

    it('should return error for missing content', () => {
      const post = new Post(1, 'Valid Title', '', 2, 'published');
      const errors = post.validate();
      
      expect(errors).toContain('Content is required');
    });

    it('should return error for content too long', () => {
      const longContent = 'a'.repeat(10001);
      const post = new Post(1, 'Valid Title', longContent, 2, 'published');
      const errors = post.validate();
      
      expect(errors).toContain('Content must not exceed 10000 characters');
    });

    it('should return error for invalid author ID', () => {
      const post = new Post(1, 'Valid Title', 'Valid content', 0, 'published');
      const errors = post.validate();
      
      expect(errors).toContain('Valid author ID is required');
    });

    it('should return error for invalid status', () => {
      const post = new Post(1, 'Valid Title', 'Valid content', 2, 'invalid');
      const errors = post.validate();
      
      expect(errors).toContain('Status must be either "draft" or "published"');
    });

    it('should return multiple errors for multiple invalid fields', () => {
      const post = new Post(1, '', '', 0, 'invalid');
      const errors = post.validate();
      
      expect(errors.length).toBeGreaterThan(1);
      expect(errors).toContain('Title is required');
      expect(errors).toContain('Content is required');
      expect(errors).toContain('Valid author ID is required');
      expect(errors).toContain('Status must be either "draft" or "published"');
    });
  });
});