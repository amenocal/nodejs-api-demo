const express = require('express');
const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API info route
router.get('/info', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'Express CRUD API',
      version: '1.0.0',
      description: 'RESTful API with CRUD operations for user management',
      endpoints: {
        users: '/api/users',
        health: '/health',
        info: '/info'
      }
    }
  });
});

module.exports = router;
