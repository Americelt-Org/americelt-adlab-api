import z from 'zod';

export const envSchema = z.object({
  ROBOT_SECRET_TOKEN: z.string().optional(),
  ROBOT_ENDPOINT: z.string().url().optional(),
});