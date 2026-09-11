import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Wraps a route with two guards:
 *  1. Not signed in         → /signin
 *  2. Email not verified    → /verify-email
 */
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/signin" replace />;

  if (!user.emailVerified) return <Navigate to="/verify-email" replace />;

  return children;
}
