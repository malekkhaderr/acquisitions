import z from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2).max(255).trim(),
  email: z.email().lowercase().trim(),
  password: z.string().min(8).max(32),
  role: z.enum(['user', 'admin']).default('user'),
});

export const signinSchema = z.object({
  email: z.email().lowercase().trim(),
  password: z.string().min(8).max(32),
});
