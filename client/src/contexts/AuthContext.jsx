import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../lib/authClient';

const AuthContext = createContext(null);

/**
 * Provides `user`, `loading`, and `signOut()` to the whole app.
 *
 * - `user`    : the better-auth session user object, or null if not signed in
 * - `loading` : true while the initial session fetch is in progress
 * - `signOut` : signs out via better-auth and redirects to /signin
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch the session once on mount
  useEffect(() => {
    let cancelled = false;

    authClient.getSession().then(({ data }) => {
      if (!cancelled) {
        setUser(data?.user ?? null);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  const signOut = useCallback(async () => {
    await authClient.signOut();
    setUser(null);
    navigate('/signin', { replace: true });
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
