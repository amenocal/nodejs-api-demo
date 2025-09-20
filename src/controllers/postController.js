const postService = require('../services/postService');
const { asyncHandler } = require('../middleware/errorHandler');

// Get all posts
const getAllPosts = asyncHandler(async (req, res) => {
  const { page, limit, search, authorId, status } = req.query;
  
  const result = await postService.getAllPosts({ page, limit, search, authorId, status });
  
  res.json({
    success: true,
    data: result.posts,
    pagination: result.pagination
  });
});

// Get post by ID
const getPostById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const post = await postService.getPostById(id);
  
  res.json({
    success: true,
    data: post
  });
});

// Create new post
const createPost = asyncHandler(async (req, res) => {
  const { title, content, status } = req.body;
  
  // Note: In a real app, authorId would come from authentication middleware
  // For now, we'll use a default user ID or require it in the request body
  const authorId = req.body.authorId || req.user?.id || 1; // Default to user 1 for demo
  
  const post = await postService.createPost({ title, content, authorId, status });
  
  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    data: post
  });
});

// Update post
const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, status } = req.body;
  
  // Note: In a real app, requestingUserId would come from authentication middleware
  const requestingUserId = req.body.requestingUserId || req.user?.id || 1; // Default to user 1 for demo
  
  const post = await postService.updatePost(id, { title, content, status }, requestingUserId);
  
  res.json({
    success: true,
    message: 'Post updated successfully',
    data: post
  });
});

// Delete post
const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Note: In a real app, requestingUserId would come from authentication middleware
  const requestingUserId = req.body.requestingUserId || req.user?.id || 1; // Default to user 1 for demo
  
  const deletedPost = await postService.deletePost(id, requestingUserId);
  
  res.json({
    success: true,
    message: 'Post deleted successfully',
    data: deletedPost
  });
});

// Get post statistics
const getPostStats = asyncHandler(async (req, res) => {
  const totalPosts = await postService.getPostCount();
  
  res.json({
    success: true,
    data: {
      totalPosts,
      timestamp: new Date().toISOString()
    }
  });
});

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostStats
};