const { z } = require('zod');

// User signup validation schema
const signupSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z
    .string()
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must not exceed 50 characters')
});

// User login validation schema
const loginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
});

// Post creation validation schema
const postSchema = z.object({
  text: z.string().optional(),
}).refine((data) => data.text && data.text.trim().length > 0, {
  message: 'Post must contain text or an image',
  path: ['text']
});

// Comment validation schema
const commentSchema = z.object({
  text: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(500, 'Comment must not exceed 500 characters')
});

module.exports = {
  signupSchema,
  loginSchema,
  postSchema,
  commentSchema
};
