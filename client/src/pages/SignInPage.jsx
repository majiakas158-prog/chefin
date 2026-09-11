import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { FormField, inputClass } from '../components/auth/FormField';
import { PasswordInput } from '../components/auth/PasswordInput';
import { RolePicker } from '../components/auth/RolePicker';
import { authClient } from '../lib/authClient';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../lib/api';

export function SignInPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [role, setRoleState] = useState(
    () => localStorage.getItem('selectedRole') || 'chef',
  );
  const [email, setEmail] = useState(
    () => localStorage.getItem('rememberEmail') || '',
  );
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(
    () => Boolean(localStorage.getItem('rememberEmail')),
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const setRole = (value) => {
    setRoleState(value);
    localStorage.setItem('selectedRole', value);
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    if (remember) {
      localStorage.setItem('rememberEmail', email);
    } else {
      localStorage.removeItem('rememberEmail');
    }

    const { data, error: authError } = await authClient.signIn.email({
      email,
      password,
    });

    if (authError) {
      setError(authError.message || 'Invalid email or password.');
      setLoading(false);
      return;
    }

    // Hydrate auth context with the signed-in user
    setUser(data.user);

    // Determine dashboard from the user's profile role
    let profileRole = role;
    try {
      const res = await userApi.getMe();
      profileRole = res.data?.data?.role ?? role;
    } catch {
      // fall back to the role picker selection
    }

    navigate(
      profileRole === 'restaurant' ? '/restaurant-dashboard' : '/chef-dashboard',
      { replace: true },
    );
  };

  const signInWithGoogle = async () => {
    setGoogleLoading(true);
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/complete-profile',
    });
    // Page will redirect — no need to setGoogleLoading(false)
  };

  return (
    <AuthLayout>
      <h2 className="text-3xl font-bold">Welcome Back 👋</h2>
      <p className="mt-2 text-slate-500">Sign in to continue using CheafIn.</p>

      <h4 className="mt-7 font-semibold">Select Your Role</h4>
      <RolePicker role={role} setRole={setRole} />

      <form onSubmit={submit}>
        <FormField label="Email Address">
          <input
            className={inputClass}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </FormField>

        <FormField label="Password">
          <PasswordInput
            value={password}
            setValue={setPassword}
            placeholder="Enter your password"
          />
        </FormField>

        <div className="mb-4 flex justify-between text-sm">
          <label className="text-slate-600">
            <input
              className="mr-2 accent-brand-500"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember Me
          </label>
          <Link className="text-brand-500 hover:underline" to="/forgot-password">
            Forgot Password?
          </Link>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          className="w-full rounded-xl bg-brand-500 py-3.5 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs text-slate-400">OR</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={googleLoading || loading}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
      >
        {googleLoading ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        {googleLoading ? 'Redirecting…' : 'Continue with Google'}
      </button>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{' '}
        <Link className="font-semibold text-brand-500 hover:underline" to="/signup">
          Create Account
        </Link>
      </p>
    </AuthLayout>
  );
}

