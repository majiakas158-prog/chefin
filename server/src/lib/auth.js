import { betterAuth } from 'better-auth';
import { prismaAdapter } from '@better-auth/prisma-adapter';
import { env } from '../config/env.js';
import { prisma } from './prisma.js';

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: [env.FRONTEND_URL],
  database: prismaAdapter(prisma, { provider: 'sqlite' }),

  emailAndPassword: { enabled: true },

  // After better-auth creates a user, auto-create their Profile row.
  // The client sends role + profile fields as part of the sign-up name
  // payload encoded as JSON: '{"name":"Gordon","role":"chef",...}'.
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // name may be a JSON string containing role + profile extras
          let name = user.name ?? '';
          let profileData = { role: 'chef' };

          try {
            const parsed = JSON.parse(name);
            if (parsed && typeof parsed === 'object') {
              name = parsed.name ?? name;
              profileData = { ...profileData, ...parsed };
              delete profileData.name; // name lives on User, not Profile
            }
          } catch {
            // plain string name — no role metadata
          }

          // Update the user's name to the clean value
          await prisma.user.update({
            where: { id: user.id },
            data: { name },
          });

          // Create the Profile row
          await prisma.profile.create({
            data: { userId: user.id, ...profileData },
          });
        },
      },
    },
  },
});
