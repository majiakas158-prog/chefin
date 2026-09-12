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
  RESEND_FROM:        z.string().optional(),
  // Gmail SMTP — use a Google App Password, never your normal Google password.
  GMAIL_USER:         z.string().email().optional(),
  GMAIL_APP_PASSWORD: z.string().min(1).optional(),
  GMAIL_FROM:         z.string().optional(),
  // Google OAuth — optional, enables "Continue with Google"
  GOOGLE_CLIENT_ID:     z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
}).refine(
  (values) => Boolean(values.GMAIL_USER) === Boolean(values.GMAIL_APP_PASSWORD),
  { message: 'GMAIL_USER and GMAIL_APP_PASSWORD must be set together', path: ['GMAIL_APP_PASSWORD'] },
);

export const env = schema.parse(process.env);
