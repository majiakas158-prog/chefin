import 'dotenv/config';
import { z } from 'zod';
const schema=z.object({PORT:z.coerce.number().default(4000),NODE_ENV:z.enum(['development','test','production']).default('development'),DATABASE_URL:z.string().min(1),BETTER_AUTH_SECRET:z.string().min(32),BETTER_AUTH_URL:z.string().url(),FRONTEND_URL:z.string().url()});
export const env=schema.parse(process.env);
