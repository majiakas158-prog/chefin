import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../lib/api';

/**
 * Used after email verification. AuthProvider validates the Better Auth
 * session cookie before this page decides where the user belongs.
 */
export function SessionRedirectPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate('/signin', { replace: true });
      return;
    }

    if (!user.emailVerified) {
      navigate('/verify-email', { replace: true });
      return;
    }

    let cancelled = false;

    userApi.getMe()
      .then(({ data }) => {
        if (cancelled) return;
        const role = data?.data?.role ?? localStorage.getItem('selectedRole') ?? 'chef';
        navigate(role === 'restaurant' ? '/restaurant-dashboard' : '/chef-dashboard', { replace: true });
      })
      .catch(() => {
        if (!cancelled) {
          const role = localStorage.getItem('selectedRole') ?? 'chef';
          navigate(role === 'restaurant' ? '/restaurant-dashboard' : '/chef-dashboard', { replace: true });
        }
      });

    return () => { cancelled = true; };
  }, [loading, navigate, user]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50" role="status">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      <span className="sr-only">Checking your session…</span>
    </div>
  );
}
