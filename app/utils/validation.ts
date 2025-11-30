import { z } from 'zod';
export const loginSchema = z.object({
  email: z.email('Invalid Email Address'),
  password: z.string().min(6, 'Password Must Be At Least 6 Characters')
});
export const signupSchema = z.object({
  username: z.string().min(3, 'Username Must Be At Least 3 Characters').max(20, 'Username Must Be Less Than 20 Characters').regex(/^[a-zA-Z0-9_]+$/, 'Username Can Only Contain Letters, Numbers And Underscores'),
  email: z.email('Invalid Email Address'),
  password: z.string().min(6, 'Password Must Be At Least 6 Characters'),
  displayName: z.string().min(1, 'Display Name Is Required').max(50, 'Display Name Must Be Less Than 50 Characters')
});
export const postSchema = z.object({
  content: z.string().min(1, 'Post Content Is Required').max(5000, 'Post Content Must Be Less Than 5000 Characters')
});
export const commentSchema = z.object({
  content: z.string().min(1, 'Comment Content Is Required').max(1000, 'Comment Must Be Less Than 1000 Characters')
});
export const updateProfileSchema = z.object({
  displayName: z.string().min(1, 'Display Name Is Required').max(50, 'Display Name Must Be Less Than 50 Characters').optional(),
  bio: z.string().max(500, 'Bio Must Be Less Than 500 Characters').optional(),
  avatarUrl: z.url('Invalid Avatar URL').optional().or(z.literal('')),
  coverUrl: z.url('Invalid Cover URL').optional().or(z.literal(''))
});
export const messageSchema = z.object({
  receiverId: z.number().int().positive(),
  content: z.string().min(1, 'Message Content Is Required').max(1000, 'Message Must Be Less Than 1000 Characters')
});