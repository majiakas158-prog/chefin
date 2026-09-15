import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../lib/authClient';

const AuthContext = createContext(null);

/**
 * Provides auth state and helpers to the whole app:
 *
 * - `user`                : better-auth session user object, or null
 * - `loading`             : true while the initial session fetch is in flight
 * - `setUser`             : manually update the cached user (after sign-in/up)
 * - `signOut()`           : signs out and redirects to /signin
 * - `resendVerification(email)` : resend the verification email
 * - `forgotPassword(email)`     : send a password-reset email
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Hydrate session on mount
  useEffect(() => {
    let cancelled = false;
    authClient.getSession()
      .then(({ data }) => {
        if (!cancelled) {
          setUser(data?.user ?? null);
          setLoading(false);
        }
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const signOut = useCallback(async () => {
    await authClient.signOut();
    setUser(null);
    navigate('/signin', { replace: true });
  }, [navigate]);

  const resendVerification = useCallback(async (email) => {
    const { error } = await authClient.sendVerificationEmail({ email, callbackURL: '/session-redirect' });
    return error ?? null;
  }, []);

  const forgotPassword = useCallback(async (email) => {
    const { error } = await authClient.forgetPassword({
      email,
      redirectTo: '/reset-password',
    });
    return error ?? null;
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, setUser, signOut, resendVerification, forgotPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
