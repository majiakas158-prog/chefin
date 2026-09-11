import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  PORT:               z.coerce.number().default(4000),
  NODE_ENV:           z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL:       z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL:    z.string().url(),
  FRONTEND_URL:       z.string().url(),
  // Optional — only required in production for real email delivery
  SMTP_HOST:          z.string().optional(),
  SMTP_PORT:          z.coerce.number().optional(),
  SMTP_USER:          z.string().optional(),
  SMTP_PASS:          z.string().optional(),
  SMTP_FROM:          z.string().optional(),
});

export const env = schema.parse(process.env);

