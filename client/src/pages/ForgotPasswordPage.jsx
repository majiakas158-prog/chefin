import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { FormField, inputClass } from '../components/auth/FormField';
import { useAuth } from '../contexts/AuthContext';
import { getErrorMessage } from '../lib/errorMessage';

/**
 * Forgot password page — sends a password-reset email.
 */
export function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | sent | error
  const [message, setMessage] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setStatus('loading');
    const error = await forgotPassword(email);
    if (error) {
      setStatus('error');
      setMessage(getErrorMessage(error));
    } else {
      setStatus('sent');
    }
  };

  if (status === 'sent') {
    return (
      <AuthLayout>
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold">Check your inbox</h2>
        <p className="mt-2 text-slate-500">
          We sent a password reset link to{' '}
          <span className="font-semibold text-slate-700">{email}</span>.
        </p>
        <Link
          to="/signin"
          className="mt-8 block w-full rounded-xl bg-brand-500 py-3.5 text-center font-semibold text-white transition hover:bg-brand-600"
        >
          Back to Sign In
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h2 className="text-3xl font-bold">Forgot password?</h2>
      <p className="mt-2 text-slate-500">
        Enter your email and we&apos;ll send you a link to reset your password.
      </p>

      <form onSubmit={submit} className="mt-7">
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

        {status === 'error' && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {message}
          </p>
        )}

        <button
          className="w-full rounded-xl bg-brand-500 py-3.5 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Sending…' : 'Send reset link'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Remember your password?{' '}
        <Link className="font-semibold text-brand-500 hover:underline" to="/signin">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}
