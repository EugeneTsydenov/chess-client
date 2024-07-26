import { z } from 'zod';

export const loginFormSchema = z.object({
  username: z.string(),
  password: z.string(),
  rememberMe: z.boolean().default(false),
});
export type LoginFormSchemaType = z.infer<typeof loginFormSchema>;
