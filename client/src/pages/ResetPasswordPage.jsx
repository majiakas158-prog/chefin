import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { getErrorMessage } from '../lib/errorMessage';
import { PasswordInput } from '../components/auth/PasswordInput';
import { FormField } from '../components/auth/FormField';
import { authClient } from '../lib/authClient';

/**
 * Reset password page — landed on from the link in the reset email.
 * better-auth appends ?token=... to the redirectTo URL.
 */
export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!token) {
      setError('Invalid or expired reset link. Please request a new one.');
      return;
    }

    setLoading(true);
    const { error: authError } = await authClient.resetPassword({ newPassword: password, token });
    if (authError) {
      setError(getErrorMessage(authError, 'Failed to reset password. The link may have expired.'));
      setLoading(false);
      return;
    }

    setDone(true);
    setTimeout(() => navigate('/signin', { replace: true }), 2500);
  };

  if (done) {
    return (
      <AuthLayout>
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold">Password reset!</h2>
        <p className="mt-2 text-slate-500">Your password has been updated. Redirecting to sign in…</p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h2 className="text-3xl font-bold">Set new password</h2>
      <p className="mt-2 text-slate-500">
        Choose a strong password for your Chefin account.
      </p>

      <form onSubmit={submit} className="mt-7">
        <FormField label="New Password">
          <PasswordInput value={password} setValue={setPassword} placeholder="New password" />
        </FormField>

        <FormField label="Confirm Password">
          <PasswordInput value={confirm} setValue={setConfirm} placeholder="Confirm new password" />
        </FormField>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          className="w-full rounded-xl bg-brand-500 py-3.5 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
          disabled={loading || !token}
        >
          {loading ? 'Saving…' : 'Reset Password'}
        </button>
      </form>
    </AuthLayout>
  );
}
