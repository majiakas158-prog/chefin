import { betterAuth } from 'better-auth';
import { prismaAdapter } from '@better-auth/prisma-adapter';
import { env } from '../config/env.js';
import { prisma } from './prisma.js';
import { sendEmail, emailTemplate } from './mailer.js';

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: [env.FRONTEND_URL],
  database: prismaAdapter(prisma, { provider: 'sqlite' }),

  // ── Email + password ───────────────────────────────────────────────────
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,

    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: 'Reset your CheafIn password',
        html: emailTemplate({
          heading: 'Reset your password',
          body:    `Hi ${user.name ?? 'there'},<br><br>We received a request to reset your CheafIn password. Click the button below to choose a new one. This link expires in 1 hour.`,
          ctaLabel: 'Reset Password',
          ctaUrl:   url,
        }),
      });
    },
  },

  // ── Email verification ─────────────────────────────────────────────────
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,

    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: 'Verify your CheafIn email',
        html: emailTemplate({
          heading: 'Almost there! Verify your email',
          body:    `Hi ${user.name ?? 'there'},<br><br>Thanks for joining CheafIn! Click the button below to verify your email address and activate your account.`,
          ctaLabel: 'Verify Email',
          ctaUrl:   url,
        }),
      });
    },
  },

  // ── Google OAuth ───────────────────────────────────────────────────────
  // Only enabled when GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET are set.
  // Google users have emailVerified=true automatically (Google already did it).
  // After OAuth they land on /complete-profile to pick their chef/restaurant role.
  ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
    ? {
        socialProviders: {
          google: {
            clientId:     env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
          },
        },
      }
    : {}),

  // ── Database hooks ────────────────────────────────────────────────────
  // Auto-create a Profile row after every sign-up (email or Google).
  // For email sign-ups: name field is JSON with role + profile fields.
  // For Google sign-ups: name is a plain string → default role='chef',
  //   user updates it on /complete-profile.
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          let name = user.name ?? '';
          let profileData = { role: 'chef' };

          try {
            const parsed = JSON.parse(name);
            if (parsed && typeof parsed === 'object') {
              name = parsed.name ?? name;
              profileData = { ...profileData, ...parsed };
              delete profileData.name;
            }
          } catch {
            // plain string name (Google OAuth) — use defaults
          }

          await prisma.user.update({
            where: { id: user.id },
            data: { name },
          });

          await prisma.profile.create({
            data: { userId: user.id, ...profileData },
          });
        },
      },
    },
  },
});

