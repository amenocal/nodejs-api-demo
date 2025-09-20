const express = require('express');
const router = express.Router();

const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostStats
} = require('../controllers/postController');

const {
  validatePostInput,
  validatePostId,
  validateQueryParams
} = require('../middleware/validation');

const { generalLimiter, strictLimiter } = require('../middleware/rateLimiter');

// GET /api/posts - Get all posts with pagination and search
router.get('/', 
  generalLimiter,
  validateQueryParams,
  getAllPosts
);

// GET /api/posts/stats - Get post statistics
router.get('/stats', 
  generalLimiter,
  getPostStats
);

// GET /api/posts/:id - Get post by ID
router.get('/:id', 
  generalLimiter,
  validatePostId,
  getPostById
);

// POST /api/posts - Create new post
router.post('/', 
  strictLimiter,
  validatePostInput,
  createPost
);

// PUT /api/posts/:id - Update post
router.put('/:id', 
  strictLimiter,
  validatePostId,
  validatePostInput,
  updatePost
);

// DELETE /api/posts/:id - Delete post
router.delete('/:id', 
  strictLimiter,
  validatePostId,
  deletePost
);

module.exports = router;