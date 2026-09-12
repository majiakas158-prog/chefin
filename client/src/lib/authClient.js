import { createAuthClient } from 'better-auth/client';
import { emailOTPClient } from 'better-auth/client/plugins';

/**
 * better-auth browser client.
 * Requires an absolute URL with protocol — relative paths are not supported.
 *
 * In dev:  Vite proxies `<origin>/api/auth` → `localhost:4000/api/auth`
 * In prod: Set VITE_API_URL=https://your-api.com
 */
const base = import.meta.env.VITE_API_URL ?? window.location.origin;

export const authClient = createAuthClient({
  baseURL: `${base}/api/auth`,
  plugins: [emailOTPClient()],
});
