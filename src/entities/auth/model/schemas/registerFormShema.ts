import { z } from 'zod';

export const registerFormSchema = z
  .object({
    username: z
      .string()
      .min(4, 'Username must be at least 4 characters!')
      .max(24, 'Username must be less then 24 characters!'),
    displayName: z
      .string()
      .min(4, 'Display name must be at least 4 characters!')
      .max(36, 'Display name must be less then 36 characters!'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters!')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/,
        'The password must consist of at least one lowercase and uppercase letter, one number and one symbol',
      ),
    confirmPassword: z.string(),
    terms: z.boolean().refine((value) => value, {
      message: 'Checkbox must be a checked!',
    }),
    email: z.string().email(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password doesn't match!",
    path: ['confirmPassword'],
  })
  .refine((data) => data.username !== data.displayName, {
    message: 'The display name and username must be different!',
    path: ['displayName'],
  });
export type RegisterFormSchemaType = z.infer<typeof registerFormSchema>;
