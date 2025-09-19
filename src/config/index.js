const config = {
  development: {
    port: process.env.PORT || 3000,
    nodeEnv: 'development',
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }
  },
  production: {
    port: process.env.PORT || 8080,
    nodeEnv: 'production',
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
      credentials: true
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 50 // stricter limits in production
    }
  },
  test: {
    port: process.env.PORT || 3001,
    nodeEnv: 'test',
    cors: {
      origin: '*',
      credentials: false
    },
    rateLimit: {
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 1000 // loose limits for testing
    }
  }
};

const environment = process.env.NODE_ENV || 'development';

module.exports = config[environment];
