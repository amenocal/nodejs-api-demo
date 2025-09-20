const Post = require('../models/Post');

class PostService {
  constructor() {
    // In-memory storage (replace with database in production)
    this.posts = [
      new Post(1, 'First Blog Post', 'This is the content of the first blog post. It contains some interesting information about our platform.', 1, 'published'),
      new Post(2, 'Draft Post', 'This is a draft post that is not yet published.', 2, 'draft'),
      new Post(3, 'Another Published Post', 'Here is another published post with more content and interesting insights.', 1, 'published')
    ];
    this.nextId = 4;
  }

  // Get all posts with optional filtering and pagination
  async getAllPosts(options = {}) {
    const { page = 1, limit = 10, search, authorId, status } = options;
    
    let filteredPosts = [...this.posts];
    
    // Filter by author
    if (authorId) {
      filteredPosts = filteredPosts.filter(post => post.authorId === parseInt(authorId));
    }
    
    // Filter by status
    if (status) {
      filteredPosts = filteredPosts.filter(post => post.status === status);
    }
    
    // Search functionality
    if (search) {
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.content.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Sort by creation date (newest first)
    filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    
    return {
      posts: paginatedPosts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredPosts.length / limit),
        totalPosts: filteredPosts.length,
        limit: parseInt(limit)
      }
    };
  }

  // Get post by ID
  async getPostById(id) {
    const post = this.posts.find(post => post.id === parseInt(id));
    if (!post) {
      throw new Error(`Post with ID ${id} not found`);
    }
    return post;
  }

  // Create new post
  async createPost(postData) {
    const post = Post.create(postData);
    
    // Validate post data
    const validationErrors = post.validate();
    if (validationErrors.length > 0) {
      const error = new Error('Validation failed');
      error.validationErrors = validationErrors;
      throw error;
    }
    
    // Assign ID and add to storage
    post.id = this.nextId++;
    this.posts.push(post);
    
    return post;
  }

  // Update post
  async updatePost(id, postData, requestingUserId) {
    const postIndex = this.posts.findIndex(post => post.id === parseInt(id));
    if (postIndex === -1) {
      throw new Error(`Post with ID ${id} not found`);
    }
    
    const post = this.posts[postIndex];
    
    // Check if the requesting user is the author
    if (post.authorId !== parseInt(requestingUserId)) {
      throw new Error('You can only update your own posts');
    }
    
    // Update post data
    post.update(postData);
    
    // Validate updated post data
    const validationErrors = post.validate();
    if (validationErrors.length > 0) {
      const error = new Error('Validation failed');
      error.validationErrors = validationErrors;
      throw error;
    }
    
    return post;
  }

  // Delete post
  async deletePost(id, requestingUserId) {
    const postIndex = this.posts.findIndex(post => post.id === parseInt(id));
    if (postIndex === -1) {
      throw new Error(`Post with ID ${id} not found`);
    }
    
    const post = this.posts[postIndex];
    
    // Check if the requesting user is the author
    if (post.authorId !== parseInt(requestingUserId)) {
      throw new Error('You can only delete your own posts');
    }
    
    const deletedPost = this.posts.splice(postIndex, 1)[0];
    return deletedPost;
  }

  // Get posts count
  async getPostCount() {
    return this.posts.length;
  }

  // Get posts by author
  async getPostsByAuthor(authorId) {
    return this.posts.filter(post => post.authorId === parseInt(authorId));
  }
}

// Export singleton instance
module.exports = new PostService();