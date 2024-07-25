import { z } from 'zod';

export const verifyResponseSchema = z.object({
  message: z.string(),
});

export type VerifyResponseType = z.infer<typeof verifyResponseSchema>;
