import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  PORT:               z.coerce.number().default(4000),
  NODE_ENV:           z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL:       z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL:    z.string().url(),
  FRONTEND_URL:       z.string().url(),
  // Resend — optional in dev (emails printed to console), required in prod
  RESEND_API_KEY:     z.string().optional(),
  RESEND_FROM:        z.string().optional(), // e.g. "CheafIn <noreply@yourdomain.com>"
});

export const env = schema.parse(process.env);

