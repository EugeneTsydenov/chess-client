import { z } from 'zod';

export const refreshResponseSchema = z.object({
  message: z.string(),
  cookies: z.object({
    accessToken: z.object({
      value: z.string(),
      name: z.literal('accessToken'),
      httpOnly: z.boolean(),
    }),
    refreshToken: z.object({
      value: z.string(),
      name: z.literal('refreshToken'),
      httpOnly: z.boolean(),
      maxAge: z.number(),
    }),
  }),
});

export type RefreshResponseType = z.infer<typeof refreshResponseSchema>;
