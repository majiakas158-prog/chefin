import { betterAuth } from 'better-auth';
import { prismaAdapter } from '@better-auth/prisma-adapter';
import { env } from '../config/env.js';
import { prisma } from './prisma.js';
export const auth=betterAuth({baseURL:env.BETTER_AUTH_URL,secret:env.BETTER_AUTH_SECRET,trustedOrigins:[env.FRONTEND_URL],database:prismaAdapter(prisma,{provider:'sqlite'}),emailAndPassword:{enabled:true}});
