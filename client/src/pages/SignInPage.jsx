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

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{' '}
        <Link className="font-semibold text-brand-500 hover:underline" to="/signup">
          Create Account
        </Link>
      </p>
    </AuthLayout>
  );
}

