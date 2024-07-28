import { z } from 'zod';

export const registerResponseSchema = z.object({
  message: z.string(),
});

export type RegisterResponseType = z.infer<typeof registerResponseSchema>;
