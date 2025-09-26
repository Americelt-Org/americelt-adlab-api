import z from 'zod';

export const envSchema = z.object({
  JWT_SECRET: z.string().min(1),
  SERP_API_KEY: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.string().default("6379"),
});