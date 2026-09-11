import { createAuthClient } from 'better-auth/client';

/**
 * better-auth browser client.
 * All methods automatically handle the session cookie — no manual
 * token management needed.
 *
 * Usage:
 *   import { authClient } from '@/lib/authClient';
 *   await authClient.signIn.email({ email, password });
 *   await authClient.signUp.email({ email, password, name });
 *   await authClient.signOut();
 *   const { data: session } = await authClient.getSession();
 */
export const authClient = createAuthClient({
  // In dev, Vite proxies /api/auth → localhost:4000/api/auth
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/auth`
    : '/api/auth',
});
