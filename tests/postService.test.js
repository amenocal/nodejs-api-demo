const PostService = require('../src/services/postService');
const Post = require('../src/models/Post');

describe('PostService', () => {
  let postService;

  beforeEach(() => {
    // Create a fresh instance for each test
    postService = require('../src/services/postService');
    // Reset the posts array to initial state
    postService.posts = [
      new Post(1, 'First Blog Post', 'This is the content of the first blog post.', 1, 'published'),
      new Post(2, 'Draft Post', 'This is a draft post that is not yet published.', 2, 'draft'),
      new Post(3, 'Another Published Post', 'Here is another published post with more content.', 1, 'published')
    ];
    postService.nextId = 4;
  });

  describe('getAllPosts', () => {
    it('should return all posts with default pagination', async () => {
      const result = await postService.getAllPosts();
      
      expect(result.posts).toHaveLength(3);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.totalPosts).toBe(3);
      expect(result.pagination.limit).toBe(10);
    });

    it('should return paginated results', async () => {
      const result = await postService.getAllPosts({ page: 1, limit: 2 });
      
      expect(result.posts).toHaveLength(2);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.totalPages).toBe(2);
    });

    it('should filter posts by search term', async () => {
      const result = await postService.getAllPosts({ search: 'draft' });
      
      expect(result.posts).toHaveLength(1);
      expect(result.posts[0].title).toBe('Draft Post');
    });

    it('should filter posts by author ID', async () => {
      const result = await postService.getAllPosts({ authorId: 1 });
      
      expect(result.posts).toHaveLength(2);
      expect(result.posts.every(post => post.authorId === 1)).toBe(true);
    });

    it('should filter posts by status', async () => {
      const result = await postService.getAllPosts({ status: 'published' });
      
      expect(result.posts).toHaveLength(2);
      expect(result.posts.every(post => post.status === 'published')).toBe(true);
    });
  });

  describe('getPostById', () => {
    it('should return post by ID', async () => {
      const post = await postService.getPostById(1);
      
      expect(post.id).toBe(1);
      expect(post.title).toBe('First Blog Post');
    });

    it('should throw error for non-existent post', async () => {
      await expect(postService.getPostById(999))
        .rejects
        .toThrow('Post with ID 999 not found');
    });
  });

  describe('createPost', () => {
    it('should create new post with valid data', async () => {
      const postData = {
        title: 'New Test Post',
        content: 'This is test content for the new post.',
        authorId: 1,
        status: 'draft'
      };

      const post = await postService.createPost(postData);

      expect(post.id).toBe(4);
      expect(post.title).toBe('New Test Post');
      expect(post.authorId).toBe(1);
      expect(post.status).toBe('draft');
      expect(postService.posts).toHaveLength(4);
    });

    it('should throw validation error for invalid data', async () => {
      const postData = {
        title: '', // Invalid: empty title
        content: 'Valid content',
        authorId: 1
      };

      await expect(postService.createPost(postData))
        .rejects
        .toThrow('Validation failed');
    });
  });

  describe('updatePost', () => {
    it('should update post with valid data', async () => {
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content',
        status: 'published'
      };

      const post = await postService.updatePost(1, updateData, 1);

      expect(post.title).toBe('Updated Title');
      expect(post.content).toBe('Updated content');
      expect(post.status).toBe('published');
    });

    it('should throw error for non-existent post', async () => {
      const updateData = { title: 'Updated Title' };

      await expect(postService.updatePost(999, updateData, 1))
        .rejects
        .toThrow('Post with ID 999 not found');
    });

    it('should throw error when user tries to update others post', async () => {
      const updateData = { title: 'Updated Title' };

      await expect(postService.updatePost(1, updateData, 2))
        .rejects
        .toThrow('You can only update your own posts');
    });
  });

  describe('deletePost', () => {
    it('should delete existing post', async () => {
      const deletedPost = await postService.deletePost(1, 1);

      expect(deletedPost.id).toBe(1);
      expect(deletedPost.title).toBe('First Blog Post');
      expect(postService.posts).toHaveLength(2);
      expect(postService.posts.find(p => p.id === 1)).toBeUndefined();
    });

    it('should throw error for non-existent post', async () => {
      await expect(postService.deletePost(999, 1))
        .rejects
        .toThrow('Post with ID 999 not found');
    });

    it('should throw error when user tries to delete others post', async () => {
      await expect(postService.deletePost(1, 2))
        .rejects
        .toThrow('You can only delete your own posts');
    });
  });

  describe('getPostCount', () => {
    it('should return correct post count', async () => {
      const count = await postService.getPostCount();
      expect(count).toBe(3);
    });
  });

  describe('getPostsByAuthor', () => {
    it('should return posts by specific author', async () => {
      const posts = await postService.getPostsByAuthor(1);
      
      expect(posts).toHaveLength(2);
      expect(posts.every(post => post.authorId === 1)).toBe(true);
    });
  });
});