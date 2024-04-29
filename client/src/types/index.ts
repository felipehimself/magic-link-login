import { z } from 'zod';
// export type TSignup = { name: string; username: string; email: string };

export type TLoaderDataSuccess = { success: boolean };

export const signupSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name must be at least 1 to 20 characters long' })
    .max(20, { message: 'Name must be at least 1 to 20 characters long' })
    .transform((val) => val.trim())
    .refine((val) => val.trim() !== '', {
      message: 'Name must not be an empty string',
    }),
  username: z
    .string()
    .min(1, { message: 'Userame must be at least 1 to 20 characters long' })
    .max(12, { message: 'Username must be at least 1 to 12 characters long' })
    .transform((val) => val.trim())
    .refine((val) => val.trim() !== '', {
      message: 'Username must not be an empty string',
    }),
  email: z.string().email(),
});

export type TSignup = z.infer<typeof signupSchema>;
