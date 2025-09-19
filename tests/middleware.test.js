const { errorHandler, asyncHandler, notFoundHandler } = require('../src/middleware/errorHandler');
const { validateUserInput, validateUserId, validateQueryParams } = require('../src/middleware/validation');

describe('Middleware Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      method: 'GET',
      path: '/test'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  describe('Error Handler Middleware', () => {
    describe('errorHandler', () => {
      it('should handle validation errors', () => {
        const error = new Error('Validation failed');
        error.validationErrors = ['Name is required', 'Email is invalid'];

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'Validation failed',
          errors: ['Name is required', 'Email is invalid']
        });
      });

      it('should handle not found errors', () => {
        const error = new Error('User with ID 999 not found');

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'User with ID 999 not found'
        });
      });

      it('should handle conflict errors', () => {
        const error = new Error('Email already exists');

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'Email already exists'
        });
      });

      it('should handle generic server errors', () => {
        const error = new Error('Something went wrong');

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'Internal server error',
          error: undefined // Should not expose error details in production
        });
      });

      it('should expose error details in development', () => {
        process.env.NODE_ENV = 'development';
        const error = new Error('Something went wrong');

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'Internal server error',
          error: 'Something went wrong'
        });

        process.env.NODE_ENV = 'test'; // Reset
      });
    });

    describe('asyncHandler', () => {
      it('should handle successful async operations', async () => {
        const asyncFn = async (req, res, next) => {
          res.json({ success: true });
        };

        const wrappedFn = asyncHandler(asyncFn);
        await wrappedFn(req, res, next);

        expect(res.json).toHaveBeenCalledWith({ success: true });
        expect(next).not.toHaveBeenCalled();
      });

      it('should catch and forward async errors', async () => {
        const asyncFn = async (req, res, next) => {
          throw new Error('Async error');
        };

        const wrappedFn = asyncHandler(asyncFn);
        await wrappedFn(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(next.mock.calls[0][0].message).toBe('Async error');
      });
    });

    describe('notFoundHandler', () => {
      it('should return 404 with route information', () => {
        req.method = 'POST';
        req.path = '/api/nonexistent';

        notFoundHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'Route POST /api/nonexistent not found'
        });
      });
    });
  });

  describe('Validation Middleware', () => {
    describe('validateUserInput', () => {
      it('should pass validation with valid user data', () => {
        req.body = {
          name: 'John Doe',
          email: 'john@example.com',
          age: 30
        };

        validateUserInput(req, res, next);

        expect(next).toHaveBeenCalledWith();
        expect(res.status).not.toHaveBeenCalled();
      });

      it('should reject empty name', () => {
        req.body = {
          name: '',
          email: 'john@example.com',
          age: 30
        };

        validateUserInput(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'Name is required and must be a non-empty string'
        });
        expect(next).not.toHaveBeenCalled();
      });

      it('should reject missing name', () => {
        req.body = {
          email: 'john@example.com',
          age: 30
        };

        validateUserInput(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'Name is required and must be a non-empty string'
        });
      });

      it('should reject invalid email', () => {
        req.body = {
          name: 'John Doe',
          email: '',
          age: 30
        };

        validateUserInput(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'Email is required and must be a non-empty string'
        });
      });

      it('should reject invalid age', () => {
        req.body = {
          name: 'John Doe',
          email: 'john@example.com',
          age: 'not-a-number'
        };

        validateUserInput(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'Age is required and must be a number'
        });
      });
    });

    describe('validateUserId', () => {
      it('should pass validation with valid user ID', () => {
        req.params.id = '1';

        validateUserId(req, res, next);

        expect(next).toHaveBeenCalledWith();
        expect(res.status).not.toHaveBeenCalled();
      });

      it('should reject invalid user ID', () => {
        req.params.id = 'invalid';

        validateUserId(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'Valid user ID is required'
        });
      });

      it('should reject negative user ID', () => {
        req.params.id = '-1';

        validateUserId(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'Valid user ID is required'
        });
      });

      it('should reject zero user ID', () => {
        req.params.id = '0';

        validateUserId(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'Valid user ID is required'
        });
      });
    });

    describe('validateQueryParams', () => {
      it('should pass validation with valid query params', () => {
        req.query = {
          page: '1',
          limit: '10'
        };

        validateQueryParams(req, res, next);

        expect(next).toHaveBeenCalledWith();
        expect(res.status).not.toHaveBeenCalled();
      });

      it('should pass validation with no query params', () => {
        req.query = {};

        validateQueryParams(req, res, next);

        expect(next).toHaveBeenCalledWith();
        expect(res.status).not.toHaveBeenCalled();
      });

      it('should reject invalid page parameter', () => {
        req.query = {
          page: '0'
        };

        validateQueryParams(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'Page must be a positive number'
        });
      });

      it('should reject invalid limit parameter', () => {
        req.query = {
          limit: '0'
        };

        validateQueryParams(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'Limit must be a positive number and not exceed 100'
        });
      });

      it('should reject limit exceeding maximum', () => {
        req.query = {
          limit: '101'
        };

        validateQueryParams(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'Limit must be a positive number and not exceed 100'
        });
      });
    });
  });
});
